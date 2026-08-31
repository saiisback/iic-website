import { Frame } from "../primitives/Frame";

const stats = [
  { code: "MEMBERS", value: "500+", jp: "メンバー" },
  { code: "EVENTS", value: "120+", jp: "イベント" },
  { code: "PROJECTS", value: "300+", jp: "プロジェクト" },
  { code: "WINNERS", value: "50+", jp: "受賞者" },
];

const perks = [
  { title: "Hands-on Workshops", desc: "Build real projects with industry mentors" },
  { title: "Startup Support", desc: "From ideation to incubation, we guide you" },
  { title: "Networking Events", desc: "Connect with founders, investors, and peers" },
  { title: "Resource Access", desc: "Labs, tools, and funding for your ideas" },
];

export function FlexboxSection() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Frame key={stat.code} tone="navy" className="p-6 text-center">
            <div
              className="text-4xl md:text-5xl text-[var(--bone)] mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {stat.value}
            </div>
            <div className="font-mono text-[10px] tracking-[0.25em] text-[var(--signal)]">
              {stat.code}
            </div>
            <div className="font-jp text-xs text-[var(--muted)] mt-1">{stat.jp}</div>
          </Frame>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {perks.map((perk) => (
          <Frame key={perk.title} tone="paper" className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 mt-2 bg-[var(--signal)] shrink-0" />
              <div>
                <div
                  className="text-xl text-[var(--ink)] mb-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {perk.title.toUpperCase()}
                </div>
                <div className="font-mono text-[11px] text-[var(--ink)]/60">
                  {perk.desc}
                </div>
              </div>
            </div>
          </Frame>
        ))}
      </div>
    </div>
  );
}
