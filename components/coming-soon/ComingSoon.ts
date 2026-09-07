import { createElement } from "react";

export function ComingSoon() {
  return createElement(
    "main",
    {
      "data-coming-soon": "true",
      className:
        "relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-black px-6 text-center text-white",
    },
    createElement(
      "div",
      { className: "flex flex-col items-center" },
      createElement(
        "p",
        {
          className:
            "mb-4 text-xs font-medium uppercase tracking-[0.35em] text-emerald-400",
        },
        "LOCK IN",
      ),
      createElement(
        "h1",
        {
          className:
            "text-7xl leading-[0.85] tracking-tighter sm:text-8xl md:text-9xl",
          style: { fontFamily: "var(--font-league-gothic)" },
        },
        "COMING SOON",
      ),
      createElement(
        "a",
        {
          href: "/",
          className:
            "mt-10 border border-white/45 px-4 py-2 text-xs font-medium tracking-[0.24em] text-white transition-[background-color,color,transform] duration-200 hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:translate-y-px",
        },
        "BACK HOME",
      ),
    ),
  );
}
