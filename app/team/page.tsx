import { teamMembers } from "../../lib/site-data";

export default function TeamPage() {
  return (
    <div className="bg-[var(--ink)] min-h-screen pt-24 pb-16 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="font-mono text-[10px] tracking-[0.25em] text-[var(--muted)] mb-2">
          SECTION 003.01 / TEAM
        </div>
        <div
          className="text-5xl md:text-7xl text-[var(--bone)] mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          OUR TEAM
        </div>
        <div className="font-jp text-lg text-[var(--signal)] mb-12">
          私たちのチーム
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="border border-[var(--wire)] bg-[var(--ink-2)] hover:border-[var(--signal)]/40 transition-all duration-300 group"
            >
              <div className="aspect-square bg-[var(--ink)] relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="text-6xl text-[var(--bone)]/10"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--signal)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </div>
              <div className="p-5">
                <div
                  className="text-xl text-[var(--bone)] mb-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {member.name.toUpperCase()}
                </div>
                <div className="font-mono text-[10px] tracking-[0.2em] text-[var(--signal)] mb-3">
                  {member.role.toUpperCase()}
                </div>
                <div className="font-mono text-[10px] tracking-[0.15em] text-[var(--muted)] mb-3">
                  {member.expertise}
                </div>
                <p className="text-[var(--bone)]/50 text-xs leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
