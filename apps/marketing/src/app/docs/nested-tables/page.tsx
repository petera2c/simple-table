import { Metadata } from "next";
import NestedTablesContent from "@/components/pages/docs-pages/NestedTablesContent";
import { SEO_STRINGS } from "@/constants/strings/seo";

export const metadata: Metadata = {
  title: SEO_STRINGS.nestedTables.title,
  description: SEO_STRINGS.nestedTables.description,
  keywords: SEO_STRINGS.nestedTables.keywords,
  openGraph: {
    title: SEO_STRINGS.nestedTables.title,
    description: SEO_STRINGS.nestedTables.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.nestedTables.title,
    description: SEO_STRINGS.nestedTables.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/nested-tables",
  },
};

const NestedTablesPage = () => {
  return <NestedTablesContent />;
};

export default NestedTablesPage;
