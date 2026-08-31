import { communityMembers } from "../../lib/site-data";

export default function CommunityPage() {
  const totalXp = communityMembers.reduce((sum, m) => sum + m.xp, 0);
  const totalProjects = communityMembers.reduce((sum, m) => sum + m.projects, 0);

  return (
    <div className="bg-[var(--ink)] min-h-screen pt-24 pb-16 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="font-mono text-[10px] tracking-[0.25em] text-[var(--muted)] mb-2">
          SECTION 005.01 / COMMUNITY
        </div>
        <div
          className="text-5xl md:text-7xl text-[var(--bone)] mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          COMMUNITY
        </div>
        <div className="font-jp text-lg text-[var(--signal)] mb-12">
          コミュニティ
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="border border-[var(--wire)] bg-[var(--ink-2)] p-6 text-center">
            <div
              className="text-4xl text-[var(--bone)] mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {communityMembers.length}+
            </div>
            <div className="font-mono text-[10px] tracking-[0.2em] text-[var(--signal)]">
              ACTIVE MEMBERS
            </div>
          </div>
          <div className="border border-[var(--wire)] bg-[var(--ink-2)] p-6 text-center">
            <div
              className="text-4xl text-[var(--bone)] mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {totalProjects}+
            </div>
            <div className="font-mono text-[10px] tracking-[0.2em] text-[var(--signal)]">
              TOTAL PROJECTS
            </div>
          </div>
          <div className="border border-[var(--wire)] bg-[var(--ink-2)] p-6 text-center">
            <div
              className="text-4xl text-[var(--bone)] mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {totalXp.toLocaleString()}+
            </div>
            <div className="font-mono text-[10px] tracking-[0.2em] text-[var(--signal)]">
              TOTAL XP EARNED
            </div>
          </div>
        </div>

        <div className="font-mono text-[10px] tracking-[0.25em] text-[var(--muted)] mb-4">
          TOP CONTRIBUTORS
        </div>
        <div className="border border-[var(--wire)] bg-[var(--ink-2)]">
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 p-4 border-b border-[var(--wire)] font-mono text-[9px] tracking-[0.2em] text-[var(--muted)]">
            <div className="w-8">#</div>
            <div>MEMBER</div>
            <div className="text-right w-20">PROJECTS</div>
            <div className="text-right w-20">XP</div>
            <div className="text-right w-24">TIER</div>
          </div>
          {communityMembers.map((member, i) => {
            const tier = member.xp >= 4000 ? "ORACLE" : member.xp >= 3000 ? "ARCHITECT" : member.xp >= 2000 ? "ENGINEER" : "INITIATE";
            return (
              <div
                key={member.name}
                className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 p-4 border-b border-[var(--wire)] last:border-0 hover:bg-[var(--ink)] transition-colors"
              >
                <div className="w-8 font-mono text-[var(--muted)]">{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <div className="text-[var(--bone)] text-sm">{member.name}</div>
                  <div className="font-mono text-[10px] text-[var(--muted)]">{member.role}</div>
                </div>
                <div className="text-right w-20 font-mono text-[var(--bone)] text-sm">
                  {member.projects}
                </div>
                <div className="text-right w-20 font-mono text-[var(--signal)] text-sm">
                  {member.xp.toLocaleString()}
                </div>
                <div className="text-right w-24">
                  <span className="font-mono text-[9px] tracking-[0.15em] text-[var(--muted)] border border-[var(--wire)] px-2 py-1">
                    {tier}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 border border-[var(--wire)] bg-[var(--ink-2)] p-8">
          <div className="font-mono text-[10px] tracking-[0.25em] text-[var(--muted)] mb-2">
            JOIN THE MOVEMENT
          </div>
          <div
            className="text-3xl text-[var(--bone)] mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            BE PART OF SOMETHING BIGGER
          </div>
          <p className="text-[var(--bone)]/60 max-w-xl mb-6">
            Whether you&apos;re a first-year student with a wild idea or a final-year grad with a working prototype — there&apos;s a place for you at IIC.
          </p>
          <button className="px-6 py-3 bg-[var(--signal)] text-white font-mono text-[11px] tracking-[0.2em] hover:bg-[var(--signal)]/80 transition-colors">
            APPLY TO JOIN ↗
          </button>
        </div>
      </div>
    </div>
  );
}
