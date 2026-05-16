export function Ruler({
  ticks = 20,
  className = "",
  tone = "navy",
}: {
  ticks?: number;
  className?: string;
  tone?: "navy" | "paper";
}) {
  const color = tone === "navy" ? "var(--bone)" : "var(--ink)";
  return (
    <div
      aria-hidden
      className={`flex items-end justify-between h-3 ${className}`}
      style={{ opacity: 0.55 }}
    >
      {Array.from({ length: ticks }).map((_, i) => (
        <span
          key={i}
          style={{
            width: 1,
            height: i % 5 === 0 ? "100%" : "55%",
            background: color,
          }}
        />
      ))}
    </div>
  );
}
