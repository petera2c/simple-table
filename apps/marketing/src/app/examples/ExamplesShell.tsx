"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import { ExamplesProvider } from "@/providers/ExamplesProvider";

/**
 * Client shell for the examples layout. Only the crypto example uses page-level
 * (external) scroll, which requires the content card to be `overflow-visible` so
 * its sticky header can escape up to `#main-scroll-container`. Every other
 * example relies on the card's default `overflow-auto` for horizontal
 * containment — without it, the flex card's `min-width: auto` resolves to the
 * table's content min-width, so the table balloons (music) or slowly grows as
 * its ResizeObserver chases the unbounded container (crm).
 */
export default function ExamplesShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const overflowVisible = pathname?.startsWith("/examples/crypto") ?? false;

  return (
    <PageLayout sidebar={null} overflowVisible={overflowVisible}>
      <Suspense fallback={<div />}>
        <ExamplesProvider>{children}</ExamplesProvider>
      </Suspense>
    </PageLayout>
  );
}
