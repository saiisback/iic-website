import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import { ComingSoon } from "./ComingSoon.ts";

test("renders a Coming Soon message with a way back home", () => {
  const markup = renderToStaticMarkup(ComingSoon());

  assert.match(markup, /<main[^>]*data-coming-soon="true"/);
  assert.match(markup, /<h1[^>]*>COMING SOON<\/h1>/);
  assert.match(markup, /<a[^>]*href="\/"[^>]*>BACK HOME<\/a>/);
});
