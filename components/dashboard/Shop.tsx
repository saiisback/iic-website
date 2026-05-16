"use client";

import { useState } from "react";
import type { Member, ShopItem } from "@/lib/types";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { ShopCard } from "./ShopCard";
import { canRedeem } from "@/lib/xp";

type Filter = "ALL" | "UNLOCKED" | "AFFORDABLE";

export function Shop({
  items,
  member,
}: {
  items: ShopItem[];
  member: Member;
}) {
  const [filter, setFilter] = useState<Filter>("ALL");

  const visible = items.filter((it) => {
    const check = canRedeem(member.xp, member.tier.code, it);
    if (filter === "UNLOCKED") return check.ok || check.reason === "xp";
    if (filter === "AFFORDABLE") return check.ok;
    return true;
  });

  return (
    <section className="mt-10">
      <SectionHeader
        code="SECTION 026.05"
        title="SHOP / XP STORE"
        meta={`${visible.length}/${items.length}`}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {(["ALL", "UNLOCKED", "AFFORDABLE"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] transition ${
              filter === f
                ? "border-[var(--signal)] bg-[var(--signal)] text-[var(--ink)]"
                : "border-[var(--wire)] text-[var(--muted)] hover:text-[var(--bone)]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((it) => (
          <ShopCard key={it.id} item={it} member={member} />
        ))}
      </div>
    </section>
  );
}
