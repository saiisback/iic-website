import assert from "node:assert/strict";
import test from "node:test";

import {
  initialPassportState,
  passportActionForKey,
  passportReducer,
} from "./passport-state.ts";

test("opening the passport reveals the first spread", () => {
  assert.deepEqual(passportReducer(initialPassportState, { type: "open" }), {
    isOpen: true,
    spread: 0,
  });
});

test("page navigation advances and clamps at the final spread", () => {
  const openState = { isOpen: true, spread: 0 };

  assert.deepEqual(passportReducer(openState, { type: "next" }), {
    isOpen: true,
    spread: 1,
  });
  assert.deepEqual(
    passportReducer({ isOpen: true, spread: 2 }, { type: "next" }),
    { isOpen: true, spread: 2 },
  );
});

test("page navigation moves backward and returns to the cover", () => {
  assert.deepEqual(
    passportReducer({ isOpen: true, spread: 2 }, { type: "previous" }),
    { isOpen: true, spread: 1 },
  );
  assert.deepEqual(
    passportReducer({ isOpen: true, spread: 0 }, { type: "previous" }),
    initialPassportState,
  );
});

test("keyboard controls map to page-turn actions", () => {
  assert.deepEqual(passportActionForKey("ArrowRight"), { type: "next" });
  assert.deepEqual(passportActionForKey("ArrowLeft"), { type: "previous" });
  assert.deepEqual(passportActionForKey("Escape"), { type: "close" });
  assert.equal(passportActionForKey("Enter"), null);
});

test("closing the passport returns to its initial cover state", () => {
  assert.deepEqual(
    passportReducer({ isOpen: true, spread: 2 }, { type: "close" }),
    initialPassportState,
  );
});
