import type { Metadata } from "next";

import { ComingSoon } from "@/components/coming-soon/ComingSoon";

export const metadata: Metadata = {
  title: "Coming Soon | IIC BMSIT",
  description: "The IIC Lock In experience is coming soon.",
};

export default function ComingSoonPage() {
  return <ComingSoon />;
}
