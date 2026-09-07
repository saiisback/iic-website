import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

const eventsPagePath = fileURLToPath(new URL("../../app/events/page.tsx", import.meta.url));

test("wires the Events route to the builder panorama and its page metadata", () => {
  const source = readFileSync(eventsPagePath, "utf8");

  assert.match(source, /import eventsHero from "@\/public\/events-builders-hero\.png"/);
  assert.match(source, /import \{ EventsHero \} from "@\/components\/events\/EventsHero"/);
  assert.match(source, /title: "Events \| IIC BMSIT"/);
  assert.match(source, /description: "Events for builders, innovators, and student founders at IIC BMSIT\."/);
  assert.match(
    source,
    /const heroAlt =\s+"Six student builders creating with electronics, robotics, code, prototypes, fabrication tools, and product tests"/,
  );
  assert.match(source, /<EventsHero\s+heroImage=\{/);
  assert.match(source, /<Image\s+src=\{eventsHero\}\s+alt=\{heroAlt\}\s+fill\s+preload\s+sizes="100vw"/);
  assert.match(source, /className="object-cover object-\[44%_center\] md:object-contain md:object-bottom"/);
});
