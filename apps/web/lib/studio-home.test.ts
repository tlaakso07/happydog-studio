/**
 * Run: node --test --experimental-strip-types lib/studio-home.test.ts
 * No test framework on purpose. This covers the two pieces of Home that can be
 * wrong without anyone noticing: which state card shows, and the meta line.
 */
import assert from "node:assert/strict";
import test from "node:test";
import {
  getHomePayload,
  homeState,
  renderMeta,
  type HomePayload,
  type RecentRender,
} from "./studio-home.ts";

const base = await getHomePayload("northline-windows");

test("ads waiting beats everything else", () => {
  assert.deepEqual(homeState(base), { kind: "ready", count: 12, minutes: 10 });
});

test("no deal stated asks for the deal", () => {
  const payload: HomePayload = { ...base, readyCount: 0, offer: null };
  assert.equal(homeState(payload).kind, "needs_offer");
});

test("a live deal with nothing waiting is quiet", () => {
  const payload: HomePayload = { ...base, readyCount: 0 };
  assert.equal(homeState(payload).kind, "quiet");
});

test("ads waiting still wins when no deal is stated", () => {
  const payload: HomePayload = { ...base, offer: null };
  assert.equal(homeState(payload).kind, "ready");
});

test("a still has no duration in its meta line", () => {
  const still: RecentRender = {
    id: "s",
    title: "October offer static",
    seconds: null,
    format: "1x1 · JPG",
    posterPath: "/fixtures/october-offer-static.jpg",
    status: "ready_for_approval",
  };
  assert.equal(renderMeta(still), "1x1 · JPG");
  assert.equal(renderMeta({ ...still, seconds: 24, format: "9:16" }), "24s · 9:16");
});

test("no em dash reaches an owner-facing string", () => {
  const strings = [
    base.offer?.title ?? "",
    ...base.recent.map((r) => `${r.title} ${r.format}`),
  ];
  for (const s of strings) {
    assert.ok(!s.includes("—"), `em dash in: ${s}`);
  }
});
