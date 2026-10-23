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
    formResult(request, native, "/contact", status, code, message);
  if (typeof body.website === "string" && body.website.trim()) return respond("envoye", 200);

  const name = stringField(body, "name", 100);
  const email = stringField(body, "email", 254)?.toLowerCase();
  const subject = stringField(body, "subject", 30);
  const message = stringField(body, "message", 3000);
  if (!name || name.length < 2 || !email || !emailPattern.test(email) ||
      !["pilote", "partenariat", "donnees", "autre"].includes(subject ?? "") ||
      !message || message.length < 10 || body.consent !== true) {
    return respond("invalide", 400, "Vérifiez les champs requis et votre consentement.");
  }

  const supabase = getSupabase();
  if (!supabase) return respond("indisponible", 503, "Le contact est momentanément indisponible. Réessayez plus tard.");
  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    subject,
    message,
    consent_at: new Date().toISOString(),
  });
  if (error) return respond("indisponible", 503, "Le message n’a pas pu être enregistré. Réessayez plus tard.");
  return respond("envoye", 201);
}
