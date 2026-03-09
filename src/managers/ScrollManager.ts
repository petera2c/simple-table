import { syncScrollLeft } from "../utils/scrollSyncUtils";

export interface ScrollSyncConfig {
  sourceElement: HTMLElement;
  targetSelector: string;
}

export interface ScrollManagerConfig {
  onLoadMore?: () => void;
  infiniteScrollThreshold?: number;
}

export interface ScrollManagerState {
  scrollTop: number;
  scrollLeft: number;
  scrollDirection: "up" | "down" | "none";
  isScrolling: boolean;
}

type StateChangeCallback = (state: ScrollManagerState) => void;

export class ScrollManager {
  private config: ScrollManagerConfig;
  private state: ScrollManagerState;
  private subscribers: Set<StateChangeCallback> = new Set();
  private scrollSyncConfigs: ScrollSyncConfig[] = [];
  private scrollHandlers: Map<HTMLElement, () => void> = new Map();
  private rafIds: Map<HTMLElement, number> = new Map();
  private pendingScrolls: Map<HTMLElement, number> = new Map();
  private lastScrollTop: number = 0;
  private scrollTimeoutId: number | null = null;

  // Guard flag to prevent scroll event loop
  private isSyncing: boolean = false;

  constructor(config: ScrollManagerConfig) {
    this.config = config;

    this.state = {
      scrollTop: 0,
      scrollLeft: 0,
      scrollDirection: "none",
      isScrolling: false,
    };
  }

  updateConfig(config: Partial<ScrollManagerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  subscribe(callback: StateChangeCallback): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((cb) => cb(this.state));
  }

  setupScrollSync(configs: ScrollSyncConfig[]): void {
    this.cleanupScrollSync();
    this.scrollSyncConfigs = configs;

    configs.forEach(({ sourceElement, targetSelector }) => {
      if (!sourceElement) return;

      const handleScroll = () => {
        // Prevent recursive scroll syncing
        if (this.isSyncing) {
          return;
        }

        const scrollLeft = sourceElement.scrollLeft;
        this.pendingScrolls.set(sourceElement, scrollLeft);

        if (this.rafIds.has(sourceElement)) {
          return;
        }

        const rafId = requestAnimationFrame(() => {
          const latestScrollLeft = this.pendingScrolls.get(sourceElement);
          if (latestScrollLeft === undefined) return;

          const bodyRenderFn = (sourceElement as any).__renderBodyCells;

          // Find the target element (header section)
          const targetElement = sourceElement.parentElement?.parentElement?.querySelector(
            targetSelector,
          ) as HTMLElement | null;

          if (targetElement) {
            // Check if target has a render function
            const headerRenderFn = (targetElement as any).__renderHeaderCells;

            if (typeof headerRenderFn === "function") {
              // Use the render function for column virtualization
              headerRenderFn(latestScrollLeft);

              // Also update the target's scrollLeft property to keep it in sync
              // The render function only updates cell positions, not the scroll position itself
              if (targetElement.scrollLeft !== latestScrollLeft) {
                // Set syncing flag to prevent recursive scroll events
                this.isSyncing = true;
                targetElement.scrollLeft = latestScrollLeft;
                this.isSyncing = false;
              }
            } else {
              // Fallback to direct scroll sync
              this.isSyncing = true;
              syncScrollLeft(sourceElement, targetElement);
              this.isSyncing = false;
            }
          }

          // Update the source element's own cells if it has a render function
          if (typeof bodyRenderFn === "function") {
            bodyRenderFn(latestScrollLeft);
          }

          this.rafIds.delete(sourceElement);
          this.pendingScrolls.delete(sourceElement);
        });

        this.rafIds.set(sourceElement, rafId);
      };

      sourceElement.addEventListener("scroll", handleScroll, { passive: true });
      this.scrollHandlers.set(sourceElement, handleScroll);
    });
  }

  private cleanupScrollSync(): void {
    this.rafIds.forEach((rafId) => cancelAnimationFrame(rafId));
    this.rafIds.clear();
    this.pendingScrolls.clear();

    this.scrollHandlers.forEach((handler, element) => {
      element.removeEventListener("scroll", handler);
    });
    this.scrollHandlers.clear();
  }

  handleScroll(
    scrollTop: number,
    scrollLeft: number,
    containerHeight: number,
    contentHeight: number,
  ): void {
    const direction =
      scrollTop > this.lastScrollTop ? "down" : scrollTop < this.lastScrollTop ? "up" : "none";
    this.lastScrollTop = scrollTop;

    this.state = {
      scrollTop,
      scrollLeft,
      scrollDirection: direction,
      isScrolling: true,
    };

    if (this.scrollTimeoutId !== null) {
      clearTimeout(this.scrollTimeoutId);
    }

    this.scrollTimeoutId = window.setTimeout(() => {
      this.state = {
        ...this.state,
        isScrolling: false,
      };
      this.notifySubscribers();
    }, 150);

    if (this.config.onLoadMore && this.config.infiniteScrollThreshold) {
      const distanceFromBottom = contentHeight - (scrollTop + containerHeight);
      if (distanceFromBottom < this.config.infiniteScrollThreshold) {
        this.config.onLoadMore();
      }
    }

    this.notifySubscribers();
  }

  setScrolling(isScrolling: boolean): void {
    this.state = {
      ...this.state,
      isScrolling,
    };
    this.notifySubscribers();
  }

  getState(): ScrollManagerState {
    return this.state;
  }

  getScrollTop(): number {
    return this.state.scrollTop;
  }

  getScrollLeft(): number {
    return this.state.scrollLeft;
  }

  getScrollDirection(): "up" | "down" | "none" {
    return this.state.scrollDirection;
  }

  isScrolling(): boolean {
    return this.state.isScrolling;
  }

  destroy(): void {
    this.cleanupScrollSync();
    if (this.scrollTimeoutId !== null) {
      clearTimeout(this.scrollTimeoutId);
      this.scrollTimeoutId = null;
    }
    this.subscribers.clear();
  }
}
