import type { ReactNode } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faBox } from "@fortawesome/free-solid-svg-icons";
import BlogLayout from "@/components/BlogLayout";
import type { BlogPostMetadata } from "@/constants/blogPosts";
import {
  FRAMEWORK_HUB_BY_ID,
  SIMPLE_TABLE_MULTI_FRAMEWORK_TAGLINE,
  type HubFrameworkId,
} from "@/constants/frameworkIntegrationHub";
import { getStackBlitzUrl } from "@/utils/getStackBlitzUrl";
import type { Framework } from "@/providers/FrameworkProvider";
import { buildTechArticleJsonLd } from "@/utils/structuredData";

type Props = {
  post: BlogPostMetadata;
  hubId: HubFrameworkId;
  children: ReactNode;
};

export default function PillarGuideLayout({ post, hubId, children }: Props) {
  const fw = FRAMEWORK_HUB_BY_ID[hubId];
  const jsonLd = buildTechArticleJsonLd({
    title: post.title,
    description: post.description,
    canonicalPath: `/blog/${post.slug}`,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
  });
  const stackBlitzUrl = getStackBlitzUrl("quick-start", hubId as Framework);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogLayout>
        <header className="mb-8 rounded-xl bg-linear-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 p-6 md:p-8">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {post.createdAt} · {fw.label} · Integration guide
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {post.title}
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl">{post.description}</p>
        </header>

        <article className="prose prose-gray dark:prose-invert max-w-none space-y-8">{children}</article>

        <section className="mt-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Continue on your stack
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{SIMPLE_TABLE_MULTI_FRAMEWORK_TAGLINE}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/frameworks/${hubId}`}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700"
            >
              <FontAwesomeIcon icon={faBook} />
              {fw.label} setup hub
            </Link>
            <a
              href={stackBlitzUrl}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-900/50"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faBox} />
              StackBlitz quick start
            </a>
            <Link
              href="/frameworks"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-900/50"
            >
              All adapters
            </Link>
          </div>
        </section>
      </BlogLayout>
    </>
  );
}
