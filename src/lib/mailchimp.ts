import { createHash } from "node:crypto";

export type NewsletterSyncStatus = "pending" | "subscribed" | "not_configured" | "error";

function mailchimpCredentials() {
  const apiKey = process.env.MAILCHIMP_API_KEY?.trim();
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID?.trim();
  const dataCenter = apiKey?.match(/-([a-z0-9]+)$/i)?.[1];

  if (!apiKey || !audienceId || !dataCenter) return null;
  return { apiKey, audienceId, dataCenter };
}

export function isMailchimpConfigured() {
  return mailchimpCredentials() !== null;
}

/** Adds only an explicitly opted-in address, pending Mailchimp confirmation. */
export async function requestNewsletterConfirmation(email: string): Promise<NewsletterSyncStatus> {
  const credentials = mailchimpCredentials();
  if (!credentials) return "not_configured";

  const { apiKey, audienceId, dataCenter } = credentials;
  const normalizedEmail = email.trim().toLowerCase();
  const subscriberHash = createHash("md5").update(normalizedEmail).digest("hex");
  const endpoint = `https://${dataCenter}.api.mailchimp.com/3.0/lists/${encodeURIComponent(audienceId)}/members`;
  const headers = {
    Authorization: `Basic ${Buffer.from(`frandeley:${apiKey}`).toString("base64")}`,
    "Content-Type": "application/json",
  };

  try {
    const lookup = await fetch(`${endpoint}/${subscriberHash}`, {
      method: "GET",
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });

    if (lookup.ok) {
      const member = await lookup.json() as { status?: string };
      if (member.status === "subscribed") return "subscribed";
      if (member.status === "pending") return "pending";
    } else if (lookup.status !== 404) {
      console.error(`Mailchimp lookup failed with HTTP ${lookup.status}.`);
      return "error";
    }

    const update = await fetch(`${endpoint}/${subscriberHash}`, {
      method: "PUT",
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
      body: JSON.stringify({
        email_address: normalizedEmail,
        status_if_new: "pending",
        status: "pending",
        tags: ["frandeley-prelaunch"],
      }),
    });

    if (!update.ok) {
      console.error(`Mailchimp subscription request failed with HTTP ${update.status}.`);
      return "error";
    }
    return "pending";
  } catch {
    console.error("Mailchimp subscription request could not be completed.");
    return "error";
  }
}
