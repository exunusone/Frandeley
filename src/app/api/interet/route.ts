import { createHmac } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { isSameOrigin, jsonError, readJson, stringField } from "@/lib/api";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const visitorIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type TurnstileResult = {
  success: boolean;
  hostname?: string;
  action?: string;
};

export async function GET() {
  const admin = getSupabaseAdmin();
  if (!admin) return jsonError("Le compteur est momentanément indisponible.", 503);

  const { data, error } = await admin.rpc("get_artist_interest_count");
  if (error || data === null) {
    console.error("Unable to read the artist interest counter", error?.code);
    return jsonError("Le compteur est momentanément indisponible.", 503);
  }

  return NextResponse.json(
    { count: Number(data) },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}

export async function POST(request: NextRequest) {
  if (!request.headers.get("origin") || !isSameOrigin(request)) {
    return jsonError("Origine de la demande invalide.", 403);
  }

  const body = await readJson(request);
  if (!body) return jsonError("Données de la demande invalides.", 400);

  const visitorId = stringField(body, "visitorId", 36);
  const token = stringField(body, "token", 2048);
  const interested = body.interested;
  if (!visitorId || !visitorIdPattern.test(visitorId) || !token || interested !== true && interested !== false) {
    return jsonError("Données de la demande invalides.", 400);
  }

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY?.trim();
  const hashSecret = process.env.INTEREST_HASH_SECRET?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || process.env.SUPABASE_SECRET_KEY?.trim();
  const admin = getSupabaseAdmin();
  if (!turnstileSecret || !hashSecret || !admin) {
    return jsonError("Le compteur d’intérêt est momentanément indisponible.", 503);
  }

  let verification: TurnstileResult;
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: turnstileSecret, response: token }),
      signal: AbortSignal.timeout(5_000),
      cache: "no-store",
    });
    if (!response.ok) return jsonError("La vérification anti-robot a échoué. Réessayez.", 503);
    verification = await response.json() as TurnstileResult;
  } catch {
    return jsonError("La vérification anti-robot est momentanément indisponible.", 503);
  }

  const hostname = request.nextUrl.hostname.toLowerCase();
  if (!verification.success || verification.hostname?.toLowerCase() !== hostname || verification.action !== "artist_interest") {
    return jsonError("La vérification anti-robot a expiré. Réessayez.", 403);
  }

  const visitorHash = createHmac("sha256", hashSecret).update(visitorId, "utf8").digest("hex");
  const { data, error } = await admin.rpc("set_artist_interest", {
    p_visitor_hash: visitorHash,
    p_interested: interested,
  });

  if (error || !Array.isArray(data) || !data[0]) {
    console.error("Unable to save the artist interest", error?.code);
    return jsonError("Votre choix n’a pas pu être enregistré. Réessayez plus tard.", 503);
  }

  return NextResponse.json(
    {
      ok: true,
      changed: data[0].changed === true,
      interested: data[0].is_interested === true,
      count: Number(data[0].total_count),
    },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
