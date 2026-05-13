import Image from "next/image";

export default function Home() {
  return (
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
      <div className="absolute right-8 top-8 z-10 text-sm font-medium tracking-[0.3em] text-white md:right-16 md:top-12 md:text-base">
        [ IIC TEAM ]
      </div>
      <div
        className="absolute left-8 top-8 z-10 font-[family-name:var(--font-league-gothic)] text-white md:left-16 md:top-12"
        style={{ fontFamily: "var(--font-league-gothic)" }}
      >
        <div className="flex w-[14rem] justify-between text-7xl leading-[0.85] tracking-tight md:w-[22rem] md:text-9xl">
          {"COMING".split("").map((c, i) => (
            <span key={`c-${i}`}>{c}</span>
          ))}
        </div>
        <div className="flex w-[14rem] justify-between text-7xl leading-[0.85] tracking-tight md:w-[22rem] md:text-9xl">
          {"SOON".split("").map((c, i) => (
            <span key={`s-${i}`}>{c}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
