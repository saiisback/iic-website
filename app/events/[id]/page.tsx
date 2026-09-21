import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { events } from "@/lib/data";
import { eventImage } from "@/lib/media";
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

  const meta = [
    { label: "DATE", value: fmtDate(event.date) },
    { label: "TIME", value: fmtTime(event.date) },
    { label: "LOCATION", value: event.location },
    { label: "XP REWARD", value: `+${event.xpReward}` },
  ];

  return (
    <main className="relative min-h-[100dvh] w-full overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${JSON.stringify(eventImage(event.id))})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-5xl flex-col px-6 py-10 md:px-12 md:py-16">
        <div className="flex items-center justify-between">
          <Link
            href="/events"
            className="border border-white/40 px-4 py-2 text-xs font-medium tracking-[0.24em] text-white transition-[background-color,color] duration-200 hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            ALL EVENTS
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
            {event.status === "upcoming" ? "UPCOMING" : "ARCHIVED"}
          </span>
        </div>

        <div className="mt-auto pt-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-white/45">
            {event.code}
          </p>
          <h1
            className="mt-4 text-6xl leading-[0.85] tracking-tighter md:text-8xl lg:text-9xl"
            style={{ fontFamily: "var(--font-league-gothic)" }}
          >
            {event.title}
          </h1>
          <p
            className="mt-3 text-base text-white/60 md:text-lg"
            style={{ fontFamily: "var(--font-jp)" }}
          >
            {event.subtitleJa}
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-white/15 pt-8 md:grid-cols-4">
            {meta.map((item) => (
              <div key={item.label}>
                <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                  {item.label}
                </dt>
                <dd className="mt-2 text-sm text-white md:text-base">{item.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Link
              href="/idea-box"
              className="bg-white px-6 py-3 text-xs font-medium tracking-[0.3em] text-black transition-transform duration-200 hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:translate-y-px"
            >
              LOCK IN
            </Link>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
              Full brief and media coming soon
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
