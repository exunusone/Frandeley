import "server-only";

/** The anonymous counter stays unavailable until every server-side credential is present. */
export function isArtistInterestConfigured() {
  return Boolean(
    process.env.SUPABASE_URL?.trim() &&
    (process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || process.env.SUPABASE_SECRET_KEY?.trim()) &&
    process.env.TURNSTILE_SECRET_KEY?.trim() &&
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim(),
  );
}
