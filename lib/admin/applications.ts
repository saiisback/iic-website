import { neon } from "@neondatabase/serverless";
import type { ValidCareerSubmission } from "@/lib/careers/types";

export const REVIEW_STATUSES = ["new", "accepted", "rejected"] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];
export interface Application extends ValidCareerSubmission {
  id: string;
  createdAt: string;
  reviewStatus: ReviewStatus;
}

export async function listApplications(): Promise<Application[]> {
  if (!process.env.DATABASE_URL) throw new Error("Missing database");
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql.query("SELECT * FROM career_submissions ORDER BY created_at DESC, id DESC");
  return rows.map((row) => Object.fromEntries(
    Object.entries(row).map(([key, value]) => [
      key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase()),
      value,
    ]),
  )) as Application[];
}

export async function updateApplication(id: string, status: ReviewStatus): Promise<boolean> {
  if (!process.env.DATABASE_URL) throw new Error("Missing database");
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql.query("UPDATE career_submissions SET review_status = $1 WHERE id = $2 RETURNING id", [status, id]);
  return rows.length > 0;
}
