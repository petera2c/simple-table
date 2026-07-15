import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { SoroBlogEmbed } from "@/components/SoroBlogEmbed";

export const metadata: Metadata = {
  title: SEO_STRINGS.articles.title,
  description: SEO_STRINGS.articles.description,
  keywords: SEO_STRINGS.articles.keywords,
  openGraph: {
    title: SEO_STRINGS.articles.title,
    description: SEO_STRINGS.articles.description,
    type: "website",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.articles.title,
    description: SEO_STRINGS.articles.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/articles",
  },
};

export default function ArticlesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 my-4">
      <SoroBlogEmbed />
    </div>
  );
}
