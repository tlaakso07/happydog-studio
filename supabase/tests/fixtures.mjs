import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { citext } from "@electric-sql/pglite/contrib/citext";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";

export const id = (n) =>
  `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
export const U = {
  agency: id(1),
  owner: id(2),
  other: id(3),
  invited: id(4),
  unverified: id(5),
  outsider: id(6),
};
export const W = { first: id(101), second: id(102) };
export const O = { first: id(201), second: id(202) };

export async function createTestDatabase() {
  const db = new PGlite({ extensions: { citext, pgcrypto } });
  await db.exec(`
    create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
    create schema auth; create schema storage;
    create table auth.users(id uuid primary key, email text unique, raw_user_meta_data jsonb default '{}', email_confirmed_at timestamptz);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    create table storage.buckets(id text primary key, name text, public boolean, file_size_limit bigint);
    create table storage.objects(id uuid primary key default gen_random_uuid(), bucket_id text references storage.buckets(id), name text);
    alter table storage.objects enable row level security;
    create function storage.foldername(name text) returns text[] language sql immutable as $$ select string_to_array(name, '/') $$;
    grant usage on schema public, auth, storage to anon, authenticated;
    grant execute on function auth.uid() to anon, authenticated;
  `);
  for (const migration of [
    "20260905054542_0001_tenancy.sql",
    "20260905054627_0002_brand_system.sql",
    "20260910063730_0003_offers_library.sql",
    "20260910063731_0006_storage.sql",
    "20260910063732_0008_access_foundation.sql",
  ]) {
    await db.exec(
      await readFile(
        new URL(`../migrations/${migration}`, import.meta.url),
        "utf8",
      ),
    );
  }
  await db.exec(
    "grant select, insert, update, delete on all tables in schema public, storage to anon, authenticated;",
  );
  for (const [name, value] of Object.entries(U)) {
    await db.query(
      "insert into auth.users(id,email,email_confirmed_at) values ($1,$2,$3)",
      [value, `${name}@example.com`, name === "unverified" ? null : new Date()],
    );
  }
  await db.query("insert into orgs(id,name) values ($1,$2),($3,$4)", [
    O.first,
    "First agency",
    O.second,
    "Other agency",
  ]);
  await db.query(
    "insert into workspaces(id,org_id,slug,name) values ($1,$2,$3,$4),($5,$6,$7,$8)",
    [
      W.first,
      O.first,
      "company-one",
      "Company One",
      W.second,
      O.second,
      "company-two",
      "Company Two",
    ],
  );
  for (const [workspace, user, role] of [
    [W.first, U.agency, "agency"],
    [W.second, U.agency, "agency"],
    [W.first, U.owner, "owner"],
    [W.second, U.other, "owner"],
  ]) {
    await db.query(
      "insert into workspace_members(workspace_id,user_id,role) values ($1,$2,$3)",
      [workspace, user, role],
    );
  }
  for (const [n, workspace] of [
    [1, W.first],
    [2, W.second],
  ]) {
    await db.query(
      "insert into brand_systems(id,workspace_id,version) values ($1,$2,1)",
      [id(300 + n), workspace],
    );
    await db.query(
      "insert into intake_sessions(id,workspace_id) values ($1,$2)",
      [id(400 + n), workspace],
    );
    await db.query(
      "insert into kit_assets(id,workspace_id,intake_session_id,kind,bucket,path,filename) values ($1,$2,$3,'logo','kit',$4,'logo.svg')",
      [id(500 + n), workspace, id(400 + n), `${workspace}/logo.svg`],
    );
    await db.query(
      "insert into brand_entities(id,workspace_id,brand_system_id,book,kind,name) values ($1,$2,$3,'cast','person','Person')",
      [id(600 + n), workspace, id(300 + n)],
    );
    await db.query(
      "insert into storage.objects(bucket_id,name) values ('kit',$1)",
      [`${workspace}/logo.svg`],
    );
  }
  return db;
}
