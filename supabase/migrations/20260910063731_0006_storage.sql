-- 0006_storage: private buckets. Path law: the first folder of every object is the workspace id.

insert into storage.buckets (id, name, public, file_size_limit)
values
  ('kit', 'kit', false, 524288000),
  ('renders', 'renders', false, 1073741824),
  ('footage', 'footage', false, 2147483648)
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit;

create or replace function storage_workspace(name text)
returns uuid
language sql immutable
as $$
  select nullif((storage.foldername(name))[1], '')::uuid;
$$;

-- Read: any member of the workspace named by the first path segment.
create policy "members read kit" on storage.objects for select
  using (bucket_id = 'kit' and is_member(storage_workspace(name)));
create policy "members read renders" on storage.objects for select
  using (bucket_id = 'renders' and is_member(storage_workspace(name)));
create policy "members read footage" on storage.objects for select
  using (bucket_id = 'footage' and is_member(storage_workspace(name)));

-- Write: owners and agency upload kit and footage. Renders are written by the worker (service role) only.
create policy "members upload kit" on storage.objects for insert
  with check (bucket_id = 'kit' and is_member(storage_workspace(name)));
create policy "members upload footage" on storage.objects for insert
  with check (bucket_id = 'footage' and is_member(storage_workspace(name)));

-- Delete: agency only, never renders from the client.
create policy "agency delete kit" on storage.objects for delete
  using (bucket_id = 'kit' and is_agency(storage_workspace(name)));
create policy "agency delete footage" on storage.objects for delete
  using (bucket_id = 'footage' and is_agency(storage_workspace(name)));
