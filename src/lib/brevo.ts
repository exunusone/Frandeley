export type NewsletterSyncStatus = "pending" | "not_configured" | "error";

type NewsletterCredentials = {
  apiKey: string;
  listId: number;
  doiTemplateId: number;
};

function positiveInteger(value?: string) {
  if (!value?.trim() || !/^[1-9]\d*$/.test(value.trim())) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

function newsletterCredentials(): NewsletterCredentials | null {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const listId = positiveInteger(process.env.BREVO_LIST_ID);
  const doiTemplateId = positiveInteger(process.env.BREVO_DOI_TEMPLATE_ID);
  if (!apiKey || !listId || !doiTemplateId) return null;
  return { apiKey, listId, doiTemplateId };
}

export function isBrevoConfigured() {
  return newsletterCredentials() !== null;
}

/** Requests a Brevo DOI email only after an explicit, separate newsletter opt-in. */
export async function requestNewsletterConfirmation(email: string): Promise<NewsletterSyncStatus> {
  const credentials = newsletterCredentials();
  if (!credentials) return "not_configured";

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://frandeley-ten.vercel.app").replace(/\/$/, "");
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const response = await fetch("https://api.brevo.com/v3/contacts/doubleOptinConfirmation", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": credentials.apiKey,
        "content-type": "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
      body: JSON.stringify({
        email: normalizedEmail,
        includeListIds: [credentials.listId],
        redirectionUrl: `${siteUrl}/pilote?newsletter=confirmed#formulaire`,
        templateId: credentials.doiTemplateId,
        contactPixelTrackingConsent: false,
      }),
    });

    if (response.status === 201 || response.status === 204) return "pending";
    console.error(`Brevo DOI request failed with HTTP ${response.status}.`);
    return "error";
  } catch {
    console.error("Brevo DOI request could not be completed.");
    return "error";
  }
}

type PilotNotification = { artistName: string; email: string };

/** Sends an operational notice to the project inbox; it never adds the artist to a list. */
export async function sendPilotSignupNotification({ artistName, email }: PilotNotification): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const senderEmail = process.env.BREVO_SENDER_EMAIL?.trim();
  const notificationEmail = process.env.BREVO_NOTIFICATION_EMAIL?.trim();
  if (!apiKey || !senderEmail || !notificationEmail) return;

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
      body: JSON.stringify({
        sender: {
          email: senderEmail,
          name: process.env.BREVO_SENDER_NAME?.trim() || "Frandeley",
        },
        to: [{ email: notificationEmail }],
        subject: "Nouvelle inscription au pilote Frandeley",
        textContent: `Une nouvelle demande a été enregistrée sur Frandeley.\n\nNom d’artiste : ${artistName}\nAdresse e-mail : ${email}\n\nCette notification est opérationnelle et n’ajoute pas cette personne à la liste des nouvelles.`,
        tags: ["frandeley-pilot-notification"],
      }),
    });

    if (!response.ok) console.error(`Brevo pilot notification failed with HTTP ${response.status}.`);
  } catch {
    console.error("Brevo pilot notification could not be completed.");
  }
}
