import { cookies } from "next/headers";
import { ADMIN_COOKIE, validSession } from "@/lib/admin/auth";
import { listApplications, type Application } from "@/lib/admin/applications";
import { buildXlsx, XLSX_CONTENT_TYPE } from "@/lib/admin/excel";
import { CAREER_SECTIONS } from "@/lib/careers/questions";

type Column = { label: string; value: (application: Application) => string };

const answer = (application: Application, field: string) => String((application as unknown as Record<string, unknown>)[field] ?? "");

// Base columns first, then every question in form order (the role example that
// belongs to the role question is its own column), closing with metadata.
const columns: Column[] = [
  { label: "ID", value: (application) => application.id },
  { label: "Full name", value: (application) => application.fullName },
  { label: "USN", value: (application) => application.usn },
  { label: "Email", value: (application) => application.email },
  { label: "Role", value: (application) => application.roleType },
  { label: "Role example", value: (application) => application.roleExample },
  ...CAREER_SECTIONS.flatMap((section) => section.questions
    .filter((question) => question.variant !== "role")
    .map((question): Column => ({ label: `${section.title} — ${question.label}`, value: (application) => answer(application, question.id) }))),
  {
    label: "Applied (IST)",
    value: (application) => new Date(application.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }),
  },
  { label: "Status", value: (application) => application.reviewStatus },
  { label: "Consent given", value: (application) => (application.consent ? "Yes" : "No") },
];

const unauthorized = () => Response.json({ error: "Session expired. Please sign in again." }, { status: 401 });

export async function GET() {
  if (!validSession((await cookies()).get(ADMIN_COOKIE)?.value)) return unauthorized();
  try {
    const applications = await listApplications();
    const rows = [columns.map((column) => column.label), ...applications.map((application) => columns.map((column) => column.value(application)))];
    const file = buildXlsx("Applications", rows);
    const today = new Date().toISOString().slice(0, 10);
    return new Response(file as unknown as BodyInit, {
      headers: {
        "Content-Type": XLSX_CONTENT_TYPE,
        "Content-Disposition": `attachment; filename="iic-career-applications-${today}.xlsx"`,
        "Content-Length": String(file.byteLength),
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return Response.json({ error: "Unable to export applications. Check the database connection and try again." }, { status: 500 });
  }
}
