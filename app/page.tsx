import Image from "next/image";
import { HomeLockIn } from "@/components/home/HomeLockIn";
import { HomeNavigation } from "@/components/home/HomeNavigation";
import { RecruitmentPopup } from "@/components/home/RecruitmentPopup";
import { RECRUITMENT_OPEN } from "@/lib/careers/status";

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
      <div className="absolute inset-x-0 top-0 z-10 flex flex-col gap-4 px-5 pt-5 md:flex-row md:items-start md:justify-between md:gap-6 md:px-16 md:pt-12">
        <div
          className="order-2 text-white md:order-none"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <div className="text-[clamp(3rem,12vw,9rem)] leading-[0.85] tracking-tighter">
            INNOVATE
          </div>
        </div>
        <div className="order-1 flex flex-col items-end text-sm font-medium tracking-[0.3em] text-white md:order-none md:text-base">
          <div>[ IIC TEAM ]</div>
          <HomeLockIn />
          <HomeNavigation />
        </div>
      </div>
      {RECRUITMENT_OPEN && <RecruitmentPopup />}
    </section>
  );
}
