import { OrangeDot } from "@/components/primitives/OrangeDot";

export function FooterStrip() {
  return (
    <footer className="border-t border-[var(--wire)] bg-[var(--ink-2)] px-4 py-4 md:px-8">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">
        <span className="flex items-center gap-2">
          <OrangeDot size={6} />
          IIC / ISSUE 026 · VOL.05
        </span>
        <span>BUILD · 026.05.16-A</span>
        <span>© INSTITUTION&apos;S INNOVATION COUNCIL</span>
      </div>
    </footer>
  );
}
