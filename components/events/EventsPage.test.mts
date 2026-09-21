import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

const eventsPagePath = fileURLToPath(new URL("../../app/events/page.tsx", import.meta.url));

test("wires the Events route to the events showcase and its page metadata", () => {
  const source = readFileSync(eventsPagePath, "utf8");

  assert.match(source, /title: "Events \| IIC BMSIT"/);
  assert.match(
    source,
    /description: "Events for builders, innovators, and student founders at IIC BMSIT\."/,
  );
  assert.match(source, /import \{ EventsShowcase \} from "@\/components\/events\/EventsShowcase"/);
  assert.match(source, /return <EventsShowcase \/>/);
  assert.doesNotMatch(source, /events-builders-hero/);
});
