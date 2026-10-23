import { siteUrl } from "@/lib/site-config";

export type NewsletterSyncStatus = "pending" | "not_configured" | "error";

function positiveInteger(value?: string) {
  if (!value?.trim()) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

function apiKey() {
  return process.env.BREVO_API_KEY?.trim() || null;
}

function newsletterConfiguration() {
  const key = apiKey();
  const listId = positiveInteger(process.env.BREVO_LIST_ID);
  const templateId = positiveInteger(process.env.BREVO_DOI_TEMPLATE_ID);
  if (!key || !listId || !templateId) return null;
  return { key, listId, templateId };
}

export function isBrevoNewsletterConfigured() {
  return newsletterConfiguration() !== null;
}

/** Sends a confirmation request only after a person explicitly opts in to project news. */
export async function requestNewsletterConfirmation(email: string): Promise<NewsletterSyncStatus> {
  const config = newsletterConfiguration();
  if (!config) return "not_configured";

  try {
    const response = await fetch("https://api.brevo.com/v3/contacts/doubleOptinConfirmation", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": config.key,
        "content-type": "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        includeListIds: [config.listId],
        redirectionUrl: `${siteUrl}/pilote?newsletter=confirmed`,
        templateId: config.templateId,
      }),
    });

    if (!response.ok) {
      console.error(`Brevo DOI request failed with HTTP ${response.status}.`);
      return "error";
    }

    return "pending";
  } catch {
    console.error("Brevo DOI request could not be completed.");
    return "error";
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

/** Sends the project owner a brief alert after a new pilot application is saved. */
export async function notifyPilotSignup(input: { artistName: string; email: string }) {
  const key = apiKey();
  const senderEmail = process.env.BREVO_SENDER_EMAIL?.trim();
  const recipientEmail = process.env.BREVO_NOTIFICATION_EMAIL?.trim();
  const senderName = process.env.BREVO_SENDER_NAME?.trim() || "FRANDELEY";
  if (!key || !senderEmail || !recipientEmail) return;

  const artistName = input.artistName.replace(/[\r\n]+/g, " ").trim();
  const email = input.email.trim().toLowerCase();
  const htmlContent = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"></head>
<body style="margin:0;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;color:#17181c">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f5f7;padding:28px 12px"><tr><td align="center">
<table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;background:#fff;border-radius:16px;overflow:hidden">
<tr><td style="padding:24px 30px;background:#101114;color:#fff;font-weight:700;letter-spacing:3px">FRANDELEY</td></tr>
<tr><td style="padding:30px">
<p style="font-size:11px;letter-spacing:2px;color:#155eef;font-weight:700">ALERTE PILOTE</p>
<h1 style="font-size:25px;line-height:1.25;color:#101114">Nouvelle demande reçue</h1>
<p style="font-size:15px;line-height:1.6;color:#434650">Une nouvelle candidature au pilote Frandeley a été enregistrée.</p>
<p style="font-size:15px;line-height:1.6"><strong>Nom d’artiste :</strong> ${escapeHtml(artistName)}<br><strong>Adresse e-mail :</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
<p style="font-size:13px;line-height:1.6;color:#646975">La demande complète est conservée dans Supabase.</p>
</td></tr>
</table></td></tr></table>
</body></html>`;
  const textContent = `Nouvelle demande au pilote FRANDELEY

Nom d’artiste : ${artistName}
Adresse e-mail : ${email}

La demande complète est conservée dans Supabase.`;

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": key,
        "content-type": "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
      body: JSON.stringify({
        sender: { email: senderEmail, name: senderName },
        to: [{ email: recipientEmail }],
        replyTo: { email },
        subject: "Nouvelle demande au pilote FRANDELEY",
        htmlContent,
        textContent,
        tags: ["frandeley-pilot-notification"],
      }),
    });

    if (!response.ok) {
      console.error(`Brevo pilot notification failed with HTTP ${response.status}.`);
    }
  } catch {
    console.error("Brevo pilot notification could not be completed.");
  }
}
