import { events } from "./data";
import type { SliderItem } from "@/components/block/interactive-hover-slider";

const galleryDir = "/gallery";

export const placeholderImages = Array.from({ length: 12 }, (_, index) => {
  const n = String(index + 1).padStart(2, "0");
  return `${galleryDir}/${n}.png`;
});

const eventCovers: Record<string, string> = {
  bullish: "/events/bullish/poster.png",
  "anveshana-3": "/events/anveshana-3/13.png",
  overclock: "/events/overclock/poster.jpg",
  "pitch-off": "/events/pitch-off/poster.png",
  "anveshana-25": "/events/anveshana-25/poster.png",
};

export function eventImage(id: string): string {
  return eventCovers[id] ?? placeholderImages[0];
}

export const eventSlides: SliderItem[] = events.map((event) => ({
  id: event.code,
  title: event.title,
  focus: event.location,
  year: String(new Date(event.date).getFullYear()),
  img: eventImage(event.id),
}));

export type GalleryEntry = { title: string; year: number };

// Photos pulled from every event section, grouped per event.
const eventPhotoSets: Array<{ eventId: string; photos: string[] }> = [
  { eventId: "bullish", photos: ["/events/bullish/poster.png", "/events/bullish/02.png", "/events/bullish/03.png", "/events/bullish/04.png"] },
  {
    eventId: "anveshana-3",
    photos: [
      "/events/anveshana-3/13.png",
      "/events/anveshana-3/01.png",
      "/events/anveshana-3/02.png",
      "/events/anveshana-3/03.png",
      "/events/anveshana-3/04.png",
      "/events/anveshana-3/05.png",
      "/events/anveshana-3/06.png",
      "/events/anveshana-3/07.png",
      "/events/anveshana-3/08.png",
      "/events/anveshana-3/09.png",
      "/events/anveshana-3/10.png",
      "/events/anveshana-3/11.png",
      "/events/anveshana-3/12.png",
    ],
  },
  {
    eventId: "overclock",
    photos: [
      "/events/overclock/poster.jpg",
      "/events/overclock/01.png",
      "/events/overclock/02.png",
      "/events/overclock/04.png",
      "/events/overclock/05.jpg",
      "/events/overclock/06.jpg",
    ],
  },
  {
    eventId: "pitch-off",
    photos: [
      "/events/pitch-off/poster.png",
      "/events/pitch-off/01.png",
      "/events/pitch-off/02.png",
      "/events/pitch-off/03.png",
    ],
  },
  {
    eventId: "anveshana-25",
    photos: [
      "/events/anveshana-25/poster.png",
      "/events/anveshana-25/00.jpg",
      "/events/anveshana-25/01.jpg",
      "/events/anveshana-25/06.jpg",
      "/events/anveshana-25/08.jpg",
      "/events/anveshana-25/speaker.jpg",
      "/events/anveshana-25/IMG_0050.jpg",
      "/events/anveshana-25/IMG_0052.jpg",
      "/events/anveshana-25/IMG_0071.jpg",
      "/events/anveshana-25/IMG_8663.jpg",
      "/events/anveshana-25/IMG_8664.jpg",
      "/events/anveshana-25/IMG_8666.jpg",
      "/events/anveshana-25/IMG_8667.jpg",
      "/events/anveshana-25/IMG_8669.jpg",
      "/events/anveshana-25/IMG_8671.jpg",
    ],
  },
];

const eventGalleryImages = eventPhotoSets.flatMap((set) => set.photos);

const eventGalleryItems: GalleryEntry[] = eventPhotoSets.flatMap((set) => {
  const event = events.find((item) => item.id === set.eventId);
  return set.photos.map(() => ({
    title: event?.title ?? "Event",
    year: event ? new Date(event.date).getFullYear() : new Date().getFullYear(),
  }));
});

export const galleryImages = [...eventGalleryImages];

export const galleryItems: GalleryEntry[] = [...eventGalleryItems];
