-- 0003_offers_library: the monthly deal, saved references, footage clips.

create type offer_status as enum ('draft', 'active', 'ended');
create type ref_kind as enum ('saved_ad', 'winner', 'footage', 'playbook', 'note');

create table offers (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  title text not null,
  terms text,
  starts_on date,
  ends_on date,
  approved_claims text[] not null default '{}',
  financing_line text,
  qualifier text,
  status offer_status not null default 'active',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
create unique index offers_one_active_idx on offers (workspace_id) where status = 'active';

create table reference_items (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  kind ref_kind not null,
  title text not null,
  url text,
  kit_asset_id uuid references kit_assets(id) on delete set null,
  meta jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table footage_clips (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  kit_asset_id uuid not null references kit_assets(id) on delete cascade,
  t_in numeric(10,3) not null,
  t_out numeric(10,3) not null,
  thumb_path text,
  proxy_path text,
  transcript text,
  tags text[] not null default '{}',
  third_party_marks text[] not null default '{}',
  created_at timestamptz not null default now(),
  check (t_out > t_in)
);
create index footage_clips_ws_idx on footage_clips (workspace_id);

alter table offers enable row level security;
alter table reference_items enable row level security;
alter table footage_clips enable row level security;

create policy offers_member on offers for all using (is_member(workspace_id)) with check (is_member(workspace_id));
create policy refs_member on reference_items for all using (is_member(workspace_id)) with check (is_member(workspace_id));
create policy clips_select on footage_clips for select using (is_member(workspace_id));
create policy clips_agency on footage_clips for all using (is_agency(workspace_id)) with check (is_agency(workspace_id));
