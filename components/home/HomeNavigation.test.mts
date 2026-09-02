import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import { HomeNavigation } from "./HomeNavigation.ts";

test("renders the approved placeholder navigation as a vertical stack with four links", () => {
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
    [
      { href: "/events", label: "Events" },
      { href: "#gallery", label: "Gallery" },
      { href: "#team", label: "Team" },
      { href: "#idea-box", label: "Idea Box" },
    ],
  );
  assert.doesNotMatch(markup, /<a[^>]*class="[^"]*border-b[^"]*"/);
});
