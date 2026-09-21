import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { events } from "@/lib/data";
import { eventImage } from "@/lib/media";
import { getEventReport } from "@/lib/reports";
import { EventReport } from "@/components/events/EventReport";
import { fmtDate, fmtTime } from "@/lib/format";

type EventPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return events.map((event) => ({ id: event.id }));
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { id } = await params;
  const event = events.find((entry) => entry.id === id);

  if (!event) {
    return { title: "Event not found | IIC BMSIT" };
  }

  return {
    title: `${event.title} | IIC BMSIT`,
    description: `${event.title} (${event.code}) at ${event.location} on ${fmtDate(
      event.date,
    )}.`,
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  const event = events.find((entry) => entry.id === id);

  if (!event) notFound();

  const report = getEventReport(event.id);
  const cover = report?.cover ?? eventImage(event.id);

  const meta = [
    { label: "DATE", value: fmtDate(event.date) },
    { label: "TIME", value: fmtTime(event.date) },
    { label: "LOCATION", value: event.location },
    { label: "XP REWARD", value: `+${event.xpReward}` },
  ];

  return (
    <main className="min-h-[100dvh] w-full bg-black text-white">
      <section className="relative h-[62vh] min-h-[24rem] w-full overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${JSON.stringify(cover)})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black" />

        <div className="relative z-10 flex h-full flex-col justify-between p-6 md:p-12">
          <div className="flex items-start justify-between">
            <Link
              href="/events"
              className="border border-white/45 px-4 py-2 text-xs font-medium tracking-[0.24em] text-white transition-[background-color,color] duration-200 hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              ALL EVENTS
            </Link>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/55">
              {event.status === "upcoming" ? "UPCOMING" : "ARCHIVED"}
            </span>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-emerald-300">
              {event.code}
            </p>
            <h1
              className="mt-3 text-6xl leading-[0.85] tracking-tighter md:text-8xl lg:text-9xl"
              style={{ fontFamily: "var(--font-league-gothic)" }}
            >
              {event.title}
            </h1>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.28em] text-white/60">
              {fmtDate(event.date)} · {event.location}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-14 md:px-12 md:py-20">
        <dl className="grid grid-cols-2 gap-6 border-b border-white/15 pb-12 md:grid-cols-4">
          {meta.map((item) => (
            <div key={item.label}>
              <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                {item.label}
              </dt>
              <dd className="mt-2 text-sm text-white md:text-base">{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-14">
          {report ? (
            <EventReport markdown={report.markdown} />
          ) : (
            <p className="max-w-prose text-sm leading-relaxed text-white/55">
              The full report for {event.title} is on its way. Check back soon.
            </p>
          )}
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-4 border-t border-white/15 pt-10">
          <Link
            href="/events"
            className="bg-white px-6 py-3 text-xs font-medium tracking-[0.3em] text-black transition-transform duration-200 hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:translate-y-px"
          >
            BACK TO EVENTS
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            IIC · BICEP TEAM
          </span>
        </div>
      </section>
    </main>
  );
}
