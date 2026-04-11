import ThemesContent from "@/components/pages/docs-pages/ThemesContent";
import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";

export const metadata: Metadata = {
  title: SEO_STRINGS.themes.title,
  description: SEO_STRINGS.themes.description,
  keywords: SEO_STRINGS.themes.keywords,
  openGraph: {
    title: SEO_STRINGS.themes.title,
    description: SEO_STRINGS.themes.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.themes.title,
    description: SEO_STRINGS.themes.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/themes",
  },
};

export default function ThemesPage() {
  return <ThemesContent />;
}
