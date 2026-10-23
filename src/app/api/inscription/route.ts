import { NextRequest } from "next/server";
import { emailPattern, formResult, isSameOrigin, jsonError, readSubmission, stringField } from "@/lib/api";
import { isBrevoNewsletterConfigured, notifyPilotSignup, requestNewsletterConfirmation } from "@/lib/brevo";
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

  const brevoNewsletterEnabled = isBrevoNewsletterConfigured();
  const updatesOptIn = body.updates === true && brevoNewsletterEnabled;
  const consentAt = new Date().toISOString();
  const { error } = await supabase.from("pilot_signups").insert({
    artist_name: artistName,
    email,
    profile: profile || null,
    current_project: project || null,
    consent_at: consentAt,
    updates_opt_in: updatesOptIn,
    updates_opt_in_at: updatesOptIn ? consentAt : null,
    source: "site",
  });

  // Keep the pilot request even if the address has already applied. A fresh explicit
  // opt-in can still trigger Brevo double confirmation.
  if (error?.code === "23505") {
    const newsletterStatus = body.updates === true ? await requestNewsletterConfirmation(email) : undefined;
    return formResult(request, native, "/pilote", "envoye", 200, "", { newsletterStatus });
  }
  if (error) return respond("indisponible", 503, "L’inscription n’a pas pu être enregistrée. Réessayez plus tard.");

  await notifyPilotSignup({ artistName, email });
  const newsletterStatus = body.updates === true ? await requestNewsletterConfirmation(email) : undefined;
  return formResult(request, native, "/pilote", "envoye", 201, "", { newsletterStatus });
}
