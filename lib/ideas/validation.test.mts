import assert from "node:assert/strict";
import test from "node:test";

import { validateIdeaSubmission } from "./validation.ts";

const validSubmission = {
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
  supportNeeds: ["Mentorship", "Lab/Tools", "Mentorship"],
  projectUrl: "https://example.com/demo",
  consent: true,
  website: "",
};

test("normalizes a complete Idea Box submission", () => {
  const result = validateIdeaSubmission(validSubmission);

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.value.fullName, "Sai Karthik");
    assert.equal(result.value.usn, "1BY23CS001");
    assert.deepEqual(result.value.supportNeeds, ["Mentorship", "Lab/Tools"]);
    assert.equal("website" in result.value, false);
  }
});

test("returns field errors for invalid submissions without throwing", () => {
  const cases = [
    ["a malformed USN", { ...validSubmission, usn: "bad!" }, "usn"],
    ["an unsupported domain", { ...validSubmission, domain: "Space" }, "domain"],
    ["an empty support selection", { ...validSubmission, supportNeeds: [] }, "supportNeeds"],
    ["a non-HTTP project URL", { ...validSubmission, projectUrl: "ftp://example.com" }, "projectUrl"],
    ["missing consent", { ...validSubmission, consent: false }, "consent"],
    ["a filled honeypot", { ...validSubmission, website: "bot" }, "website"],
    ["a non-object input", null, "fullName"],
  ] as const;

  for (const [, input, field] of cases) {
    assert.doesNotThrow(() => validateIdeaSubmission(input));
    const result = validateIdeaSubmission(input);
    assert.equal(result.ok, false);
    if (!result.ok) assert.ok(result.fieldErrors[field]);
  }
});
