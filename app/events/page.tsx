import type { Metadata } from "next";
import Image from "next/image";
import eventsHero from "@/public/events-builders-hero.png";
import { EventsHero } from "@/components/events/EventsHero";

const heroAlt =
  "Six student builders creating with electronics, robotics, code, prototypes, fabrication tools, and product tests";

export const metadata: Metadata = {
  title: "Events | IIC BMSIT",
  description: "Events for builders, innovators, and student founders at IIC BMSIT.",
};

export default function EventsPage() {
  return (
    <EventsHero
      heroImage={
        <Image
          src={eventsHero}
          alt={heroAlt}
          fill
          preload
          sizes="100vw"
          className="object-cover object-[44%_center] md:object-center"
        />
      }
    />
  );
}
