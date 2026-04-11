import React from "react";
import { Metadata } from "next";
import ChartColumnsContent from "@/components/pages/docs-pages/ChartColumnsContent";

export const metadata: Metadata = {
  title: "Chart Columns with Simple Table React Grid",
  description:
    "Visualize array data inline with chart columns in Simple Table. Add bar charts and line/area charts directly in your React data grid cells with smart copy/paste support.",
  keywords: [
    "simple-table",
    "react-table",
    "react-grid",
    "data-grid",
    "datagrid",
    "data table",
    "chart columns",
    "inline charts",
    "sparklines",
    "data visualization",
    "bar chart",
    "line chart",
    "typescript table",
  ],
  openGraph: {
    title: "Chart Columns with Simple Table React Grid",
    description:
      "Visualize array data inline with chart columns in Simple Table. Add bar charts and line/area charts directly in your React data grid cells.",
    type: "article",
  },
  alternates: {
    canonical: "/docs/chart-columns",
  },
};

export default function ChartColumnsPage() {
  return <ChartColumnsContent />;
}
