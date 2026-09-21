import { events } from "./data";
import type { SliderItem } from "@/components/block/interactive-hover-slider";

const galleryDir = "/gallery";

export const placeholderImages = Array.from({ length: 12 }, (_, index) => {
  const n = String(index + 1).padStart(2, "0");
  return `${galleryDir}/${n}.png`;
});

export function eventImage(id: string): string {
  const index = events.findIndex((event) => event.id === id);
  return placeholderImages[(index < 0 ? 0 : index) % placeholderImages.length];
}

export const eventSlides: SliderItem[] = events.map((event, index) => ({
  id: event.code,
  title: event.title,
  focus: event.location,
  year: String(new Date(event.date).getFullYear()),
  img: placeholderImages[index % placeholderImages.length],
}));

export type GalleryEntry = { title: string; year: number };

export const galleryImages = placeholderImages.slice(0, 18);

export const galleryItems: GalleryEntry[] = [
  { title: "Builders Night", year: 2026 },
  { title: "Ideathon", year: 2026 },
  { title: "Hardware Hack", year: 2026 },
  { title: "Demo Day", year: 2025 },
  { title: "Patent Clinic", year: 2025 },
  { title: "Mentor Round", year: 2025 },
  { title: "Studio Sessions", year: 2026 },
  { title: "Prototype Lab", year: 2026 },
  { title: "Founder Talks", year: 2025 },
  { title: "Campus Sprint", year: 2026 },
  { title: "Maker Fair", year: 2025 },
  { title: "AI Workshop", year: 2026 },
  { title: "Open Studio", year: 2026 },
  { title: "Launch Night", year: 2025 },
  { title: "Field Notes", year: 2026 },
  { title: "After Hours", year: 2025 },
  { title: "Signal Room", year: 2026 },
  { title: "Archive", year: 2025 },
];
