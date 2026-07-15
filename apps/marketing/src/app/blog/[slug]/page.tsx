import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import BlogLayout from "@/components/BlogLayout";
import { BLOG_POSTS } from "@/constants/blogPosts";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { getSoroArticleBySlug, getSoroArticleSlugs } from "@/lib/soroArticles";
import {
  buildBreadcrumbListJsonLd,
  buildTechArticleJsonLd,
} from "@/utils/structuredData";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/** Static blog folders and nested routes that must not be claimed by this catch-all. */
const RESERVED_BLOG_SLUGS = new Set([
  "topic",
  ...BLOG_POSTS.map((post) => post.slug),
]);

export function generateStaticParams() {
  return getSoroArticleSlugs()
    .filter((slug) => !RESERVED_BLOG_SLUGS.has(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (RESERVED_BLOG_SLUGS.has(slug)) {
    return { title: "Article not found" };
  }
  const article = getSoroArticleBySlug(slug);
  if (!article) {
    return { title: "Article not found" };
  }

  const ogImage = article.featuredImage?.url
    ? { url: article.featuredImage.url }
    : SEO_STRINGS.site.ogImage;

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      images: [ogImage],
      siteName: SEO_STRINGS.site.name,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      creator: SEO_STRINGS.site.creator,
      images:
        typeof ogImage === "object" && "url" in ogImage ? ogImage.url : ogImage,
    },
    alternates: {
      canonical: `/blog/${article.slug}`,
    },
  };
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function SoroBlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  if (RESERVED_BLOG_SLUGS.has(slug)) notFound();

  const article = getSoroArticleBySlug(slug);
  if (!article) notFound();

  const jsonLd = buildTechArticleJsonLd({
    title: article.title,
    description: article.description,
    canonicalPath: `/blog/${article.slug}`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
  });
  const breadcrumbs = buildBreadcrumbListJsonLd([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: article.title, url: `/blog/${article.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <BlogLayout>
        <article className="space-y-6">
          <header className="space-y-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <Link href="/blog" className="hover:underline">
                Blog
              </Link>
              <span className="mx-2">/</span>
              {formatDate(article.publishedAt)}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {article.title}
            </h1>
            {article.description ? (
              <p className="text-lg text-gray-600 dark:text-gray-300">{article.description}</p>
            ) : null}
          </header>

          {article.featuredImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.featuredImage.url}
              alt=""
              className="w-full rounded-lg object-cover max-h-[420px]"
            />
          ) : null}

          <div
            className="article-body space-y-4 text-gray-800 dark:text-gray-200 leading-relaxed [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-gray-900 [&_h2]:dark:text-white [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-gray-900 [&_h3]:dark:text-white [&_p]:mb-4 [&_a]:text-blue-600 [&_a]:dark:text-blue-400 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1 [&_code]:text-sm [&_code]:bg-gray-100 [&_code]:dark:bg-gray-800 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded"
            dangerouslySetInnerHTML={{ __html: article.contentHtml }}
          />
        </article>
      </BlogLayout>
    </>
  );
}
