"use client";

import { useState } from "react";
import { upcomingEvents } from "../../lib/site-data";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  const grouped = upcomingEvents.reduce((acc, event) => {
    const month = new Date(event.date).getMonth();
    const key = months[month];
    if (!acc[key]) acc[key] = [];
    acc[key].push(event);
    return acc;
  }, {} as Record<string, typeof upcomingEvents>);

  return (
    <div className="bg-[var(--ink)] min-h-screen pt-24 pb-16 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="font-mono text-[10px] tracking-[0.25em] text-[var(--muted)] mb-2">
          SECTION 004.01 / CALENDAR
        </div>
        <div
          className="text-5xl md:text-7xl text-[var(--bone)] mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          UPCOMING EVENTS
        </div>
        <div className="font-jp text-lg text-[var(--signal)] mb-12">
          今後のイベント
        </div>

        <div className="space-y-12">
          {Object.entries(grouped).map(([month, events]) => (
            <div key={month}>
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="text-3xl text-[var(--bone)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {month.toUpperCase()}
                </div>
                <div className="flex-1 h-px bg-[var(--wire)]" />
                <div className="font-mono text-[10px] tracking-[0.2em] text-[var(--muted)]">
                  {events.length} EVENT{events.length > 1 ? "S" : ""}
                </div>
              </div>

              <div className="space-y-4">
                {events.map((event) => {
                  const date = new Date(event.date);
                  const day = date.getDate();
                  const spotsLeft = event.spots - event.spotsTaken;
                  const pct = (event.spotsTaken / event.spots) * 100;
                  const isSelected = selectedEvent === event.id;

                  return (
                    <div
                      key={event.id}
                      onClick={() => setSelectedEvent(isSelected ? null : event.id)}
                      className="border border-[var(--wire)] bg-[var(--ink-2)] hover:border-[var(--signal)]/30 transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-stretch">
                        <div className="w-20 md:w-24 flex flex-col items-center justify-center border-r border-[var(--wire)] shrink-0">
                          <div
                            className="text-3xl text-[var(--bone)]"
                            style={{ fontFamily: "var(--font-display)" }}
                          >
                            {String(day).padStart(2, "0")}
                          </div>
                          <div className="font-mono text-[9px] tracking-[0.2em] text-[var(--muted)]">
                            {months[date.getMonth()].toUpperCase()}
                          </div>
                        </div>

                        <div className="flex-1 p-5 md:p-6">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="font-mono text-[10px] tracking-[0.2em] text-[var(--signal)] mb-1">
                                EVT · {event.time}
                              </div>
                              <div
                                className="text-2xl text-[var(--bone)]"
                                style={{ fontFamily: "var(--font-display)" }}
                              >
                                {event.title.toUpperCase()}
                              </div>
                              <div className="font-jp text-sm text-[var(--muted)]">
                                {event.subtitleJa}
                              </div>
                            </div>
                            <div className="text-right shrink-0 ml-4">
                              <div
                                className="text-2xl text-[var(--signal)]"
                                style={{ fontFamily: "var(--font-display)" }}
                              >
                                +{event.xpReward}
                              </div>
                              <div className="font-mono text-[9px] tracking-[0.15em] text-[var(--muted)]">
                                XP
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 mt-3">
                            <span className="font-mono text-[10px] tracking-[0.15em] text-[var(--muted)]">
                              {event.location}
                            </span>
                            <div className="flex-1 h-px bg-[var(--wire)]" />
                            <span className="font-mono text-[10px] tracking-[0.15em] text-[var(--muted)]">
                              {spotsLeft} SPOTS LEFT
                            </span>
                          </div>

                          <div className="mt-3 h-1 bg-[var(--ink)] w-full">
                            <div
                              className="h-full bg-[var(--signal)]/60 transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="border-t border-[var(--wire)] p-5 md:p-6 bg-[var(--ink)]">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <div className="font-mono text-[9px] tracking-[0.2em] text-[var(--muted)] mb-1">DATE</div>
                              <div className="text-[var(--bone)] text-sm">
                                {date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                              </div>
                            </div>
                            <div>
                              <div className="font-mono text-[9px] tracking-[0.2em] text-[var(--muted)] mb-1">TIME</div>
                              <div className="text-[var(--bone)] text-sm">{event.time}</div>
                            </div>
                            <div>
                              <div className="font-mono text-[9px] tracking-[0.2em] text-[var(--muted)] mb-1">VENUE</div>
                              <div className="text-[var(--bone)] text-sm">{event.location}</div>
                            </div>
                            <div>
                              <div className="font-mono text-[9px] tracking-[0.2em] text-[var(--muted)] mb-1">CAPACITY</div>
                              <div className="text-[var(--bone)] text-sm">{event.spotsTaken}/{event.spots}</div>
                            </div>
                          </div>
                          <button className="px-6 py-3 bg-[var(--signal)] text-white font-mono text-[11px] tracking-[0.2em] hover:bg-[var(--signal)]/80 transition-colors">
                            RSVP NOW ↗
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
