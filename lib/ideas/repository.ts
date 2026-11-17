import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import type { ValidIdeaSubmission } from "./types";

export type QueryExecutor = (
  query: string,
  params: readonly unknown[],
) => Promise<readonly unknown[]>;

export interface RepositoryDependencies {
  query?: QueryExecutor;
  createId?: () => string;
}

const INSERT_SUBMISSION = `
  INSERT INTO whos_building_submissions (
    id, full_name, usn, email, portfolio_url, phone, project_name,
    domain, product_category, problem, solution, prototype_status, traction,
    team_status, team_size, team_roles, looking_for_collaborators, collaborator_needs,
    business_potential, support_needs, next_milestone, funding_estimate,
    github_url, demo_url, website_url, pitch_deck_url,
    consent_review, consent_share, consent_feature
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7,
    $8, $9, $10, $11, $12, $13,
    $14, $15, $16, $17, $18,
    $19, $20, $21, $22,
    $23, $24, $25, $26,
    $27, $28, $29
  )
`;

function createDefaultQuery(): QueryExecutor {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not configured");
  const sql = neon(connectionString);
  return (query, params) => sql.query(query, [...params]);
}

export async function saveIdeaSubmission(
  value: ValidIdeaSubmission,
  dependencies: RepositoryDependencies = {},
): Promise<string> {
  const id = (dependencies.createId ?? randomUUID)();
  const query = dependencies.query ?? createDefaultQuery();

  await query(INSERT_SUBMISSION, [
    id,
    value.fullName,
    value.usn,
    value.email,
    value.portfolioUrl || null,
    value.phone,
    value.projectName,
    value.domain,
    value.productCategory,
    value.problem,
    value.solution,
    value.prototypeStatus,
    value.traction,
    value.teamStatus,
    value.teamSize,
    value.teamRoles,
    value.lookingForCollaborators,
    value.collaboratorNeeds || null,
    value.businessPotential,
    JSON.stringify(value.supportNeeds),
    value.nextMilestone,
    value.fundingEstimate || null,
    value.githubUrl || null,
    value.demoUrl || null,
    value.websiteUrl || null,
    value.pitchDeckUrl || null,
    value.consentReview,
    value.consentShare,
    value.consentFeature,
  ]);

  return id;
}
