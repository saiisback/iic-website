import { saveIdeaSubmission } from "./repository";
import { validateIdeaSubmission } from "./validation";

export const MAX_IDEA_PAYLOAD_BYTES = 32_000;

type SaveIdea = typeof saveIdeaSubmission;

function json(body: unknown, status: number) {
  return Response.json(body, { status });
}

export function createIdeaPostHandler(save: SaveIdea = saveIdeaSubmission) {
  return async function POST(request: Request): Promise<Response> {
    const declaredLength = Number(request.headers.get("content-length"));
    if (Number.isFinite(declaredLength) && declaredLength > MAX_IDEA_PAYLOAD_BYTES) {
      return json({ ok: false, error: "payload_too_large" }, 413);
    }

    let parsed: unknown;
    try {
      const rawBody = await request.text();
      if (new TextEncoder().encode(rawBody).byteLength > MAX_IDEA_PAYLOAD_BYTES) {
        return json({ ok: false, error: "payload_too_large" }, 413);
      }
      parsed = JSON.parse(rawBody);
    } catch {
      return json({ ok: false, error: "invalid_json" }, 400);
    }

    const validation = validateIdeaSubmission(parsed);
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
