import { cookies } from "next/headers";
import { ADMIN_COOKIE, sameOrigin, validSession } from "@/lib/admin/auth";
import { COMMENTERS, listApplicationReviews, listApplications, REVIEW_STATUSES, saveApplicationReview, updateApplication, type ReviewStatus } from "@/lib/admin/applications";

async function authorized() {
  return validSession((await cookies()).get(ADMIN_COOKIE)?.value);
}
const unauthorized = () => Response.json({ error: "Session expired. Please sign in again." }, { status: 401 });
const isUuid = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

export async function GET() {
  if (!await authorized()) return unauthorized();
  try {
    const [applications, reviews] = await Promise.all([listApplications(), listApplicationReviews()]);
    return Response.json({ applications, reviews }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Unable to load applications. Check the database connection and try again." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!await authorized()) return unauthorized();
  if (!sameOrigin(request)) return Response.json({ error: "Invalid request origin." }, { status: 403 });
  try {
    const raw = await request.text();
    if (raw.length > 1024) return Response.json({ error: "Invalid update." }, { status: 400 });
    const { id, status } = JSON.parse(raw);
    if (typeof id !== "string" || !isUuid(id) || !REVIEW_STATUSES.includes(status)) {
      return Response.json({ error: "Invalid application or status." }, { status: 400 });
    }
    if (!await updateApplication(id, status as ReviewStatus)) return Response.json({ error: "Application not found." }, { status: 404 });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Unable to save the decision. Please try again." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!await authorized()) return unauthorized();
  if (!sameOrigin(request)) return Response.json({ error: "Invalid request origin." }, { status: 403 });
  try {
    const raw = await request.text();
    if (raw.length > 4096) return Response.json({ error: "Review is too long." }, { status: 400 });
    const { id, commenter, rating, comment } = JSON.parse(raw);
    const reviewer = typeof commenter === "string" ? COMMENTERS.find((name) => name.toLowerCase() === commenter.trim().toLowerCase()) : undefined;
    const validReview = typeof id === "string" && isUuid(id) && reviewer !== undefined
      && Number.isInteger(rating) && rating >= 1 && rating <= 5
      && typeof comment === "string" && comment.trim().length <= 2000;
    if (!validReview) return Response.json({ error: "A reviewer name and a star rating are required." }, { status: 400 });
    const review = await saveApplicationReview(id, reviewer, rating, comment.trim());
    if (!review) return Response.json({ error: "Application not found." }, { status: 404 });
    return Response.json({ review }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Unable to save the review. Please try again." }, { status: 500 });
  }
}
