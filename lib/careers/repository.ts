import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import type { ValidCareerSubmission } from "./types";

export type QueryExecutor = (
  query: string,
  params: readonly unknown[],
) => Promise<readonly unknown[]>;

export interface RepositoryDependencies {
  query?: QueryExecutor;
  createId?: () => string;
}

const INSERT_CAREER = `
  INSERT INTO career_submissions (
    id, full_name, usn, email, why_iic, innovation_meaning, talk_about,
    proud_work, role_type, role_example, mistake_response, different_style,
    learning_struggle, campus_problem, unlimited_problem, contribution,
    remembered_for, expectations, consent
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
  )
`;

function createDefaultQuery(): QueryExecutor {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not configured");
  const sql = neon(connectionString);
  return (query, params) => sql.query(query, [...params]);
}

export async function saveCareerSubmission(
  value: ValidCareerSubmission,
  dependencies: RepositoryDependencies = {},
): Promise<string> {
  const id = (dependencies.createId ?? randomUUID)();
  const query = dependencies.query ?? createDefaultQuery();

  await query(INSERT_CAREER, [
    id,
    value.fullName,
    value.usn,
    value.email,
    value.whyIic,
    value.innovationMeaning,
    value.talkAbout,
    value.proudWork || null,
    value.roleType,
    value.roleExample,
    value.mistakeResponse,
    value.differentStyle,
    value.learningStruggle,
    value.campusProblem,
    value.unlimitedProblem,
    value.contribution,
    value.rememberedFor,
    value.expectations,
    value.consent,
  ]);

  return id;
}
