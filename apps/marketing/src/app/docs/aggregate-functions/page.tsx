import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import AggregateFunctionsContent from "@/components/pages/docs-pages/AggregateFunctionsContent";

export const metadata: Metadata = {
  title: SEO_STRINGS.aggregateFunctions.title,
  description: SEO_STRINGS.aggregateFunctions.description,
  keywords: SEO_STRINGS.aggregateFunctions.keywords,
  openGraph: {
    title: SEO_STRINGS.aggregateFunctions.title,
    description: SEO_STRINGS.aggregateFunctions.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.aggregateFunctions.title,
    description: SEO_STRINGS.aggregateFunctions.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/aggregate-functions",
  },
};

const AggregateFunctionsPage = () => {
  return <AggregateFunctionsContent />;
};

export default AggregateFunctionsPage;
