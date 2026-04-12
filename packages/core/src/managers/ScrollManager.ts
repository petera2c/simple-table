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

/**
 * Manages vertical scroll state (scrollTop, direction, isScrolling) and infinite scroll.
 * Horizontal header/body/scrollbar sync is handled by SectionScrollController.
 */
export class ScrollManager {
  private config: ScrollManagerConfig;
  private state: ScrollManagerState;
  private subscribers: Set<StateChangeCallback> = new Set();
  private lastScrollTop: number = 0;
  private scrollTimeoutId: number | null = null;
  /** Coalesce scroll-driven subscriber notifications to one rAF (avoids sync storms + reflow). */
  private notifySubscribersRafId: number | null = null;

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
    if (this.subscribers.size === 0) return;
    this.subscribers.forEach((cb) => cb(this.state));
  }

  private scheduleNotifySubscribersFromScroll(): void {
    if (this.subscribers.size === 0) return;
    if (this.notifySubscribersRafId !== null) return;
    this.notifySubscribersRafId = requestAnimationFrame(() => {
      this.notifySubscribersRafId = null;
      this.notifySubscribers();
    });
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
      this.scheduleNotifySubscribersFromScroll();
    }, 150);

    if (this.config.onLoadMore && this.config.infiniteScrollThreshold) {
      const distanceFromBottom = contentHeight - (scrollTop + containerHeight);
      if (distanceFromBottom < this.config.infiniteScrollThreshold) {
        this.config.onLoadMore();
      }
    }

    this.scheduleNotifySubscribersFromScroll();
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
    if (this.scrollTimeoutId !== null) {
      clearTimeout(this.scrollTimeoutId);
      this.scrollTimeoutId = null;
    }
    if (this.notifySubscribersRafId !== null) {
      cancelAnimationFrame(this.notifySubscribersRafId);
      this.notifySubscribersRafId = null;
    }
    this.subscribers.clear();
  }
}
