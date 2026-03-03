import { useEffect, RefObject } from "react";
import { syncScrollLeft } from "../utils/scrollSyncUtils";

/**
 * IMPORTANT: This hook is different from the ScrollSync context system!
 *
 * - ScrollSync (context-based): Syncs elements within the same group (e.g., all elements with group="default")
 *   Used for syncing body sections with sticky parents.
 *
 * - useHeaderBodyScrollSync (this hook): Direct 1-to-1 sync between specific pairs (header ↔ body)
 *   Used for syncing each header section with its corresponding body section.
 */

interface ScrollSyncConfig {
  sourceRef: RefObject<HTMLElement>;
  targetSelector: string;
}

/**
 * Hook to synchronize horizontal scroll between a source element and a target element
 * @param sourceRef - Ref to the element that will trigger scroll events
 * @param targetSelector - CSS selector to find the target element to sync with
 */
export const useScrollSync = (sourceRef: RefObject<HTMLElement>, targetSelector: string) => {
  useEffect(() => {
    const sourceElement = sourceRef.current;
    if (!sourceElement) return;

    const handleScroll = () => {
      // Find target element by traversing up to find common container, then query down
      const targetElement = sourceElement.parentElement?.parentElement?.querySelector(
        targetSelector,
      ) as HTMLElement | null;

      if (targetElement) {
        syncScrollLeft(sourceElement, targetElement);
      }
    };

    sourceElement.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      sourceElement.removeEventListener("scroll", handleScroll);
    };
  }, [sourceRef, targetSelector]);
};

/**
 * Hook to set up bidirectional scroll sync for multiple header-body section pairs
 * This creates direct 1-to-1 sync relationships between specific elements.
 * Also triggers header cell re-rendering for virtual scrolling if render function is available.
 *
 * Example: Syncing header sections with their corresponding body sections
 * @param configs - Array of scroll sync configurations
 */
export const useMultiScrollSync = (configs: ScrollSyncConfig[]) => {
  useEffect(() => {
    const handlers = new Map<HTMLElement, () => void>();
    const rafIds = new Map<HTMLElement, number>();
    const pendingScrolls = new Map<HTMLElement, number>();

    configs.forEach(({ sourceRef, targetSelector }) => {
      const sourceElement = sourceRef.current;
      if (!sourceElement) return;

      const handleScroll = () => {
        const scrollLeft = sourceElement.scrollLeft;
        pendingScrolls.set(sourceElement, scrollLeft);

        // If already scheduled, skip
        if (rafIds.has(sourceElement)) return;

        // Schedule RAF for this element
        const rafId = requestAnimationFrame(() => {
          const latestScrollLeft = pendingScrolls.get(sourceElement);
          if (latestScrollLeft === undefined) return;

          // Check if render functions exist (for virtual scrolling)
          const headerRenderFn = (sourceElement as any).__renderHeaderCells;
          const bodyRenderFn = (sourceElement as any).__renderBodyCells;
          const hasRenderFunctions = typeof headerRenderFn === "function" || typeof bodyRenderFn === "function";

          // Only sync scrollLeft if there are NO render functions
          // Render functions handle positioning themselves and don't need scroll sync
          if (!hasRenderFunctions) {
            const targetElement = sourceElement.parentElement?.parentElement?.querySelector(
              targetSelector,
            ) as HTMLElement | null;

            if (targetElement) {
              syncScrollLeft(sourceElement, targetElement);
            }
          }

          // Call render functions if they exist - they handle their own positioning
          if (typeof headerRenderFn === "function") {
            headerRenderFn(latestScrollLeft);
          }

          if (typeof bodyRenderFn === "function") {
            bodyRenderFn(latestScrollLeft);
          }

          // Clean up
          rafIds.delete(sourceElement);
          pendingScrolls.delete(sourceElement);
        });

        rafIds.set(sourceElement, rafId);
      };

      sourceElement.addEventListener("scroll", handleScroll, { passive: true });
      handlers.set(sourceElement, handleScroll);
    });

    return () => {
      // Cancel any pending RAF callbacks
      rafIds.forEach((rafId) => cancelAnimationFrame(rafId));
      rafIds.clear();
      pendingScrolls.clear();

      handlers.forEach((handler, element) => {
        element.removeEventListener("scroll", handler);
      });
    };
  }, [configs]);
};
