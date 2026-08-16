import type { ScrollManager } from "./ScrollManager";

export type ScrollRenderSource = "scroll-raf" | "scroll-end";

export interface ScrollRenderCoalescerHost {
  getScrollManager(): ScrollManager | null;
  /** When true, pass container/content height into ScrollManager for infinite scroll. */
  shouldTrackInfiniteScroll(): boolean;
  onRender(source: ScrollRenderSource): void;
}

export interface ScrollFrameInput {
  scrollTop: number;
  scrollLeft: number;
  containerHeight: number;
  contentHeight: number;
  /** Runs inside the rAF after scrollTop and direction are stored. */
  afterApply?: () => void;
}

/**
 * Coalesces vertical scroll into one rAF render, then one full render after
 * scrolling stops. Shared by the table body scroller and an external scroll parent.
 */
export class ScrollRenderCoalescer {
  private host: ScrollRenderCoalescerHost;
  private scrollRafId: number | null = null;
  private scrollEndTimeoutId: number | null = null;
  private lastScrollTop = 0;

  isScrolling = false;
  scrollTop = 0;
  scrollDirection: "up" | "down" | "none" = "none";

  constructor(host: ScrollRenderCoalescerHost) {
    this.host = host;
  }

  schedule(frame: ScrollFrameInput): void {
    this.isScrolling = true;

    if (this.scrollEndTimeoutId !== null) {
      clearTimeout(this.scrollEndTimeoutId);
    }
    this.scrollEndTimeoutId = window.setTimeout(() => {
      this.isScrolling = false;
      this.scrollEndTimeoutId = null;
      requestAnimationFrame(() => {
        this.host.onRender("scroll-end");
      });
    }, 150);

    if (this.scrollRafId !== null) {
      cancelAnimationFrame(this.scrollRafId);
    }

    this.scrollRafId = requestAnimationFrame(() => {
      const direction: "up" | "down" | "none" =
        frame.scrollTop > this.lastScrollTop
          ? "down"
          : frame.scrollTop < this.lastScrollTop
            ? "up"
            : "none";

      this.scrollTop = frame.scrollTop;
      this.scrollDirection = direction;
      this.lastScrollTop = frame.scrollTop;

      frame.afterApply?.();

      const scrollManager = this.host.getScrollManager();
      if (scrollManager) {
        if (this.host.shouldTrackInfiniteScroll()) {
          scrollManager.handleScroll(
            frame.scrollTop,
            frame.scrollLeft,
            frame.containerHeight,
            frame.contentHeight,
          );
        } else {
          scrollManager.handleScroll(frame.scrollTop, frame.scrollLeft, 0, 0);
        }
      }

      this.host.onRender("scroll-raf");
      this.scrollRafId = null;
    });
  }

  destroy(): void {
    if (this.scrollRafId !== null) {
      cancelAnimationFrame(this.scrollRafId);
      this.scrollRafId = null;
    }
    if (this.scrollEndTimeoutId !== null) {
      clearTimeout(this.scrollEndTimeoutId);
      this.scrollEndTimeoutId = null;
    }
    this.isScrolling = false;
  }
}
