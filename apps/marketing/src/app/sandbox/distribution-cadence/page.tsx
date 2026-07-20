import type { Metadata } from "next";
import DistributionCadenceContent from "@/components/pages/DistributionCadenceContent";

// Internal ops page for the 90-day earned-distribution cadence.
// Noindex — not for search; use as a copy/paste checklist.
export const metadata: Metadata = {
  title: "Distribution Cadence (Internal)",
  robots: { index: false, follow: false },
};

export default function DistributionCadencePage() {
  return <DistributionCadenceContent />;
}
