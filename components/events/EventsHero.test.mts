import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { EventsHero } from "./EventsHero.ts";

test("renders an accessible Events hero around the builder artwork", () => {
  const heroImage = createElement("img", {
    src: "/events-builders-hero.png",
    alt: "Six student builders creating with electronics, robotics, code, prototypes, fabrication tools, and product tests",
  });
  const markup = renderToStaticMarkup(EventsHero({ heroImage }));

  assert.match(markup, /<main[^>]*data-events-hero="true"/);
  assert.match(markup, /<h1[^>]*>EVENTS<\/h1>/);
  assert.match(markup, /<a[^>]*href="\/"[^>]*>BACK HOME<\/a>/);
  assert.match(markup, /<img[^>]*alt="Six student builders creating/);
  assert.doesNotMatch(markup, /THE BUILDERS/);
});
