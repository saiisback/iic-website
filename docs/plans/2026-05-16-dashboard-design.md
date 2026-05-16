# IIC Member Dashboard — Design

Date: 2026-05-16
Status: Approved, ready for implementation

## Goal

Build a single-scroll member dashboard at `/dashboard` for the IIC site. The page shows the member's identity, XP and tier, attended events, upcoming events, and a shop redeemable with XP. The hero's `LOCK IN` button repoints from `/about` to `/dashboard`.

## Decisions

- **Data source:** mock data with API stubs. Typed mock in `lib/data.ts`, route handlers under `app/api/*` so a real backend swap is a one-file change per handler.
- **Layout:** single scroll page, six sections.
- **Visual anchor:** CBRPNK navy + orange-dot card style as the global frame, with RAD-style instrument readouts for data-dense cards.
- **XP loop:** XP both ranks the member into a tier and is spent in the shop. Locked items are gated by tier.

## Section flow on `/dashboard`

1. **Top bar** — `[ IIC TEAM ]` left, `MEMBER ID · 026.02` middle, profile chip right.
2. **Identity card** — full-width CBRPNK banner. PFP with corner crosshair, name, handle, tier badge, member-since, orange dot, member-ID QR.
3. **XP / Tier readout** — RAD-style panel. Big XP numeral, segmented bar to next tier, three stat tiles (events attended, hours, streak), ruler ticks.
4. **Recent attendance** — horizontal scroll of event "ticket stubs" with event code, date, XP earned, kanji subtitle, perforated edge.
5. **Upcoming events** — grid of CBRPNK panels. Title, date, location, XP reward, `RSVP` styled like the hero `LOCK IN` button.
6. **Shop** — product grid with filters (All / Unlocked / Affordable). Each card shows image, XP price, required tier; locked items show redacted price.
7. **Footer strip** — issue number, build hash, accreditation logos.

## Visual system

### Palette (added to `globals.css`)

| Token | Value | Use |
|---|---|---|
| `--ink` | `#0d1530` | Primary surface |
| `--ink-2` | `#131c3d` | Elevated panels |
| `--paper` | `#e9e4d8` | RAD-style cards / contrast blocks |
| `--bone` | `#f4f1e8` | Lightest paper, text-on-navy chips |
| `--signal` | `#ff5a1f` | Orange accent dot, never large fills |
| `--wire` | `rgba(244,241,232,0.18)` | Hairlines, dividers |
| `--muted` | `#6b7a9e` | Secondary metadata |

### Typography

- `League Gothic` — display (page titles, tier names, XP numerals).
- `Geist Mono` — codes, metadata, ruler labels.
- `Geist Sans` — body, buttons, descriptions.
- `Noto Sans JP` (added) — kanji subtitles, decorative only.

### Motifs (reusable primitives)

- Corner-crosshair `<Frame>` wrapper.
- `<Ruler>` numeric tick scale.
- `<Barcode>` from CSS gradients, no library.
- `<QR>` seeded inline-SVG, stable per member ID.
- `<OrangeDot>` accent.
- `<SectionHeader>` — `SECTION 26.0X / META / ↗` pattern.

### Layout rules

- 12-col desktop, 4-col mobile.
- `rounded-none` everywhere, 1px `--wire` borders.
- Every card carries 3+ pieces of metadata (issue code, model, FCC-style ID, date) for spec-sheet density.

## Data model (`lib/types.ts`)

```ts
type Tier = { code: "INITIATE" | "ENGINEER" | "ARCHITECT" | "ORACLE"; index: 1|2|3|4; xpFloor: number; xpCeil: number };
type Member = { id: string; name: string; handle: string; avatar: string; memberSince: string; tier: Tier; xp: number; stats: { attended: number; hours: number; streak: number } };
type Event = { id: string; code: string; title: string; subtitleJa: string; date: string; location: string; xpReward: number; cover: string; status: "upcoming" | "attended" };
type Attendance = { eventId: string; attendedAt: string; xpEarned: number };
type ShopItem = { id: string; sku: string; name: string; subtitleJa: string; image: string; xpPrice: number; tierRequired: Tier["code"]; stock: number };
```

### Tier math (`lib/xp.ts`)

- `INITIATE` 0–499
- `ENGINEER` 500–1499
- `ARCHITECT` 1500–3499
- `ORACLE` 3500+
- `tierProgress(xp) → { current, next, pct }` powers the segmented bar.

### Mock seed (`lib/data.ts`)

- One `currentMember`.
- ~8 events: 4 attended, 4 upcoming. Titles include *Ideathon 026.02*, *Patent Clinic*, *Startup Sprint Vol.3*, *Faculty x Founders*, *Hardware Hack 48h*.
- ~9 shop items spanning all tiers: *Field Notebook R542*, *Coil Hoodie*, *Workshop Pass — Q3*, *Patent Filing Voucher*, *Mentor Hour*, etc.

## API stubs

| Method | Path | Returns |
|---|---|---|
| GET | `/api/me` | `Member` |
| GET | `/api/events?status=upcoming\|attended` | `Event[]` |
| GET | `/api/shop` | `ShopItem[]` |
| POST | `/api/events/:id/rsvp` | `{ ok: true }` |
| POST | `/api/shop/:id/redeem` | `{ ok: true, xp: number }` |

`/dashboard/page.tsx` is a Server Component that fetches the three GETs in parallel via `Promise.all`. Interactivity is opt-in per client subcomponent.

## File structure

```
app/
  page.tsx                          # repoint LOCK IN → /dashboard
  layout.tsx                        # add Noto Sans JP font variable
  globals.css                       # palette tokens, kanji font var
  dashboard/
    page.tsx                        # server component, parallel fetch
    loading.tsx                     # skeleton w/ crosshair frames
  api/
    me/route.ts
    events/route.ts
    events/[id]/rsvp/route.ts
    shop/route.ts
    shop/[id]/redeem/route.ts
lib/
  types.ts
  data.ts                           # mock seed
  xp.ts                             # tier math
  format.ts                         # date/code formatters
components/
  primitives/
    Frame.tsx
    Ruler.tsx
    Barcode.tsx
    QR.tsx
    OrangeDot.tsx
    SectionHeader.tsx
  dashboard/
    TopBar.tsx
    IdentityCard.tsx
    XpReadout.tsx
    AttendanceStubs.tsx             # "use client" — scroll snap
    EventTicket.tsx
    UpcomingEvents.tsx
    EventCard.tsx                   # "use client" — RSVP
    Shop.tsx                        # "use client" — filters
    ShopCard.tsx
    FooterStrip.tsx
public/
  avatars/, events/, shop/          # placeholder imagery
```

Only `EventCard`, `Shop`, and `AttendanceStubs` are client components.

## Build order

1. Tokens + fonts (`globals.css`, `layout.tsx`).
2. Primitives (`Frame`, `Ruler`, `Barcode`, `QR`, `SectionHeader`).
3. Types + mock data + xp math.
4. API route handlers.
5. `/dashboard/page.tsx` shell + parallel fetch.
6. Sections top-to-bottom: `TopBar` → `IdentityCard` → `XpReadout` → `AttendanceStubs` → `UpcomingEvents` → `Shop` → `FooterStrip`.
7. Repoint `LOCK IN`, smoke-test in browser.

## Next.js 16 caveat

This project's AGENTS.md flags Next 16 as breaking from prior knowledge. Before writing route handlers and `loading.tsx`, read `node_modules/next/dist/docs/` for current signatures.

## Out of scope (deferred)

- Real auth and persisted user accounts.
- Real attendance check-in flow (QR scan).
- Shop checkout / order history.
- Admin event-creation UI.
