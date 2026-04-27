import type { Metadata } from "next";
import PageLayout from "@/components/PageLayout";
import { ExamplesProvider } from "@/providers/ExamplesProvider";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Data Grid Examples & Demos | Simple Table",
  description:
    "Explore real-world Simple Table examples and live demos across React, Vue, Angular, Svelte, Solid, and vanilla TypeScript. See CRM, HR, billing, manufacturing, infrastructure, and music dashboards built with Simple Table.",
  keywords: [
    "simple table examples",
    "data grid examples",
    "data grid demos",
    "react data grid examples",
    "vue data grid examples",
    "angular data grid examples",
    "svelte data grid examples",
    "solid data grid examples",
    "vanilla js data grid examples",
    "typescript data grid demos",
    "table component examples",
    "datagrid showcase",
    "crm data grid",
    "hr dashboard table",
    "manufacturing dashboard grid",
    "infrastructure monitoring table",
    "billing data grid",
  ].join(", "),
  openGraph: {
    title: "Simple Table Examples & Demos",
    description:
      "See Simple Table in action with live, real-world examples for React, Vue, Angular, Svelte, Solid, and vanilla TypeScript.",
    url: "https://www.simple-table.com/examples",
    type: "website",
  },
  twitter: {
    title: "Simple Table Examples & Demos",
    description:
      "See Simple Table in action with live, real-world examples for React, Vue, Angular, Svelte, Solid, and vanilla TypeScript.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://www.simple-table.com/examples",
  },
};

export default function ExamplesLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageLayout sidebar={null}>
      <Suspense fallback={<div />}>
        <ExamplesProvider>{children}</ExamplesProvider>
      </Suspense>
    </PageLayout>
  );
}
