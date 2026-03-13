import { useEffect, RefObject } from "react";
import { SectionScrollController } from "../managers/SectionScrollController";

/**
 * Sets up bidirectional scroll sync for header–body pairs using SectionScrollController.
 * Each pair stays in sync independently (scrolling one updates the other).
 *
 * For the main Simple Table (vanilla), scroll sync is handled by SectionScrollController
 * in the render pipeline. This hook is for React wrappers that render header/body
 * separately and need to sync specific pairs.
 */

export interface ScrollSyncConfig {
  sourceRef: RefObject<HTMLElement>;
  targetSelector: string;
}

/**
 * Hook to set up bidirectional scroll sync for multiple header-body section pairs.
 * Uses SectionScrollController so scrolling either element in a pair updates the other.
 *
 * @param configs - Array of { sourceRef, targetSelector }; target is resolved via sourceRef.current.parentElement?.parentElement?.querySelector(targetSelector)
 */
export const useMultiScrollSync = (configs: ScrollSyncConfig[]) => {
  useEffect(() => {
    const controllers: SectionScrollController[] = [];

    configs.forEach(({ sourceRef, targetSelector }) => {
      const source = sourceRef.current;
      if (!source) return;

      const target = source.parentElement?.parentElement?.querySelector(targetSelector) as
        | HTMLElement
        | null;
      if (!target) return;

      const controller = new SectionScrollController();
      controller.registerPane("main", source, "body");
      controller.registerPane("main", target, "header");
      controller.setSectionScrollLeft("main", source.scrollLeft);
      controller.restoreAll();
      controllers.push(controller);
    });

    return () => {
      controllers.forEach((c) => c.destroy());
    };
  }, [configs]);
};
