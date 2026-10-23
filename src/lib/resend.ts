import { createHash, randomBytes } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase";

export type NewsletterSyncStatus = "pending" | "not_configured" | "error";
export type NewsletterConfirmationStatus = "confirmed" | "expired" | "invalid" | "not_configured" | "error";

const RESEND_API = "https://api.resend.com";
const DEFAULT_SITE_URL = "https://frandeley-ten.vercel.app";
const TOKEN_LIFETIME_MS = 24 * 60 * 60 * 1000;

type NewsletterSettings = {
  apiKey: string;
  from: string;
  topicId: string;
};

function newsletterSettings(): NewsletterSettings | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const topicId = process.env.RESEND_NEWSLETTER_TOPIC_ID?.trim();
  const senderAddress = from?.match(/<([^<>]+)>/)?.[1] ?? from;
  if (!apiKey || !from || !topicId || !senderAddress || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderAddress)) return null;
  return { apiKey, from: formatFrom(from), topicId };
}

function formatFrom(address: string) {
  if (address.includes("<")) return address;
  const name = process.env.RESEND_FROM_NAME?.trim() || "Frandeley";
  return `${name} <${address}>`;
}

export function isResendConfigured() {
  return newsletterSettings() !== null && getSupabaseAdmin() !== null;
}

async function sendEmail(apiKey: string, body: Record<string, unknown>, idempotencyKey?: string) {
  try {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };
    if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;
    const response = await fetch(`${RESEND_API}/emails`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    return response.ok ? "sent" : "error";
  } catch {
    return "error";
  }
}

/** Sends a double opt-in email. The address enters the Resend topic only after confirmation. */
export async function requestNewsletterConfirmation(email: string, consentAt: string): Promise<NewsletterSyncStatus> {
  const settings = newsletterSettings();
  const admin = getSupabaseAdmin();
  if (!settings || !admin) return "not_configured";

  const normalizedEmail = email.trim().toLowerCase();
  const { data: signup, error: signupError } = await admin
    .from("pilot_signups")
    .select("email")
    .eq("email", normalizedEmail)
    .eq("updates_opt_in", true)
    .eq("updates_opt_in_at", consentAt)
    .maybeSingle();
  if (signupError || !signup) return "error";

  const token = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + TOKEN_LIFETIME_MS).toISOString();
  const { error: tokenError } = await admin.from("newsletter_confirmation_tokens").upsert({
    email: normalizedEmail,
    token_hash: tokenHash,
    consent_at: consentAt,
    expires_at: expiresAt,
    used_at: null,
  }, { onConflict: "email" });
  if (tokenError) return "error";

  const confirmationUrl = new URL("/confirmer-inscription", (process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL).replace(/\/$/, ""));
  confirmationUrl.searchParams.set("token", token);
  const link = confirmationUrl.toString();
  const safeLink = escapeHtml(link);

  const result = await sendEmail(settings.apiKey, {
    from: settings.from,
    to: [normalizedEmail],
    subject: "Confirmez votre inscription aux nouvelles de Frandeley",
    text: `Vous avez demandé à recevoir les nouvelles de Frandeley. Confirmez votre adresse dans les 24 heures en ouvrant ce lien : ${link}\n\nSi vous n’êtes pas à l’origine de cette demande, ignorez cet e-mail.`,
    html: `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Confirmer votre inscription</title></head><body style="margin:0;background:#0b1118;color:#eef3f8;font-family:Arial,sans-serif"><main style="max-width:560px;margin:0 auto;padding:40px 24px"><p style="color:#92b8f5;letter-spacing:.12em;text-transform:uppercase;font-size:12px">FRANDELEY / LES NOUVELLES</p><h1 style="font-size:28px;line-height:1.2">Confirmez votre adresse e-mail</h1><p style="font-size:16px;line-height:1.6;color:#c8d2dc">Vous avez demandé à recevoir les nouvelles de Frandeley. Cliquez sur le bouton ci-dessous dans les prochaines 24 heures pour confirmer votre inscription.</p><p style="margin:28px 0"><a href="${safeLink}" style="display:inline-block;padding:14px 20px;background:#d9e8ff;color:#101820;text-decoration:none;font-weight:700;border-radius:4px">Confirmer mon inscription</a></p><p style="font-size:14px;line-height:1.6;color:#a8b4c0">Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br><a href="${safeLink}" style="color:#a8c8ff;overflow-wrap:anywhere">${safeLink}</a></p><p style="font-size:13px;line-height:1.6;color:#8996a3">Si vous n’êtes pas à l’origine de cette demande, ignorez cet e-mail. Votre adresse ne sera pas ajoutée à la liste.</p></main></body></html>`,
  }, `newsletter-confirmation/${token.slice(-32)}`);

  if (result === "sent") return "pending";
  await admin.from("newsletter_confirmation_tokens").delete().eq("email", normalizedEmail).eq("token_hash", tokenHash);
  console.error("Resend newsletter confirmation could not be sent.");
  return "error";
}

async function addConfirmedContact(settings: NewsletterSettings, email: string) {
  const topic = { id: settings.topicId, subscription: "opt_in" };
  try {
    const createResponse = await fetch(`${RESEND_API}/contacts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${settings.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, unsubscribed: false, topics: [topic] }),
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    if (createResponse.ok) return true;
    if (createResponse.status !== 409) return false;

    const updateResponse = await fetch(`${RESEND_API}/contacts/${encodeURIComponent(email)}/topics`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${settings.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([topic]),
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    return updateResponse.ok;
  } catch {
    return false;
  }
}

/** Confirms a random, expiring token before adding the address to the Resend newsletter topic. */
export async function confirmNewsletterSubscription(token: string | null): Promise<NewsletterConfirmationStatus> {
  const settings = newsletterSettings();
  const admin = getSupabaseAdmin();
  if (!settings || !admin) return "not_configured";
  if (!token || !/^[A-Za-z0-9_-]{40,80}$/.test(token)) return "invalid";

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const { data: tokenRecord, error: tokenLookupError } = await admin
    .from("newsletter_confirmation_tokens")
    .select("email, consent_at, expires_at, used_at")
    .eq("token_hash", tokenHash)
    .maybeSingle();
  if (tokenLookupError) return "error";
  if (!tokenRecord) return "invalid";
  if (tokenRecord.used_at) return "confirmed";
  if (Date.parse(tokenRecord.expires_at) <= Date.now()) return "expired";

  const { data, error } = await admin
    .from("pilot_signups")
    .select("updates_opt_in_at, updates_confirmed_at")
    .eq("email", tokenRecord.email)
    .eq("updates_opt_in", true)
    .eq("updates_opt_in_at", tokenRecord.consent_at)
    .maybeSingle();

  if (error || !data) return "error";
  if (data.updates_confirmed_at) return "confirmed";
  if (!data.updates_opt_in_at) return "expired";

  if (!(await addConfirmedContact(settings, tokenRecord.email))) {
    console.error("Resend could not add a confirmed newsletter contact.");
    return "error";
  }

  const { error: updateError } = await admin
    .from("pilot_signups")
    .update({ updates_confirmed_at: new Date().toISOString() })
    .eq("email", tokenRecord.email)
    .eq("updates_opt_in", true)
    .eq("updates_opt_in_at", tokenRecord.consent_at)
    .is("updates_confirmed_at", null);

  if (updateError) {
    console.error("Supabase could not record newsletter confirmation.");
    return "error";
  }

  const { error: tokenUpdateError } = await admin
    .from("newsletter_confirmation_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("token_hash", tokenHash)
    .is("used_at", null);
  if (tokenUpdateError) {
    console.error("Supabase could not mark the newsletter token as used.");
    return "error";
  }
  return "confirmed";
}

type PilotNotification = { artistName: string; email: string };

/** Sends an operational notice; it does not subscribe the artist to the newsletter. */
export async function sendPilotSignupNotification({ artistName, email }: PilotNotification): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromAddress = process.env.RESEND_FROM_EMAIL?.trim();
  const notificationEmail = process.env.RESEND_NOTIFICATION_EMAIL?.trim();
  if (!apiKey || !fromAddress || !notificationEmail) return;

  const safeArtistName = escapeHtml(artistName);
  const safeEmail = escapeHtml(email);
  const result = await sendEmail(apiKey, {
    from: formatFrom(fromAddress),
    to: [notificationEmail],
    subject: "Nouvelle inscription au pilote Frandeley",
    text: `Une nouvelle demande a été enregistrée sur Frandeley.\n\nNom d’artiste : ${artistName}\nAdresse e-mail : ${email}\n\nCette notification opérationnelle n’ajoute pas cette personne à la liste des nouvelles.`,
    html: `<p>Une nouvelle demande a été enregistrée sur Frandeley.</p><p><strong>Nom d’artiste :</strong> ${safeArtistName}<br><strong>Adresse e-mail :</strong> ${safeEmail}</p><p>Cette notification opérationnelle n’ajoute pas cette personne à la liste des nouvelles.</p>`,
  });
  if (result === "error") console.error("Resend pilot notification could not be sent.");
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}
