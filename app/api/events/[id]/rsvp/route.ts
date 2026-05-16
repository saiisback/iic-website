import { events } from "@/lib/data";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const event = events.find((e) => e.id === id);
  if (!event) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  return Response.json({ ok: true, eventId: id });
}
