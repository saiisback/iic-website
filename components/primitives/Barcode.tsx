export function Barcode({
  seed = "IIC-026",
  className = "",
  tone = "navy",
  height = 28,
}: {
  seed?: string;
  className?: string;
  tone?: "navy" | "paper";
  height?: number;
}) {
  const fg = tone === "navy" ? "var(--bone)" : "var(--ink)";
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const bars: number[] = [];
  for (let i = 0; i < 52; i++) {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    bars.push(((h >>> 0) % 3) + 1);
  }
  return (
    <div
      aria-hidden
      className={`flex items-stretch gap-[2px] ${className}`}
      style={{ height }}
    >
      {bars.map((w, i) => (
        <span
          key={i}
          style={{
            width: w,
            background: i % 7 === 0 ? "transparent" : fg,
          }}
        />
      ))}
    </div>
  );
}
