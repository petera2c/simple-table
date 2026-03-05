// Vanilla JS scroll synchronization manager
// Replaces React Context-based ScrollSync system

import { syncScrollLeft, hasScrollableContent } from "./scrollSyncUtils";

class ScrollSyncManager {
  private panes: Record<string, HTMLElement[]> = {};
  private rafIds: WeakMap<HTMLElement, number> = new WeakMap();
  private scrollHandlers: WeakMap<HTMLElement, () => void> = new WeakMap();

  // Register an element for scroll synchronization
  registerPane(element: HTMLElement, groups: string[]): void {
    groups.forEach((group) => {
      if (!this.panes[group]) {
        this.panes[group] = [];
      }

      if (!this.panes[group].includes(element)) {
        // Sync initial scroll position from first pane in group
        if (this.panes[group].length > 0) {
          syncScrollLeft(this.panes[group][0], element);
        }
        this.panes[group].push(element);
      }
    });

    this.addScrollListener(element, groups);
  }

  // Unregister an element
  unregisterPane(element: HTMLElement, groups: string[]): void {
    groups.forEach((group) => {
      const index = this.panes[group]?.indexOf(element);
      if (index !== undefined && index !== -1) {
        this.removeScrollListener(element);
        this.panes[group].splice(index, 1);
      }
    });
  }

  // Add scroll listener to element
  private addScrollListener(element: HTMLElement, groups: string[]): void {
    // Remove existing listener if any
    this.removeScrollListener(element);

    const handleScroll = () => {
      // Cancel any pending RAF
      const existingRaf = this.rafIds.get(element);
      if (existingRaf) {
        cancelAnimationFrame(existingRaf);
      }

      // Schedule sync
      const rafId = requestAnimationFrame(() => {
        if (!hasScrollableContent(element)) {
          this.rafIds.delete(element);
          return;
        }

        groups.forEach((group) => {
          this.panes[group]?.forEach((pane) => {
            if (pane !== element) {
              this.removeScrollListener(pane);
              syncScrollLeft(element, pane);

              requestAnimationFrame(() => {
                const paneGroups = this.getGroupsForPane(pane);
                this.addScrollListener(pane, paneGroups);
              });
            }
          });
        });

        this.rafIds.delete(element);
      });

      this.rafIds.set(element, rafId);
    };

    // Store handler for cleanup
    this.scrollHandlers.set(element, handleScroll);
    element.addEventListener("scroll", handleScroll);
  }

  // Remove scroll listener
  private removeScrollListener(element: HTMLElement): void {
    const handler = this.scrollHandlers.get(element);
    if (handler) {
      element.removeEventListener("scroll", handler);
      this.scrollHandlers.delete(element);
    }

    const rafId = this.rafIds.get(element);
    if (rafId) {
      cancelAnimationFrame(rafId);
      this.rafIds.delete(element);
    }
  }

  // Get all groups an element belongs to
  private getGroupsForPane(element: HTMLElement): string[] {
    return Object.keys(this.panes).filter((group) => this.panes[group].includes(element));
  }

  // Cleanup all panes
  cleanup(): void {
    Object.values(this.panes)
      .flat()
      .forEach((element) => {
        this.removeScrollListener(element);
      });
    this.panes = {};
  }
}

// Create singleton instance
export const scrollSyncManager = new ScrollSyncManager();
