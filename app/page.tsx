import Image from "next/image";
import Link from "next/link";
import { FlexboxSection } from "../components/sections/FlexboxSection";
import { IdeaBox } from "../components/sections/IdeaBox";

export default function Home() {
  return (
    <div>
      <section className="relative h-screen w-screen overflow-hidden bg-black">
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
        <div
          className="absolute left-8 top-8 z-10 text-white md:left-16 md:top-12"
          style={{ fontFamily: "var(--font-league-gothic)" }}
        >
          <div className="text-7xl leading-[0.85] tracking-tighter md:text-9xl">
            INNOVATE
          </div>
        </div>
        <div className="absolute flex flex-col right-8 top-8 z-10 text-sm font-medium tracking-[0.3em] text-white md:right-16 md:top-12 md:text-base">
          <div>[ IIC TEAM ]</div>
          <button className="text-sm font-medium tracking-[0.3em] px-4 py-2 hover:border-transparent transition-all duration-300 bg-white text-black py-2 mt-2">
            <Link href="/dashboard">LOCK IN</Link>
          </button>
        </div>
      </section>

      <section className="bg-[var(--ink)] py-24 px-8 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="font-mono text-[10px] tracking-[0.25em] text-[var(--muted)] mb-2">
            SECTION 001.01 / ABOUT
          </div>
          <div
            className="text-5xl md:text-7xl text-[var(--bone)] mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            WHAT IS IIC?
          </div>
          <div className="font-jp text-lg text-[var(--signal)] mb-12">
            什么是IIC
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <p className="text-[var(--bone)]/80 text-lg leading-relaxed mb-6">
                The <strong className="text-[var(--bone)]">Institution&apos;s Innovation Council (IIC)</strong> is
                a initiative by the Ministry of Education, Government of India to foster a culture of
                innovation and entrepreneurship in academic institutions.
              </p>
              <p className="text-[var(--bone)]/60 leading-relaxed mb-6">
                Our chapter serves as the nerve center for innovation activities on campus — from
                ideation workshops and hackathons to patent support and startup incubation. We bridge
                the gap between academic learning and real-world problem solving.
              </p>
              <p className="text-[var(--bone)]/60 leading-relaxed">
                Whether you&apos;re a coder, designer, researcher, or dreamer — IIC is where your ideas
                find structure, your skills find purpose, and your innovations find a path to impact.
              </p>
            </div>
            <div className="space-y-6">
              <div className="border border-[var(--wire)] p-6">
                <div
                  className="text-2xl text-[var(--bone)] mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  OUR MISSION
                </div>
                <div className="font-jp text-sm text-[var(--signal)] mb-3">私たちの使命</div>
                <p className="text-[var(--bone)]/60 text-sm leading-relaxed">
                  To create a vibrant innovation ecosystem that transforms students into changemakers
                  through hands-on experiences, mentorship, and community.
                </p>
              </div>
              <div className="border border-[var(--wire)] p-6">
                <div
                  className="text-2xl text-[var(--bone)] mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  WHAT WE DO
                </div>
                <div className="font-jp text-sm text-[var(--signal)] mb-3">何をしますか</div>
                <ul className="space-y-2 text-[var(--bone)]/60 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--signal)] mt-1">▸</span>
                    Organize hackathons, ideathons, and innovation challenges
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--signal)] mt-1">▸</span>
                    Provide mentorship from industry and academic leaders
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--signal)] mt-1">▸</span>
                    Support patent filing and IP protection
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--signal)] mt-1">▸</span>
                    Incubate student startups with resources and funding
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--signal)] mt-1">▸</span>
                    Build a community of innovators and changemakers
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--ink)] py-24 px-8 md:px-16 border-t border-[var(--wire)]">
        <div className="max-w-6xl mx-auto">
          <div className="font-mono text-[10px] tracking-[0.25em] text-[var(--muted)] mb-2">
            SECTION 001.02 / NUMBERS
          </div>
          <div
            className="text-5xl md:text-7xl text-[var(--bone)] mb-12"
            style={{ fontFamily: "var(--font-display)" }}
          >
            BY THE NUMBERS
          </div>
          <FlexboxSection />
        </div>
      </section>

      <section className="bg-[var(--ink)] py-24 px-8 md:px-16 border-t border-[var(--wire)]">
        <div className="max-w-6xl mx-auto">
          <div className="font-mono text-[10px] tracking-[0.25em] text-[var(--muted)] mb-2">
            SECTION 001.03 / CONTRIBUTE
          </div>
          <div
            className="text-5xl md:text-7xl text-[var(--bone)] mb-12"
            style={{ fontFamily: "var(--font-display)" }}
          >
            HAVE AN IDEA?
          </div>
          <div className="max-w-2xl">
            <IdeaBox />
          </div>
        </div>
      </section>
    </div>
  );
}
