import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import { HomeNavigation } from "./HomeNavigation.ts";

test("renders the Events, Gallery, Who's Building and Careers links beneath Lock In", () => {
  const markup = renderToStaticMarkup(HomeNavigation());

  assert.match(
    markup,
    /<nav[^>]*aria-label="Explore IIC"[^>]*class="[^"]*text-right[^"]*"/,
  );
  assert.match(markup, /<ul[^>]*class="[^"]*flex-col[^"]*"/);
  assert.deepEqual(
    [...markup.matchAll(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map(
      ([, href, inner]) => ({
        href,
        label: inner.replace(/<[^>]+>/g, "").replace(/&#x27;/g, "'"),
      }),
    ),
    [
      { href: "/events", label: "Events" },
      { href: "/gallery", label: "Gallery" },
      { href: "/whos-building", label: "Who's Building" },
      { href: "/careers", label: "Careers" },
    ],
  );
  assert.doesNotMatch(markup, />Team</);
  assert.doesNotMatch(markup, /<a[^>]*class="[^"]*border-b[^"]*"/);
});

test("Careers renders in the quiet nav style while recruitment is closed", () => {
  const markup = renderToStaticMarkup(HomeNavigation());
  const careersAnchor =
    markup.match(/<a[^>]*href="\/careers"[^>]*>[\s\S]*?<\/a>/)?.[0] ?? "";

  // The pulsing accent only bounces back when RECRUITMENT_OPEN flips to true.
  assert.doesNotMatch(careersAnchor, /text-emerald-300/);
  assert.doesNotMatch(careersAnchor, /animate-pulse/);
});
