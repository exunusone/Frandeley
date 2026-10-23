import { NextRequest } from "next/server";
import { emailPattern, formResult, isSameOrigin, jsonError, readSubmission, stringField } from "@/lib/api";
import { getSupabase } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return jsonError("Origine de la demande invalide.", 403);
  const submission = await readSubmission(request);
  if (!submission) return jsonError("Données du formulaire invalides.", 400);
  const { body, native } = submission;
  const respond = (status: "envoye" | "invalide" | "indisponible", code: number, message = "") =>
    formResult(request, native, "/pilote", status, code, message);
  if (typeof body.website === "string" && body.website.trim()) return respond("envoye", 200);

  const artistName = stringField(body, "artistName", 80);
  const email = stringField(body, "email", 254)?.toLowerCase();
  const profile = stringField(body, "profile", 30);
  const project = stringField(body, "project", 500);
  if (!artistName || artistName.length < 2 || !email || !emailPattern.test(email) ||
      !["", "solo", "collectif", "collaboration"].includes(profile ?? "invalid") ||
      project === null || body.consent !== true || typeof body.updates !== "boolean") {
    return respond("invalide", 400, "Vérifiez les champs requis et votre consentement.");
  }

  const supabase = getSupabase();
  if (!supabase) return respond("indisponible", 503, "L’inscription est momentanément indisponible. Réessayez plus tard.");

  const { error } = await supabase.from("pilot_signups").insert({
    artist_name: artistName,
    email,
    profile: profile || null,
    current_project: project || null,
    consent_at: new Date().toISOString(),
    updates_opt_in: body.updates,
    source: "site",
  });

  // Do not reveal whether an address is already on the list.
  if (error?.code === "23505") return respond("envoye", 200);
  if (error) return respond("indisponible", 503, "L’inscription n’a pas pu être enregistrée. Réessayez plus tard.");
  return respond("envoye", 201);
}
