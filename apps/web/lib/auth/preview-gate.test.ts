import { test } from "node:test";
import assert from "node:assert/strict";
import { createPreviewSession, previewGateRequired, validPreviewPassword, validPreviewSession, PREVIEW_SESSION_SECONDS } from "./preview-gate.ts";

const password = "fixture-password-for-preview-only";
const now = 1_800_000_000_000;

test("hosted deployments fail closed; ordinary local development stays open", () => {
  assert.equal(previewGateRequired({ VERCEL_ENV: "preview" }), true);
  assert.equal(previewGateRequired({ VERCEL_ENV: "production" }), true);
  assert.equal(previewGateRequired({ STUDIO_PREVIEW_PASSWORD: password }), true);
  assert.equal(previewGateRequired({}), false);
});

test("password validation rejects wrong or missing configuration", () => {
  assert.equal(validPreviewPassword(password, password), true);
  for (const value of ["", "wrong", "x".repeat(257)]) assert.equal(validPreviewPassword(value, password), false);
  assert.equal(validPreviewPassword(password, undefined), false);
  assert.equal(validPreviewPassword("short", "short"), false);
});

test("sessions expire, reject tampering and are invalidated by password rotation", () => {
  const token = createPreviewSession(password, now);
  assert.equal(validPreviewSession(token, password, now), true);
  assert.equal(validPreviewSession(token, password, now + PREVIEW_SESSION_SECONDS * 1000), false);
  assert.equal(validPreviewSession(token, password, now - 1000), false);
  assert.equal(validPreviewSession(token, password + "changed", now), false);
  assert.equal(validPreviewSession(token + "x", password, now), false);
  const parts = token.split(".");
  parts[1] = "f".repeat(32);
  assert.equal(validPreviewSession(parts.join("."), password, now), false);
  for (const value of [undefined, "", "malformed", "x".repeat(200)]) assert.equal(validPreviewSession(value, password, now), false);
  assert.equal(validPreviewSession(token, undefined, now), false);
  assert.throws(() => createPreviewSession("short", now));
  assert.notEqual(createPreviewSession(password, now), token);
});
