import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import { HomeLockIn } from "./HomeLockIn.ts";

test("opens the temporary Coming Soon destination", () => {
  const markup = renderToStaticMarkup(HomeLockIn());

  assert.match(markup, /<a[^>]*href="\/coming-soon"[^>]*>LOCK IN<\/a>/);
  assert.doesNotMatch(markup, /href="\/dashboard"/);
});
