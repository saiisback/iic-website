import { currentMember } from "@/lib/data";

export async function GET() {
  return Response.json(currentMember);
}
