// Local browser-test fixture. No real Supabase account or email service is used.
// The SQL and RLS are real, running in isolated PGlite; Auth transport is simulated.
import { createServer } from "node:http";
import { createHmac } from "node:crypto";
import { createTestDatabase, U } from "./fixtures.mjs";

const db = await createTestDatabase();
const now = Math.floor(Date.now() / 1000);
const encode = (value) =>
  Buffer.from(JSON.stringify(value)).toString("base64url");
const sessions = Object.fromEntries(
  Object.entries(U).map(([name, id]) => {
    const user = {
      id,
      email: `${name}@example.com`,
      aud: "authenticated",
      role: "authenticated",
      email_confirmed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      identities: [],
      app_metadata: {},
      user_metadata: {},
    };
    const parts = `${encode({ alg: "HS256", typ: "JWT" })}.${encode({ sub: id, email: user.email, aud: "authenticated", role: "authenticated", exp: now + 3600, iat: now })}`;
    const access_token = `${parts}.${createHmac("sha256", "local-browser-test-only").update(parts).digest("base64url")}`;
    return [
      name,
      {
        access_token,
        refresh_token: `test-refresh-${name}`,
        token_type: "bearer",
        expires_in: 3600,
        expires_at: now + 3600,
        user,
      },
    ];
  }),
);
const entities = {
  workspaces: ["id", "org_id", "slug", "name", "monthly_allowance"],
  workspace_members: ["workspace_id", "user_id", "role"],
  orgs: ["id", "name"],
  workspace_invites: [
    "id",
    "workspace_id",
    "email",
    "role",
    "expires_at",
    "accepted_at",
    "revoked_at",
    "created_at",
  ],
};
const rpcs = {
  pending_workspace_invitations: [],
  accept_workspace_invitation: ["invitation_id"],
  create_company: ["company_org_id", "company_name", "company_slug"],
  create_workspace_invitation: ["company_id", "invite_email", "invite_role"],
  revoke_workspace_invitation: ["invitation_id"],
};

createServer(async (req, res) => {
  const url = new URL(req.url, "http://127.0.0.1:3104");
  const send = (code, data) => {
    res.writeHead(code, {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    });
    res.end(JSON.stringify(data));
  };
  try {
    if (url.pathname.startsWith("/test/session/"))
      return send(200, sessions[url.pathname.split("/").at(-1)] ?? null);
    let raw = "";
    for await (const chunk of req) raw += chunk;
    const body = raw ? JSON.parse(raw) : {};
    const session = Object.values(sessions).find(
      (s) => req.headers.authorization === `Bearer ${s.access_token}`,
    );
    if (url.pathname === "/auth/v1/user")
      return session
        ? send(200, session.user)
        : send(401, { msg: "Invalid session" });
    if (url.pathname === "/auth/v1/otp") return send(200, {});
    if (url.pathname === "/auth/v1/token")
      return body.auth_code === "valid-owner-code"
        ? send(200, sessions.owner)
        : send(400, { error: "invalid_grant" });
    if (url.pathname === "/auth/v1/verify")
      return body.token_hash === "valid-owner-hash"
        ? send(200, sessions.owner)
        : send(400, { error: "invalid_token" });
    if (url.pathname === "/auth/v1/logout") return send(200, {});
    if (!session)
      return send(401, { message: "Authentication required", code: "401" });
    const result = await db.transaction(async (tx) => {
      await tx.exec("set local role authenticated");
      await tx.query("select set_config('request.jwt.claim.sub', $1, true)", [
        session.user.id,
      ]);
      if (url.pathname.startsWith("/rest/v1/rpc/")) {
        const name = url.pathname.split("/").at(-1);
        if (!Object.hasOwn(rpcs, name))
          throw new Error("Unsupported fixture RPC");
        const fields = rpcs[name];
        const sql = `select * from ${name}(${fields.map((_, i) => "$" + (i + 1)).join(",")})`;
        const r = await tx.query(
          sql,
          fields.map((field) => body[field]),
        );
        return name === "pending_workspace_invitations"
          ? r.rows
          : Object.values(r.rows[0] ?? {})[0];
      }
      const table = url.pathname.split("/").at(-1);
      if (!Object.hasOwn(entities, table) || req.method !== "GET")
        throw new Error("Unsupported fixture query");
      const columns = (url.searchParams.get("select") || "*").split(",");
      if (columns.some((c) => !entities[table].includes(c)))
        throw new Error("Unsupported fixture column");
      const params = [];
      const conditions = [];
      for (const [column, filter] of url.searchParams) {
        if (["select", "order"].includes(column)) continue;
        if (!entities[table].includes(column))
          throw new Error("Unsupported fixture filter");
        if (filter === "is.null") conditions.push(`${column} is null`);
        else if (filter.startsWith("eq.") || filter.startsWith("gt.")) {
          params.push(filter.slice(3));
          conditions.push(
            `${column} ${filter.startsWith("eq.") ? "=" : ">"} $${params.length}`,
          );
        } else if (filter.startsWith("in.(") && filter.endsWith(")")) {
          const entries = filter
            .slice(4, -1)
            .split(",")
            .map((v) => v.replaceAll('"', ""));
          const refs = entries.map((v) => {
            params.push(v);
            return "$" + params.length;
          });
          conditions.push(`${column} in (${refs.join(",")})`);
        } else throw new Error("Unsupported fixture operator");
      }
      let sql = `select ${columns.join(",")} from ${table}`;
      if (conditions.length) sql += " where " + conditions.join(" and ");
      const order = url.searchParams.get("order");
      if (order) {
        const [column, dir] = order.split(".");
        if (!entities[table].includes(column))
          throw new Error("Unsupported order");
        sql += ` order by ${column} ${dir === "desc" ? "desc" : "asc"}`;
      }
      const r = await tx.query(sql, params);
      return req.headers.accept?.includes("vnd.pgrst.object")
        ? (r.rows[0] ?? null)
        : r.rows;
    });
    send(200, result);
  } catch (error) {
    send(400, { message: error.message, code: error.code || "fixture_error" });
  }
}).listen(3104, "127.0.0.1", () =>
  process.stdout.write(
    "Local auth browser fixture on 3104; no real emails or accounts.\n",
  ),
);
