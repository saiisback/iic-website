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

const INSERT_IDEA = `
  INSERT INTO idea_submissions (
    id, full_name, usn, email, project_name, summary, problem, solution,
    domain, prototype_status, team_status, support_needs, project_url, consent
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
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

  await query(INSERT_IDEA, [
    id,
    value.fullName,
    value.usn,
    value.email,
    value.projectName,
    value.summary,
    value.problem,
    value.solution,
    value.domain,
    value.prototypeStatus,
    value.teamStatus,
    JSON.stringify(value.supportNeeds),
    value.projectUrl || null,
    value.consent,
  ]);

  return id;
}
