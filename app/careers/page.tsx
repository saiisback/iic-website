import type { Metadata } from "next";
import Link from "next/link";
import { CareersForm } from "@/components/careers/CareersForm";

export const metadata: Metadata = {
  title: "Careers | IIC BMSIT",
  description: "Apply to join IIC BMSIT and tell us why you belong in the room.",
};

export default function CareersPage() {
  return (
    <main data-careers-page="true" className="min-h-[100dvh] bg-[#050706] text-white">
      <header className="mx-auto flex max-w-[1440px] justify-end px-5 pt-5 md:px-10 md:pt-8">
        <Link href="/" className="inline-flex min-h-11 items-center border border-white/30 px-4 text-xs font-medium tracking-[0.18em] text-white transition-[background-color,color,transform] hover:-translate-y-px hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:translate-y-px">
          BACK HOME
        </Link>
      </header>

      <div className="mx-auto grid max-w-[1440px] gap-14 px-5 pb-24 pt-12 md:px-10 md:pt-16 lg:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.28fr)] lg:gap-20 lg:pt-20 xl:gap-28">
        <aside className="lg:sticky lg:top-12 lg:h-fit">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-emerald-300">Come build with us</p>
          <h1 className="mt-6 max-w-xl font-display text-[6.5rem] leading-[0.76] tracking-[-0.025em] text-white sm:text-[8rem] lg:text-[9.5rem] xl:text-[11rem]">
            CAREERS
          </h1>
          <p className="mt-8 max-w-md text-base leading-7 text-white/62 md:text-lg md:leading-8">
            Tell us what you bring to the table, what you want to learn, and how you&rsquo;d like to contribute to IIC.
          </p>
          <div className="mt-10 max-w-md border-l-2 border-emerald-400 pl-5">
            <p className="text-sm leading-6 text-white/60">
              No perfect answers. Take your time, be yourself, and tell us what genuinely interests you.
            </p>
          </div>
        </aside>

        <section aria-label="IIC careers application form" className="min-w-0 border-t border-white/25 pt-10">
          <CareersForm />
        </section>
      </div>
    </main>
  );
}
