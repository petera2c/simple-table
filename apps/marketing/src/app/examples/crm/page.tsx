import { SEO_STRINGS } from "@/constants/strings/seo";
import { Metadata } from "next";
import CRMExampleWrapper from "@/examples/crm/CRMExampleWrapper";

export const metadata: Metadata = {
  title: SEO_STRINGS.examples.crm.title,
  description: SEO_STRINGS.examples.crm.description,
  openGraph: {
    title: SEO_STRINGS.examples.crm.title,
    description: SEO_STRINGS.examples.crm.description,
    type: "website",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.examples.crm.title,
    description: SEO_STRINGS.examples.crm.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/examples/crm",
  },
};

export default function CRMPage() {
  return <CRMExampleWrapper shouldPaginate={false} />;
}
