import type { Metadata } from "next";
import ProgrammaticControlContent from "@/components/pages/docs-pages/ProgrammaticControlContent";

export const metadata: Metadata = {
  title: "Programmatic Control API - SimpleTable React Component",
  description:
    "Complete guide to programmatic control of SimpleTable. Learn to manage sorting, filtering, and data access via tableRef API. Control your React data grid programmatically with TypeScript support.",
  keywords: [
    "simple-table",
    "@simple-table/react",
    "react table",
    "programmatic control",
    "table api",
    "tableRef",
    "sort api",
    "filter api",
    "data access",
    "react grid api",
    "table state management",
    "typescript table",
  ],
  openGraph: {
    title: "Programmatic Control API - SimpleTable",
    description:
      "Master programmatic control of your React table with sort, filter, and data access APIs",
    type: "article",
  },
};

export default function ProgrammaticControlPage() {
  return <ProgrammaticControlContent />;
}
