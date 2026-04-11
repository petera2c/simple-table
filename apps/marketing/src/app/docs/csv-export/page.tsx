import { Metadata } from "next";
import CSVExportContent from "@/components/pages/docs-pages/CSVExportContent";
import { SEO_STRINGS } from "@/constants/strings/seo";

export const metadata: Metadata = {
  title: SEO_STRINGS.csvExport.title,
  description: SEO_STRINGS.csvExport.description,
  keywords: SEO_STRINGS.csvExport.keywords,
  openGraph: {
    title: SEO_STRINGS.csvExport.title,
    description: SEO_STRINGS.csvExport.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.csvExport.title,
    description: SEO_STRINGS.csvExport.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/csv-export",
  },
};

const CSVExportPage = () => {
  return <CSVExportContent />;
};

export default CSVExportPage;
