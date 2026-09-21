import { createElement } from "react";

const navigationItems = [
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  // { href: "#team", label: "Team" },
  { href: "/idea-box", label: "Idea Box" },
] as const;

export function HomeNavigation() {
  return createElement(
    "nav",
    {
      "aria-label": "Explore IIC",
      className:
        "mt-4 w-[min(70vw,11rem)] border-t border-white/35 pt-2 text-right text-white",
    },
    createElement(
      "ul",
      { className: "flex flex-col" },
      navigationItems.map((item) =>
        createElement(
          "li",
          { key: item.href },
          createElement(
            "a",
            {
              href: item.href,
              className:
                "block whitespace-nowrap py-2 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-white/75 transition-[color,transform] duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:translate-y-px md:text-xs",
            },
            item.label,
          ),
        ),
      ),
    ),
  );
}
