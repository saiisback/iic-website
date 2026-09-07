import { createElement } from "react";

export function HomeLockIn() {
  return createElement(
    "a",
    {
      href: "/coming-soon",
      className:
        "mt-2 inline-flex bg-white px-4 py-2 text-sm font-medium tracking-[0.3em] text-black transition-transform duration-200 hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:translate-y-px",
    },
    "LOCK IN",
  );
}
