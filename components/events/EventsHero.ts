import { createElement, type ReactNode } from "react";

export function EventsHero({ heroImage }: { heroImage: ReactNode }) {
  return createElement(
    "main",
    {
      "data-events-hero": "true",
      className: "relative min-h-[100dvh] overflow-hidden bg-black text-white",
    },
    createElement("div", { className: "absolute inset-0" }, heroImage),
    createElement(
      "div",
      { className: "relative z-10 flex items-start justify-between px-6 pt-6 md:px-16 md:pt-12" },
      createElement(
        "h1",
        {
          className: "text-7xl leading-[0.85] tracking-tighter md:text-9xl",
          style: { fontFamily: "var(--font-league-gothic)" },
        },
        "EVENTS",
      ),
      createElement(
        "a",
        {
          href: "/",
          className: "mt-1 whitespace-nowrap border border-white/45 px-4 py-2 text-xs font-medium tracking-[0.24em] text-white transition-[background-color,color,transform] duration-200 hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:translate-y-px md:text-sm",
        },
        "BACK HOME",
      ),
    ),
  );
}
