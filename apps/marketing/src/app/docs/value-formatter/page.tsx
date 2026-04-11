import { Metadata } from "next";
import ValueFormatterContent from "@/components/pages/docs-pages/ValueFormatterContent";
import { SEO_STRINGS } from "@/constants/strings/seo";

export const metadata: Metadata = {
  title: SEO_STRINGS.valueFormatter.title,
  description: SEO_STRINGS.valueFormatter.description,
  keywords: SEO_STRINGS.valueFormatter.keywords,
  openGraph: {
    title: SEO_STRINGS.valueFormatter.title,
    description: SEO_STRINGS.valueFormatter.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.valueFormatter.title,
    description: SEO_STRINGS.valueFormatter.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/value-formatter",
  },
};

export default function ValueFormatterPage() {
  return <ValueFormatterContent />;
}
