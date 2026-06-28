import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import SoccerExampleWrapper from "@/examples/soccer/SoccerExampleWrapper";

export const metadata: Metadata = {
  title: SEO_STRINGS.examples.soccer?.title || "Sports Analytics Dashboard - Simple Table",
  description:
    SEO_STRINGS.examples.soccer?.description ||
    "Explore sports player analytics with Simple Table - goals, assists, expected goals, ratings, and form across an entire league.",
  alternates: {
    canonical: "/examples/soccer",
  },
};

export default function SoccerPage() {
  return <SoccerExampleWrapper />;
}
