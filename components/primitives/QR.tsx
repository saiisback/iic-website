export function QR({
  seed = "IIC",
  size = 84,
  tone = "navy",
}: {
  seed?: string;
  size?: number;
  tone?: "navy" | "paper";
}) {
  const fg = tone === "navy" ? "var(--bone)" : "var(--ink)";
  const bg = tone === "navy" ? "var(--ink)" : "var(--bone)";
  const n = 21;
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const cells: boolean[] = [];
  for (let i = 0; i < n * n; i++) {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    cells.push(((h >>> 0) & 1) === 1);
  }
  const isFinder = (r: number, c: number) => {
    const inBox = (br: number, bc: number) =>
      r >= br && r < br + 7 && c >= bc && c < bc + 7;
    const inRing = (br: number, bc: number) => {
      if (!inBox(br, bc)) return false;
      const isOuter =
        r === br || r === br + 6 || c === bc || c === bc + 6;
      const isInner =
        r >= br + 2 && r <= br + 4 && c >= bc + 2 && c <= bc + 4;
      return isOuter || isInner;
    };
    return inRing(0, 0) || inRing(0, n - 7) || inRing(n - 7, 0);
  };
  const isFinderArea = (r: number, c: number) => {
    const inBox = (br: number, bc: number) =>
      r >= br && r < br + 8 && c >= bc && c < bc + 8;
    return inBox(0, 0) || inBox(0, n - 8) || inBox(n - 8, 0);
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${n} ${n}`}
      shapeRendering="crispEdges"
      aria-hidden
    >
      <rect width={n} height={n} fill={bg} />
      {cells.map((on, i) => {
        const r = Math.floor(i / n);
        const c = i % n;
        if (isFinderArea(r, c)) {
          return isFinder(r, c) ? (
            <rect key={i} x={c} y={r} width={1} height={1} fill={fg} />
          ) : null;
        }
        return on ? (
          <rect key={i} x={c} y={r} width={1} height={1} fill={fg} />
        ) : null;
      })}
    </svg>
  );
}
