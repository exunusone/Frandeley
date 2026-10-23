-- Record only newsletter addresses that have completed the Resend double opt-in.
alter table public.pilot_signups
  add column if not exists updates_confirmed_at timestamptz;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'pilot_signups_updates_confirmed_check'
      and conrelid = 'public.pilot_signups'::regclass
  ) then
    alter table public.pilot_signups
      add constraint pilot_signups_updates_confirmed_check
      check (updates_confirmed_at is null or updates_opt_in = true);
  end if;
end;
$$;

create table if not exists public.newsletter_confirmation_tokens (
  email text primary key references public.pilot_signups(email) on delete cascade,
  token_hash text not null unique check (token_hash ~ '^[0-9a-f]{64}$'),
  consent_at timestamptz not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  used_at timestamptz,
  check (expires_at > created_at)
);

alter table public.newsletter_confirmation_tokens enable row level security;
revoke all on public.newsletter_confirmation_tokens from public, anon, authenticated;
grant select, update on public.pilot_signups to service_role;
grant select, insert, update, delete on public.newsletter_confirmation_tokens to service_role;
