# Idea Box Submission Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a public Idea Box intake form that validates builder and prototype details, stores valid submissions in Neon PostgreSQL, and returns a traceable submission ID.

**Architecture:** A client form posts JSON to a thin App Router endpoint. Pure validation and form-state modules keep behavior testable, while a small repository boundary owns the parameterized Neon insert and keeps `DATABASE_URL` server-only. A checked-in SQL migration creates the durable table before live verification.

**Tech Stack:** Next.js 16.2.6 App Router, React 19.2.4, TypeScript, Tailwind CSS 4, Node test runner through `tsx` 4.23.13, Neon serverless driver 1.1.0, PostgreSQL.

**Spec:** `docs/superpowers/specs/2026-09-07-idea-box-submission-design.md`

## Global Constraints

- The visible homepage `Idea Box` link changes from `#idea-box` to `/idea-box`; the other homepage navigation entries remain commented out.
- The form asks for full name, USN, college email, project name, one-line summary, problem, solution, domain, prototype status, team status, support needs, optional project URL, and consent.
- `DATABASE_URL` exists only in `.env.local` and server runtime state; never render, log, commit, or return it.
- The server validator is authoritative and invalid submissions never reach the repository.
- Neon writes use parameterized queries through `@neondatabase/serverless` 1.1.0.
- Valid inserts return a UUID submission ID; database failures preserve form values and reveal no SQL or connection detail.
- The page follows the existing black, white, sharp-border, emerald-teal visual language and remains keyboard-usable on desktop and mobile.
- Authentication, administration, file uploads, email, judging, editing, and public idea listings remain out of scope.
- Read the relevant installed Next.js 16 guides in `node_modules/next/dist/docs/` before editing App Router pages or route handlers.

---

### Task 1: Add the Test Runtime, Idea Types, and Authoritative Validation

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `lib/ideas/types.ts`
- Create: `lib/ideas/validation.ts`
- Create: `lib/ideas/validation.test.mts`

**Interfaces:**
- Produces: `IdeaDraft`, `ValidIdeaSubmission`, `IdeaFieldErrors`, `ValidationResult`, field option constants, `EMPTY_IDEA_DRAFT`, and `validateIdeaSubmission(input: unknown): ValidationResult`.
- Consumed by: Tasks 2–5.

- [ ] **Step 1: Install the current pinned dependencies and widen the test command**

```bash
npm install @neondatabase/serverless@1.1.0
npm install --save-dev tsx@4.23.13
```

Change the `test` script to:

```json
"test": "tsx --test components/**/*.test.mts lib/**/*.test.mts"
```

Run `npm test` before adding Idea tests. Expected: the existing suite passes unchanged through `tsx`.

- [ ] **Step 2: Define the exact shared form contract**

Create `lib/ideas/types.ts` with these exports:

```ts
export const IDEA_DOMAINS = [
  "AI/ML",
  "Software/SaaS",
  "Hardware/IoT",
  "Robotics",
  "Sustainability",
  "Health",
  "Education",
  "FinTech",
  "Other",
] as const;

export const PROTOTYPE_STATUSES = [
  "Idea",
  "Research",
  "Design",
  "Proof of Concept",
  "Working Prototype",
  "Testing",
  "Pilot Ready",
  "Launched",
] as const;

export const TEAM_STATUSES = [
  "Solo",
  "Have a Team",
  "Looking for Teammates",
] as const;

export const SUPPORT_OPTIONS = [
  "Mentorship",
  "Technical Guidance",
  "Funding",
  "Lab/Tools",
  "IP/Patent",
  "Business Model",
  "Teammates",
  "User Testing",
] as const;

export type IdeaDomain = (typeof IDEA_DOMAINS)[number];
export type PrototypeStatus = (typeof PROTOTYPE_STATUSES)[number];
export type TeamStatus = (typeof TEAM_STATUSES)[number];
export type SupportNeed = (typeof SUPPORT_OPTIONS)[number];

export interface IdeaDraft {
  fullName: string;
  usn: string;
  email: string;
  projectName: string;
  summary: string;
  problem: string;
  solution: string;
  domain: string;
  prototypeStatus: string;
  teamStatus: string;
  supportNeeds: string[];
  projectUrl: string;
  consent: boolean;
  website: string;
}

export interface ValidIdeaSubmission extends Omit<IdeaDraft,
  "domain" | "prototypeStatus" | "teamStatus" | "supportNeeds" | "website"
> {
  domain: IdeaDomain;
  prototypeStatus: PrototypeStatus;
  teamStatus: TeamStatus;
  supportNeeds: SupportNeed[];
}

export type IdeaFieldErrors = Partial<Record<keyof IdeaDraft, string>>;
export type ValidationResult =
  | { ok: true; value: ValidIdeaSubmission }
  | { ok: false; fieldErrors: IdeaFieldErrors };

export const EMPTY_IDEA_DRAFT: IdeaDraft = {
  fullName: "",
  usn: "",
  email: "",
  projectName: "",
  summary: "",
  problem: "",
  solution: "",
  domain: "",
  prototypeStatus: "",
  teamStatus: "",
  supportNeeds: [],
  projectUrl: "",
  consent: false,
  website: "",
};
```

- [ ] **Step 3: Write validation tests before implementation**

Create `lib/ideas/validation.test.mts`. Use one complete literal valid submission fixture and cover:

```ts
test("normalizes a complete Idea Box submission", () => {
  const result = validateIdeaSubmission({
    fullName: "  Sai Karthik  ",
    usn: " 1by23cs001 ",
    email: " sai@example.edu ",
    projectName: " Campus Energy Lens ",
    summary: " Tracks avoidable power use across teaching blocks. ",
    problem: "Campus teams cannot see which rooms waste electricity after hours.",
    solution: "We are building sensor nodes and a dashboard that surface avoidable loads.",
    domain: "Hardware/IoT",
    prototypeStatus: "Working Prototype",
    teamStatus: "Have a Team",
    supportNeeds: ["Mentorship", "Lab/Tools"],
    projectUrl: "https://example.com/demo",
    consent: true,
    website: "",
  });

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.value.fullName, "Sai Karthik");
    assert.equal(result.value.usn, "1BY23CS001");
    assert.deepEqual(result.value.supportNeeds, ["Mentorship", "Lab/Tools"]);
  }
});
```

Add table-driven cases for every length boundary, invalid USN characters, invalid email, unsupported select values, empty support needs, non-HTTP URL, false consent, a filled `website` honeypot, arrays with unsupported support values, and a non-object input. Every invalid case must assert the expected field key and must never throw.

- [ ] **Step 4: Run the validation tests and confirm RED**

```bash
npx tsx --test lib/ideas/validation.test.mts
```

Expected: FAIL because `validateIdeaSubmission` does not exist.

- [ ] **Step 5: Implement normalization and validation**

Create `lib/ideas/validation.ts`. Use trimmed strings, uppercase USN, literal membership checks against the exported option arrays, `/^[A-Z0-9-]{6,20}$/` for USN, `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` for email, and `new URL()` restricted to `http:` or `https:` for the optional project URL. Enforce the exact min/max lengths from the spec and build one `IdeaFieldErrors` object before returning. Do not mutate the input object.

The success branch must omit the honeypot field and return `supportNeeds` de-duplicated in the submitted order.

- [ ] **Step 6: Run focused and full tests**

```bash
npx tsx --test lib/ideas/validation.test.mts
npm test
```

Expected: validation tests and the full suite pass with zero failures and no warnings.

- [ ] **Step 7: Commit Task 1**

```bash
git add package.json package-lock.json lib/ideas/types.ts lib/ideas/validation.ts lib/ideas/validation.test.mts
git commit -m "feat: validate idea box submissions"
```

---

### Task 2: Add the Neon Schema, Migration Runner, and Repository

**Files:**
- Create: `db/migrations/001_create_idea_submissions.sql`
- Create: `scripts/apply-idea-migration.mjs`
- Modify: `package.json`
- Create: `lib/ideas/repository.ts`
- Create: `lib/ideas/repository.test.mts`

**Interfaces:**
- Consumes: `ValidIdeaSubmission` from Task 1 and server-only `DATABASE_URL`.
- Produces: `saveIdeaSubmission(value: ValidIdeaSubmission, dependencies?: RepositoryDependencies): Promise<string>`.
- Consumed by: Task 3.

- [ ] **Step 1: Add the SQL migration**

Create `db/migrations/001_create_idea_submissions.sql`:

```sql
CREATE TABLE IF NOT EXISTS idea_submissions (
  id uuid PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  full_name text NOT NULL,
  usn text NOT NULL,
  email text NOT NULL,
  project_name text NOT NULL,
  summary text NOT NULL,
  problem text NOT NULL,
  solution text NOT NULL,
  domain text NOT NULL,
  prototype_status text NOT NULL,
  team_status text NOT NULL,
  support_needs jsonb NOT NULL,
  project_url text,
  consent boolean NOT NULL,
  review_status text NOT NULL DEFAULT 'new'
);

-- migrate:split
CREATE INDEX IF NOT EXISTS idea_submissions_created_at_idx
  ON idea_submissions (created_at DESC);

-- migrate:split
CREATE INDEX IF NOT EXISTS idea_submissions_usn_idx
  ON idea_submissions (usn);

-- migrate:split
CREATE INDEX IF NOT EXISTS idea_submissions_review_status_idx
  ON idea_submissions (review_status);
```

- [ ] **Step 2: Add a deterministic migration runner**

Create `scripts/apply-idea-migration.mjs`. Load `.env.local` with `process.loadEnvFile()` when present, require a non-empty `DATABASE_URL`, split the SQL file only on the exact `-- migrate:split` marker, and execute each non-empty statement sequentially with `neon(connectionString).query(statement)`. Catch failures, print only `Unable to apply idea_submissions migration.`, and set a nonzero exit code; never print the connection string or driver error object. On success print only `Applied idea_submissions migration.`.

Add this package script:

```json
"db:migrate:ideas": "node scripts/apply-idea-migration.mjs"
```

- [ ] **Step 3: Write the failing repository test**

In `lib/ideas/repository.test.mts`, inject a fake `query` function and deterministic `createId`. Assert:

- the returned ID is `11111111-1111-4111-8111-111111111111`;
- the SQL names all fourteen inserted columns and uses `$1` through `$14`;
- the parameter array has normalized values in column order;
- `supportNeeds` is JSON-encoded;
- an empty `DATABASE_URL` is never needed when `query` is injected;
- a query rejection propagates without logging.

- [ ] **Step 4: Run the repository test and confirm RED**

```bash
npx tsx --test lib/ideas/repository.test.mts
```

Expected: FAIL because the repository module is missing.

- [ ] **Step 5: Implement the repository boundary**

Use this interface in `lib/ideas/repository.ts`:

```ts
export type QueryExecutor = (
  query: string,
  params: readonly unknown[],
) => Promise<readonly unknown[]>;

export interface RepositoryDependencies {
  query?: QueryExecutor;
  createId?: () => string;
}

export async function saveIdeaSubmission(
  value: ValidIdeaSubmission,
  dependencies: RepositoryDependencies = {},
): Promise<string>;
```

The default query executor must construct `neon(process.env.DATABASE_URL)` only after checking the variable, then call `sql.query(query, [...params])`. Generate the ID with `crypto.randomUUID()`. Insert the fourteen values using one parameterized `INSERT`; use `null` for an empty project URL and `JSON.stringify(value.supportNeeds)` for the JSONB column.

- [ ] **Step 6: Run focused and full tests**

```bash
npx tsx --test lib/ideas/repository.test.mts
npm test
git diff --check
```

Expected: all pass. Do not apply the migration until Task 6, when `DATABASE_URL` is configured.

- [ ] **Step 7: Commit Task 2**

```bash
git add db/migrations/001_create_idea_submissions.sql scripts/apply-idea-migration.mjs package.json package-lock.json lib/ideas/repository.ts lib/ideas/repository.test.mts
git commit -m "feat: persist idea submissions in neon"
```

---

### Task 3: Add the Idea Submission API

**Files:**
- Create: `app/api/ideas/route.ts`
- Create: `lib/ideas/api.ts`
- Create: `lib/ideas/api.test.mts`

**Interfaces:**
- Consumes: `validateIdeaSubmission` and `saveIdeaSubmission` from Tasks 1–2.
- Produces: `createIdeaPostHandler(save?: typeof saveIdeaSubmission): (request: Request) => Promise<Response>` and the public `POST /api/ideas` handler.
- Consumed by: Task 4.

- [ ] **Step 1: Write failing API behavior tests**

Create `lib/ideas/api.test.mts` and call the handler factory with an in-memory save function. Cover these literal cases:

```ts
test("stores one valid submission and returns its ID", async () => {
  const stored: ValidIdeaSubmission[] = [];
  const handler = createIdeaPostHandler(async (value) => {
    stored.push(value);
    return "11111111-1111-4111-8111-111111111111";
  });
  const response = await handler(new Request("http://local/api/ideas", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(validDraft),
  }));

  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), {
    ok: true,
    submissionId: "11111111-1111-4111-8111-111111111111",
  });
  assert.equal(stored.length, 1);
});
```

Also assert that malformed JSON returns `400 invalid_json`, validation failure returns `400 validation_failed` with field errors, declared or measured bodies over 32,000 characters return `413 payload_too_large`, a filled honeypot never calls save, and a thrown save error returns only `500 submission_failed`.

- [ ] **Step 2: Run the API test and confirm RED**

```bash
npx tsx --test lib/ideas/api.test.mts
```

Expected: FAIL because `createIdeaPostHandler` is missing.

- [ ] **Step 3: Implement the handler factory**

Create `lib/ideas/api.ts` with `MAX_IDEA_PAYLOAD_BYTES = 32_000`. Check `content-length` first, read `request.text()`, measure the actual UTF-8 byte length with `new TextEncoder().encode(rawBody).byteLength`, parse JSON in a `try/catch`, validate, then call the injected save function. Return the exact response shapes and status codes in the spec. Catch only the storage call for the generic 500 response; never serialize the caught error.

- [ ] **Step 4: Expose the App Router endpoint**

Create `app/api/ideas/route.ts`:

```ts
import { createIdeaPostHandler } from "@/lib/ideas/api";

export const POST = createIdeaPostHandler();
```

- [ ] **Step 5: Run focused tests, lint, and build**

```bash
npx tsx --test lib/ideas/api.test.mts
npm test
npm run lint
npm run build
```

Expected: all commands pass; the build lists `ƒ /api/ideas`.

- [ ] **Step 6: Commit Task 3**

```bash
git add app/api/ideas/route.ts lib/ideas/api.ts lib/ideas/api.test.mts
git commit -m "feat: add idea submission endpoint"
```

---

### Task 4: Build the Form State Machine and Accessible Form

**Files:**
- Create: `components/idea-box/idea-form-state.ts`
- Create: `components/idea-box/idea-form-state.test.mts`
- Create: `components/idea-box/IdeaBoxForm.tsx`
- Create: `components/idea-box/IdeaBoxForm.test.mts`

**Interfaces:**
- Consumes: Task 1 types, option constants, and validation; posts to `POST /api/ideas` from Task 3.
- Produces: `IdeaFormState`, `ideaFormReducer`, `INITIAL_IDEA_FORM_STATE`, and `IdeaBoxForm({ initialState? }): ReactElement`.
- Consumed by: Task 5.

- [ ] **Step 1: Write failing reducer tests**

Cover these real state transitions:

- `change` updates one field and removes only that field's prior error;
- `toggle_support` adds and removes a literal support option without duplicates;
- `submitting` keeps the complete draft and disables another submission through status;
- `validation_failed` keeps the draft and attaches field errors;
- `failed` keeps the draft and sets the generic retry message;
- `succeeded` clears the draft and stores the returned submission ID.

Run `npx tsx --test components/idea-box/idea-form-state.test.mts`. Expected: FAIL because the module is absent.

- [ ] **Step 2: Implement the pure form reducer**

Define:

```ts
export interface IdeaFormState {
  draft: IdeaDraft;
  fieldErrors: IdeaFieldErrors;
  status: "idle" | "submitting" | "success" | "error";
  formError: string;
  submissionId: string;
}
```

Use a discriminated `IdeaFormAction` union for the six transitions above. Clone `EMPTY_IDEA_DRAFT` and its array whenever resetting so no state shares a mutable support array.

- [ ] **Step 3: Write the failing form markup tests**

Render `IdeaBoxForm` with `renderToStaticMarkup`. Assert the initial form contains labeled controls with these exact `name` values: `fullName`, `usn`, `email`, `projectName`, `summary`, `problem`, `solution`, `domain`, `prototypeStatus`, `teamStatus`, `supportNeeds`, `projectUrl`, and `consent`. Assert every prototype status and support option is present, the honeypot is visually hidden and excluded from keyboard order, and the submit button says `SUBMIT IDEA`.

Render with injected submitting, error, and success states to assert:

- submitting disables the button and shows `SUBMITTING…`;
- error retains a literal project name and exposes an `aria-live` retry message;
- success removes the form and displays the literal submission ID plus `BACK HOME`.

Run `npx tsx --test components/idea-box/IdeaBoxForm.test.mts`. Expected: FAIL because the component is absent.

- [ ] **Step 4: Implement the client form**

Create `IdeaBoxForm.tsx` with `"use client"`, `useReducer`, and the reducer from Step 2. Export it as `IdeaBoxForm({ initialState = INITIAL_IDEA_FORM_STATE }: { initialState?: IdeaFormState } = {})` so initial, pending, error, and success rendering remain directly testable. Use a single `<form noValidate>` split into four numbered `<fieldset>` sections. Use inputs for identity and project title, textareas for summary/problem/solution, a select for domain, radio-card groups for prototype and team status, checkbox cards for support needs, a URL input, and a consent checkbox.

On submit:

1. ignore the event when already submitting;
2. call `validateIdeaSubmission(state.draft)` locally and focus the first invalid control by its `name` when invalid;
3. dispatch `submitting`;
4. call `fetch("/api/ideas", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(state.draft) })`;
5. dispatch server field errors for `400 validation_failed` and focus the first affected control;
6. dispatch success only for a successful JSON response containing a string `submissionId`;
7. dispatch the generic error for every network, parse, or server failure.

Use sharp `border-white/20` controls, emerald focus borders, white labels, muted hints, and large touch targets. Connect each error with `aria-describedby`, put status messages in `aria-live="polite"`, and keep form values controlled.

- [ ] **Step 5: Run focused and full verification**

```bash
npx tsx --test components/idea-box/idea-form-state.test.mts components/idea-box/IdeaBoxForm.test.mts
npm test
npm run lint
```

Expected: all pass with no React render warnings.

- [ ] **Step 6: Commit Task 4**

```bash
git add components/idea-box/idea-form-state.ts components/idea-box/idea-form-state.test.mts components/idea-box/IdeaBoxForm.tsx components/idea-box/IdeaBoxForm.test.mts
git commit -m "feat: build idea box intake form"
```

---

### Task 5: Add the Idea Box Route and Homepage Link

**Files:**
- Modify: `components/home/HomeNavigation.ts`
- Modify: `components/home/HomeNavigation.test.mts`
- Create: `app/idea-box/page.tsx`
- Create: `components/idea-box/IdeaBoxPage.test.mts`

**Interfaces:**
- Consumes: `IdeaBoxForm` from Task 4.
- Produces: public static `/idea-box` page and homepage navigation to it.

- [ ] **Step 1: Make the homepage navigation test fail**

Change its only expected link to:

```ts
[{ href: "/idea-box", label: "Idea Box" }]
```

Run `npx tsx --test components/home/HomeNavigation.test.mts`. Expected: FAIL because the link still uses `#idea-box`.

- [ ] **Step 2: Change the visible Idea Box link**

In `HomeNavigation.ts`, change only the active Idea Box item to `{ href: "/idea-box", label: "Idea Box" }`. Leave Events, Gallery, and Team commented out.

- [ ] **Step 3: Write the failing page render test**

Create `components/idea-box/IdeaBoxPage.test.mts`, import the default export from `../../app/idea-box/page.tsx`, render it to static markup, and assert:

- one `<main data-idea-box-page="true">`;
- live `IDEA BOX` heading and `SUBMIT WHAT YOU'RE BUILDING` eyebrow;
- the complete `IdeaBoxForm` markup;
- a `BACK HOME` link;
- no admin table or public submission list.

Run the test. Expected: FAIL because the page module is absent.

- [ ] **Step 4: Build the route shell**

Create `app/idea-box/page.tsx` with metadata title `Idea Box | IIC BMSIT` and description `Submit what you are building and request support from IIC BMSIT.` Render a black `min-h-[100dvh]` page with:

- a top-right `BACK HOME` link;
- a responsive two-column grid from `lg` upward;
- a sticky left intro containing the eyebrow, large League Gothic `IDEA BOX` heading, and concise explanation;
- `IdeaBoxForm` in the right column.

The heading is live HTML and the page contains no bitmap text.

- [ ] **Step 5: Run page, navigation, full, lint, and build checks**

```bash
npx tsx --test components/home/HomeNavigation.test.mts components/idea-box/IdeaBoxPage.test.mts
npm test
npm run lint
npm run build
git diff --check
```

Expected: all pass; build lists `○ /idea-box` and `ƒ /api/ideas`.

- [ ] **Step 6: Commit Task 5**

```bash
git add components/home/HomeNavigation.ts components/home/HomeNavigation.test.mts app/idea-box/page.tsx components/idea-box/IdeaBoxPage.test.mts
git commit -m "feat: add idea box submission page"
```

---

### Task 6: Apply the Neon Migration and Verify a Real Submission

**Files:**
- Modify only if a verified defect is found: files from Tasks 1–5.
- Test if code changes: the matching focused test file.

**Interfaces:**
- Consumes: `.env.local` with `DATABASE_URL`, complete `/idea-box` page, `/api/ideas`, migration, and Neon repository.
- Produces: a migrated Neon database and verified end-to-end submission flow.

- [ ] **Step 1: Confirm the secret prerequisite without printing it**

```bash
test -f .env.local && rg -q '^DATABASE_URL=.+' .env.local
```

Expected: exit 0. If it fails, stop this task and ask the user to add `DATABASE_URL` to `.env.local`; never request that they paste it into chat.

- [ ] **Step 2: Apply the idempotent migration**

```bash
npm run db:migrate:ideas
```

Expected: `Applied idea_submissions migration.` with exit 0 and no secret in output.

- [ ] **Step 3: Start the local app and verify responsive presentation**

Open `/idea-box` in the in-app browser. At approximately 1440×900 and 390×844, verify labels, radio/checkbox cards, textareas, CTA, focus indicators, sticky desktop layout, single-column mobile layout, and absence of horizontal scrolling or console errors.

- [ ] **Step 4: Submit one synthetic verification record**

Use the browser form with a clearly synthetic project name prefixed `IIC E2E`, valid literal data, and all required fields. Confirm the success panel displays a UUID. This writes one temporary verification row to the user's Neon database and is within the requested database integration scope.

- [ ] **Step 5: Verify and remove only the synthetic row**

Use a Node command with `--env-file=.env.local` and the returned UUID to `SELECT id, project_name, review_status FROM idea_submissions WHERE id = $1`. Confirm exactly one row, the `IIC E2E` prefix, and `review_status = 'new'`. Then delete only that exact UUID and verify zero rows remain. Never delete by a broad predicate.

- [ ] **Step 6: Run final project checks**

```bash
npm test
npm run lint
npm run build
git diff --check
git status --short
```

Expected: tests, lint, build, and diff check pass; the source tree is clean. Report the known non-blocking multi-lockfile workspace-root warning separately if it remains.

- [ ] **Step 7: Commit a verified correction only when needed**

If browser or database verification exposed a real defect, first add a focused failing test, implement the smallest correction, rerun Steps 3–6, and commit only the affected files:

```bash
git commit -m "fix: refine idea box submission flow"
```

If no source changes were needed, do not create an empty commit.
