"use client";

import { useState } from "react";
import type { Member, ShopItem } from "@/lib/types";
import { Frame } from "@/components/primitives/Frame";
import { OrangeDot } from "@/components/primitives/OrangeDot";
import { Barcode } from "@/components/primitives/Barcode";
import { canRedeem, tierByCode } from "@/lib/xp";

export function ShopCard({
  item,
  member,
}: {
  item: ShopItem;
  member: Member;
}) {
  const check = canRedeem(member.xp, member.tier.code, item);
  const tierLock = check.reason === "tier";
  const xpShort = check.reason === "xp";
  const required = tierByCode(item.tierRequired);
  const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");

  async function redeem() {
    if (!check.ok) return;
    setState("loading");
    try {
      const r = await fetch(`/api/shop/${item.id}/redeem`, { method: "POST" });
      setState(r.ok ? "ok" : "err");
    } catch {
      setState("err");
    }
  }

  return (
    <Frame tone="paper" className="flex h-full flex-col p-4">
      <div className="flex items-start justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--ink)]/60">
        <span className="flex items-center gap-2">
          <OrangeDot size={6} />
          {item.sku}
        </span>
        <span>TIER · {item.tierRequired}</span>
      </div>

      <div className="mt-3 aspect-[4/3] w-full bg-[var(--bone)]">
        <div
          className="flex h-full w-full items-center justify-center text-5xl leading-none text-[var(--ink)]/70"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {item.sku.split("-")[0]}
        </div>
      </div>

      <div
        className="mt-3 text-2xl uppercase leading-[0.95] tracking-tight text-[var(--ink)]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {item.name}
      </div>
      <div
        className="text-[11px] text-[var(--ink)]/60"
        style={{ fontFamily: "var(--font-jp)" }}
      >
        {item.subtitleJa}
      </div>

      <div className="mt-3 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ink)]/60">
        <div>
          <div>PRICE</div>
          <div
            className={`mt-1 text-2xl ${
              tierLock ? "text-[var(--ink)]/30" : "text-[var(--ink)]"
            }`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            {tierLock ? "▮▮▮▮ XP" : `${item.xpPrice} XP`}
          </div>
        </div>
        <div className="text-right">
          <div>STOCK</div>
          <div className="mt-1 text-[var(--ink)]">{item.stock}</div>
        </div>
      </div>

      <Barcode seed={item.sku} className="mt-4" tone="paper" height={14} />

      <button
        onClick={redeem}
        disabled={!check.ok || state === "loading"}
        className={`mt-4 w-full py-2 font-mono text-[11px] uppercase tracking-[0.3em] transition ${
          check.ok
            ? "bg-[var(--ink)] text-[var(--bone)] hover:bg-[var(--signal)] hover:text-[var(--ink)]"
            : "bg-[var(--ink)]/10 text-[var(--ink)]/40"
        }`}
      >
        {!check.ok && tierLock && `LOCKED · NEED ${required.code}`}
        {!check.ok && xpShort && "INSUFFICIENT XP"}
        {check.ok && state === "idle" && "REDEEM"}
        {check.ok && state === "loading" && "REDEEMING…"}
        {check.ok && state === "ok" && "REDEEMED ✓"}
        {check.ok && state === "err" && "RETRY"}
      </button>
    </Frame>
  );
}
