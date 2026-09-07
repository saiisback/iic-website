import Image from "next/image";
import { HomeLockIn } from "@/components/home/HomeLockIn";
import { HomeNavigation } from "@/components/home/HomeNavigation";

export default function Home() {
  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden bg-black">
      <div className="absolute inset-x-0 bottom-0 h-[65%]">
        <Image
          src="/hero-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-contain object-bottom"
        />
      </div>
      <div className="absolute right-5 top-5 z-10 flex flex-col items-end text-sm font-medium tracking-[0.3em] text-white md:right-16 md:top-12 md:text-base">
        <div>[ IIC TEAM ]</div>
        <HomeLockIn />
        <HomeNavigation />
      </div>
      <div
        className="absolute left-8 top-8 z-10 text-white md:left-16 md:top-12"
        style={{ fontFamily: "var(--font-league-gothic)" }}
      >
        <div className="text-7xl leading-[0.85] tracking-tighter md:text-9xl">
          INNOVATE
        </div>
      </div>
    </section>
  );
}
