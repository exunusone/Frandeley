import { NextRequest, NextResponse } from "next/server";
import { confirmNewsletterSubscription } from "@/lib/resend";
import { isSameOrigin } from "@/lib/api";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Origine de la demande invalide." }, { status: 403 });
  if (Number(request.headers.get("content-length") || 0) > 5_000) {
    return NextResponse.json({ error: "Données du formulaire invalides." }, { status: 400 });
  }

  let token: string | null = null;
  try {
    const form = await request.formData();
    const value = form.get("token");
    if (typeof value === "string" && value.length <= 4_000) token = value;
  } catch {
    token = null;
  }

  const status = await confirmNewsletterSubscription(token);
  const destination = new URL("/pilote", request.nextUrl.origin);
  destination.searchParams.set("newsletter", status);
  destination.hash = "formulaire";
  return NextResponse.redirect(destination, 303);
}
