# Events Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a public `/events` route with an original teal-and-black student-builder hero and connect the homepage Events navigation item to it.

**Architecture:** Generate one project-owned raster asset from the supplied image as composition and mood reference only. Render that local asset through `next/image` inside a testable server-rendered `EventsHero` boundary, then expose it through a thin App Router page and a real homepage link.

**Tech Stack:** Next.js 16.2.6 App Router, React 19.2.4, Tailwind CSS 4, Node test runner, built-in ImageGen.

**Spec:** `docs/superpowers/specs/2026-09-02-events-hero-design.md`

## Global Constraints

- The reference photograph guides composition and mood only; do not preserve or imitate performer identities.
- The generated scene contains six original student builders, no performers, no musical instruments, no embedded text, no logos, and no watermarks.
- The visual palette is luminous teal and deep black with restrained reflections.
- `EVENTS` remains live HTML text in the existing League Gothic display font.
- The generated final asset must live at `public/events-builders-hero.png` before code references it.
- The page is static. Calendars, event cards, filters, registration, and event-detail routes remain out of scope.
- Use `min-h-[100dvh]`, preserve visible keyboard focus, and verify desktop and mobile presentation.

---

### Task 1: Generate the Project-Owned Builder Banner

**Files:**
- Create: `public/events-builders-hero.png`

**Interfaces:**
- Consumes: the user-supplied screenshot as Image 1, used only as a composition and mood reference.
- Produces: a wide RGB PNG at `public/events-builders-hero.png`, consumed by `app/events/page.tsx`.

- [ ] **Step 1: Generate the image with the built-in ImageGen tool**

Use the most recent user image as the single reference and submit this prompt:

```text
Use case: stylized-concept
Asset type: wide website hero banner for an innovation events page
Primary request: create an original cinematic group portrait of six university student builders and innovators, inspired only by the wide staged rhythm and circular backlights of Image 1
Input images: Image 1 is a composition and mood reference only; do not preserve, reproduce, or imitate the performers or their identities
Scene/backdrop: deep black studio environment with a subtly reflective black floor
Subject: six distinct full-body student builders spaced across the frame; each is actively engaged with one credible making activity: electronics assembly, robotics, laptop coding, physical prototyping, digital fabrication, and product testing
Style/medium: premium editorial campaign photography with crisp silhouettes and believable tools
Composition/framing: ultra-wide panoramic arrangement, all six figures readable, individual luminous circular or vertical teal light fields behind them, calm negative space in the upper-left for live webpage copy, subjects concentrated through the center and lower portion
Lighting/mood: dramatic teal backlighting, black silhouettes, restrained teal reflections, collaborative and technically credible rather than theatrical
Color palette: only deep black, dark charcoal, and the same luminous teal-green family used by the current IIC homepage hero
Constraints: completely original people and poses; no words; no letters; no logos; no watermark; no musical instruments; no concert stage; no microphones; no recognizable branded products; natural hands and tool interactions; no duplicated people or objects
Avoid: red, orange, magenta, warm lighting, sci-fi armor, cyberpunk neon clutter, stock-photo smiles, floating UI, text baked into the image
```

- [ ] **Step 2: Inspect the generated result**

Confirm all six subjects are distinct builders, their hands and tools are coherent, the palette is teal/black, and no text or performer staging appears. If one requirement fails, run one targeted ImageGen edit that names only that defect while repeating the invariants.

- [ ] **Step 3: Save the selected output into the project**

Copy the selected built-in output from its generated-images location to `public/events-builders-hero.png`. Do not overwrite any unrelated existing asset.

- [ ] **Step 4: Verify the asset file**

```bash
file public/events-builders-hero.png
sips -g pixelWidth -g pixelHeight public/events-builders-hero.png
```

Expected: a valid PNG with landscape dimensions and no decode errors.

- [ ] **Step 5: Commit the asset**

```bash
git add public/events-builders-hero.png
git commit -m "feat: add events builder hero artwork"
```

---

### Task 2: Turn the Homepage Events Placeholder into a Route Link

**Files:**
- Modify: `components/home/HomeNavigation.test.mts`
- Modify: `components/home/HomeNavigation.ts`

**Interfaces:**
- Consumes: the existing `HomeNavigation(): ReactElement` rendering contract.
- Produces: an `Events` anchor whose `href` is `/events`; the other three placeholder anchors remain unchanged.

- [ ] **Step 1: Write the failing navigation expectation**

Change only the Events literal in the expected anchor list:

```ts
[
  { href: "/events", label: "Events" },
  { href: "#gallery", label: "Gallery" },
  { href: "#team", label: "Team" },
  { href: "#idea-box", label: "Idea Box" },
]
```

- [ ] **Step 2: Run the focused test and confirm the expected failure**

```bash
node --no-warnings --test components/home/HomeNavigation.test.mts
```

Expected: FAIL because the rendered Events anchor still has `href="#events"`.

- [ ] **Step 3: Implement the route href**

```ts
{ href: "/events", label: "Events" },
```

- [ ] **Step 4: Run the focused and full tests**

```bash
node --no-warnings --test components/home/HomeNavigation.test.mts
npm test
```

Expected: both commands PASS with zero failures.

- [ ] **Step 5: Commit the navigation change**

```bash
git add components/home/HomeNavigation.ts components/home/HomeNavigation.test.mts
git commit -m "feat: link homepage navigation to events"
```

---

### Task 3: Build the Testable Events Hero and App Router Page

**Files:**
- Create: `components/events/EventsHero.test.mts`
- Create: `components/events/EventsHero.ts`
- Create: `app/events/page.tsx`

**Interfaces:**
- Produces: `EventsHero({ heroImage }: { heroImage: ReactNode }): ReactElement`.
- Consumes: `public/events-builders-hero.png` through a static `next/image` import in `app/events/page.tsx`.
- Exposes: the static `/events` route.

- [ ] **Step 1: Write the failing hero render test**

Create `components/events/EventsHero.test.mts`:

```ts
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
```

- [ ] **Step 2: Run the test to expose the missing module**

```bash
node --no-warnings --test components/events/EventsHero.test.mts
```

Expected: ERROR with `ERR_MODULE_NOT_FOUND` for `EventsHero.ts`.

- [ ] **Step 3: Add the smallest loadable component boundary**

Create `components/events/EventsHero.ts`:

```ts
import { createElement, type ReactNode } from "react";

export function EventsHero({ heroImage }: { heroImage: ReactNode }) {
  return createElement("main", { "data-events-hero": "true" }, heroImage);
}
```

- [ ] **Step 4: Rerun and confirm the behavioral failure**

```bash
node --no-warnings --test components/events/EventsHero.test.mts
```

Expected: FAIL because the heading and home link are absent.

- [ ] **Step 5: Implement the hero structure**

Replace `EventsHero.ts` with:

```ts
import { createElement, type ReactNode } from "react";

export function EventsHero({ heroImage }: { heroImage: ReactNode }) {
  return createElement(
    "main",
    {
      "data-events-hero": "true",
      className: "relative min-h-[100dvh] overflow-hidden bg-black text-white",
    },
    createElement("div", { className: "absolute inset-0" }, heroImage),
    createElement(
      "div",
      { className: "relative z-10 flex items-start justify-between px-6 pt-6 md:px-16 md:pt-12" },
      createElement(
        "h1",
        {
          className: "text-7xl leading-[0.85] tracking-tighter md:text-9xl",
          style: { fontFamily: "var(--font-league-gothic)" },
        },
        "EVENTS",
      ),
      createElement(
        "a",
        {
          href: "/",
          className: "mt-1 whitespace-nowrap border border-white/45 px-4 py-2 text-xs font-medium tracking-[0.24em] text-white transition-[background-color,color,transform] duration-200 hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:translate-y-px md:text-sm",
        },
        "BACK HOME",
      ),
    ),
  );
}
```

- [ ] **Step 6: Add the thin App Router page**

Create `app/events/page.tsx`:

```tsx
import type { Metadata } from "next";
import Image from "next/image";
import eventsHero from "@/public/events-builders-hero.png";
import { EventsHero } from "@/components/events/EventsHero";

const heroAlt =
  "Six student builders creating with electronics, robotics, code, prototypes, fabrication tools, and product tests";

export const metadata: Metadata = {
  title: "Events | IIC BMSIT",
  description: "Events for builders, innovators, and student founders at IIC BMSIT.",
};

export default function EventsPage() {
  return (
    <EventsHero
      heroImage={
        <Image
          src={eventsHero}
          alt={heroAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      }
    />
  );
}
```

- [ ] **Step 7: Run the focused test and static checks**

```bash
node --no-warnings --test components/events/EventsHero.test.mts
npm test
npm run lint
```

Expected: all tests PASS and ESLint exits with code 0.

- [ ] **Step 8: Commit the Events route**

```bash
git add app/events/page.tsx components/events/EventsHero.ts components/events/EventsHero.test.mts
git commit -m "feat: add events builder hero page"
```

---

### Task 4: Verify Responsive Rendering and Production Readiness

**Files:**
- Modify if verification reveals a real defect: `components/events/EventsHero.ts`
- Modify if verification reveals a real crop defect: `app/events/page.tsx`
- Test if code changes: `components/events/EventsHero.test.mts`

**Interfaces:**
- Consumes: the complete `/events` page from Tasks 1-3.
- Produces: verified desktop and mobile hero presentation with no browser console errors.

- [ ] **Step 1: Verify the homepage navigation in the live app**

Open `http://localhost:3000/`, confirm the right-aligned vertical navigation contains `Events`, and confirm selecting it navigates to `http://localhost:3000/events`.

- [ ] **Step 2: Verify desktop composition**

At a desktop viewport near 1440 by 900, confirm the title and home link do not overlap, the hero fills the viewport, all six builders remain readable, and no generated text, performer staging, or warm colors appear.

- [ ] **Step 3: Verify mobile composition**

At a mobile viewport near 390 by 844, confirm the title and home link fit, the central builder group remains clear, no horizontal scrolling occurs, and the crop does not create damaged partial faces or tools.

- [ ] **Step 4: Run final project checks**

```bash
npm test
npm run lint
npm run build
git diff --check
```

Expected: tests and lint pass with zero failures. The production build exits with code 0 when the existing Google Font downloads are reachable; if only those external downloads fail, report that exact pre-existing network blocker without changing font architecture in this feature.

- [ ] **Step 5: Commit any verification adjustments**

If Steps 2 or 3 required code changes, add a failing assertion first when the behavior is testable, make the minimal correction, rerun all checks, then commit only the relevant files:

```bash
git add app/events/page.tsx components/events/EventsHero.ts components/events/EventsHero.test.mts
git commit -m "fix: refine events hero responsiveness"
```
