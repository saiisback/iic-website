export function OrangeDot({
  size = 10,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`inline-block ${className}`}
      style={{
        width: size,
        height: size,
        background: "var(--signal)",
        borderRadius: 9999,
      }}
    />
  );
}
