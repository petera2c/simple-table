import { useEffect, RefObject } from "react";
import { ScrollManager } from "../managers/ScrollManager";

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
 * Hook to set up bidirectional scroll sync for multiple header-body section pairs.
 * This is a thin React wrapper around ScrollManager.setupScrollSync().
 * 
 * @param configs - Array of scroll sync configurations with React refs
 */
export const useMultiScrollSync = (configs: ScrollSyncConfig[]) => {
  useEffect(() => {
    const scrollManager = new ScrollManager({});
    
    const elementConfigs = configs
      .map(({ sourceRef, targetSelector }) => ({
        sourceElement: sourceRef.current,
        targetSelector,
      }))
      .filter((config) => config.sourceElement !== null) as Array<{
        sourceElement: HTMLElement;
        targetSelector: string;
      }>;

    if (elementConfigs.length > 0) {
      scrollManager.setupScrollSync(elementConfigs);
    }

    return () => {
      scrollManager.destroy();
    };
  }, [configs]);
};
