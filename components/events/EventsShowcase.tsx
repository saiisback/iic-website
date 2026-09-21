"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { InteractiveHoverSlider } from "@/components/block/interactive-hover-slider";
import { events } from "@/lib/data";
import { eventSlides } from "@/lib/media";

export function EventsShowcase() {
  const router = useRouter();

  return (
    <section
      id="events"
      className="relative min-h-[100dvh] w-full overflow-hidden bg-black text-white"
    >
      <div className="flex items-start justify-between px-6 pt-6 md:px-16 md:pt-12">
        <h1
          className="text-7xl leading-[0.85] tracking-tighter md:text-8xl lg:text-9xl"
          style={{ fontFamily: "var(--font-league-gothic)" }}
        >
          EVENTS
        </h1>
        <Link
          href="/"
          className="mt-1 whitespace-nowrap border border-white/45 px-4 py-2 text-xs font-medium tracking-[0.24em] text-white transition-[background-color,color,transform] duration-200 hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:translate-y-px md:text-sm"
        >
          BACK HOME
        </Link>
      </div>

      <p className="mt-6 max-w-md px-6 text-sm leading-relaxed text-white/55 md:px-16">
        Hover or tap an event to preview it. Open a row to read the full brief.
      </p>

      <div className="mt-8 md:mt-10">
        <InteractiveHoverSlider
          items={eventSlides}
          showHeader={false}
          className="h-[70vh] min-h-[30rem] w-full md:h-[78vh]"
          onSelect={(item) => {
            const event = events.find((entry) => entry.code === item.id);
            if (event) router.push(`/events/${event.id}`);
          }}
        />
      </div>
    </section>
  );
}
