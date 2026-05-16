import type { NextRequest } from "next/server";
import { events } from "@/lib/data";

export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get("status");
  if (status === "upcoming" || status === "attended") {
    return Response.json(events.filter((e) => e.status === status));
  }
  return Response.json(events);
}
