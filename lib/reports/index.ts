import { bullishReport } from "./bullish";
import { anveshana3Report } from "./anveshana3";

export type EventReport = {
  markdown: string;
  cover: string;
};

const reports: Record<string, EventReport> = {
  bullish: {
    markdown: bullishReport,
    cover: "/events/bullish/01.png",
  },
  "anveshana-3": {
    markdown: anveshana3Report,
    cover: "/events/anveshana-3/01.png",
  },
};

export function getEventReport(id: string): EventReport | undefined {
  return reports[id];
}
