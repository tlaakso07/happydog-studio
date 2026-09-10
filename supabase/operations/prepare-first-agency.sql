-- Operator-only, one-time bootstrap for an empty application database.
-- The caller supplies studio.bootstrap_email through set_config in the same session.
-- This saves an invitation. It neither sends email nor verifies an account.
begin;
lock table public.orgs, public.workspaces, public.workspace_members, public.workspace_invites in exclusive mode;
do $$
declare
  operator_email text := lower(trim(current_setting('studio.bootstrap_email')));
  agency_id uuid;
  setup_workspace_id uuid;
begin
  if operator_email is null or length(operator_email) > 254
    or operator_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    then raise exception 'invalid_operator_email'; end if;
  if exists (select 1 from public.orgs) or exists (select 1 from public.workspaces)
    or exists (select 1 from public.workspace_members) or exists (select 1 from public.workspace_invites)
    then raise exception 'bootstrap_requires_empty_application'; end if;

  insert into public.orgs (name) values ('Happy Dog Media') returning id into agency_id;
  insert into public.workspaces (org_id, name, slug, monthly_allowance, settings)
    values (agency_id, 'Agency setup', 'agency-setup', 0, '{"purpose":"agency_administration"}')
    returning id into setup_workspace_id;
  insert into public.workspace_invites (workspace_id, email, role)
    values (setup_workspace_id, operator_email, 'agency');
end;
$$;
commit;
