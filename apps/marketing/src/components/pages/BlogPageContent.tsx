"use client";

import React, { useMemo, useState } from "react";
import { SearchOutlined, CalendarOutlined, TagOutlined } from "@ant-design/icons";
import Link from "next/link";
import {
  BLOG_POSTS,
  searchBlogPosts,
  BlogPostMetadata,
  getPostFrameworkId,
} from "@/constants/blogPosts";
import {
  FRAMEWORK_HUB_BY_ID,
  FRAMEWORK_HUB_IDS,
  type HubFrameworkId,
} from "@/constants/frameworkIntegrationHub";
import PageWrapper from "@/components/PageWrapper";

type FrameworkFilter = HubFrameworkId | "all";

function BlogCard({ post }: { post: BlogPostMetadata }) {
  return (
    <div className="h-full hover:shadow-md transition-shadow duration-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 cursor-pointer">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
            <CalendarOutlined />
            <span className="text-gray-500 dark:text-gray-400">
              {(() => {
                // Parse YYYY-MM-DD format correctly without timezone conversion
                const [year, month, day] = post.createdAt.split("-").map(Number);
                const date = new Date(year, month - 1, day); // month is 0-indexed
                return date.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });
              })()}
            </span>
          </div>

          <h3 className="mb-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
            {post.title}
          </h3>

          <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">{post.description}</p>

          <div className="flex flex-wrap gap-1">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded text-xs flex items-center gap-1"
              >
                <TagOutlined className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}

interface BlogPageContentProps {
  /** Optional framework to pre-filter on. Used by /blog/topic/[framework] landing pages. */
  initialFramework?: FrameworkFilter;
  /** Hide the framework filter chips. Used by per-framework landing pages where the filter is fixed. */
  hideFrameworkFilter?: boolean;
  /** Optional H1 override for landing pages. */
  heading?: string;
  /** Optional intro paragraph override. */
  intro?: string;
}

export default function BlogPageContent({
  initialFramework = "all",
  hideFrameworkFilter = false,
  heading,
  intro,
}: BlogPageContentProps = {}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [frameworkFilter, setFrameworkFilter] = useState<FrameworkFilter>(initialFramework);

  const sortedBlogPosts = useMemo(
    () =>
      [...BLOG_POSTS].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    []
  );

  const visiblePosts = useMemo<BlogPostMetadata[]>(() => {
    const trimmed = searchQuery.trim();
    const base = trimmed === "" ? sortedBlogPosts : searchBlogPosts(trimmed);
    const sortedBase = [...base].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    if (frameworkFilter === "all") return sortedBase;
    return sortedBase.filter((post) => getPostFrameworkId(post.slug) === frameworkFilter);
  }, [searchQuery, frameworkFilter, sortedBlogPosts]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <PageWrapper>
      <header className="text-center mb-12">
        <h1 className="text-gray-900 dark:text-gray-100 mb-4 text-4xl font-bold">
          {heading ?? "Simple Table Blog"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto mb-8">
          {intro ??
            "Tutorials and comparisons for React, Vue, Angular, Svelte, Solid, and vanilla TypeScript—with Simple Table across every stack."}
        </p>

        <div className="max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-3 pl-12 text-gray-900 dark:!text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg placeholder:text-gray-500 dark:placeholder:text-gray-400 dark:caret-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <SearchOutlined className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {!hideFrameworkFilter ? (
          <div
            className="mt-6 flex flex-wrap items-center justify-center gap-2"
            role="tablist"
            aria-label="Filter posts by framework"
          >
            {(["all", ...FRAMEWORK_HUB_IDS] as FrameworkFilter[]).map((id) => {
              const label =
                id === "all" ? "All frameworks" : FRAMEWORK_HUB_BY_ID[id as HubFrameworkId].label;
              const active = frameworkFilter === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFrameworkFilter(id)}
                  className={
                    active
                      ? "px-3 py-1.5 rounded-full text-sm font-medium bg-blue-600 text-white"
                      : "px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  }
                >
                  {label}
                </button>
              );
            })}
          </div>
        ) : null}
      </header>

      {(searchQuery || frameworkFilter !== "all") && (
        <div className="mb-8">
          <span className="text-gray-600 dark:text-gray-400">
            {visiblePosts.length > 0
              ? `Showing ${visiblePosts.length} post${visiblePosts.length === 1 ? "" : "s"}${
                  searchQuery ? ` matching "${searchQuery}"` : ""
                }${
                  frameworkFilter !== "all"
                    ? ` for ${FRAMEWORK_HUB_BY_ID[frameworkFilter as HubFrameworkId].label}`
                    : ""
                }`
              : `No posts found${searchQuery ? ` matching "${searchQuery}"` : ""}${
                  frameworkFilter !== "all"
                    ? ` for ${FRAMEWORK_HUB_BY_ID[frameworkFilter as HubFrameworkId].label}`
                    : ""
                }`}
          </span>
        </div>
      )}

      {visiblePosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {visiblePosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 mb-16">
          <h3 className="text-gray-500 dark:text-gray-400 mb-4 text-2xl font-semibold">
            No blog posts found
          </h3>
          <p className="text-gray-400 dark:text-gray-500">
            Try adjusting your search terms or browse all available posts.
          </p>
        </div>
      )}

      {/* All Tags Section */}
      <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-gray-900 dark:text-gray-100 mb-4 text-xl font-semibold">
          Browse by Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {Array.from(new Set(sortedBlogPosts.flatMap((post) => post.tags))).map((tag) => (
            <button
              key={tag}
              onClick={() => handleSearch(tag)}
              className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors flex items-center gap-1"
            >
              <TagOutlined className="w-3 h-3" />
              {tag}
            </button>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
