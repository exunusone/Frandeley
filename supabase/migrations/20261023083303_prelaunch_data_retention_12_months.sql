-- Automatically remove pre-launch applications and contact requests after 12 months.
-- Newsletter consent is optional; Resend retains confirmed subscribers until they unsubscribe.

alter table public.pilot_signups
  add column if not exists updates_opt_in_at timestamptz;

update public.pilot_signups
set updates_opt_in_at = consent_at
where updates_opt_in = true and updates_opt_in_at is null;

alter table public.pilot_signups
  drop constraint if exists pilot_signups_updates_opt_in_timestamp_check;

alter table public.pilot_signups
  add constraint pilot_signups_updates_opt_in_timestamp_check
  check (updates_opt_in = (updates_opt_in_at is not null));

create extension if not exists pg_cron with schema pg_catalog;

create or replace function public.purge_frandeley_prelaunch_data()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.pilot_signups
  where created_at < now() - interval '12 months';

  delete from public.contact_messages
  where created_at < now() - interval '12 months';
end;
$$;

revoke all on function public.purge_frandeley_prelaunch_data() from public, anon, authenticated;

do $$
declare
  existing_job bigint;
begin
  for existing_job in
    select jobid from cron.job where jobname = 'frandeley-prelaunch-retention'
  loop
    perform cron.unschedule(existing_job);
  end loop;

  perform cron.schedule(
    'frandeley-prelaunch-retention',
    '15 3 * * *',
    'select public.purge_frandeley_prelaunch_data();'
  );
end;
$$;
