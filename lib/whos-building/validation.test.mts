import assert from "node:assert/strict";
import test from "node:test";

import { validateSubmission } from "./validation.ts";

const validSubmission = {
  fullName: "  Sai Karthik  ",
  usn: " 1by23cs001 ",
  email: " sai@example.edu ",
  portfolioUrl: " https://linkedin.com/in/saikarthik ",
  phone: " +91 98765 43210 ",
  projectName: " Campus Energy Lens ",
  domain: "Robotics / IoT / Hardware",
  productCategory: "B2B",
  problem: "Campus teams cannot see which rooms waste electricity after hours.",
  solution: "We are building sensor nodes and a dashboard that surface avoidable loads.",
  prototypeStatus: "Working Prototype",
  traction: "We built two nodes and tested them in one lab block for a month.",
  teamStatus: "Have a Team",
  teamSize: "3",
  teamRoles: "One embedded engineer, one full-stack developer, one designer.",
  lookingForCollaborators: "Yes",
  collaboratorNeeds: " A firmware developer with ESP32 experience. ",
  businessPotential: "Colleges pay for energy audits today; we sell a cheaper continuous view.",
  supportNeeds: ["Technical mentorship", "Infrastructure / Lab resources", "Technical mentorship"],
  nextMilestone: "Pilot the dashboard with the electrical department by March.",
  fundingEstimate: "₹50,000",
  githubUrl: "https://github.com/saikarthik/energy-lens",
  demoUrl: "https://energy-lens.example.com",
  websiteUrl: "",
  pitchDeckUrl: "",
  consentReview: true,
  consentShare: true,
  consentFeature: true,
  website: "",
};

test("accepts a complete submission and cleans it up", () => {
  const result = validateSubmission(validSubmission);

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.value.fullName, "Sai Karthik");
    assert.equal(result.value.usn, "1BY23CS001");
    assert.equal(result.value.email, "sai@example.edu");
    assert.equal(result.value.collaboratorNeeds, "A firmware developer with ESP32 experience.");
    assert.deepEqual(result.value.supportNeeds, [
      "Technical mentorship",
      "Infrastructure / Lab resources",
    ]);
    assert.equal("website" in result.value, false);
  }
});

test("accepts the submission when everything optional is left empty", () => {
  const result = validateSubmission({
    ...validSubmission,
    portfolioUrl: "",
    githubUrl: "",
    demoUrl: "",
    websiteUrl: "",
    pitchDeckUrl: "",
    fundingEstimate: "",
    collaboratorNeeds: "",
    lookingForCollaborators: "No",
  });

  assert.equal(result.ok, true);
});

test("flags every required field when the form is empty", () => {
  const result = validateSubmission({});

  assert.equal(result.ok, false);
  if (!result.ok) {
    for (const field of [
      "fullName",
      "usn",
      "email",
      "phone",
      "projectName",
      "domain",
      "productCategory",
      "problem",
      "solution",
      "prototypeStatus",
      "traction",
      "teamStatus",
      "teamSize",
      "teamRoles",
      "lookingForCollaborators",
      "businessPotential",
      "supportNeeds",
      "nextMilestone",
      "consentReview",
      "consentShare",
      "consentFeature",
    ]) {
      assert.ok(result.fieldErrors[field as keyof typeof result.fieldErrors], `missing error for ${field}`);
    }
  }
});

test("rejects a phone number that is not a real phone number", () => {
  const cases = [
    "not a phone",
    "12345",
    "+91 98765 43210 ext 90210",
  ] as const;

  for (const phone of cases) {
    const result = validateSubmission({ ...validSubmission, phone });
    assert.equal(result.ok, false);
    if (!result.ok) assert.ok(result.fieldErrors.phone);
  }
});

test("rejects a link that is not a real web address", () => {
  const result = validateSubmission({ ...validSubmission, githubUrl: "ftp://example.com" });

  assert.equal(result.ok, false);
  if (!result.ok) assert.ok(result.fieldErrors.githubUrl);
});

test("asks for the skills you need when you want collaborators", () => {
  const result = validateSubmission({
    ...validSubmission,
    lookingForCollaborators: "Yes",
    collaboratorNeeds: "",
  });

  assert.equal(result.ok, false);
  if (!result.ok) assert.ok(result.fieldErrors.collaboratorNeeds);
});

test("accepts an empty skills answer when you don't want collaborators", () => {
  const result = validateSubmission({
    ...validSubmission,
    lookingForCollaborators: "No",
    collaboratorNeeds: "",
  });

  assert.equal(result.ok, true);
});

test("rejects answers that only exist in the option lists", () => {
  const cases = [
    ["domain", "Space"],
    ["productCategory", "D2C"],
    ["prototypeStatus", "Almost done"],
    ["teamSize", "7"],
    ["lookingForCollaborators", "Maybe"],
  ] as const;

  for (const [field, value] of cases) {
    const result = validateSubmission({ ...validSubmission, [field]: value });
    assert.equal(result.ok, false);
    if (!result.ok) assert.ok(result.fieldErrors[field], `no error for ${field}`);
  }
});

test("requires all three consent boxes, one by one", () => {
  for (const field of ["consentReview", "consentShare", "consentFeature"] as const) {
    const result = validateSubmission({ ...validSubmission, [field]: false });
    assert.equal(result.ok, false);
    if (!result.ok) assert.ok(result.fieldErrors[field]);
  }
});

test("rejects support options that are not on the list", () => {
  const result = validateSubmission({ ...validSubmission, supportNeeds: ["Free pizza"] });

  assert.equal(result.ok, false);
  if (!result.ok) assert.ok(result.fieldErrors.supportNeeds);
});

test("blocks bots that fill the hidden website field", () => {
  const result = validateSubmission({ ...validSubmission, website: "bot" });

  assert.equal(result.ok, false);
  if (!result.ok) assert.ok(result.fieldErrors.website);
});

test("never throws, whatever you send it", () => {
  const weirdInputs = [null, undefined, "string", 42, [], { supportNeeds: "yes" }, { supportNeeds: [1, 2] }];

  for (const input of weirdInputs) {
    assert.doesNotThrow(() => validateSubmission(input));
    const result = validateSubmission(input);
    assert.equal(result.ok, false);
  }
});
