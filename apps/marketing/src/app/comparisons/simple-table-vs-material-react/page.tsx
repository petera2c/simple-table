import SimpleTableVsMaterialReactContent from "@/components/pages/comparisons/SimpleTableVsMaterialReactContent";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: SEO_STRINGS.comparisons.materialReact.title,
  description: SEO_STRINGS.comparisons.materialReact.description,
  keywords: SEO_STRINGS.comparisons.materialReact.keywords,
  openGraph: {
    title: SEO_STRINGS.comparisons.materialReact.title,
    description: SEO_STRINGS.comparisons.materialReact.description,
    type: "website",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.comparisons.materialReact.title,
    description: SEO_STRINGS.comparisons.materialReact.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/comparisons/simple-table-vs-material-react",
  },
};

const SimpleVsMaterialReact = () => {
  return <SimpleTableVsMaterialReactContent />;
};

export default SimpleVsMaterialReact;
