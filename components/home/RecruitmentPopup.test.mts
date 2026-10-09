import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { RecruitmentDialog, RecruitmentPopup } from "./RecruitmentPopup.tsx";

test("announces that recruitment has started with a way into the careers form", () => {
  const markup = renderToStaticMarkup(
    createElement(RecruitmentDialog, { onClose: () => {} }),
  );

  assert.match(markup, /role="dialog"/);
  assert.match(markup, /aria-modal="true"/);
  assert.match(markup, /RECRUITMENT STARTED/);
  assert.match(markup, /<a[^>]*href="\/careers"[^>]*>/);
  assert.match(markup, /aria-label="Close recruitment announcement"/);
});

test("stays hidden on the server so the popup never flashes", () => {
  const markup = renderToStaticMarkup(createElement(RecruitmentPopup));

  assert.equal(markup, "");
});
