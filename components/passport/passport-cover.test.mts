import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import { PassportCover } from "./PassportCover.ts";

test("the initial passport is a closed branded cover without a 3D viewer", () => {
  const markup = renderToStaticMarkup(
    PassportCover({
      onOpen: () => undefined,
      styles: {
        coverScene: "cover-scene",
        coverButton: "cover-button",
        closedPassport: "closed-passport",
        coverTexture: "cover-texture",
        coverFrame: "cover-frame",
        coverKicker: "cover-kicker",
        coverEmblem: "cover-emblem",
        coverMonogram: "cover-monogram",
        coverInstitute: "cover-institute",
        coverTitle: "cover-title",
        coverMeta: "cover-meta",
        openHint: "open-hint",
      },
    }),
  );

  assert.match(markup, /data-passport-cover="closed"/);
  assert.match(markup, /aria-label="Open IIC BMSIT passport"/);
  assert.match(markup, /IIC/);
  assert.match(markup, /BMSIT/);
  assert.doesNotMatch(markup, /model-viewer/);
});

