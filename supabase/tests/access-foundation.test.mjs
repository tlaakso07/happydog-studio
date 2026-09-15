import { test, before, after, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";

import { createTestDatabase, id, U, W, O } from "./fixtures.mjs";
let db;

before(async () => {
  db = await createTestDatabase();
});
after(async () => {
  await db?.close();
});
beforeEach(async () => {
  await db.exec("begin");
});
afterEach(async () => {
  await db.exec("rollback");
});

async function as(user) {
  await db.exec("set local role authenticated");
  await db.query("select set_config('request.jwt.claim.sub', $1, true)", [
    user,
  ]);
}
async function admin() {
  await db.exec("reset role");
}
async function reject(sql, args = [], pattern = /./) {
  await db.exec("savepoint expected_failure");
  await assert.rejects(db.query(sql, args), pattern);
  await db.exec(
    "rollback to savepoint expected_failure; release savepoint expected_failure",
  );
}
async function invite(
  email = "invited@example.com",
  role = "owner",
  company = W.first,
) {
  await as(U.agency);
  const r = await db.query(
    "select create_workspace_invitation($1,$2,$3) as id",
    [company, email, role],
  );
  return r.rows[0].id;
}

test("owner and outsider queries cannot read another company or its media", async () => {
  await as(U.owner);
  assert.deepEqual((await db.query("select id from workspaces")).rows, [
    { id: W.first },
  ]);
  assert.equal((await db.query("select * from kit_assets")).rows.length, 1);
  assert.equal(
    (await db.query("select * from storage.objects")).rows.length,
    1,
  );
  await reject(
    "insert into storage.objects(bucket_id,name) values ('kit',$1)",
    [`${W.second}/stolen.svg`],
    /row-level security/,
  );
  await as(U.outsider);
  assert.equal((await db.query("select * from workspaces")).rows.length, 0);
  assert.equal(
    (await db.query("select * from storage.objects")).rows.length,
    0,
  );
});

test("account creation never auto-accepts an invitation", async () => {
  const invitation = await invite("new-person@example.com");
  await admin();
  await db.query(
    "insert into auth.users(id,email,email_confirmed_at) values ($1,$2,now())",
    [id(9), "new-person@example.com"],
  );
  assert.equal(
    (
      await db.query("select * from workspace_members where user_id=$1", [
        id(9),
      ])
    ).rows.length,
    0,
  );
  await as(id(9));
  assert.equal(
    (await db.query("select * from pending_workspace_invitations()")).rows[0]
      .id,
    invitation,
  );
  await db.query("select accept_workspace_invitation($1)", [invitation]);
  assert.equal((await db.query("select * from workspaces")).rows.length, 1);
});

test("existing user joins a second company after verified acceptance; retries are harmless", async () => {
  const invitation = await invite("OWNER@example.com", "owner", W.second);
  await as(U.owner);
  assert.equal((await db.query("select * from workspaces")).rows.length, 1);
  await db.query("select accept_workspace_invitation($1)", [invitation]);
  await db.query("select accept_workspace_invitation($1)", [invitation]);
  assert.equal((await db.query("select * from workspaces")).rows.length, 2);
  assert.equal(
    (
      await db.query("select * from workspace_members where user_id=$1", [
        U.owner,
      ])
    ).rows.length,
    2,
  );
});

test("wrong email, unverified account, expired and revoked invitations are refused", async () => {
  const invitation = await invite();
  await as(U.other);
  assert.equal(
    (await db.query("select * from pending_workspace_invitations()")).rows
      .length,
    0,
  );
  await reject(
    "select accept_workspace_invitation($1)",
    [invitation],
    /invitation_unavailable/,
  );
  const unverified = await invite("unverified@example.com");
  await as(U.unverified);
  await reject(
    "select accept_workspace_invitation($1)",
    [unverified],
    /invitation_unavailable/,
  );
  await admin();
  await db.query(
    "update workspace_invites set expires_at=now()-interval '1 second' where id=$1",
    [invitation],
  );
  await as(U.invited);
  await reject(
    "select accept_workspace_invitation($1)",
    [invitation],
    /invitation_unavailable/,
  );
  const revoked = await invite();
  await db.query("select revoke_workspace_invitation($1)", [revoked]);
  await as(U.invited);
  await reject(
    "select accept_workspace_invitation($1)",
    [revoked],
    /invitation_unavailable/,
  );
});

test("accepted invitation cannot restore revoked membership or promote existing membership", async () => {
  const invitation = await invite();
  await as(U.invited);
  await db.query("select accept_workspace_invitation($1)", [invitation]);
  await admin();
  await db.query(
    "delete from workspace_members where workspace_id=$1 and user_id=$2",
    [W.first, U.invited],
  );
  await as(U.invited);
  await reject(
    "select accept_workspace_invitation($1)",
    [invitation],
    /invitation_unavailable/,
  );
  const escalation = await invite("owner@example.com", "agency");
  await as(U.owner);
  await db.query("select accept_workspace_invitation($1)", [escalation]);
  assert.equal(
    (
      await db.query("select role from workspace_members where user_id=$1", [
        U.owner,
      ])
    ).rows[0].role,
    "owner",
  );
});

test("invitation creation is idempotent and lifecycle writes require an agency RPC", async () => {
  const first = await invite();
  assert.equal(await invite(), first);
  await as(U.owner);
  await reject(
    "select create_workspace_invitation($1,$2,$3)",
    [W.first, "other@example.com", "owner"],
    /not_authorized/,
  );
  await reject(
    "insert into workspace_invites(workspace_id,email,role) values ($1,'outsider@example.com','agency')",
    [W.first],
    /row-level security/,
  );
  await as(U.agency);
  const update = await db.query(
    "update workspace_invites set accepted_at=now() where id=$1 returning id",
    [first],
  );
  assert.equal(update.rows.length, 0);
});

test("company creation is atomic and organization-scoped", async () => {
  await as(U.owner);
  await reject(
    "select create_company($1,$2,$3)",
    [O.first, "Nope", "nope"],
    /not_authorized/,
  );
  await as(U.agency);
  const r = await db.query("select create_company($1,$2,$3) as id", [
    O.first,
    "New Company",
    "new-company",
  ]);
  assert.equal(
    (
      await db.query(
        "select role from workspace_members where workspace_id=$1 and user_id=$2",
        [r.rows[0].id, U.agency],
      )
    ).rows[0].role,
    "agency",
  );
  await reject(
    "select create_company($1,$2,$3)",
    [O.first, "Another", "new-company"],
    /duplicate key/,
  );
  await reject(
    "select create_company($1,$2,$3)",
    [O.first, "Another", "bad/slug"],
    /invalid_company/,
  );
  await reject(
    "update workspaces set org_id=$1 where id=$2",
    [O.second, W.first],
    /company_org_immutable/,
  );
  await admin();
  await db.query(
    "delete from workspace_members where workspace_id=$1 and user_id=$2",
    [W.second, U.agency],
  );
  await as(U.agency);
  await reject(
    "select create_company($1,$2,$3)",
    [O.second, "Other Org", "other-org"],
    /not_authorized/,
  );
});

test("multi-company staff cannot cross-link brand, source, voice, footage or library records", async () => {
  await as(U.agency);
  await reject(
    "insert into brand_entities(workspace_id,brand_system_id,book,kind,name) values ($1,$2,'cast','person','Wrong')",
    [W.first, id(302)],
    /foreign key/,
  );
  await reject(
    "insert into kit_assets(workspace_id,intake_session_id,kind,bucket,path,filename) values ($1,$2,'logo','kit',$3,'wrong')",
    [W.first, id(402), `${W.first}/wrong.svg`],
    /foreign key/,
  );
  await reject(
    "insert into kit_assets(workspace_id,kind,bucket,path,filename) values ($1,'logo','kit',$2,'wrong')",
    [W.first, `${W.second}/other.svg`],
    /kit_assets_path_workspace_check/,
  );
  await reject(
    "insert into voices(workspace_id,cast_entity_id,provider) values ($1,$2,'test')",
    [W.first, id(602)],
    /foreign key/,
  );
  await reject(
    "insert into voices(workspace_id,cast_entity_id,sample_kit_asset_id,provider) values ($1,$2,$3,'test')",
    [W.first, id(601), id(502)],
    /foreign key/,
  );
  await reject(
    "insert into brand_traits(workspace_id,brand_system_id,entity_id,key,value,source_note) values ($1,$2,$3,'a','1','agency:test')",
    [W.first, id(301), id(602)],
    /foreign key/,
  );
  await reject(
    "insert into brand_traits(workspace_id,brand_system_id,key,value,source_kit_asset_id) values ($1,$2,'a','1',$3)",
    [W.first, id(301), id(502)],
    /foreign key/,
  );
  await reject(
    "insert into reference_items(workspace_id,kit_asset_id,kind,title) values ($1,$2,'footage','wrong')",
    [W.first, id(502)],
    /foreign key/,
  );
  await reject(
    "insert into footage_clips(workspace_id,kit_asset_id,t_in,t_out) values ($1,$2,0,1)",
    [W.first, id(502)],
    /foreign key/,
  );
});

test("anonymous sessions cannot execute invitation acceptance or create companies", async () => {
  await db.exec("set local role anon");
  await reject(
    "select accept_workspace_invitation($1)",
    [id(99)],
    /permission denied/,
  );
  await reject(
    "select create_company($1,$2,$3)",
    [O.first, "Nope", "nope"],
    /permission denied/,
  );
});
