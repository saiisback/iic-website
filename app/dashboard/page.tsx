import { PassportExperience } from "@/components/passport/PassportExperience";
import { currentMember, events } from "@/lib/data";

export default function DashboardPage() {
  const attended = events.filter((event) => event.status === "attended");
  const upcoming = events.filter((event) => event.status === "upcoming");

  return (
    <PassportExperience
      member={currentMember}
      attended={attended}
      upcoming={upcoming}
    />
  );
}
