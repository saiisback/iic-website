import { saveCareerSubmission } from "./repository";
import { validateCareerSubmission } from "./validation";

export const MAX_CAREER_PAYLOAD_BYTES = 48_000;

type SaveCareer = typeof saveCareerSubmission;

function json(body: unknown, status: number) {
  return Response.json(body, { status });
}

export function createCareerPostHandler(save: SaveCareer = saveCareerSubmission) {
  return async function POST(request: Request): Promise<Response> {
    const declaredLength = Number(request.headers.get("content-length"));
    if (Number.isFinite(declaredLength) && declaredLength > MAX_CAREER_PAYLOAD_BYTES) {
      return json({ ok: false, error: "payload_too_large" }, 413);
    }

    let parsed: unknown;
    try {
      const rawBody = await request.text();
      if (new TextEncoder().encode(rawBody).byteLength > MAX_CAREER_PAYLOAD_BYTES) {
        return json({ ok: false, error: "payload_too_large" }, 413);
      }
      parsed = JSON.parse(rawBody);
    } catch {
      return json({ ok: false, error: "invalid_json" }, 400);
    }

    const validation = validateCareerSubmission(parsed);
    if (!validation.ok) {
      return json(
        { ok: false, error: "validation_failed", fieldErrors: validation.fieldErrors },
        400,
      );
    }

    try {
      const submissionId = await save(validation.value);
      return json({ ok: true, submissionId }, 201);
    } catch {
      return json({ ok: false, error: "submission_failed" }, 500);
    }
  };
}
