import { TopBar } from "@/components/dashboard/TopBar";
import { IdentityCard } from "@/components/dashboard/IdentityCard";
import { XpReadout } from "@/components/dashboard/XpReadout";
import { AttendanceStubs } from "@/components/dashboard/AttendanceStubs";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { Shop } from "@/components/dashboard/Shop";
import { FooterStrip } from "@/components/dashboard/FooterStrip";
import { currentMember, events, shopItems } from "@/lib/data";

export default async function DashboardPage() {
  const [member, attended, upcoming, shop] = await Promise.all([
    Promise.resolve(currentMember),
    Promise.resolve(events.filter((e) => e.status === "attended")),
    Promise.resolve(events.filter((e) => e.status === "upcoming")),
    Promise.resolve(shopItems),
  ]);

  return (
    <main className="min-h-screen w-full bg-[var(--ink)] text-[var(--bone)]">
      <TopBar member={member} />
      <div className="mx-auto max-w-[1400px] px-4 pb-24 md:px-8">
        <IdentityCard member={member} />
        <XpReadout member={member} />
        <AttendanceStubs events={attended} />
        <UpcomingEvents events={upcoming} />
        <Shop items={shop} member={member} />
      </div>
      <FooterStrip />
    </main>
  );
}
