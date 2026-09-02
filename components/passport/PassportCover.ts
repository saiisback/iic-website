import { createElement, type ReactElement } from "react";

export type PassportCoverStyles = {
  coverScene: string;
  coverButton: string;
  closedPassport: string;
  coverTexture: string;
  coverFrame: string;
  coverKicker: string;
  coverEmblem: string;
  coverMonogram: string;
  coverInstitute: string;
  coverTitle: string;
  coverMeta: string;
  openHint: string;
};

type PassportCoverProps = {
  onOpen: () => void;
  styles: PassportCoverStyles;
};

export function PassportCover({
  onOpen,
  styles,
}: PassportCoverProps): ReactElement {
  return createElement(
    "section",
    { className: styles.coverScene, "aria-label": "IIC BMSIT passport" },
    createElement(
      "button",
      {
        className: styles.coverButton,
        type: "button",
        onClick: onOpen,
        "aria-label": "Open IIC BMSIT passport",
      },
      createElement(
        "span",
        {
          className: styles.closedPassport,
          "data-passport-cover": "closed",
        },
        createElement("span", {
          className: styles.coverTexture,
          "aria-hidden": "true",
        }),
        createElement("span", {
          className: styles.coverFrame,
          "aria-hidden": "true",
        }),
        createElement(
          "span",
          { className: styles.coverKicker },
          "Innovation & Incubation Council",
        ),
        createElement(
          "span",
          { className: styles.coverEmblem, "aria-hidden": "true" },
          createElement("span", { className: styles.coverMonogram }, "IIC"),
        ),
        createElement("span", { className: styles.coverInstitute }, "BMSIT"),
        createElement(
          "span",
          { className: styles.coverTitle },
          createElement("span", null, "Innovation"),
          createElement("span", null, "Passport"),
        ),
        createElement(
          "span",
          { className: styles.coverMeta },
          createElement("span", null, "Member edition"),
          createElement("span", null, "2026"),
        ),
      ),
    ),
    createElement("p", { className: styles.openHint }, "Click to open"),
  );
}

