import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import ThemeBuilderContent from "@/components/pages/ThemeBuilderContent";

export const metadata: Metadata = {
  title: SEO_STRINGS.themeBuilder.title,
  description: SEO_STRINGS.themeBuilder.description,
  keywords: SEO_STRINGS.themeBuilder.keywords,
  openGraph: {
    title: SEO_STRINGS.themeBuilder.title,
    description: SEO_STRINGS.themeBuilder.description,
    type: "website",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.themeBuilder.title,
    description: SEO_STRINGS.themeBuilder.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/theme-builder",
  },
};

export default function ThemeBuilderPage() {
  return <ThemeBuilderContent />;
}
