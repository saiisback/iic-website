import type { ReactNode } from "react";

type Tone = "navy" | "paper" | "bone";

const toneClass: Record<Tone, string> = {
  navy: "bg-[var(--ink)] text-[var(--bone)] border-[var(--wire)]",
  paper: "bg-[var(--paper)] text-[var(--ink)] border-[var(--wire-dark)]",
  bone: "bg-[var(--bone)] text-[var(--ink)] border-[var(--wire-dark)]",
};

const crosshairColor: Record<Tone, string> = {
  navy: "var(--bone)",
  paper: "var(--ink)",
  bone: "var(--ink)",
};

export function Frame({
  tone = "navy",
  className = "",
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  const c = crosshairColor[tone];
  return (
    <div className={`relative border ${toneClass[tone]} ${className}`}>
      <Crosshair pos="tl" color={c} />
      <Crosshair pos="tr" color={c} />
      <Crosshair pos="bl" color={c} />
      <Crosshair pos="br" color={c} />
      {children}
    </div>
  );
}

function Crosshair({
  pos,
  color,
}: {
  pos: "tl" | "tr" | "bl" | "br";
  color: string;
}) {
  const map = {
    tl: "top-1 left-1",
    tr: "top-1 right-1",
    bl: "bottom-1 left-1",
    br: "bottom-1 right-1",
  } as const;
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute ${map[pos]} h-2 w-2`}
      style={{
        borderLeft: pos.endsWith("l") ? `1px solid ${color}` : undefined,
        borderRight: pos.endsWith("r") ? `1px solid ${color}` : undefined,
        borderTop: pos.startsWith("t") ? `1px solid ${color}` : undefined,
        borderBottom: pos.startsWith("b") ? `1px solid ${color}` : undefined,
      }}
    />
  );
}
