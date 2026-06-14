export type SectionId = "pinned-left" | "main" | "pinned-right";
export type SectionPaneRole = "sticky" | "scrollbar" | "header" | "body";

interface RegisteredPane {
  element: HTMLElement;
  role: SectionPaneRole;
}

export interface SectionScrollControllerConfig {
  /** Heavy body virtualization. Throttled to every {@link VIRTUALIZATION_THRESHOLD_PX}px. */
  onMainSectionScrollLeft?: (scrollLeft: number) => void;
}

/** Run column virtualization only when scroll has moved by at least this many px (reduces lag; scroll position still syncs every scroll). */
const VIRTUALIZATION_THRESHOLD_PX = 20;

/**
 * Single controller for horizontal scroll sync across all four panes per section:
 * sticky parent, horizontal scrollbar segment, header, and body.
 * Scrolling any one pane updates the other three in that section.
 * All four panes must have the same scroll width (enforced by renderers).
 */
export class SectionScrollController {
  private scrollLeftBySection: Record<SectionId, number> = {
    "pinned-left": 0,
    main: 0,
    "pinned-right": 0,
  };
  private panesBySection: Map<SectionId, Set<RegisteredPane>> = new Map([
    ["pinned-left", new Set<RegisteredPane>()],
    ["main", new Set<RegisteredPane>()],
    ["pinned-right", new Set<RegisteredPane>()],
  ]);
  private scrollHandlers: WeakMap<HTMLElement, () => void> = new WeakMap();
  /** Non-passive touchmove handlers on header panes that cancel iOS touch scrolling. */
  private headerTouchMoveHandlers: WeakMap<HTMLElement, (e: TouchEvent) => void> = new WeakMap();
  private config: SectionScrollControllerConfig;
  /** Guard to avoid re-entrancy when we programmatically set scrollLeft on other panes */
  private isSyncing = false;
  /** Last scrollLeft at which we ran main-section virtualization; used to run heavy ops only every N px. */
  private lastMainVirtualizationScrollLeft: number | null = null;
  /**
   * True while a touch-driven scroll (including post-release momentum) is in progress on a body
   * pane. While true, we must not write scrollLeft to scroll-container followers (the horizontal
   * scrollbar), because on iOS that cancels the body's inertial momentum. Such followers are
   * reconciled once scrolling settles.
   */
  private isTouchScrolling = false;
  /** Scroll-idle timer used to detect the end of a touch-driven scroll (incl. momentum). */
  private touchSettleTimeoutId: number | null = null;

  constructor(config: SectionScrollControllerConfig = {}) {
    this.config = config;
  }

  updateConfig(config: Partial<SectionScrollControllerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Register a pane (sticky, scrollbar, header, or body) for a section.
   * When any registered pane scrolls, the others in the same section are updated.
   * If a pane with the same role was already registered (e.g. after re-render), it is replaced.
   */
  registerPane(sectionId: SectionId, element: HTMLElement, role: SectionPaneRole): void {
    const panes = this.panesBySection.get(sectionId)!;
    const existingSameElement = Array.from(panes).find((p) => p.element === element);
    if (existingSameElement) return;

    const existingSameRole = Array.from(panes).find((p) => p.role === role);
    if (existingSameRole) {
      this.removeScrollListener(existingSameRole.element);
      panes.delete(existingSameRole);
    }

    panes.add({ element, role });

    // Header and sticky panes are pure followers: the user never scrolls them directly, so we
    // make them non-scroll-containers (overflow:hidden) and keep them synced via programmatic
    // scrollLeft. This is critical on iOS: setting scrollLeft on a *scroll container* during the
    // body's inertial (momentum) scroll cancels the momentum, but setting it on a non-scroll
    // container does not. Pure followers also get no scroll listener, which avoids the echo
    // scroll events (a programmatic scrollLeft write still fires a `scroll` event) being
    // re-processed as a fresh source and triggering redundant header virtualization (jitter).
    const isPureFollower = role === "header" || role === "sticky";
    if (isPureFollower) {
      element.style.overflowX = "hidden";
    }
    // Sticky is a pure follower (never user-scrolled), so it gets no scroll listener. Header, body
    // and scrollbar can all be scroll sources (e.g. wheel/trackpad over the header still scrolls an
    // overflow:hidden element on desktop), so they listen and propagate to the rest of the section.
    if (role !== "sticky") {
      this.addScrollListener(sectionId, element, role);
      if (role === "body") {
        this.addTouchTracking(sectionId, element);
      }
    }
    // Completely disable touch scrolling on the header (mobile). iOS still scrolls overflow:hidden
    // elements by touch and does not honor `touch-action` on a scroll container, so the reliable fix
    // is to cancel the touch scroll via a non-passive `touchmove` preventDefault. This MUST be
    // attached AFTER addScrollListener() above, because addScrollListener begins by calling
    // removeScrollListener(element), which also strips this touchmove handler — attaching first would
    // immediately remove it. Desktop wheel is unaffected (it does not dispatch touch events), so the
    // header still scrolls and syncs the body on desktop; the header is not a scroll surface on mobile.
    if (role === "header") {
      element.style.touchAction = "none";
      const preventTouchScroll = (e: TouchEvent) => e.preventDefault();
      this.headerTouchMoveHandlers.set(element, preventTouchScroll);
      element.addEventListener("touchmove", preventTouchScroll, { passive: false });
    }

    // Sync new pane to current section scroll position (e.g. when scrollbar is created after header/body)
    const current = this.scrollLeftBySection[sectionId] ?? 0;
    if (element.scrollLeft !== current) {
      this.isSyncing = true;
      element.scrollLeft = current;
      this.isSyncing = false;
    }
  }

  /**
   * Unregister a pane (e.g. when section is removed or re-created).
   */
  unregisterPane(sectionId: SectionId, element: HTMLElement): void {
    const panes = this.panesBySection.get(sectionId);
    if (!panes) return;

    this.removeScrollListener(element);
    const toRemove = Array.from(panes).find((p) => p.element === element);
    if (toRemove) panes.delete(toRemove);
  }

  /**
   * Unregister all panes for a section (e.g. on cleanup).
   */
  unregisterSection(sectionId: SectionId): void {
    const panes = this.panesBySection.get(sectionId);
    if (!panes) return;

    panes.forEach(({ element }) => this.removeScrollListener(element));
    panes.clear();
  }

  /**
   * Set scroll position for a section. Updates state and all registered panes.
   * Used when a pane fires scroll and when restoring after render.
   */
  setSectionScrollLeft(sectionId: SectionId, value: number): void {
    this.scrollLeftBySection[sectionId] = value;
    const panes = this.panesBySection.get(sectionId);
    if (!panes) return;

    panes.forEach(({ element }) => {
      if (element.scrollLeft !== value) {
        element.scrollLeft = value;
      }
    });

    if (sectionId === "main" && this.config.onMainSectionScrollLeft) {
      this.lastMainVirtualizationScrollLeft = value;
      this.config.onMainSectionScrollLeft(value);
    }
  }

  getSectionScrollLeft(sectionId: SectionId): number {
    return this.scrollLeftBySection[sectionId] ?? 0;
  }

  /**
   * Restore scroll position to all registered panes from stored state (e.g. after render).
   */
  restoreAll(): void {
    (["pinned-left", "main", "pinned-right"] as SectionId[]).forEach((sectionId) => {
      const value = this.scrollLeftBySection[sectionId] ?? 0;
      this.isSyncing = true;
      this.setSectionScrollLeft(sectionId, value);
      this.isSyncing = false;
    });
  }

  private addScrollListener(
    sectionId: SectionId,
    element: HTMLElement,
    sourceRole: SectionPaneRole,
  ): void {
    this.removeScrollListener(element);
    const handler = () => {
      if (this.isSyncing) return;
      // During a touch-driven body scroll (and its momentum), only the body may act as the scroll
      // source. Ignore scroll events from other panes — notably the header's echo event produced by
      // our own programmatic scrollLeft sync — because propagating them would write the body's
      // scrollLeft and cancel iOS inertial momentum.
      if (this.isTouchScrolling && sourceRole !== "body") return;

      const value = element.scrollLeft;
      this.scrollLeftBySection[sectionId] = value;
      this.isSyncing = true;

      const panes = this.panesBySection.get(sectionId);
      if (panes) {
        panes.forEach(({ element: paneEl, role }) => {
          if (paneEl === element || paneEl.scrollLeft === value) return;
          // The horizontal scrollbar is a scroll container; writing its scrollLeft during a
          // touch-driven body scroll cancels iOS momentum. Skip it while touch-scrolling; it is
          // reconciled when scrolling settles. Header/sticky are non-scroll-containers (safe), and
          // body is only a follower on desktop (no momentum to break).
          if (role === "scrollbar" && this.isTouchScrolling) return;
          paneEl.scrollLeft = value;
        });
      }

      if (this.isTouchScrolling) this.scheduleTouchSettle(sectionId);

      // Virtualization (main section only): run only every N px so scroll position sync paints without being blocked
      if (
        sectionId === "main" &&
        this.config.onMainSectionScrollLeft &&
        (this.lastMainVirtualizationScrollLeft === null ||
          Math.abs(value - this.lastMainVirtualizationScrollLeft) >= VIRTUALIZATION_THRESHOLD_PX)
      ) {
        this.lastMainVirtualizationScrollLeft = value;
        this.config.onMainSectionScrollLeft(value);
      }

      this.isSyncing = false;
    };
    this.scrollHandlers.set(element, handler);
    element.addEventListener("scroll", handler, { passive: true });
  }

  /**
   * Track touch-driven scrolling on a body pane. While a touch (and its post-release momentum) is
   * active, scroll-container followers (the horizontal scrollbar) are not written, to preserve iOS
   * momentum; they are reconciled when scrolling settles.
   */
  private addTouchTracking(sectionId: SectionId, element: HTMLElement): void {
    element.addEventListener(
      "touchstart",
      () => {
        this.isTouchScrolling = true;
        if (this.touchSettleTimeoutId !== null) {
          clearTimeout(this.touchSettleTimeoutId);
          this.touchSettleTimeoutId = null;
        }
      },
      { passive: true },
    );
    // Momentum may continue after release; arm the settle timer so scroll-container followers
    // reconcile even if no further scroll events arrive (e.g. a tap, or a drag with no fling).
    element.addEventListener("touchend", () => this.scheduleTouchSettle(sectionId), {
      passive: true,
    });
  }

  /**
   * (Re)arm the scroll-idle timer that marks the end of a touch-driven scroll. When it fires (no
   * scroll for the idle window, i.e. momentum has stopped), reconcile scroll-container followers
   * (the scrollbar) to the final position, which we deliberately skipped during the touch scroll.
   */
  private scheduleTouchSettle(sectionId: SectionId): void {
    if (this.touchSettleTimeoutId !== null) clearTimeout(this.touchSettleTimeoutId);
    this.touchSettleTimeoutId = window.setTimeout(() => {
      this.touchSettleTimeoutId = null;
      this.isTouchScrolling = false;
      const value = this.scrollLeftBySection[sectionId] ?? 0;
      const panes = this.panesBySection.get(sectionId);
      if (!panes) return;
      this.isSyncing = true;
      panes.forEach(({ element: paneEl, role }) => {
        if (role === "scrollbar" && paneEl.scrollLeft !== value) {
          paneEl.scrollLeft = value;
        }
      });
      this.isSyncing = false;
    }, 100);
  }

  private removeScrollListener(element: HTMLElement): void {
    const handler = this.scrollHandlers.get(element);
    if (handler) {
      element.removeEventListener("scroll", handler);
      this.scrollHandlers.delete(element);
    }
    const touchMoveHandler = this.headerTouchMoveHandlers.get(element);
    if (touchMoveHandler) {
      element.removeEventListener("touchmove", touchMoveHandler);
      this.headerTouchMoveHandlers.delete(element);
    }
  }

  destroy(): void {
    if (this.touchSettleTimeoutId !== null) {
      clearTimeout(this.touchSettleTimeoutId);
      this.touchSettleTimeoutId = null;
    }
    (["pinned-left", "main", "pinned-right"] as SectionId[]).forEach((sectionId) =>
      this.unregisterSection(sectionId),
    );
  }
}
