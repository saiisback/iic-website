"use client";

import type { EventItem } from "@/lib/types";
import { EventTicket } from "./EventTicket";
import { SectionHeader } from "@/components/primitives/SectionHeader";

export function AttendanceStubs({ events }: { events: EventItem[] }) {
  return (
    <section className="mt-10">
      <SectionHeader
        code="SECTION 026.03"
        title="RECENT ATTENDANCE"
        meta={`${events.length} STUBS`}
      />
      <div
        className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4"
        style={{ scrollbarWidth: "thin" }}
      >
        {events.map((e) => (
          <div key={e.id} className="snap-start">
            <EventTicket event={e} />
          </div>
        ))}
      </div>
    </section>
  );
}
