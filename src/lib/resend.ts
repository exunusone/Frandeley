import { createCipheriv, createDecipheriv, createHmac } from "node:crypto";
import { siteUrl } from "@/lib/site-config";

export type NewsletterSyncStatus = "pending" | "not_configured" | "error";
type ConfirmationPayload = { email: string; expiresAt: number };

const DAY_MS = 24 * 60 * 60 * 1000;
const RESEND_API = "https://api.resend.com";

function apiKey() {
  return process.env.RESEND_API_KEY?.trim() || null;
}

function normalizedEmail(value: string) {
  return value.trim().toLowerCase();
}

function validEmail(value?: string) {
  const email = value?.trim().toLowerCase();
  return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

function newsletterConfiguration() {
  const key = apiKey();
  const fromEmail = validEmail(process.env.RESEND_FROM_EMAIL);
  const topicId = process.env.RESEND_NEWSLETTER_TOPIC_ID?.trim();
  if (!key || !fromEmail || !topicId) return null;
  return { key, fromEmail, topicId };
}

export function isResendNewsletterConfigured() {
  return newsletterConfiguration() !== null;
}

function deriveTokenKey(key: string) {
  return createHmac("sha256", key).update("frandeley/newsletter-confirmation/v1").digest();
}

function confirmationToken(email: string, expiresAt: number, key: string) {
  const normalized = normalizedEmail(email);
  const tokenKey = deriveTokenKey(key);
  const iv = createHmac("sha256", tokenKey)
    .update("nonce\0" + normalized + "\0" + expiresAt)
    .digest()
    .subarray(0, 12);
  const cipher = createCipheriv("aes-256-gcm", tokenKey, iv);
  const plaintext = Buffer.from(JSON.stringify({ email: normalized, expiresAt }), "utf8");
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString("base64url");
}

/** Decrypts a DOI token without changing subscription state. */
export function readNewsletterConfirmation(token: string): ConfirmationPayload | null {
  const key = apiKey();
  if (!key || !token || token.length > 4096) return null;
  try {
    const raw = Buffer.from(token, "base64url");
    if (raw.length < 29) return null;
    const iv = raw.subarray(0, 12);
    const tag = raw.subarray(12, 28);
    const encrypted = raw.subarray(28);
    const decipher = createDecipheriv("aes-256-gcm", deriveTokenKey(key), iv);
    decipher.setAuthTag(tag);
    const plaintext = Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
    const payload = JSON.parse(plaintext) as Record<string, unknown>;
    if (typeof payload.email !== "string" || typeof payload.expiresAt !== "number") return null;
    const email = validEmail(payload.email);
    if (!email || !Number.isSafeInteger(payload.expiresAt)) return null;
    return { email, expiresAt: payload.expiresAt };
  } catch {
    return null;
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function senderAddress(email: string) {
  const name = process.env.RESEND_FROM_NAME?.replace(/[\r\n"<>]/g, " ").trim() || "FRANDELEY";
  return name + " <" + email + ">";
}

function authHeaders(key: string) {
  return {
    accept: "application/json",
    authorization: "Bearer " + key,
    "content-type": "application/json",
  };
}

/** Sends a DOI email only after the person has explicitly checked the news option. */
export async function requestNewsletterConfirmation(email: string): Promise<NewsletterSyncStatus> {
  const config = newsletterConfiguration();
  if (!config) return "not_configured";

  const recipient = normalizedEmail(email);
  const expiresAt = (Math.floor(Date.now() / DAY_MS) + 2) * DAY_MS;
  const token = confirmationToken(recipient, expiresAt, config.key);
  const confirmationUrl = new URL("/api/newsletter/confirm", siteUrl);
  confirmationUrl.searchParams.set("token", token);
  const link = confirmationUrl.toString();
  const html = '<!doctype html><html lang="fr"><head><meta charset="utf-8"></head>' +
    '<body style="margin:0;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;color:#17181c">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f5f7;padding:28px 12px"><tr><td align="center">' +
    '<table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;background:#fff;border-radius:16px;overflow:hidden">' +
    '<tr><td style="padding:24px 30px;background:#101114;color:#fff;font-weight:700;letter-spacing:3px">FRANDELEY</td></tr>' +
    '<tr><td style="padding:30px"><p style="font-size:11px;letter-spacing:2px;color:#155eef;font-weight:700">CONFIRMATION DES ACTUALITÉS</p>' +
    '<h1 style="font-size:25px;line-height:1.25;color:#101114">Confirmez votre adresse</h1>' +
    '<p style="font-size:15px;line-height:1.6;color:#434650">Vous avez demandé à recevoir les nouvelles de Frandeley. Confirmez votre adresse pour terminer l’inscription.</p>' +
    '<p style="margin:28px 0"><a href="' + escapeHtml(link) + '" style="display:inline-block;padding:14px 20px;background:#155eef;color:#fff;text-decoration:none;border-radius:8px;font-weight:700">Confirmer mon inscription</a></p>' +
    '<p style="font-size:13px;line-height:1.6;color:#646975">Ce lien expire dans 24 à 48 heures. Si vous n’avez pas fait cette demande, ignorez ce message.</p>' +
    '</td></tr></table></td></tr></table></body></html>';
  const text = "Vous avez demandé à recevoir les nouvelles de Frandeley.\n\n" +
    "Confirmez votre adresse dans les 24 à 48 heures : " + link + "\n\n" +
    "Si vous n’avez pas fait cette demande, ignorez ce message.";

  const idempotencyKey = createHmac("sha256", deriveTokenKey(config.key))
    .update("doi\0" + recipient + "\0" + expiresAt + "\0" + link)
    .digest("hex");

  try {
    const response = await fetch(RESEND_API + "/emails", {
      method: "POST",
      headers: { ...authHeaders(config.key), "Idempotency-Key": idempotencyKey },
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
      body: JSON.stringify({
        from: senderAddress(config.fromEmail),
        to: [recipient],
        subject: "Confirmez les nouvelles de FRANDELEY",
        html,
        text,
        tags: [{ name: "category", value: "frandeley-newsletter-confirmation" }],
      }),
    });

    if (!response.ok) {
      console.error("Resend newsletter confirmation failed with HTTP " + response.status + ".");
      return "error";
    }
    return "pending";
  } catch {
    console.error("Resend newsletter confirmation could not be completed.");
    return "error";
  }
}

async function updateContactTopic(key: string, topicId: string, email: string) {
  const response = await fetch(
    RESEND_API + "/contacts/" + encodeURIComponent(email) + "/topics",
    {
      method: "PATCH",
      headers: authHeaders(key),
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
      body: JSON.stringify({ topics: [{ id: topicId, subscription: "opt_in" }] }),
    },
  );
  return response.ok;
}

/** Adds a confirmed address to the Resend topic without changing other topic choices. */
export async function confirmNewsletterSubscription(email: string): Promise<"confirmed" | "error" | "not_configured"> {
  const key = apiKey();
  const topicId = process.env.RESEND_NEWSLETTER_TOPIC_ID?.trim();
  const recipient = validEmail(email);
  if (!key || !topicId || !recipient) return "not_configured";

  try {
    const contactUrl = RESEND_API + "/contacts/" + encodeURIComponent(recipient);
    const existing = await fetch(contactUrl, {
      method: "GET",
      headers: authHeaders(key),
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });

    if (existing.status === 404) {
      const created = await fetch(RESEND_API + "/contacts", {
        method: "POST",
        headers: authHeaders(key),
        cache: "no-store",
        signal: AbortSignal.timeout(8_000),
        body: JSON.stringify({
          email: recipient,
          unsubscribed: false,
          topics: [{ id: topicId, subscription: "opt_in" }],
        }),
      });
      if (created.ok) return "confirmed";
      if (created.status !== 409) {
        console.error("Resend contact creation failed with HTTP " + created.status + ".");
        return "error";
      }
      return (await updateContactTopic(key, topicId, recipient)) ? "confirmed" : "error";
    }

    if (!existing.ok) {
      console.error("Resend contact lookup failed with HTTP " + existing.status + ".");
      return "error";
    }

    return (await updateContactTopic(key, topicId, recipient)) ? "confirmed" : "error";
  } catch {
    console.error("Resend newsletter subscription could not be completed.");
    return "error";
  }
}

/** Sends the project owner an internal alert after a new pilot application is saved. */
export async function notifyPilotSignup(input: { artistName: string; email: string }) {
  const key = apiKey();
  const fromEmail = validEmail(process.env.RESEND_FROM_EMAIL);
  const recipient = validEmail(process.env.RESEND_NOTIFICATION_EMAIL);
  if (!key || !fromEmail || !recipient) return;

  const artistName = input.artistName.replace(/[\r\n]+/g, " ").trim();
  const email = normalizedEmail(input.email);
  const html = '<!doctype html><html lang="fr"><head><meta charset="utf-8"></head>' +
    '<body style="margin:0;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;color:#17181c">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f5f7;padding:28px 12px"><tr><td align="center">' +
    '<table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;background:#fff;border-radius:16px;overflow:hidden">' +
    '<tr><td style="padding:24px 30px;background:#101114;color:#fff;font-weight:700;letter-spacing:3px">FRANDELEY</td></tr>' +
    '<tr><td style="padding:30px"><p style="font-size:11px;letter-spacing:2px;color:#155eef;font-weight:700">ALERTE PILOTE</p>' +
    '<h1 style="font-size:25px;line-height:1.25;color:#101114">Nouvelle demande reçue</h1>' +
    '<p style="font-size:15px;line-height:1.6;color:#434650">Une nouvelle candidature au pilote Frandeley a été enregistrée.</p>' +
    '<p style="font-size:15px;line-height:1.6"><strong>Nom d’artiste :</strong> ' + escapeHtml(artistName) +
    '<br><strong>Adresse e-mail :</strong> <a href="mailto:' + escapeHtml(email) + '">' + escapeHtml(email) + '</a></p>' +
    '<p style="font-size:13px;line-height:1.6;color:#646975">La demande complète est conservée dans Supabase.</p>' +
    '</td></tr></table></td></tr></table></body></html>';
  const text = "Nouvelle demande au pilote FRANDELEY\n\nNom d’artiste : " + artistName +
    "\nAdresse e-mail : " + email + "\n\nLa demande complète est conservée dans Supabase.";
  const idempotencyKey = createHmac("sha256", deriveTokenKey(key))
    .update("pilot-notification\0" + email)
    .digest("hex");

  try {
    const response = await fetch(RESEND_API + "/emails", {
      method: "POST",
      headers: { ...authHeaders(key), "Idempotency-Key": idempotencyKey },
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
      body: JSON.stringify({
        from: senderAddress(fromEmail),
        to: [recipient],
        reply_to: email,
        subject: "Nouvelle demande au pilote FRANDELEY",
        html,
        text,
        tags: [{ name: "category", value: "frandeley-pilot-notification" }],
      }),
    });

    if (!response.ok) {
      console.error("Resend pilot notification failed with HTTP " + response.status + ".");
    }
  } catch {
    console.error("Resend pilot notification could not be completed.");
  }
}
