import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { customizingReactTableLookPost } from "@/constants/blogPosts";
import BlogLayout from "@/components/BlogLayout";
import CustomizingReactTableThemesContent from "@/components/pages/CustomizingReactTableThemesContent";

export const metadata: Metadata = {
  title:
    SEO_STRINGS.blogPosts.customizingReactTableLook?.title || customizingReactTableLookPost.title,
  description:
    SEO_STRINGS.blogPosts.customizingReactTableLook?.description ||
    customizingReactTableLookPost.description,
  keywords:
    SEO_STRINGS.blogPosts.customizingReactTableLook?.keywords ||
    customizingReactTableLookPost.tags.join(", "),
  openGraph: {
    title:
      SEO_STRINGS.blogPosts.customizingReactTableLook?.title || customizingReactTableLookPost.title,
    description:
      SEO_STRINGS.blogPosts.customizingReactTableLook?.description ||
      customizingReactTableLookPost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title:
      SEO_STRINGS.blogPosts.customizingReactTableLook?.title || customizingReactTableLookPost.title,
    description:
      SEO_STRINGS.blogPosts.customizingReactTableLook?.description ||
      customizingReactTableLookPost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/customizing-react-table-look-simple-table-themes",
  },
};

export default function CustomizingReactTableLookPage() {
  return (
    <BlogLayout>
      <CustomizingReactTableThemesContent />
    </BlogLayout>
  );
}
