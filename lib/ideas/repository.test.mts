import assert from "node:assert/strict";
import test from "node:test";

import { saveIdeaSubmission, type RepositoryDependencies } from "./repository.ts";
import { validateIdeaSubmission } from "./validation.ts";

const validSubmission = {
  fullName: "Sai Karthik",
  usn: "1BY23CS001",
  email: "sai@example.edu",
  portfolioUrl: "https://linkedin.com/in/saikarthik",
  phone: "+91 98765 43210",
  projectName: "Campus Energy Lens",
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
  collaboratorNeeds: "A firmware developer with ESP32 experience.",
  businessPotential: "Colleges pay for energy audits today; we sell a cheaper continuous view.",
  supportNeeds: ["Technical mentorship", "Infrastructure / Lab resources"],
  nextMilestone: "Pilot the dashboard with the electrical department by March.",
  fundingEstimate: "₹50,000",
  githubUrl: "https://github.com/saikarthik/energy-lens",
  demoUrl: "",
  websiteUrl: "",
  pitchDeckUrl: "",
  consentReview: true,
  consentShare: true,
  consentFeature: true,
} as const;

test("saves the submission and hands back the new id", async () => {
  const saved: { query: string; params: readonly unknown[] }[] = [];
  const dependencies: RepositoryDependencies = {
    createId: () => "test-id-1",
    query: async (query, params) => {
      saved.push({ query, params });
      return [];
    },
  };

  const validation = validateIdeaSubmission(validSubmission);
  assert.equal(validation.ok, true);
  if (!validation.ok) return;

  const id = await saveIdeaSubmission(validation.value, dependencies);

  assert.equal(id, "test-id-1");
  assert.equal(saved.length, 1);
  assert.equal(saved[0].params.length, 29);
});

test("writes every column in the same order as the SQL", async () => {
  let captured: { query: string; params: readonly unknown[] } | undefined;
  const dependencies: RepositoryDependencies = {
    createId: () => "test-id-2",
    query: async (query, params) => {
      captured = { query, params };
      return [];
    },
  };

  const validation = validateIdeaSubmission(validSubmission);
  if (!validation.ok) throw new Error("fixture should be valid");
  await saveIdeaSubmission(validation.value, dependencies);

  assert.ok(captured);
  const columns = captured.query.match(/INSERT INTO whos_building_submissions \(([\s\S]*?)\)/)?.[1]
    .split(",")
    .map((column) => column.trim()) ?? [];
  const values = captured.params;

  assert.equal(columns.length, values.length);
  const byColumn = Object.fromEntries(columns.map((column, index) => [column, values[index]]));

  assert.equal(byColumn.id, "test-id-2");
  assert.equal(byColumn.full_name, "Sai Karthik");
  assert.equal(byColumn.usn, "1BY23CS001");
  assert.equal(byColumn.email, "sai@example.edu");
  assert.equal(byColumn.portfolio_url, "https://linkedin.com/in/saikarthik");
  assert.equal(byColumn.phone, "+91 98765 43210");
  assert.equal(byColumn.project_name, "Campus Energy Lens");
  assert.equal(byColumn.domain, "Robotics / IoT / Hardware");
  assert.equal(byColumn.product_category, "B2B");
  assert.equal(byColumn.prototype_status, "Working Prototype");
  assert.equal(byColumn.team_status, "Have a Team");
  assert.equal(byColumn.team_size, "3");
  assert.equal(byColumn.looking_for_collaborators, "Yes");
  assert.equal(byColumn.collaborator_needs, "A firmware developer with ESP32 experience.");
  assert.equal(byColumn.next_milestone, "Pilot the dashboard with the electrical department by March.");
  assert.equal(byColumn.funding_estimate, "₹50,000");
  assert.deepEqual(JSON.parse(String(byColumn.support_needs)), [
    "Technical mentorship",
    "Infrastructure / Lab resources",
  ]);
  assert.equal(byColumn.consent_review, true);
  assert.equal(byColumn.consent_share, true);
  assert.equal(byColumn.consent_feature, true);
});

test("writes into the new table, never the old Idea Box one", async () => {
  let queryText = "";
  const dependencies: RepositoryDependencies = {
    createId: () => "test-id-4",
    query: async (query, _params) => {
      queryText = query;
      return [];
    },
  };

  const validation = validateIdeaSubmission(validSubmission);
  if (!validation.ok) throw new Error("fixture should be valid");
  await saveIdeaSubmission(validation.value, dependencies);

  assert.match(queryText, /INSERT INTO whos_building_submissions/);
  assert.doesNotMatch(queryText, /idea_submissions/);
});

test("leaves empty optional links as database nulls", async () => {
  let captured: readonly unknown[] = [];
  const dependencies: RepositoryDependencies = {
    createId: () => "test-id-3",
    query: async (_query, params) => {
      captured = params;
      return [];
    },
  };

  const validation = validateIdeaSubmission({ ...validSubmission, demoUrl: "", websiteUrl: "", pitchDeckUrl: "" });
  if (!validation.ok) throw new Error("fixture should be valid");
  await saveIdeaSubmission(validation.value, dependencies);

  assert.deepEqual([captured[23], captured[24], captured[25]], [null, null, null]);
});
