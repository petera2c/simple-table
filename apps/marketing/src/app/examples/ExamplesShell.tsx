"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import { ExamplesProvider } from "@/providers/ExamplesProvider";

/**
 * Client shell for the examples layout. Only the crypto example uses page-level
 * (external) scroll, which requires the content card to be `overflow-visible` so
 * its sticky header can escape up to `#main-scroll-container`. Because an
 * `overflow-visible` flex item does not get the scroll-container's automatic
 * `min-width: 0`, the card is also flagged so PageLayout can apply `min-w-0`
 * explicitly — otherwise its `min-width: auto` resolves to the table's content
 * min-width and the wide table balloons the card past the page width. With
 * `min-w-0` the card clamps to the page width and the table scrolls horizontally
 * via its own internal section scroll, while the sticky header still escapes
 * vertically to the page scroller.
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
