-- 0002_brand_system: versioned brand systems, lockbook entities, kit intake, provenance.

create type brand_book as enum ('cast', 'wardrobe', 'product', 'fleet', 'world', 'voice_proof');
create type brand_status as enum ('draft', 'in_review', 'locked');
create type kit_kind as enum (
  'logo', 'uniform', 'product_photo', 'product_doc', 'truck', 'wrap_art',
  'jobsite_photo', 'footage', 'voice_note', 'brand_doc', 'other'
);

create table brand_systems (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  version int not null,
  status brand_status not null default 'draft',
  locked_at timestamptz,
  locked_by uuid references auth.users(id),
  signed_off_by uuid references auth.users(id),
  signed_off_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  unique (workspace_id, version)
);

-- A locked brand system is immutable except for the sign-off columns.
create or replace function brand_systems_guard()
returns trigger language plpgsql as $$
begin
  if old.status = 'locked' then
    if new.version <> old.version or new.workspace_id <> old.workspace_id
       or new.status <> old.status or new.locked_at <> old.locked_at or new.locked_by <> old.locked_by
       or new.notes is distinct from old.notes then
      raise exception 'brand_system_locked';
    end if;
  end if;
  return new;
end;
$$;
create trigger brand_systems_guard before update on brand_systems
  for each row execute function brand_systems_guard();

create table intake_sessions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  started_by uuid references auth.users(id),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  step_reached int not null default 1,
  created_at timestamptz not null default now()
);

create table kit_assets (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  intake_session_id uuid references intake_sessions(id) on delete set null,
  kind kit_kind not null,
  bucket text not null,
  path text not null,
  filename text not null,
  mime text,
  bytes bigint,
  transcript text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (bucket, path)
);
create index kit_assets_ws_kind_idx on kit_assets (workspace_id, kind);

-- One row per cast member, outfit, SKU, fleet asset, world rule group, or voice/proof section.
create table brand_entities (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  brand_system_id uuid not null references brand_systems(id) on delete cascade,
  book brand_book not null,
  kind text not null,
  name text not null,
  locked_paragraph text,
  data jsonb not null default '{}'::jsonb,
  sort int not null default 0,
  created_at timestamptz not null default now()
);
create index brand_entities_bs_idx on brand_entities (brand_system_id, book, sort);

-- Exactly one locked synthetic voice per cast member. Never cloned from a real person.
create table voices (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  cast_entity_id uuid not null unique references brand_entities(id) on delete cascade,
  provider text not null,
  provider_voice_id text,
  sample_kit_asset_id uuid references kit_assets(id),
  description text,
  locked boolean not null default false,
  created_at timestamptz not null default now()
);

-- Provenance: every trait cites the kit asset it came from, or an explicit agency note.
create table brand_traits (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  brand_system_id uuid not null references brand_systems(id) on delete cascade,
  entity_id uuid references brand_entities(id) on delete cascade,
  key text not null,
  value jsonb not null,
  source_kit_asset_id uuid references kit_assets(id),
  source_locator text,
  source_note text,
  created_at timestamptz not null default now(),
  check (source_kit_asset_id is not null or source_note like 'agency:%')
);
create index brand_traits_bs_idx on brand_traits (brand_system_id);

-- Notify the worker when a kit is complete.
create or replace function intake_completed_notify()
returns trigger language plpgsql as $$
begin
  if new.completed_at is not null and old.completed_at is null then
    perform pg_notify('intake_completed', json_build_object('id', new.id, 'workspace_id', new.workspace_id)::text);
  end if;
  return new;
end;
$$;
create trigger intake_completed_notify after update on intake_sessions
  for each row execute function intake_completed_notify();

-- RLS
alter table brand_systems enable row level security;
alter table intake_sessions enable row level security;
alter table kit_assets enable row level security;
alter table brand_entities enable row level security;
alter table voices enable row level security;
alter table brand_traits enable row level security;

create policy brand_systems_select on brand_systems for select using (is_member(workspace_id));
create policy brand_systems_agency on brand_systems for all using (is_agency(workspace_id)) with check (is_agency(workspace_id));

create policy intake_select on intake_sessions for select using (is_member(workspace_id));
create policy intake_insert on intake_sessions for insert with check (is_member(workspace_id));
create policy intake_update on intake_sessions for update using (is_member(workspace_id)) with check (is_member(workspace_id));

create policy kit_select on kit_assets for select using (is_member(workspace_id));
create policy kit_insert on kit_assets for insert with check (is_member(workspace_id));
create policy kit_agency on kit_assets for update using (is_agency(workspace_id)) with check (is_agency(workspace_id));
create policy kit_delete_agency on kit_assets for delete using (is_agency(workspace_id));

create policy entities_select on brand_entities for select using (is_member(workspace_id));
create policy entities_agency on brand_entities for all using (is_agency(workspace_id)) with check (is_agency(workspace_id));

create policy voices_select on voices for select using (is_member(workspace_id));
create policy voices_agency on voices for all using (is_agency(workspace_id)) with check (is_agency(workspace_id));

create policy traits_select on brand_traits for select using (is_member(workspace_id));
create policy traits_agency on brand_traits for all using (is_agency(workspace_id)) with check (is_agency(workspace_id));
