import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getAuthConfig,
  isPreviewMode,
  safeNext,
  emailSchema,
  slugSchema,
} from "./config.ts";

test("preview requires an explicit flag and cannot bypass production deployment auth", () => {
  assert.equal(isPreviewMode({}), false);
  assert.equal(isPreviewMode({ STUDIO_MODE: "preview" }), true);
  assert.equal(
    isPreviewMode({ STUDIO_MODE: "preview", VERCEL_ENV: "production" }),
    false,
  );
  assert.equal(isPreviewMode({ STUDIO_MODE: "true" }), false);
});

test("missing/unsafe account configuration fails closed", () => {
  const good = {
    NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-public-key",
    NEXT_PUBLIC_APP_URL: "http://127.0.0.1:3100",
  };
  assert.equal(getAuthConfig({}), null);
  assert.equal(
    getAuthConfig({ ...good, NEXT_PUBLIC_SUPABASE_ANON_KEY: "" }),
    null,
  );
  assert.equal(
    getAuthConfig({ ...good, NEXT_PUBLIC_APP_URL: "http://public.example" }),
    null,
  );
  assert.equal(
    getAuthConfig({
      ...good,
      NEXT_PUBLIC_APP_URL: "https://user:pass@example.com",
    }),
    null,
  );
  assert.equal(
    getAuthConfig({ ...good, NEXT_PUBLIC_APP_URL: "https://example.com/path" }),
    null,
  );
  assert.equal(getAuthConfig(good)?.appUrl, "http://127.0.0.1:3100");
});

test("email redirects accept only known internal destinations", () => {
  for (const value of [
    "https://evil.example",
    "//evil.example",
    "/\\evil.example",
    "/w/foo/../../evil",
    "/w/foo%2fbar",
    "/w/foo?next=https://evil.example",
    "/login",
    ["/hq"],
    null,
  ]) {
    assert.equal(safeNext(value), "/", String(value));
  }
  for (const value of [
    "/workspaces",
    "/hq",
    "/w/my-company",
    "/w/my-company/jobs/abc-123/script",
  ])
    assert.equal(safeNext(value), value);
});

test("identity and company address inputs are bounded", () => {
  assert.equal(emailSchema.parse(" owner@example.com "), "owner@example.com");
  assert.equal(emailSchema.safeParse("not-an-email").success, false);
  for (const slug of [
    "..",
    "a/b",
    "hello world",
    "a--b",
    "-hello",
    "a".repeat(65),
  ])
    assert.equal(slugSchema.safeParse(slug).success, false);
  assert.equal(slugSchema.parse("northline-windows"), "northline-windows");
});
