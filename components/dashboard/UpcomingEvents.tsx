import type { EventItem } from "@/lib/types";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { EventCard } from "./EventCard";

export function UpcomingEvents({ events }: { events: EventItem[] }) {
  return (
    <section className="mt-10">
      <SectionHeader
        code="SECTION 026.04"
        title="UPCOMING EVENTS"
        meta={`${events.length} OPEN`}
      />
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {events.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>
    </section>
  );
}
