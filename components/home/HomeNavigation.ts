import { createElement } from "react";
import { RECRUITMENT_OPEN } from "@/lib/careers/status";

const navigationItems = [
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  // { href: "#team", label: "Team" },
  { href: "/idea-box", label: "Idea Box" },
  { href: "/careers", label: "Careers", highlight: RECRUITMENT_OPEN },
] as const;

const baseLinkClass =
  "block whitespace-nowrap py-2 text-[0.68rem] uppercase tracking-[0.14em] transition-[color,transform] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 active:translate-y-px md:text-xs";
const defaultLinkClass = `${baseLinkClass} font-medium text-white/75 hover:text-white focus-visible:outline-white`;
const highlightedLinkClass = `${baseLinkClass} font-bold text-emerald-300 hover:text-emerald-200 focus-visible:outline-emerald-300`;

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
      navigationItems.map((item) => {
        const highlighted = "highlight" in item && item.highlight;
        return createElement(
          "li",
          { key: item.href },
          createElement(
            "a",
            {
              href: item.href,
              className: highlighted ? highlightedLinkClass : defaultLinkClass,
            },
            item.label,
            highlighted
              ? createElement("span", {
                  "aria-hidden": "true",
                  className:
                    "ml-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 align-middle",
                })
              : null,
          ),
        );
      }),
    ),
  );
}
