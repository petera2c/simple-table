import { SEO_STRINGS } from "@/constants/strings/seo";
import { Metadata } from "next";
import SalesExampleWrapper from "@/examples/sales/SalesExampleWrapper";

export const metadata: Metadata = {
  title: SEO_STRINGS.examples.sales.title,
  description: SEO_STRINGS.examples.sales.description,
  openGraph: {
    title: SEO_STRINGS.examples.sales.title,
    description: SEO_STRINGS.examples.sales.description,
    type: "website",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.examples.sales.title,
    description: SEO_STRINGS.examples.sales.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/examples/sales",
  },
};

export default function SalesPage() {
  return <SalesExampleWrapper shouldPaginate={false} />;
}
