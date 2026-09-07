import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import { HomeNavigation } from "./HomeNavigation.ts";

test("renders only the Idea Box placeholder beneath Lock In", () => {
  const markup = renderToStaticMarkup(HomeNavigation());

  assert.match(
    markup,
    /<nav[^>]*aria-label="Explore IIC"[^>]*class="[^"]*text-right[^"]*"/,
  );
  assert.match(markup, /<ul[^>]*class="[^"]*flex-col[^"]*"/);
  assert.deepEqual(
    [...markup.matchAll(/<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g)].map(
      ([, href, label]) => ({ href, label }),
    ),
    [{ href: "#idea-box", label: "Idea Box" }],
  );
  assert.doesNotMatch(markup, />Events<|>Gallery<|>Team</);
  assert.doesNotMatch(markup, /<a[^>]*class="[^"]*border-b[^"]*"/);
});
