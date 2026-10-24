import { NextRequest, NextResponse } from "next/server";
import { emailPattern, formResult, isSameOrigin, jsonError, readSubmission, stringField } from "@/lib/api";
import { isPilotSignupOpen } from "@/lib/pilot-signup";
import { isResendConfigured, requestNewsletterConfirmation, sendPilotSignupNotification } from "@/lib/resend";
import { getSupabase, getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return jsonError("Origine de la demande invalide.", 403);
  if (!isPilotSignupOpen()) {
    const contentType = request.headers.get("content-type") || "";
    const native = contentType.startsWith("application/x-www-form-urlencoded") || contentType.startsWith("multipart/form-data");
    if (native) {
      const closedUrl = new URL("/pilote?status=ferme", request.url);
      closedUrl.hash = "inscription";
      return NextResponse.redirect(closedUrl, 303);
    }
    return jsonError("Les inscriptions ouvriront après la première phase de pré-lancement sur les réseaux sociaux.", 403);
  }
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

  const resendEnabled = isResendConfigured();
  const updatesOptIn = body.updates === true && resendEnabled;
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
  // newsletter opt-in resets the confirmation timestamp before a new DOI email is sent.
  if (error?.code === "23505") {
    let newsletterStatus: "pending" | "not_configured" | "error" = "not_configured";
    if (updatesOptIn) {
      const admin = getSupabaseAdmin();
      if (!admin) {
        newsletterStatus = "error";
      } else {
        const { error: optInError } = await admin
          .from("pilot_signups")
          .update({ updates_opt_in: true, updates_opt_in_at: consentAt, updates_confirmed_at: null })
          .eq("email", email);
        newsletterStatus = optInError ? "error" : await requestNewsletterConfirmation(email, consentAt);
      }
    }
    return formResult(request, native, "/pilote", "envoye", 200, "", { newsletterStatus });
  }
  if (error) return respond("indisponible", 503, "L’inscription n’a pas pu être enregistrée. Réessayez plus tard.");

  const [newsletterStatus] = await Promise.all([
    updatesOptIn ? requestNewsletterConfirmation(email, consentAt) : Promise.resolve("not_configured" as const),
    sendPilotSignupNotification({ artistName, email }),
  ]);
  return formResult(request, native, "/pilote", "envoye", 201, "", { newsletterStatus });
}
