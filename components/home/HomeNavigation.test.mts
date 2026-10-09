import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import { HomeNavigation } from "./HomeNavigation.ts";

test("renders the Events, Gallery, Idea Box and Careers links beneath Lock In", () => {
  const markup = renderToStaticMarkup(HomeNavigation());

  assert.match(
    markup,
    /<nav[^>]*aria-label="Explore IIC"[^>]*class="[^"]*text-right[^"]*"/,
  );
  assert.match(markup, /<ul[^>]*class="[^"]*flex-col[^"]*"/);
  assert.deepEqual(
    [...markup.matchAll(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map(
      ([, href, inner]) => ({ href, label: inner.replace(/<[^>]+>/g, "") }),
    ),
    [
      { href: "/events", label: "Events" },
      { href: "/gallery", label: "Gallery" },
      { href: "/idea-box", label: "Idea Box" },
      { href: "/careers", label: "Careers" },
    ],
  );
  assert.doesNotMatch(markup, />Team</);
  assert.doesNotMatch(markup, /<a[^>]*class="[^"]*border-b[^"]*"/);
});

test("highlights the Careers link with a pulsing accent", () => {
  const markup = renderToStaticMarkup(HomeNavigation());
  const careersAnchor =
    markup.match(/<a[^>]*href="\/careers"[^>]*>[\s\S]*?<\/a>/)?.[0] ?? "";

  assert.match(careersAnchor, /text-emerald-300/);
  assert.match(careersAnchor, /animate-pulse/);
});
