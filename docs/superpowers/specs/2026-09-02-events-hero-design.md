# Events Hero Design

## Goal

Add a public `/events` page with a cinematic hero that establishes IIC events as a place where student builders make and demonstrate real work. The homepage `Events` navigation item will open this route.

## Scope

This change includes:

- one generated, project-owned hero image;
- one static `/events` page;
- the `Events` placeholder link changing from `#events` to `/events`;
- responsive, accessible hero presentation;
- automated coverage for the route and navigation contract.

An event calendar, event cards, filtering, registration, and event-detail routes are outside this change.

## Visual Direction

The supplied performance photograph is a composition and mood reference, not an edit target. The new image will depict original subjects and will not preserve the performers or their identities.

The banner will show six student builders in a wide, stage-like composition. Each person will have a distinct making activity, such as electronics assembly, robotics, coding, physical prototyping, digital fabrication, or product testing. Their full-body silhouettes will sit against individual luminous teal circles or vertical pools of teal light. The surrounding space and foreground will be deep black with restrained reflections. The result should feel cinematic, collaborative, and technically credible.

The image must contain no words, logos, watermarks, musical instruments, concert staging, or recognizable branded products. It will reserve calm negative space near the upper-left area for the live page heading.

The generated asset will be saved in `public/events-builders-hero.png`. The source prompt and generation mode will be reported when implementation is complete.

## Page Composition

The `/events` route will use a full-viewport black hero. The generated image will fill the hero width and favor the lower and central areas of the frame so all builders remain visible across common desktop sizes.

The visible title will be `EVENTS`, rendered as HTML with the existing League Gothic display font. It will sit in the upper-left area and remain separate from the bitmap for accessibility, responsive scaling, and visual sharpness.

A compact `BACK HOME` link will sit in the upper-right area. The page will reuse the current homepage language: black field, teal image light, white typography, sharp corners, and restrained hover feedback.

## Responsive Behavior

- Desktop: show the wide composition at full width with the title over negative space.
- Tablet: keep all subjects visible by using a centered crop and a slightly smaller title.
- Mobile: use a taller hero crop, center the builder group, and keep the title and home link clear of faces, tools, and each other.
- The hero will use `min-h-[100dvh]` to avoid mobile viewport jumps.

## Accessibility and Performance

- The hero image will use `next/image` with a static local import, `priority`, and responsive `sizes`.
- Alternative text will describe the builder scene without repeating the `EVENTS` heading.
- Navigation will have visible keyboard focus treatment.
- Text contrast will remain high against the black background.
- The generated image will be compressed to an appropriate web format and size without visible banding or damaged silhouettes.

## Data and Failure Behavior

The page is static and has no runtime data dependency. If future event content is added, it will be designed separately rather than coupled to this hero-only change. The local asset avoids a remote-image failure state.

## Testing

Implementation will follow a red-green-refactor cycle:

1. Update the navigation test to require `/events`.
2. Add a route-level render test that requires the `EVENTS` heading, descriptive hero image, and `BACK HOME` link.
3. Implement the smallest page and navigation changes that satisfy those tests.
4. Run the full test suite, ESLint, production build, and live browser verification at desktop and mobile widths.

## Acceptance Criteria

- Selecting `Events` from the homepage opens `/events`.
- `/events` displays the generated teal-and-black builder banner as its hero.
- The image depicts builders rather than performers and contains no embedded text.
- `EVENTS` is rendered as live HTML text.
- The composition remains legible and usable on desktop and mobile.
- Automated tests and lint pass. The production build passes when the existing Google Font assets are reachable; external download failures are reported separately.
