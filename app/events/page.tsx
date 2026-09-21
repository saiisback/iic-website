import type { Metadata } from "next";
import { EventsShowcase } from "@/components/events/EventsShowcase";

export const metadata: Metadata = {
  title: "Events | IIC BMSIT",
  description: "Events for builders, innovators, and student founders at IIC BMSIT.",
};

export default function EventsPage() {
  return <EventsShowcase />;
}
