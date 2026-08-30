"use client";

import React, { ReactNode } from "react";

interface PageLayoutProps {
  sidebar?: ReactNode;
  children: ReactNode;
  /**
   * When true, the content card uses `overflow-visible` instead of the default
   * `overflow-auto`. This lets `position: sticky` descendants (e.g. an external
   * scroll table header) escape up to the page scroller (`#main-scroll-container`)
   * rather than being captured by the card. It also adds `min-w-0` so the card
   * still clamps to the available width: unlike an `overflow-auto` flex item, an
   * `overflow-visible` one keeps `min-width: auto`, which would otherwise resolve
   * to a wide table's content min-width and balloon the card past the page.
   */
  overflowVisible?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ sidebar, children, overflowVisible }) => {
  return (
    <>
      <div className="relative z-10 site-shell">
        <div className="flex w-full flex-col md:flex-row justify-center gap-4 md:gap-6">
          {sidebar}

          <div
            className={`flex flex-col grow w-full min-w-0 ${overflowVisible ? "overflow-visible" : "overflow-auto"} bg-surface text-ink 
              rounded-lg my-2 sm:my-3 md:my-4 p-2 sm:p-3 md:p-4 min-h-[calc(100dvh-var(--header-height)-1.5rem)] 
              border border-line`}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default PageLayout;
