-- 0001_tenancy: orgs, enterprise accounts, workspaces, members, invites, RLS helpers.
-- Every tenant table carries workspace_id and is guarded by is_member(workspace_id).

create extension if not exists citext;
create extension if not exists pgcrypto;

create type member_role as enum ('owner', 'agency', 'enterprise');

create table orgs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table enterprise_accounts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table workspaces (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  enterprise_account_id uuid references enterprise_accounts(id) on delete set null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  monthly_allowance int not null default 30,
  allowance_resets_on date,
  next_milestone text,
  disclosure_toggle boolean not null default false,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email citext not null,
  display_name text,
  created_at timestamptz not null default now()
);

create table workspace_members (
  workspace_id uuid not null references workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role member_role not null,
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create table workspace_invites (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  email citext not null,
  role member_role not null,
  invited_by uuid references auth.users(id),
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);
create index workspace_invites_email_idx on workspace_invites (email) where accepted_at is null;

-- Helpers. Security definer so they can read workspace_members regardless of the caller's policies.
create or replace function is_member(ws uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from workspace_members m
    where m.workspace_id = ws and m.user_id = auth.uid()
  );
$$;

create or replace function member_role(ws uuid)
returns member_role
language sql stable security definer set search_path = public
as $$
  select m.role from workspace_members m
  where m.workspace_id = ws and m.user_id = auth.uid()
  limit 1;
$$;

create or replace function is_agency(ws uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce(member_role(ws) = 'agency', false);
$$;

-- Every org member with the agency role on any workspace of the org is treated as org staff.
create or replace function is_org_staff(o uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from workspace_members m
    join workspaces w on w.id = m.workspace_id
    where w.org_id = o and m.user_id = auth.uid() and m.role = 'agency'
  );
$$;

-- Provision the profile and attach any pending invites on first sign-in.
create or replace function handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;

  insert into workspace_members (workspace_id, user_id, role)
  select i.workspace_id, new.id, i.role
  from workspace_invites i
  where i.email = new.email and i.accepted_at is null
  on conflict (workspace_id, user_id) do nothing;

  update workspace_invites set accepted_at = now()
  where email = new.email and accepted_at is null;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- RLS
alter table orgs enable row level security;
alter table enterprise_accounts enable row level security;
alter table workspaces enable row level security;
alter table profiles enable row level security;
alter table workspace_members enable row level security;
alter table workspace_invites enable row level security;

create policy orgs_select on orgs for select using (
  exists (select 1 from workspaces w where w.org_id = orgs.id and is_member(w.id))
);

create policy enterprise_select on enterprise_accounts for select using (
  exists (select 1 from workspaces w where w.enterprise_account_id = enterprise_accounts.id and is_member(w.id))
);

create policy workspaces_select on workspaces for select using (is_member(id));
create policy workspaces_update_agency on workspaces for update using (is_agency(id)) with check (is_agency(id));
create policy workspaces_insert_staff on workspaces for insert with check (is_org_staff(org_id));

create policy profiles_self on profiles for select using (
  id = auth.uid() or exists (
    select 1 from workspace_members a
    join workspace_members b on a.workspace_id = b.workspace_id
    where a.user_id = auth.uid() and b.user_id = profiles.id
  )
);
create policy profiles_update_self on profiles for update using (id = auth.uid()) with check (id = auth.uid());

create policy members_select on workspace_members for select using (is_member(workspace_id));
create policy members_write_agency on workspace_members for all using (is_agency(workspace_id)) with check (is_agency(workspace_id));

create policy invites_agency on workspace_invites for all using (is_agency(workspace_id)) with check (is_agency(workspace_id));
