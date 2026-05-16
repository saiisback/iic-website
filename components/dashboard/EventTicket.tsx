import type { EventItem } from "@/lib/types";
import { Frame } from "@/components/primitives/Frame";
import { Barcode } from "@/components/primitives/Barcode";
import { OrangeDot } from "@/components/primitives/OrangeDot";
import { fmtDate } from "@/lib/format";

export function EventTicket({ event }: { event: EventItem }) {
  return (
    <Frame tone="navy" className="min-w-[280px] shrink-0 p-4">
      <div className="flex items-start justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted)]">
        <span className="flex items-center gap-2">
          <OrangeDot size={6} />
          {event.code}
        </span>
        <span>ATTENDED</span>
      </div>
      <div
        className="mt-3 text-2xl uppercase leading-[0.9] tracking-tight text-[var(--bone)]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {event.title}
      </div>
      <div
        className="mt-1 text-[11px] text-[var(--muted)]"
        style={{ fontFamily: "var(--font-jp)" }}
      >
        {event.subtitleJa}
      </div>

      <div className="mt-4 border-t border-dashed border-[var(--wire)] pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
        <div className="flex justify-between">
          <span>DATE</span>
          <span className="text-[var(--bone)]">{fmtDate(event.date)}</span>
        </div>
        <div className="mt-1 flex justify-between">
          <span>LOC</span>
          <span className="text-[var(--bone)]">{event.location}</span>
        </div>
        <div className="mt-1 flex justify-between">
          <span>XP+</span>
          <span className="text-[var(--signal)]">+{event.xpReward}</span>
        </div>
      </div>

      <Barcode seed={event.id} className="mt-4" tone="navy" height={18} />
    </Frame>
  );
}
