import { OrangeDot } from "./OrangeDot";

export function SectionHeader({
  code,
  title,
  meta,
  tone = "navy",
}: {
  code: string;
  title: string;
  meta?: string;
  tone?: "navy" | "paper";
}) {
  const sub = tone === "navy" ? "text-[var(--muted)]" : "text-[var(--ink)]/60";
  const text = tone === "navy" ? "text-[var(--bone)]" : "text-[var(--ink)]";
  return (
    <div className="flex items-end justify-between gap-4 border-b border-[var(--wire)] pb-3">
      <div className="flex items-center gap-3">
        <OrangeDot />
        <span
          className={`font-mono text-[10px] uppercase tracking-[0.25em] ${sub}`}
        >
          {code}
        </span>
        <span
          className={`text-2xl uppercase leading-none ${text}`}
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </span>
      </div>
      {meta ? (
        <span
          className={`font-mono text-[10px] uppercase tracking-[0.25em] ${sub}`}
        >
          {meta} <span aria-hidden>↗</span>
        </span>
      ) : null}
    </div>
  );
}
