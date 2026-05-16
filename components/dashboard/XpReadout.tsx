import type { Member } from "@/lib/types";
import { Frame } from "@/components/primitives/Frame";
import { Ruler } from "@/components/primitives/Ruler";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { tierProgress, TIERS } from "@/lib/xp";
import { fmtXp } from "@/lib/format";

export function XpReadout({ member }: { member: Member }) {
  const p = tierProgress(member.xp);

  return (
    <section className="mt-8">
      <SectionHeader code="SECTION 026.02" title="XP / TIER" meta="LIVE" />
      <Frame tone="paper" className="mt-4 grid grid-cols-1 gap-0 md:grid-cols-[1.4fr_1fr]">
        <div className="border-b border-[var(--wire-dark)] p-5 md:border-b-0 md:border-r md:p-8">
          <div className="flex items-baseline gap-4">
            <div
              className="text-7xl leading-none text-[var(--ink)] md:text-9xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {fmtXp(member.xp)}
            </div>
            <div className="flex flex-col font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--ink)]/60">
              <span>XP</span>
              <span>BALANCE</span>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--ink)]/70">
              <span>{p.current.code}</span>
              <span>{p.next ? `→ ${p.next.code}` : "MAX TIER"}</span>
            </div>
            <div className="mt-1 h-4 w-full border border-[var(--ink)]/30 bg-[var(--bone)]">
              <div
                className="h-full bg-[var(--signal)]"
                style={{ width: `${p.pct}%` }}
              />
            </div>
            <div className="mt-1 flex justify-between font-mono text-[10px] text-[var(--ink)]/60">
              <span>{p.pct}%</span>
              <span>{p.next ? `${p.xpToNext} XP TO ${p.next.code}` : "—"}</span>
            </div>
          </div>

          <Ruler ticks={28} className="mt-4" tone="paper" />

          <div className="mt-4 grid grid-cols-4 gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--ink)]/60">
            {TIERS.map((t) => (
              <div
                key={t.code}
                className={`border px-2 py-1 ${
                  t.code === p.current.code
                    ? "border-[var(--signal)] text-[var(--signal)]"
                    : "border-[var(--ink)]/20"
                }`}
              >
                <div>{String(t.index).padStart(2, "0")}</div>
                <div>{t.code}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-0">
          <Stat k="ATTENDED" v={member.stats.attended} suffix="EV" />
          <Stat k="HOURS" v={member.stats.hours} suffix="HR" />
          <Stat k="STREAK" v={member.stats.streak} suffix="WK" last />
        </div>
      </Frame>
    </section>
  );
}

function Stat({
  k,
  v,
  suffix,
  last = false,
}: {
  k: string;
  v: number;
  suffix: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex flex-col justify-between p-5 ${
        last ? "" : "border-r border-[var(--wire-dark)]"
      }`}
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--ink)]/60">
        {k}
      </div>
      <div className="mt-6 flex items-baseline gap-2">
        <span
          className="text-5xl leading-none text-[var(--ink)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {String(v).padStart(2, "0")}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--ink)]/60">
          {suffix}
        </span>
      </div>
    </div>
  );
}
