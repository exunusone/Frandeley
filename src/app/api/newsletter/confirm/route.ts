import { NextRequest, NextResponse } from "next/server";
import { isSameOrigin } from "@/lib/api";
import { confirmNewsletterSubscription, readNewsletterConfirmation } from "@/lib/resend";
import { siteUrl } from "@/lib/site-config";

export const runtime = "nodejs";

function redirectToPilot(status: "confirmed" | "expired" | "error") {
  const url = new URL("/pilote", siteUrl);
  url.searchParams.set("newsletter", status);
  return NextResponse.redirect(url, 303);
}

function confirmationPage(token: string) {
  const safeToken = token.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  const html = '<!doctype html><html lang="fr"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<meta name="referrer" content="no-referrer"><title>Confirmer les nouvelles — FRANDELEY</title>' +
    '<style>body{margin:0;background:#f4f5f7;color:#17181c;font:16px/1.6 Arial,Helvetica,sans-serif}main{max-width:560px;margin:10vh auto;padding:36px;background:#fff;border-radius:16px}h1{line-height:1.2}button{border:0;border-radius:8px;background:#155eef;color:#fff;padding:14px 20px;font-size:16px;font-weight:700;cursor:pointer}a{color:#155eef}</style></head>' +
    '<body><main><p><strong>FRANDELEY</strong></p><h1>Confirmez votre inscription</h1>' +
    '<p>Un clic supplémentaire est nécessaire pour confirmer votre adresse et recevoir les nouvelles de Frandeley.</p>' +
    '<form method="post" action="/api/newsletter/confirm"><input type="hidden" name="token" value="' + safeToken + '">' +
    '<button type="submit">Confirmer mon inscription</button></form>' +
    '<p>Si vous n’avez pas demandé ces nouvelles, vous pouvez fermer cette page.</p></main></body></html>';
  return new NextResponse(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
      "referrer-policy": "no-referrer",
      "x-content-type-options": "nosniff",
    },
  });
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token || token.length > 4096) return redirectToPilot("error");
  const confirmation = readNewsletterConfirmation(token);
  if (!confirmation) return redirectToPilot("error");
  if (confirmation.expiresAt <= Date.now()) return redirectToPilot("expired");
  return confirmationPage(token);
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return redirectToPilot("error");
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return redirectToPilot("error");
  }
  const token = form.get("token");
  if (typeof token !== "string" || token.length > 4096) return redirectToPilot("error");
  const confirmation = readNewsletterConfirmation(token);
  if (!confirmation) return redirectToPilot("error");
  if (confirmation.expiresAt <= Date.now()) return redirectToPilot("expired");

  const result = await confirmNewsletterSubscription(confirmation.email);
  return redirectToPilot(result === "confirmed" ? "confirmed" : "error");
}
