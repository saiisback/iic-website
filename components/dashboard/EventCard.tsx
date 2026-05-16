"use client";

import { useState } from "react";
import type { EventItem } from "@/lib/types";
import { Frame } from "@/components/primitives/Frame";
import { OrangeDot } from "@/components/primitives/OrangeDot";
import { Barcode } from "@/components/primitives/Barcode";
import { fmtDate } from "@/lib/format";

export function EventCard({ event }: { event: EventItem }) {
  const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");

  async function rsvp() {
    setState("loading");
    try {
      const r = await fetch(`/api/events/${event.id}/rsvp`, { method: "POST" });
      setState(r.ok ? "ok" : "err");
    } catch {
      setState("err");
    }
  }

  return (
    <Frame tone="navy" className="flex h-full flex-col p-4">
      <div className="flex items-start justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted)]">
        <span className="flex items-center gap-2">
          <OrangeDot size={6} />
          {event.code}
        </span>
        <span>UPCOMING</span>
      </div>
      <div
        className="mt-3 text-3xl uppercase leading-[0.9] tracking-tight text-[var(--bone)]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {event.title}
      </div>
      <div
        className="mt-1 text-xs text-[var(--muted)]"
        style={{ fontFamily: "var(--font-jp)" }}
      >
        {event.subtitleJa}
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-2 font-mono text-[10px] uppercase tracking-[0.2em]">
        <div>
          <dt className="text-[var(--muted)]">DATE</dt>
          <dd className="mt-1 text-[var(--bone)]">{fmtDate(event.date)}</dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">LOC</dt>
          <dd className="mt-1 text-[var(--bone)]">{event.location}</dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">XP REWARD</dt>
          <dd className="mt-1 text-[var(--signal)]">+{event.xpReward}</dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">CAP</dt>
          <dd className="mt-1 text-[var(--bone)]">120</dd>
        </div>
      </dl>

      <Barcode seed={event.id} className="mt-4" tone="navy" height={16} />

      <button
        onClick={rsvp}
        disabled={state === "loading"}
        className="mt-4 w-full bg-[var(--bone)] py-2 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--ink)] transition hover:bg-[var(--signal)] hover:text-[var(--ink)] disabled:opacity-50"
      >
        {state === "idle" && "RSVP · LOCK IN"}
        {state === "loading" && "LOCKING…"}
        {state === "ok" && "LOCKED ✓"}
        {state === "err" && "RETRY"}
      </button>
    </Frame>
  );
}
