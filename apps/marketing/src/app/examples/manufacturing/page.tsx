import { SEO_STRINGS } from "@/constants/strings/seo";
import ManufacturingExampleWrapper from "@/examples/manufacturing/ManufacturingExampleWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: SEO_STRINGS.examples.manufacturing.title,
  description: SEO_STRINGS.examples.manufacturing.description,
  openGraph: {
    title: SEO_STRINGS.examples.manufacturing.title,
    description: SEO_STRINGS.examples.manufacturing.description,
    type: "website",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.examples.manufacturing.title,
    description: SEO_STRINGS.examples.manufacturing.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/examples/manufacturing",
  },
};

export default function ManufacturingExample() {
  return <ManufacturingExampleWrapper />;
}
