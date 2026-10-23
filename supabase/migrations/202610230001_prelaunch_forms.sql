-- Apply to the selected Frandeley project after verifying that these names are unused.
-- The site uses only a publishable key; public roles may INSERT but cannot read entries.

create table if not exists public.pilot_signups (
  id uuid primary key default gen_random_uuid(),
  artist_name text not null check (char_length(artist_name) between 2 and 80),
  email text not null unique check (char_length(email) <= 254 and email = lower(email)),
  profile text check (profile in ('solo', 'collectif', 'collaboration')),
  current_project text check (char_length(current_project) <= 500),
  consent_at timestamptz not null,
  updates_opt_in boolean not null default false,
  source text not null default 'site' check (source = 'site'),
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) <= 254 and email = lower(email)),
  subject text not null check (subject in ('pilote', 'partenariat', 'donnees', 'autre')),
  message text not null check (char_length(message) between 10 and 3000),
  consent_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists pilot_signups_created_at_idx on public.pilot_signups (created_at desc);
create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);

alter table public.pilot_signups enable row level security;
alter table public.contact_messages enable row level security;

revoke all on public.pilot_signups from anon, authenticated;
revoke all on public.contact_messages from anon, authenticated;
grant insert on public.pilot_signups to anon, authenticated;
grant insert on public.contact_messages to anon, authenticated;

create policy "public may submit a pilot application"
  on public.pilot_signups for insert to anon, authenticated
  with check (
    consent_at <= now()
    and consent_at > now() - interval '5 minutes'
    and source = 'site'
  );

create policy "public may send a contact message"
  on public.contact_messages for insert to anon, authenticated
  with check (
    consent_at <= now()
    and consent_at > now() - interval '5 minutes'
  );
