"use client";

import { usePathname } from "next/navigation";
import OtherFrameworksCallout from "@/components/OtherFrameworksCallout";
import {
  getBlogPostBySlug,
  getPostFrameworkId,
  shouldShowOtherFrameworksCallout,
} from "@/constants/blogPosts";
import { FRAMEWORK_HUB_PILLAR_BLOG_SLUG } from "@/constants/frameworkPillarBlogs";
import {
  buildBreadcrumbListJsonLd,
  buildTechArticleJsonLd,
} from "@/utils/structuredData";

const PILLAR_SLUGS_WITH_OWN_JSONLD = new Set(
  Object.entries(FRAMEWORK_HUB_PILLAR_BLOG_SLUG)
    .filter(([id]) => id !== "react")
    .map(([, slug]) => slug)
);

export default function BlogSegmentChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const segment = pathname.replace(/^\/?blog\/?/, "").split("/")[0] ?? "";
  const showCallout = shouldShowOtherFrameworksCallout(segment);
  const frameworkId = getPostFrameworkId(segment);

  const post = segment ? getBlogPostBySlug(segment) : undefined;
  const shouldEmitJsonLd = !!post && !PILLAR_SLUGS_WITH_OWN_JSONLD.has(segment);
  const article = shouldEmitJsonLd
    ? buildTechArticleJsonLd({
        title: post.title,
        description: post.description,
        canonicalPath: `/blog/${post.slug}`,
        datePublished: post.createdAt,
        dateModified: post.updatedAt,
      })
    : null;
  const breadcrumbs = shouldEmitJsonLd
    ? buildBreadcrumbListJsonLd([
        { name: "Home", url: "/" },
        { name: "Blog", url: "/blog" },
        { name: post.title, url: `/blog/${post.slug}` },
      ])
    : null;

  return (
    <>
      {article ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
        />
      ) : null}
      {breadcrumbs ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
        />
      ) : null}
      {children}
      {showCallout ? (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <OtherFrameworksCallout currentFramework={frameworkId ?? "react"} />
        </div>
      ) : null}
    </>
  );
}
