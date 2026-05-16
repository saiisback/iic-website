import type { Tier, TierCode, TierProgress } from "./types";

export const TIERS: Tier[] = [
  { code: "INITIATE", index: 1, xpFloor: 0, xpCeil: 499 },
  { code: "ENGINEER", index: 2, xpFloor: 500, xpCeil: 1499 },
  { code: "ARCHITECT", index: 3, xpFloor: 1500, xpCeil: 3499 },
  { code: "ORACLE", index: 4, xpFloor: 3500, xpCeil: Infinity },
];

export function tierFromXp(xp: number): Tier {
  for (const t of TIERS) {
    if (xp >= t.xpFloor && xp <= t.xpCeil) return t;
  }
  return TIERS[TIERS.length - 1];
}

export function tierByCode(code: TierCode): Tier {
  return TIERS.find((t) => t.code === code) ?? TIERS[0];
}

export function tierProgress(xp: number): TierProgress {
  const current = tierFromXp(xp);
  const next = TIERS.find((t) => t.index === current.index + 1) ?? null;
  const span =
    next != null ? next.xpFloor - current.xpFloor : current.xpCeil - current.xpFloor;
  const xpIntoTier = xp - current.xpFloor;
  const xpToNext = next ? next.xpFloor - xp : 0;
  const pct = next ? Math.min(100, Math.round((xpIntoTier / span) * 100)) : 100;
  return { current, next, pct, xpIntoTier, xpToNext };
}

export function canRedeem(memberXp: number, memberTier: TierCode, item: {
  xpPrice: number;
  tierRequired: TierCode;
}): { ok: boolean; reason?: "tier" | "xp" } {
  const required = tierByCode(item.tierRequired);
  const current = tierByCode(memberTier);
  if (current.index < required.index) return { ok: false, reason: "tier" };
  if (memberXp < item.xpPrice) return { ok: false, reason: "xp" };
  return { ok: true };
}
