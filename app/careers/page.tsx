import type { Metadata } from "next";
import Link from "next/link";
import { CareersForm } from "@/components/careers/CareersForm";
import { CAREERS_SOCIAL_LINKS, RECRUITMENT_OPEN } from "@/lib/careers/status";

export const metadata: Metadata = {
  title: "Careers | IIC BMSIT",
  description: RECRUITMENT_OPEN
    ? "Apply to join IIC BMSIT and tell us why you belong in the room."
    : "Recruitment is currently closed. Follow IIC BMSIT for the next opening.",
};

const backLinkClass =
  "inline-flex min-h-11 items-center border border-white/30 px-4 text-xs font-medium tracking-[0.18em] text-white transition-[background-color,color,transform] hover:-translate-y-px hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:translate-y-px";

const socialLinkClass =
  "inline-flex min-h-12 items-center gap-2 border border-white/25 px-6 text-xs font-bold uppercase tracking-[0.18em] text-white transition-[background-color,color,transform] hover:-translate-y-px hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:translate-y-px";

// Wordmark scales with the viewport so it never overflows: 16vw keeps it inside
// a phone; the lg/xl caps keep it inside its column when the two-column layout
// splits the page.
const wordmarkClass = "mt-6 font-display leading-[0.76] tracking-[-0.025em] text-white";

export default function CareersPage() {
  return (
    <main data-careers-page="true" className="min-h-[100dvh] bg-[#050706] text-white">
      <header className="mx-auto flex max-w-[1440px] justify-end px-5 pt-5 md:px-10 md:pt-8">
        <Link href="/" className={backLinkClass}>
          BACK HOME
        </Link>
      </header>

      {RECRUITMENT_OPEN ? (
        <div className="mx-auto grid max-w-[1440px] gap-14 px-5 pb-24 pt-12 md:px-10 md:pt-16 lg:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.28fr)] lg:gap-20 lg:pt-20 xl:gap-28">
          <aside className="lg:sticky lg:top-12 lg:h-fit">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-emerald-300">Come build with us</p>
            <h1 className={`${wordmarkClass} max-w-xl text-[clamp(3.25rem,16vw,8rem)] lg:text-[clamp(3.25rem,4.8vw,5rem)]`}>
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
      ) : (
        <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-12 md:px-10 md:pt-16 lg:pt-20">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-emerald-300">Come build with us</p>
          <h1 className={`${wordmarkClass} text-[clamp(3.25rem,16vw,8rem)] sm:text-[clamp(3.25rem,15vw,8rem)] lg:text-[clamp(3.25rem,8vw,11rem)]`}>
            CAREERS
          </h1>
          <p className="mt-8 max-w-xl text-base leading-7 text-white/65 md:text-lg md:leading-8">
            Recruitment is currently closed. The application form returns when the next round opens.
          </p>
          <div className="mt-10 max-w-xl border-l-2 border-emerald-400 pl-5">
            <p className="text-sm leading-6 text-white/60">
              Follow our socials — we&rsquo;ll be updating there first if you are hiring.
            </p>
          </div>

          <section aria-label="IIC recruitment status" className="mt-16 border-t border-white/25 pt-10 md:mt-24">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-emerald-300">Recruitment status</p>
            <h2 className="mt-6 max-w-4xl font-display text-[clamp(2.5rem,9vw,7rem)] leading-[0.85] tracking-tight text-white">
              RECRUITMENT IS CURRENTLY CLOSED
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/65 md:text-lg md:leading-8">
              We&rsquo;re not hiring right now. Follow our socials and we&rsquo;ll be updating if you are hiring — that&rsquo;s where every new round gets announced first.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href={CAREERS_SOCIAL_LINKS.instagram} target="_blank" rel="noreferrer" className={socialLinkClass}>
                Instagram <span aria-hidden="true">↗</span>
              </a>
              <a href={CAREERS_SOCIAL_LINKS.linkedin} target="_blank" rel="noreferrer" className={socialLinkClass}>
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
