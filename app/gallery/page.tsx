import type { Metadata } from "next";
import { GalleryShowcase } from "@/components/gallery/GalleryShowcase";

export const metadata: Metadata = {
  title: "Gallery | IIC BMSIT",
  description: "Moments from the IIC BMSIT build floor — events, hacks and demo days.",
};

export default function GalleryPage() {
  return <GalleryShowcase />;
}
