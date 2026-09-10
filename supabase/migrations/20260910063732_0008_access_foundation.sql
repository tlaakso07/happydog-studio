-- Account foundation. Apply after 0001, 0002, 0003, and 0006.
-- No membership is granted until the invitee verifies their email and accepts.

alter table public.workspace_invites
  add column expires_at timestamptz not null default (now() + interval '7 days'),
  add column revoked_at timestamptz,
  add column accepted_by uuid references auth.users(id);

-- Do not revive an old pending invitation when applying this migration.
update public.workspace_invites set expires_at = created_at + interval '7 days';

-- Preserve old accepted invitations as history; they cannot grant access again.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace function public.pending_workspace_invitations()
returns table (id uuid, workspace_name text, role public.member_role, expires_at timestamptz)
language sql stable security definer set search_path = ''
as $$
  select i.id, w.name, i.role, i.expires_at
  from public.workspace_invites i
  join public.workspaces w on w.id = i.workspace_id
  join auth.users u on u.id = auth.uid() and u.email_confirmed_at is not null
  where lower(i.email::text) = lower(u.email)
    and i.accepted_at is null and i.revoked_at is null and i.expires_at > now()
  order by i.created_at;
$$;

create or replace function public.accept_workspace_invitation(invitation_id uuid)
returns uuid language plpgsql security definer set search_path = ''
as $$
declare
  invitation public.workspace_invites%rowtype;
  verified_email text;
begin
  select u.email into verified_email from auth.users u
  where u.id = auth.uid() and u.email_confirmed_at is not null;
  if verified_email is null then raise exception 'invitation_unavailable'; end if;

  select * into invitation from public.workspace_invites where id = invitation_id for update;
  if not found or lower(invitation.email::text) <> lower(verified_email)
    or invitation.revoked_at is not null then raise exception 'invitation_unavailable'; end if;

  if invitation.accepted_at is not null then
    if invitation.accepted_by = auth.uid() and public.is_member(invitation.workspace_id) then
      return invitation.workspace_id;
    end if;
    -- An old invitation must never restore revoked membership.
    raise exception 'invitation_unavailable';
  end if;
  if invitation.expires_at <= now() then raise exception 'invitation_unavailable'; end if;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (invitation.workspace_id, auth.uid(), invitation.role)
  on conflict (workspace_id, user_id) do nothing;
  update public.workspace_invites set accepted_at = now(), accepted_by = auth.uid()
  where id = invitation.id;
  return invitation.workspace_id;
end;
$$;

create or replace function public.create_company(company_org_id uuid, company_name text, company_slug text)
returns uuid language plpgsql security definer set search_path = ''
as $$
declare company_id uuid;
begin
  if auth.uid() is null or not public.is_org_staff(company_org_id) then raise exception 'not_authorized'; end if;
  if length(trim(company_name)) not between 2 and 120 or length(company_slug) not between 2 and 64
    or company_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$' then raise exception 'invalid_company'; end if;
  insert into public.workspaces (org_id, name, slug) values (company_org_id, trim(company_name), company_slug)
  returning id into company_id;
  insert into public.workspace_members (workspace_id, user_id, role) values (company_id, auth.uid(), 'agency');
  return company_id;
end;
$$;

create or replace function public.create_workspace_invitation(company_id uuid, invite_email text, invite_role public.member_role)
returns uuid language plpgsql security definer set search_path = ''
as $$
declare result_id uuid;
begin
  if auth.uid() is null or not public.is_agency(company_id) then raise exception 'not_authorized'; end if;
  if invite_email is null or length(trim(invite_email)) > 254 or trim(invite_email) !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    or invite_role is null then raise exception 'invalid_invitation'; end if;
  -- Serializes invitation changes for this company, including duplicate clicks.
  perform 1 from public.workspaces where id = company_id for update;
  select id into result_id from public.workspace_invites
    where workspace_id = company_id and lower(email::text) = lower(trim(invite_email)) and role = invite_role
      and accepted_at is null and revoked_at is null and expires_at > now()
    order by created_at desc limit 1;
  if result_id is not null then return result_id; end if;
  update public.workspace_invites set revoked_at = now()
    where workspace_id = company_id and lower(email::text) = lower(trim(invite_email))
      and accepted_at is null and revoked_at is null;
  insert into public.workspace_invites (workspace_id, email, role, invited_by)
    values (company_id, lower(trim(invite_email)), invite_role, auth.uid()) returning id into result_id;
  return result_id;
end;
$$;

create or replace function public.revoke_workspace_invitation(invitation_id uuid)
returns void language plpgsql security definer set search_path = ''
as $$
declare company_id uuid;
begin
  select workspace_id into company_id from public.workspace_invites where id = invitation_id;
  if company_id is null or not public.is_agency(company_id) then raise exception 'not_authorized'; end if;
  perform 1 from public.workspaces where id = company_id for update;
  update public.workspace_invites set revoked_at = coalesce(revoked_at, now())
    where id = invitation_id and accepted_at is null;
end;
$$;

-- Only verified RPCs may create companies or change invitation lifecycle fields.
drop policy workspaces_insert_staff on public.workspaces;
drop policy invites_agency on public.workspace_invites;
create policy invites_agency_read on public.workspace_invites for select using (public.is_agency(workspace_id));

revoke all on function public.pending_workspace_invitations() from public, anon;
revoke all on function public.accept_workspace_invitation(uuid) from public, anon;
revoke all on function public.create_company(uuid, text, text) from public, anon;
revoke all on function public.create_workspace_invitation(uuid, text, public.member_role) from public, anon;
revoke all on function public.revoke_workspace_invitation(uuid) from public, anon;
grant execute on function public.pending_workspace_invitations() to authenticated;
grant execute on function public.accept_workspace_invitation(uuid) to authenticated;
grant execute on function public.create_company(uuid, text, text) to authenticated;
grant execute on function public.create_workspace_invitation(uuid, text, public.member_role) to authenticated;
grant execute on function public.revoke_workspace_invitation(uuid) to authenticated;

-- Composite references close cross-company links even for multi-company staff.
alter table public.enterprise_accounts add constraint enterprise_accounts_id_org_unique unique (id, org_id);
alter table public.workspaces add constraint workspaces_enterprise_org_fk
  foreign key (enterprise_account_id, org_id) references public.enterprise_accounts(id, org_id);
alter table public.brand_systems add constraint brand_systems_id_workspace_unique unique (id, workspace_id);
alter table public.intake_sessions add constraint intake_sessions_id_workspace_unique unique (id, workspace_id);
alter table public.kit_assets add constraint kit_assets_id_workspace_unique unique (id, workspace_id);
alter table public.kit_assets add constraint kit_assets_path_workspace_check
  check (split_part(path, '/', 1) = workspace_id::text and position('/' in path) > 0);
alter table public.brand_entities add constraint brand_entities_id_workspace_unique unique (id, workspace_id);
alter table public.brand_entities add constraint brand_entities_id_system_workspace_unique unique (id, brand_system_id, workspace_id);
alter table public.kit_assets add constraint kit_assets_intake_workspace_fk
  foreign key (intake_session_id, workspace_id) references public.intake_sessions(id, workspace_id);
alter table public.brand_entities add constraint brand_entities_system_workspace_fk
  foreign key (brand_system_id, workspace_id) references public.brand_systems(id, workspace_id);
alter table public.voices add constraint voices_cast_workspace_fk
  foreign key (cast_entity_id, workspace_id) references public.brand_entities(id, workspace_id);
alter table public.voices add constraint voices_sample_workspace_fk
  foreign key (sample_kit_asset_id, workspace_id) references public.kit_assets(id, workspace_id);
alter table public.brand_traits add constraint traits_system_workspace_fk
  foreign key (brand_system_id, workspace_id) references public.brand_systems(id, workspace_id);
alter table public.brand_traits add constraint traits_entity_system_workspace_fk
  foreign key (entity_id, brand_system_id, workspace_id) references public.brand_entities(id, brand_system_id, workspace_id);
alter table public.brand_traits add constraint traits_source_workspace_fk
  foreign key (source_kit_asset_id, workspace_id) references public.kit_assets(id, workspace_id);
alter table public.reference_items add constraint refs_asset_workspace_fk
  foreign key (kit_asset_id, workspace_id) references public.kit_assets(id, workspace_id);
alter table public.footage_clips add constraint clips_asset_workspace_fk
  foreign key (kit_asset_id, workspace_id) references public.kit_assets(id, workspace_id);

-- Company ownership cannot be changed through a normal workspace update.
create function public.guard_company_ownership()
returns trigger language plpgsql set search_path = ''
as $$
begin
  if new.org_id is distinct from old.org_id then raise exception 'company_org_immutable'; end if;
  return new;
end;
$$;
create trigger guard_company_ownership before update on public.workspaces
  for each row execute function public.guard_company_ownership();
