import type { Metadata } from "next";
import { notFound } from "next/navigation";

// This page is temporarily hidden. The content lives in
// `@/components/pages/docs-pages/ColumnEditingContent` and can be restored by
// rendering it here again and re-adding the route to docsNavigation, the search
// index, and the sitemap.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const ColumnEditingPage = () => {
  notFound();
};

export default ColumnEditingPage;
