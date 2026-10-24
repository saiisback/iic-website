import { bullishReport } from "./bullish";
import { anveshana3Report } from "./anveshana3";
import { overclockReport } from "./overclock";
import { pitchOffReport } from "./pitchOff";
import { anveshanaBootcampReport } from "./bootcamp";

export type EventReport = {
  markdown: string;
  cover: string;
};

const reports: Record<string, EventReport> = {
  bullish: {
    markdown: bullishReport,
    cover: "/events/bullish/poster.png",
  },
  "anveshana-3": {
    markdown: anveshana3Report,
    cover: "/events/anveshana-3/13.png",
  },
  overclock: {
    markdown: overclockReport,
    cover: "/events/overclock/poster.jpg",
  },
  "pitch-off": {
    markdown: pitchOffReport,
    cover: "/events/pitch-off/poster.png",
  },
  "anveshana-25": {
    markdown: anveshanaBootcampReport,
    cover: "/events/anveshana-25/poster.png",
  },
};

export function getEventReport(id: string): EventReport | undefined {
  return reports[id];
}
