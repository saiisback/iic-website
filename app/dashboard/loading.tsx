import { Frame } from "@/components/primitives/Frame";

export default function Loading() {
  return (
    <main className="min-h-screen w-full bg-[var(--ink)] text-[var(--bone)] p-6">
      <div className="mx-auto max-w-[1400px] space-y-6">
        <Frame tone="navy" className="h-12" >
          <div className="h-full w-full animate-pulse" />
        </Frame>
        <Frame tone="navy" className="h-64">
          <div className="h-full w-full animate-pulse" />
        </Frame>
        <Frame tone="paper" className="h-48">
          <div className="h-full w-full animate-pulse" />
        </Frame>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Frame key={i} tone="navy" className="h-48">
              <div className="h-full w-full animate-pulse" />
            </Frame>
          ))}
        </div>
      </div>
    </main>
  );
}
