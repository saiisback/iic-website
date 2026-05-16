import type { Member } from "@/lib/types";
import { OrangeDot } from "@/components/primitives/OrangeDot";

export function TopBar({ member }: { member: Member }) {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[var(--wire)] bg-[var(--ink)]/85 px-4 py-3 backdrop-blur md:px-8">
      <div className="flex items-center gap-3">
        <OrangeDot />
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--bone)]">
          [ IIC TEAM ]
        </span>
      </div>
      <div className="hidden font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--muted)] md:block">
        MEMBER ID · {member.id}
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right md:block">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted)]">
            {member.tier.code} · 026.05
          </div>
          <div className="font-mono text-[11px] text-[var(--bone)]">
            {member.handle}
          </div>
        </div>
        <div className="h-8 w-8 border border-[var(--wire)] bg-[var(--ink-2)] flex items-center justify-center font-mono text-[10px] text-[var(--bone)]">
          {member.name
            .split(" ")
            .map((s) => s[0])
            .join("")
            .slice(0, 2)}
        </div>
      </div>
    </div>
  );
}
