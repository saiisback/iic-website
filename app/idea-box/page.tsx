import type { Metadata } from "next";
import Link from "next/link";
import { IdeaBoxForm } from "@/components/idea-box/IdeaBoxForm";

export const metadata: Metadata = {
  title: "Idea Box | IIC BMSIT",
  description: "Submit what you are building and request support from IIC BMSIT.",
};

export default function IdeaBoxPage() {
  return (
    <main data-idea-box-page="true" className="min-h-[100dvh] bg-[#050706] text-white">
      <header className="mx-auto flex max-w-[1440px] justify-end px-5 pt-5 md:px-10 md:pt-8">
        <Link href="/" className="inline-flex min-h-11 items-center border border-white/30 px-4 text-xs font-medium tracking-[0.18em] text-white transition-[background-color,color,transform] hover:-translate-y-px hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:translate-y-px">
          BACK HOME
        </Link>
      </header>

      <div className="mx-auto grid max-w-[1440px] gap-14 px-5 pb-24 pt-12 md:px-10 md:pt-16 lg:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.28fr)] lg:gap-20 lg:pt-20 xl:gap-28">
        <aside className="lg:sticky lg:top-12 lg:h-fit">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-300">Submit what you&apos;re building</p>
          <h1 className="mt-6 max-w-xl font-display text-[6.5rem] leading-[0.76] tracking-[-0.025em] text-white sm:text-[8rem] lg:text-[9.5rem] xl:text-[11rem]">
            IDEA BOX
          </h1>
          <p className="mt-8 max-w-md text-base leading-7 text-white/62 md:text-lg md:leading-8">
            Show us the problem, the prototype, and the support that could move your build forward.
          </p>
          <div className="mt-10 max-w-md border-l-2 border-emerald-400 pl-5">
            <p className="text-sm leading-6 text-white/60">
              Share the real state of the work. Early ideas, rough experiments, and working prototypes are all welcome.
            </p>
          </div>
        </aside>

        <section aria-label="Idea submission form" className="min-w-0 border-t border-white/25 pt-10">
          <IdeaBoxForm />
        </section>
      </div>
    </main>
  );
}
