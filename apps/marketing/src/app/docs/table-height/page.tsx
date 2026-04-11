import TableHeightContent from "@/components/pages/docs-pages/TableHeightContent";
import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";

export const metadata: Metadata = {
  title: SEO_STRINGS.tableHeight.title,
  description: SEO_STRINGS.tableHeight.description,
  keywords: SEO_STRINGS.tableHeight.keywords,
  openGraph: {
    title: SEO_STRINGS.tableHeight.title,
    description: SEO_STRINGS.tableHeight.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.tableHeight.title,
    description: SEO_STRINGS.tableHeight.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/table-height",
  },
};

export default function TableHeightPage() {
  return <TableHeightContent />;
}
