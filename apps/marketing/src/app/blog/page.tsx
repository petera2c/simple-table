import React from "react";
import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import BlogLayout from "@/components/BlogLayout";
import BlogPageContent from "@/components/pages/BlogPageContent";

export const metadata: Metadata = {
  title: SEO_STRINGS.blog.title,
  description: SEO_STRINGS.blog.description,
  keywords: SEO_STRINGS.blog.keywords,
  openGraph: {
    title: SEO_STRINGS.blog.title,
    description: SEO_STRINGS.blog.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blog.title,
    description: SEO_STRINGS.blog.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  return (
    <BlogLayout width="wide">
      <BlogPageContent />
    </BlogLayout>
  );
}
