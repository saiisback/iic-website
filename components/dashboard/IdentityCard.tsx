import type { Member } from "@/lib/types";
import { Frame } from "@/components/primitives/Frame";
import { OrangeDot } from "@/components/primitives/OrangeDot";
import { Barcode } from "@/components/primitives/Barcode";
import { QR } from "@/components/primitives/QR";
import { fmtDate } from "@/lib/format";

export function IdentityCard({ member }: { member: Member }) {
  return (
    <Frame tone="navy" className="mt-6 p-5 md:p-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[180px_1fr_auto]">
        <div className="relative">
          <Frame tone="bone" className="aspect-square w-full p-3">
            <div
              className="flex h-full w-full items-center justify-center bg-[var(--paper)] text-[var(--ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span className="text-7xl leading-none">
                {member.name.split(" ")[0][0]}
              </span>
            </div>
          </Frame>
          <div className="mt-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--muted)]">
            <span>PFP · 01</span>
            <span>FCC ID · K7Z-2026</span>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">
              <OrangeDot size={6} />
              MEMBER FILE · 026.05
              <span className="ml-auto" />
            </div>
            <h1
              className="mt-2 text-5xl uppercase leading-[0.85] tracking-tight text-[var(--bone)] md:text-7xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {member.name}
            </h1>
            <div
              className="mt-1 text-sm text-[var(--muted)]"
              style={{ fontFamily: "var(--font-jp)" }}
            >
              メンバー.ファイル
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-3 border-t border-[var(--wire)] pt-3 font-mono text-[11px] uppercase tracking-[0.2em] md:grid-cols-4">
            <Field k="HANDLE" v={member.handle} />
            <Field k="TIER" v={member.tier.code} accent />
            <Field k="JOINED" v={fmtDate(member.memberSince)} />
            <Field k="ID" v={member.id} />
          </dl>

          <Barcode seed={member.id} tone="navy" />
        </div>

        <div className="flex flex-col items-end gap-2">
          <QR seed={member.id} size={108} tone="navy" />
          <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--muted)]">
            SCAN · CHECK-IN
          </div>
        </div>
      </div>
    </Frame>
  );
}

function Field({ k, v, accent = false }: { k: string; v: string; accent?: boolean }) {
  return (
    <div>
      <dt className="text-[var(--muted)]">{k}</dt>
      <dd
        className={`mt-1 ${accent ? "text-[var(--signal)]" : "text-[var(--bone)]"}`}
      >
        {v}
      </dd>
    </div>
  );
}
