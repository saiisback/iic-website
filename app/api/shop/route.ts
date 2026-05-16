import { shopItems } from "@/lib/data";

export async function GET() {
  return Response.json(shopItems);
}
