import Link from "next/link";
import { ArtGallery } from "@/components/block/art-gallery";
import { galleryImages, galleryItems } from "@/lib/media";

export function GalleryShowcase() {
  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden bg-black text-white">
      <div className="flex items-start justify-between px-6 pt-6 md:px-16 md:pt-12">
        <h1
          className="text-7xl leading-[0.85] tracking-tighter md:text-8xl lg:text-9xl"
          style={{ fontFamily: "var(--font-league-gothic)" }}
        >
          GALLERY
        </h1>
        <Link
          href="/"
          className="mt-1 whitespace-nowrap border border-white/45 px-4 py-2 text-xs font-medium tracking-[0.24em] text-white transition-[background-color,color,transform] duration-200 hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:translate-y-px md:text-sm"
        >
          BACK HOME
        </Link>
      </div>

      <p className="mt-6 max-w-md px-6 text-sm leading-relaxed text-white/55 md:px-16">
        Moments from the build floor — ideathons, hardware hacks, demo days and the
        people who make them happen. Drag to explore.
      </p>

      <div className="mt-8 px-6 md:mt-10 md:px-16">
        <ArtGallery
          images={galleryImages}
          items={galleryItems}
          className="h-[60vh] min-h-[22rem] w-full md:h-[74vh]"
        />
      </div>
    </section>
  );
}
