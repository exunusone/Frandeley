-- Resend replaced Brevo for pilot notifications. Remove the old database-side
-- HTTP triggers so a future pilot signup cannot send a duplicate Brevo request.
drop trigger if exists frandeley_brevo_newsletter_confirmed on public.pilot_signups;
drop trigger if exists frandeley_brevo_pilot_signup on public.pilot_signups;

-- These functions are no longer part of the application API.
revoke all on function public.frandeley_notify_brevo_newsletter_confirmation() from public, anon, authenticated, service_role;
revoke all on function public.frandeley_notify_brevo_pilot_signup() from public, anon, authenticated, service_role;
