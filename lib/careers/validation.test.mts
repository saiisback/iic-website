import assert from "node:assert/strict";
import test from "node:test";

import { validateCareerSubmission } from "./validation.ts";

const validSubmission = {
  fullName: "  Sai Karthik  ",
  usn: " 1by23cs001 ",
  email: " sai@example.edu ",
  whyIic: "I want to build with people who ship, not just talk about ideas.",
  innovationMeaning: "Innovation is turning a real annoyance into something usable.",
  talkAbout: "I can talk for hours about how campus logistics actually work.",
  proudWork: "https://github.com/example/campus-map",
  roleType: "Builder",
  roleExample: "I built a campus map that tracks empty study rooms in real time.",
  mistakeResponse: "I would flag it immediately, own it, and fix it before it spreads.",
  differentStyle: "A teammate planned everything; I improvised. We split the work by strength.",
  learningStruggle: "I struggled with circuits until I rebuilt a simple radio from scratch.",
  campusProblem: "Lab equipment sits idle. I would build a shared booking calendar.",
  unlimitedProblem: "Free campus transport and a repair lab for broken devices.",
  contribution: "I can lead documentation so every project leaves a clear trail.",
  rememberedFor: "I want to be remembered for making ambitious ideas actually launch.",
  expectations: "I expect mentorship and real work. You can expect reliability from me.",
  consent: true,
  website: "",
};

test("normalizes a complete careers application", () => {
  const result = validateCareerSubmission(validSubmission);

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.value.fullName, "Sai Karthik");
    assert.equal(result.value.usn, "1BY23CS001");
    assert.equal(result.value.roleType, "Builder");
    assert.equal("website" in result.value, false);
  }
});

test("returns field errors for invalid applications without throwing", () => {
  const cases = [
    ["a malformed USN", { ...validSubmission, usn: "bad!" }, "usn"],
    ["an unsupported role", { ...validSubmission, roleType: "Visionary" }, "roleType"],
    ["a missing answer", { ...validSubmission, whyIic: "short" }, "whyIic"],
    ["a missing aspirational answer", { ...validSubmission, unlimitedProblem: "" }, "unlimitedProblem"],
    ["missing consent", { ...validSubmission, consent: false }, "consent"],
    ["a filled honeypot", { ...validSubmission, website: "bot" }, "website"],
    ["a non-object input", null, "fullName"],
  ] as const;

  for (const [, input, field] of cases) {
    assert.doesNotThrow(() => validateCareerSubmission(input));
    const result = validateCareerSubmission(input);
    assert.equal(result.ok, false);
    if (!result.ok) assert.ok(result.fieldErrors[field]);
  }
});

test("accepts an empty optional proof-of-work answer", () => {
  const result = validateCareerSubmission({ ...validSubmission, proudWork: "" });
  assert.equal(result.ok, true);
});
