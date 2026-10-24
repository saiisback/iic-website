import { neon, type QueryResultRow } from "@neondatabase/serverless";
import type { ValidCareerSubmission } from "@/lib/careers/types";

export const REVIEW_STATUSES = ["new", "accepted", "rejected"] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

export const COMMENTERS = ["Madhia", "Srish", "Nithin", "Sai", "Aadarsh", "Momo", "Luna"] as const;

export interface Application extends ValidCareerSubmission {
  id: string;
  createdAt: string;
  reviewStatus: ReviewStatus;
}

export interface ApplicationReview {
  id: string;
  applicationId: string;
  commenter: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

const toCamel = (row: QueryResultRow) => Object.fromEntries(
  Object.entries(row).map(([key, value]) => [
    key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase()),
    value,
  ]),
);

export async function listApplications(): Promise<Application[]> {
  if (!process.env.DATABASE_URL) throw new Error("Missing database");
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql.query("SELECT * FROM career_submissions ORDER BY created_at DESC, id DESC");
  return rows.map((row) => toCamel(row)) as Application[];
}

export async function listApplicationReviews(): Promise<ApplicationReview[]> {
  if (!process.env.DATABASE_URL) throw new Error("Missing database");
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql.query("SELECT * FROM application_reviews ORDER BY updated_at DESC, id DESC");
  return rows.map((row) => toCamel(row)) as ApplicationReview[];
}

export async function updateApplication(id: string, status: ReviewStatus): Promise<boolean> {
  if (!process.env.DATABASE_URL) throw new Error("Missing database");
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql.query("UPDATE career_submissions SET review_status = $1 WHERE id = $2 RETURNING id", [status, id]);
  return rows.length > 0;
}

export async function saveApplicationReview(applicationId: string, commenter: string, rating: number, comment: string): Promise<ApplicationReview | null> {
  if (!process.env.DATABASE_URL) throw new Error("Missing database");
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql.query(
    `INSERT INTO application_reviews (id, application_id, commenter, rating, comment)
     VALUES (gen_random_uuid(), $1, $2, $3, $4)
     ON CONFLICT (application_id, commenter)
     DO UPDATE SET rating = EXCLUDED.rating, comment = EXCLUDED.comment, updated_at = now()
     RETURNING *`,
    [applicationId, commenter, rating, comment],
  );
  return rows.length > 0 ? (toCamel(rows[0]) as ApplicationReview) : null;
}
