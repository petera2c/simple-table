import type { Metadata } from "next";
import ProgrammaticControlContent from "@/components/pages/docs-pages/ProgrammaticControlContent";
import DocsDemoCode from "@/components/DocsDemoCode";
import { SEO_STRINGS } from "@/constants/strings/seo";

export const metadata: Metadata = {
  title: SEO_STRINGS.programmaticControl.title,
  description: SEO_STRINGS.programmaticControl.description,
  keywords: SEO_STRINGS.programmaticControl.keywords,
  openGraph: {
    title: SEO_STRINGS.programmaticControl.title,
    description: SEO_STRINGS.programmaticControl.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.programmaticControl.title,
    description: SEO_STRINGS.programmaticControl.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/programmatic-control",
  },
};

export default function ProgrammaticControlPage() {
  return (
    <DocsDemoCode slug="programmatic-control">
      <ProgrammaticControlContent />
    </DocsDemoCode>
  );
}
