import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import CryptoExampleWrapper from "@/examples/crypto/CryptoExampleWrapper";

export const metadata: Metadata = {
  title: SEO_STRINGS.examples.crypto?.title || "Crypto Markets Dashboard - Simple Table",
  description:
    SEO_STRINGS.examples.crypto?.description ||
    "Explore a live crypto markets dashboard with Simple Table - real-time prices, sparkline charts, market cap, and 24h change across thousands of assets.",
  alternates: {
    canonical: "/examples/crypto",
  },
};

export default function CryptoPage() {
  return <CryptoExampleWrapper />;
}
