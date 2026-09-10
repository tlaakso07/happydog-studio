import assert from "node:assert/strict";
import test from "node:test";
import {
  getStudioPreview,
  initialPreview,
  previewReducer,
  timestamp,
} from "./studio-preview.ts";

const payload = await getStudioPreview();

test("changing approved words invalidates both approval gates", () => {
  let state = initialPreview(payload);
  state = previewReducer(state, { type: "approve-script" });
  state = previewReducer(state, { type: "approve-scenes" });
  assert.equal(state.scenesApproved, true);
  state = previewReducer(state, {
    type: "line",
    index: 0,
    value: "A different opening.",
  });
  assert.equal(state.scriptApproved, false);
  assert.equal(state.scenesApproved, false);
  assert.equal(state.lines[1].text, payload.lines[1].text);
});

test("blank words cannot be approved and scenes need approved words", () => {
  const state = initialPreview(payload);
  assert.equal(
    previewReducer(state, { type: "approve-scenes" }).scenesApproved,
    false,
  );
  const blank = previewReducer(state, { type: "line", index: 1, value: "  " });
  assert.equal(
    previewReducer(blank, { type: "approve-script" }).scriptApproved,
    false,
  );
});

test("redo needs a reason and a repeated decision cannot count twice", () => {
  const state = initialPreview(payload);
  const withoutReason = {
    type: "decide",
    id: "sample-1",
    decision: "redo",
    reasons: [],
    note: "",
  } as const;
  assert.deepEqual(
    previewReducer(state, { ...withoutReason, reasons: [] }).decisions,
    {},
  );
  const withReason = previewReducer(state, {
    ...withoutReason,
    reasons: ["Wrong price"],
    note: "Keep the October deal.",
  });
  assert.equal(Object.keys(withReason.decisions).length, 1);
  assert.equal(withReason.decisions["sample-1"].note, "Keep the October deal.");
  assert.deepEqual(
    previewReducer(withReason, {
      type: "decide",
      id: "sample-1",
      decision: "approve",
      reasons: [],
      note: "",
    }),
    withReason,
  );
});

test("each scene occupies a contiguous part of the 24-second sample", () => {
  assert.equal(payload.scenes[0].start, 0);
  for (let index = 1; index < payload.scenes.length; index++) {
    assert.equal(payload.scenes[index - 1].end, payload.scenes[index].start);
  }
  assert.equal(payload.scenes.at(-1)?.end, 24);
  assert.equal(timestamp(64), "1:04");
});

test("swapping a photo preserves camera rules and the final offer card", () => {
  const state = initialPreview(payload);
  const swapped = previewReducer(state, {
    type: "swap",
    id: "curb",
    photo: "reveal",
  });
  assert.equal(swapped.scenes[0].camera, state.scenes[0].camera);
  assert.equal(swapped.scenes[0].photo, "reveal");
  assert.deepEqual(
    previewReducer(state, {
      type: "swap",
      id: "offer",
      photo: "curb",
    }).scenes.at(-1),
    state.scenes.at(-1),
  );
});
