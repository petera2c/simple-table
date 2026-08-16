import type { DimensionManager } from "./DimensionManager";
import {
  getExternalScrollMetrics,
  getParentViewportHeight,
  resolveScrollParent,
  type ExternalScrollMetrics,
  type ResolvedScrollParent,
  type ScrollParentValue,
} from "../utils/externalScroll";

const EXTERNAL_SCROLL_MAX_RETRIES = 60;

export interface ExternalScrollHost {
  getScrollParent(): ScrollParentValue;
  getHeight(): string | number | undefined | null;
  getMaxHeight(): string | number | undefined | null;
  getBodyContainer(): HTMLElement | null;
  getRootElement(): HTMLElement | null;
  getFallbackRoot(): HTMLElement;
  isMounted(): boolean;
  getDimensionManager(): DimensionManager | null;
  onInternalScroll(e: Event): void;
  onExternalScroll(metrics: ExternalScrollMetrics): void;
  onExternalResize(): void;
}

/**
 * Owns which element is the vertical scroller: the table body (internal) or a
 * consumer `scrollParent` (external / window). Also tracks the visible
 * viewport height used for virtualization in external mode.
 */
export class ExternalScrollController {
  private host: ExternalScrollHost;
  private resolvedScrollParent: ResolvedScrollParent = null;
  private externalScrollListener: ((e: Event) => void) | null = null;
  private externalWindowResizeListener: (() => void) | null = null;
  private externalParentResizeObserver: ResizeObserver | null = null;
  private externalViewportHeight: number = 0;
  private externalScrollRetryRaf: number | null = null;
  private externalScrollRetryCount: number = 0;
  private bodyScrollListenerAttached: boolean = false;
  private bodyContainerScrollListener: ((e: Event) => void) | null = null;
  /**
   * When external scroll mode is active we briefly take control of the scroll
   * parent's `overscroll-behavior-y` to neutralize the browser's rubber-band /
   * scroll-chaining at the boundaries. Without this, pulling past the top or
   * bottom of the scroll parent visually translates the entire scroll content
   * layer (including the CSS-sticky header), causing the header to "disappear"
   * during overscroll bounces even though its layout position is unchanged.
   */
  private overscrollBehaviorTarget: HTMLElement | null = null;
  private overscrollBehaviorPrev: string = "";

  constructor(host: ExternalScrollHost) {
    this.host = host;
  }

  getResolvedParent(): ResolvedScrollParent {
    return this.resolvedScrollParent;
  }

  getViewportHeight(): number {
    return this.externalViewportHeight;
  }

  setViewportHeight(next: number): void {
    if (next === this.externalViewportHeight) return;
    this.externalViewportHeight = next;
    this.host.getDimensionManager()?.updateConfig({ externalViewportHeight: next });
  }

  /**
   * Reconciles which element owns the vertical scroll listener based on the
   * current `scrollParent` config. Idempotent — safe to call repeatedly.
   */
  sync(): void {
    const bodyContainer = this.host.getBodyContainer();
    if (!bodyContainer) return;

    const height = this.host.getHeight();
    const maxHeight = this.host.getMaxHeight();
    const noHeight = height === undefined || height === null || height === "";
    const noMaxHeight = maxHeight === undefined || maxHeight === null || maxHeight === "";
    const scrollParent = this.host.getScrollParent();
    const wantsExternal = scrollParent != null && noHeight && noMaxHeight;

    const nextParent: ResolvedScrollParent = wantsExternal
      ? resolveScrollParent(scrollParent)
      : null;

    if (nextParent !== this.resolvedScrollParent) {
      this.detachExternalWiring();
    }

    if (nextParent) {
      this.externalScrollRetryCount = 0;
      this.attachExternalWiring(nextParent);
      this.ensureBodyScrollListenerDetached(bodyContainer);
      this.recomputeViewportHeight();
    } else if (wantsExternal) {
      // External scroll requested but the parent isn't resolvable yet. Seed a
      // provisional viewport (the window height) so virtualization stays ON in
      // the meantime — otherwise `contentHeight` is undefined and EVERY row
      // renders at once. Then retry resolving the real parent on subsequent
      // frames.
      this.ensureBodyScrollListenerDetached(bodyContainer);
      const provisional = typeof window !== "undefined" ? window.innerHeight : 0;
      if (provisional > 0 && this.externalViewportHeight !== provisional) {
        this.setViewportHeight(provisional);
      }
      this.scheduleParentRetry();
    } else {
      this.externalScrollRetryCount = 0;
      this.ensureBodyScrollListenerAttached(bodyContainer);
      if (this.externalViewportHeight !== 0) {
        this.externalViewportHeight = 0;
        this.host.getDimensionManager()?.updateConfig({ externalViewportHeight: undefined });
      }
    }
  }

  recomputeViewportHeight(): void {
    if (!this.resolvedScrollParent) return;
    const tableRoot = this.host.getRootElement() ?? this.host.getFallbackRoot();
    const metrics = getExternalScrollMetrics(this.resolvedScrollParent, tableRoot);
    if (!metrics) return;
    let next = metrics.visibleViewportHeight;
    // Before the first render the table has no laid-out height, so the
    // table∩viewport intersection is 0. Feeding 0 disables virtualization.
    if (next <= 0) {
      next = getParentViewportHeight(this.resolvedScrollParent);
    }
    if (next <= 0 || next === this.externalViewportHeight) return;
    this.setViewportHeight(next);
  }

  getVerticalScrollMetrics(): {
    clientHeight: number;
    scrollHeight: number;
    scrollTop: number;
  } | null {
    if (!this.resolvedScrollParent) return null;
    const tableRoot = this.host.getRootElement() ?? this.host.getFallbackRoot();
    const metrics = getExternalScrollMetrics(this.resolvedScrollParent, tableRoot);
    if (!metrics || metrics.visibleViewportHeight <= 0 || metrics.tableTotalHeight <= 0) {
      return null;
    }
    return {
      clientHeight: metrics.visibleViewportHeight,
      scrollHeight: metrics.tableTotalHeight,
      scrollTop: metrics.relativeScrollTop,
    };
  }

  destroy(): void {
    if (this.externalScrollRetryRaf !== null) {
      cancelAnimationFrame(this.externalScrollRetryRaf);
      this.externalScrollRetryRaf = null;
    }
    this.detachExternalWiring();
    const bodyContainer = this.host.getBodyContainer();
    if (bodyContainer) {
      this.ensureBodyScrollListenerDetached(bodyContainer);
    }
  }

  private scheduleParentRetry(): void {
    if (this.externalScrollRetryRaf !== null) return;
    if (this.externalScrollRetryCount >= EXTERNAL_SCROLL_MAX_RETRIES) return;
    if (typeof requestAnimationFrame === "undefined") return;
    this.externalScrollRetryRaf = requestAnimationFrame(() => {
      this.externalScrollRetryRaf = null;
      if (!this.host.isMounted()) return;
      this.externalScrollRetryCount++;
      this.sync();
    });
  }

  private ensureBodyScrollListenerAttached(bodyContainer: HTMLElement): void {
    if (this.bodyScrollListenerAttached) return;
    this.bodyContainerScrollListener = (e: Event) => this.host.onInternalScroll(e);
    bodyContainer.addEventListener("scroll", this.bodyContainerScrollListener);
    this.bodyScrollListenerAttached = true;
  }

  private ensureBodyScrollListenerDetached(bodyContainer: HTMLElement): void {
    if (!this.bodyScrollListenerAttached) return;
    if (this.bodyContainerScrollListener) {
      bodyContainer.removeEventListener("scroll", this.bodyContainerScrollListener);
      this.bodyContainerScrollListener = null;
    }
    this.bodyScrollListenerAttached = false;
  }

  private attachExternalWiring(parent: ResolvedScrollParent): void {
    if (!parent) return;
    this.resolvedScrollParent = parent;

    const handler = (e: Event) => this.handleExternalScroll(e);
    this.externalScrollListener = handler;
    parent.addEventListener("scroll", handler, { passive: true });

    if (typeof Window !== "undefined" && parent instanceof Window) {
      const resizeHandler = () => this.handleExternalResize();
      this.externalWindowResizeListener = resizeHandler;
      parent.addEventListener("resize", resizeHandler, { passive: true });
    } else if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => this.handleExternalResize());
      ro.observe(parent as HTMLElement);
      this.externalParentResizeObserver = ro;
    }

    this.recomputePaddingTop();
    this.applyOverscrollContainment(parent);
  }

  private detachExternalWiring(): void {
    const parent = this.resolvedScrollParent;
    if (parent && this.externalScrollListener) {
      parent.removeEventListener("scroll", this.externalScrollListener);
    }
    this.externalScrollListener = null;

    if (
      parent &&
      this.externalWindowResizeListener &&
      typeof Window !== "undefined" &&
      parent instanceof Window
    ) {
      parent.removeEventListener("resize", this.externalWindowResizeListener);
    }
    this.externalWindowResizeListener = null;

    if (this.externalParentResizeObserver) {
      this.externalParentResizeObserver.disconnect();
      this.externalParentResizeObserver = null;
    }

    this.resolvedScrollParent = null;

    const root = this.host.getRootElement();
    if (root) {
      root.style.removeProperty("--st-external-scroll-padding-top");
    }

    this.restoreOverscrollBehavior();
  }

  private applyOverscrollContainment(parent: ResolvedScrollParent): void {
    const target: HTMLElement | null =
      typeof Window !== "undefined" && parent instanceof Window
        ? typeof document !== "undefined"
          ? document.documentElement
          : null
        : (parent as HTMLElement | null);
    if (!target) return;
    this.overscrollBehaviorTarget = target;
    this.overscrollBehaviorPrev = target.style.overscrollBehaviorY;
    target.style.overscrollBehaviorY = "none";
  }

  private restoreOverscrollBehavior(): void {
    if (!this.overscrollBehaviorTarget) return;
    this.overscrollBehaviorTarget.style.overscrollBehaviorY = this.overscrollBehaviorPrev;
    this.overscrollBehaviorTarget = null;
    this.overscrollBehaviorPrev = "";
  }

  private recomputePaddingTop(): void {
    const root = this.host.getRootElement();
    if (!root) return;
    const parent = this.resolvedScrollParent;
    let paddingTop = 0;
    if (parent && typeof HTMLElement !== "undefined" && parent instanceof HTMLElement) {
      const cs = getComputedStyle(parent);
      paddingTop = parseFloat(cs.paddingTop) || 0;
    }
    root.style.setProperty("--st-external-scroll-padding-top", `${paddingTop}px`);
  }

  private handleExternalResize(): void {
    this.recomputeViewportHeight();
    this.recomputePaddingTop();
    this.host.onExternalResize();
  }

  private handleExternalScroll(_e: Event): void {
    const parent = this.resolvedScrollParent;
    if (!parent) return;
    const tableRoot = this.host.getRootElement() ?? this.host.getFallbackRoot();
    const metrics = getExternalScrollMetrics(parent, tableRoot);
    if (!metrics) return;
    this.host.onExternalScroll(metrics);
  }
}
