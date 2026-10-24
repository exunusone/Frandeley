-- Store one anonymous interest vote per browser identifier. Raw browser identifiers
-- never leave the Vercel route; only their keyed digest is sent to this database.
create table if not exists public.artist_interest_votes (
  visitor_hash text primary key check (visitor_hash ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now()
);

create index if not exists artist_interest_votes_created_at_idx
  on public.artist_interest_votes (created_at);

create table if not exists public.artist_interest_totals (
  singleton smallint primary key default 1 check (singleton = 1),
  total_count bigint not null default 0 check (total_count >= 0)
);

insert into public.artist_interest_totals (singleton, total_count)
values (1, 0)
on conflict (singleton) do nothing;

alter table public.artist_interest_votes enable row level security;
alter table public.artist_interest_totals enable row level security;

revoke all on public.artist_interest_votes from public, anon, authenticated;
revoke all on public.artist_interest_totals from public, anon, authenticated;
grant select, insert, delete on public.artist_interest_votes to service_role;
grant select, update on public.artist_interest_totals to service_role;

create or replace function public.set_artist_interest(
  p_visitor_hash text,
  p_interested boolean
)
returns table (changed boolean, is_interested boolean, total_count bigint)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  affected_rows bigint;
  updated_total bigint;
begin
  if p_visitor_hash is null or p_visitor_hash !~ '^[0-9a-f]{64}$' or p_interested is null then
    raise exception 'Invalid artist interest request' using errcode = '22023';
  end if;

  if p_interested then
    insert into public.artist_interest_votes (visitor_hash)
    values (p_visitor_hash)
    on conflict (visitor_hash) do nothing;
  else
    delete from public.artist_interest_votes
    where visitor_hash = p_visitor_hash;
  end if;

  get diagnostics affected_rows = row_count;

  if affected_rows > 0 then
    update public.artist_interest_totals as totals
    set total_count = greatest(totals.total_count + case when p_interested then 1 else -1 end, 0)
    where totals.singleton = 1
    returning totals.total_count into updated_total;
  else
    select totals.total_count
    into updated_total
    from public.artist_interest_totals as totals
    where totals.singleton = 1;
  end if;

  if updated_total is null then
    raise exception 'Artist interest counter is not initialized';
  end if;

  return query select affected_rows > 0, p_interested, updated_total;
end;
$$;

create or replace function public.get_artist_interest_count()
returns bigint
language sql
stable
security invoker
set search_path = ''
as $$
  select total_count
  from public.artist_interest_totals
  where singleton = 1
$$;

revoke all on function public.set_artist_interest(text, boolean) from public, anon, authenticated;
revoke all on function public.get_artist_interest_count() from public, anon, authenticated;
grant execute on function public.set_artist_interest(text, boolean) to service_role;
grant execute on function public.get_artist_interest_count() to service_role;

-- The existing daily retention job also expires the anonymous deduplication hashes.
create or replace function public.purge_frandeley_prelaunch_data()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform 1
  from public.artist_interest_totals
  where singleton = 1
  for update;

  delete from public.pilot_signups
  where created_at < now() - interval '12 months';

  delete from public.contact_messages
  where created_at < now() - interval '12 months';

  delete from public.artist_interest_votes
  where created_at < now() - interval '12 months';

  update public.artist_interest_totals
  set total_count = (select count(*)::bigint from public.artist_interest_votes)
  where singleton = 1;
end;
$$;

revoke all on function public.purge_frandeley_prelaunch_data() from public, anon, authenticated, service_role;
