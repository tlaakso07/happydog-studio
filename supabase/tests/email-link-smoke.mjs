// Run against the isolated Auth fixture and web server on ports 3104/3103.
// No hosted credentials, email requests, or real accounts are used.
import assert from "node:assert/strict";

const origin = "http://127.0.0.1:3103";
function browser() {
  const jar = new Map();
  return {
    jar,
    async request(path, options = {}) {
      const response = await fetch(new URL(path, origin), {
        ...options,
        redirect: "manual",
        headers: {
          Cookie: [...jar].map(([key, value]) => `${key}=${value}`).join("; "),
          ...options.headers,
        },
      });
      for (const cookie of response.headers.getSetCookie()) {
        const [pair] = cookie.split(";");
        const index = pair.indexOf("=");
        const name = pair.slice(0, index);
        if (/Max-Age=0(?:;|$)/i.test(cookie)) jar.delete(name);
        else jar.set(name, pair.slice(index + 1));
      }
      return response;
    },
  };
}

async function openEmail(client, token) {
  const response = await client.request(`/auth/confirm?token_hash=${token}&type=email`);
  assert.equal(response.status, 307);
  assert.equal(response.headers.get("location"), `${origin}/auth/continue`);
  assert.match(response.headers.get("cache-control"), /no-store/);
  assert.equal(response.headers.get("referrer-policy"), "no-referrer");
  const pending = response.headers.getSetCookie().find((c) => c.startsWith("studio-pending-email="));
  assert.match(pending, /HttpOnly/i);
  assert.match(pending, /SameSite=lax/i);
  assert.match(pending, /Path=\/auth/i);
  assert.match(pending, /Max-Age=600/i);
  const page = await client.request("/auth/continue");
  assert.equal(page.status, 200);
  const html = await page.text();
  assert.ok(html.includes("Continue to my studio"));
  assert.ok(!html.includes(token), "The token stays out of HTML and form fields");
  return html.match(/name="(\$ACTION_ID_[^"]+)"/)?.[1];
}

async function submit(client, action) {
  assert.ok(action, "The continuation page renders a server-action form");
  const body = new FormData();
  body.set(action, "");
  return client.request("/auth/continue", {
    method: "POST",
    headers: { Origin: origin },
    body,
  });
}

const scanner = browser();
await openEmail(scanner, "valid-owner-hash");
assert.ok(![...scanner.jar.keys()].some((key) => key.startsWith("sb-")));
const user = browser(); // No requesting-browser PKCE cookie.
const action = await openEmail(user, "valid-owner-hash");
const signedIn = await submit(user, action);
assert.equal(signedIn.status, 303);
assert.equal(new URL(signedIn.headers.get("location"), origin).pathname, "/");
assert.ok(!user.jar.has("studio-pending-email"));
assert.ok([...user.jar.keys()].some((key) => key.startsWith("sb-")));
const companies = await user.request("/workspaces");
assert.equal(companies.status, 200, "Session cookie authorizes a subsequent page request");
const login = await user.request("/login");
assert.equal(login.status, 307, "Signed-in users leave the login form");

const reused = browser();
const reuseAction = await openEmail(reused, "valid-owner-hash");
const reuseResult = await submit(reused, reuseAction);
assert.equal(reuseResult.status, 303);
assert.equal(reuseResult.headers.get("location"), "/login?error=link");
assert.ok(![...reused.jar.keys()].some((key) => key.startsWith("sb-")));
const expired = browser();
const expiredAction = await openEmail(expired, "expired-owner-hash");
const expiredResult = await submit(expired, expiredAction);
assert.equal(expiredResult.headers.get("location"), "/login?error=link");

const empty = browser();
const noToken = await empty.request("/auth/continue");
assert.equal(noToken.status, 307);
const malformed = await empty.request("/auth/confirm?token_hash=bad&type=recovery");
assert.equal(new URL(malformed.headers.get("location")).pathname, "/login");
assert.ok(!empty.jar.has("studio-pending-email"));
console.log("PASS: scanner GET, fresh-browser sign-in, cookie persistence, login redirect, one-time use, expired and malformed links.");
