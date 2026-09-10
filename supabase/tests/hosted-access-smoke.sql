-- Explicit operator check for a linked hosted project. Every fixture rolls back.
-- Run only through: supabase db query --linked --file supabase/tests/hosted-access-smoke.sql
begin;

insert into auth.users (id, email, email_confirmed_at, raw_user_meta_data) values
  ('7ab10000-0000-4000-8000-000000000001', 'studio-smoke-owner@example.invalid', now(), '{}'),
  ('7ab10000-0000-4000-8000-000000000002', 'studio-smoke-agency@example.invalid', now(), '{}');
insert into public.orgs (id, name) values ('7ab10000-0000-4000-8000-000000000010', 'Transactional smoke test');
insert into public.workspaces (id, org_id, name, slug) values
  ('7ab10000-0000-4000-8000-000000000101', '7ab10000-0000-4000-8000-000000000010', 'Smoke one', 'transactional-smoke-one'),
  ('7ab10000-0000-4000-8000-000000000102', '7ab10000-0000-4000-8000-000000000010', 'Smoke two', 'transactional-smoke-two');
insert into public.workspace_members (workspace_id, user_id, role) values
  ('7ab10000-0000-4000-8000-000000000101', '7ab10000-0000-4000-8000-000000000001', 'owner'),
  ('7ab10000-0000-4000-8000-000000000101', '7ab10000-0000-4000-8000-000000000002', 'agency'),
  ('7ab10000-0000-4000-8000-000000000102', '7ab10000-0000-4000-8000-000000000002', 'agency');

set local role authenticated;
select set_config('request.jwt.claim.sub', '7ab10000-0000-4000-8000-000000000001', true);
do $$
begin
  if (select count(*) from public.workspaces) <> 1 then raise exception 'owner_workspace_isolation_failed'; end if;
  if public.is_agency('7ab10000-0000-4000-8000-000000000101') then raise exception 'owner_role_failed'; end if;
  begin
    perform public.create_company('7ab10000-0000-4000-8000-000000000010', 'Forbidden', 'forbidden-smoke');
    raise exception 'owner_created_company';
  exception when raise_exception then
    if sqlerrm <> 'not_authorized' then raise; end if;
  end;
end;
$$;

select set_config('request.jwt.claim.sub', '7ab10000-0000-4000-8000-000000000002', true);
do $$
begin
  if (select count(*) from public.workspaces) <> 2 then raise exception 'agency_workspace_access_failed'; end if;
  perform public.create_workspace_invitation(
    '7ab10000-0000-4000-8000-000000000102', 'studio-smoke-owner@example.invalid', 'owner'
  );
end;
$$;

select set_config('request.jwt.claim.sub', '7ab10000-0000-4000-8000-000000000001', true);
do $$
declare invitation_id uuid;
begin
  select id into strict invitation_id from public.pending_workspace_invitations();
  perform public.accept_workspace_invitation(invitation_id);
  perform public.accept_workspace_invitation(invitation_id);
  if (select count(*) from public.workspaces) <> 2 then raise exception 'accepted_membership_failed'; end if;
end;
$$;

reset role;
do $$
begin
  if exists (select 1 from pg_tables where schemaname = 'public' and not rowsecurity)
    then raise exception 'public_table_missing_rls'; end if;
  if exists (select 1 from storage.buckets where id in ('kit', 'renders', 'footage') and public)
    then raise exception 'public_media_bucket'; end if;
  if has_function_privilege('anon', 'public.accept_workspace_invitation(uuid)', 'execute')
    then raise exception 'anonymous_invitation_grant'; end if;
end;
$$;
rollback;
select 'passed; all test accounts and company data rolled back' as hosted_access_smoke;
