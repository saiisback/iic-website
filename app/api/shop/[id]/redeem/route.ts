import { currentMember, shopItems } from "@/lib/data";
import { canRedeem } from "@/lib/xp";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = shopItems.find((s) => s.id === id);
  if (!item) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  const check = canRedeem(currentMember.xp, currentMember.tier.code, item);
  if (!check.ok) {
    return Response.json(
      { ok: false, error: check.reason },
      { status: 400 }
    );
  }
  return Response.json({ ok: true, xp: currentMember.xp - item.xpPrice });
}
