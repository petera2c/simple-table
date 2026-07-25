"use client";

import { usePathname } from "next/navigation";
import { getDocSeoEntry } from "@/constants/docsSeo";
import {
  buildBreadcrumbListJsonLd,
  buildTechArticleJsonLd,
} from "@/utils/structuredData";

export default function DocsJsonLd() {
  const pathname = usePathname();
  const slug = pathname.replace(/^\/?docs\/?/, "").split("/")[0] ?? "";
  if (!slug) return null;

  const entry = getDocSeoEntry(slug);
  if (!entry) return null;

  const today = new Date().toISOString().slice(0, 10);
  const article = buildTechArticleJsonLd({
    title: entry.title,
    description: entry.description,
    canonicalPath: `/docs/${slug}`,
    datePublished: "2025-01-01",
    dateModified: today,
  });
  const breadcrumbs = buildBreadcrumbListJsonLd([
    { name: "Home", url: "/" },
    { name: "Docs", url: "/docs/quick-start" },
    { name: entry.title, url: `/docs/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
    </>
  );
}
