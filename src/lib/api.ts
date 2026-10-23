import { NextRequest, NextResponse } from "next/server";

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

export async function readJson(request: NextRequest): Promise<Record<string, unknown> | null> {
  if (!request.headers.get("content-type")?.startsWith("application/json")) return null;
  if (Number(request.headers.get("content-length") || 0) > 10_000) return null;
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) return null;
    return body as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function readSubmission(request: NextRequest): Promise<{ body: Record<string, unknown>; native: boolean } | null> {
  const contentType = request.headers.get("content-type") || "";
  if (Number(request.headers.get("content-length") || 0) > 10_000) return null;
  if (contentType.startsWith("application/json")) {
    const body = await readJson(request);
    return body ? { body, native: false } : null;
  }
  if (contentType.startsWith("application/x-www-form-urlencoded") || contentType.startsWith("multipart/form-data")) {
    try {
      const fields = await request.formData();
      const body: Record<string, unknown> = Object.fromEntries(fields.entries());
      body.consent = fields.get("consent") === "on";
      body.updates = fields.get("updates") === "on";
      return { body, native: true };
    } catch {
      return null;
    }
  }
  return null;
}

export function formResult(request: NextRequest, native: boolean, path: string, status: "envoye" | "invalide" | "indisponible", code: number, message: string) {
  if (native) return NextResponse.redirect(new URL(`${path}?status=${status}#formulaire`, request.url), 303);
  return status === "envoye" ? NextResponse.json({ ok: true }, { status: code }) : jsonError(message, code);
}

export function stringField(body: Record<string, unknown>, key: string, limit: number) {
  const value = body[key];
  return typeof value === "string" && value.length <= limit ? value.trim() : null;
}
