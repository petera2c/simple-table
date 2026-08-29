import type {
  HorizontalScrollEngineConfig,
  SectionId,
  SectionPaneRole,
  SectionScrollMetrics,
} from "./types";
import {
  capRubberX,
  clampScrollX,
  isAtRubberCap,
  maxScrollX,
  MAX_RUBBER_PX,
  normalizeWheelDelta,
  rubberBandX,
  stepFling,
  TOUCH_LOCK_PX,
  unboundedFromDisplayedX,
  LIVE_WHEEL_STRETCH_PX,
  LEFTOVER_DX_SLACK,
  LEFTOVER_IDLE_MS,
  WHEEL_SPRING_IDLE_MS,
} from "./physics";
import { ensureHorizontalScrollLayer } from "./scrollLayer";
import { bindHorizontalScrollEngine, unbindHorizontalScrollEngine } from "./lookup";

const VIRTUALIZATION_THRESHOLD_PX = 20;
const SECTION_IDS: SectionId[] = ["pinned-left", "main", "pinned-right"];

interface RegisteredPane {
  element: HTMLElement;
  role: SectionPaneRole;
  layer: HTMLElement | null;
  onWheel: (event: WheelEvent) => void;
  onTouchStart: (event: TouchEvent) => void;
  onTouchMove: (event: TouchEvent) => void;
  onTouchEnd: (event: TouchEvent) => void;
  onScroll: () => void;
}

interface TouchSession {
  sectionId: SectionId;
  lastX: number;
  lastY: number;
  lastTime: number;
  axis: "x" | "y" | null;
  unboundedX: number;
  samples: Array<{ t: number; x: number }>;
}

interface SectionState {
  x: number;
  velocity: number;
  contentWidth: number;
  viewportWidth: number;
  panes: Set<RegisteredPane>;
  lastWrittenBarX: number | null;
}

/**
 * Owns horizontal position for header, body, sticky strips, and the bottom bar.
 * Header/body/sticky slide with the same transform. The bottom bar is a native
 * scrollbar that reads and writes the same position.
 */
export class HorizontalScrollEngine {
  private config: HorizontalScrollEngineConfig;
  private root: HTMLElement | null = null;
  private sections: Record<SectionId, SectionState> = {
    "pinned-left": this.createSectionState(),
    main: this.createSectionState(),
    "pinned-right": this.createSectionState(),
  };
  private applying = false;
  private lastMainVirtualizationX: number | null = null;
  private flingRafId: number | null = null;
  private scrollbarRafId: number | null = null;
  private virtRafId: number | null = null;
  private lastFlingTime = 0;
  private touch: TouchSession | null = null;
  private pendingScrollbar = new Set<SectionId>();
  private wheelSpringTimer: number | null = null;
  private wheelSpringSection: SectionId | null = null;
  private leftoverDir: -1 | 0 | 1 = 0;
  private leftoverAbsDx = 0;
  private leftoverIdleTimer: number | null = null;

  constructor(config: HorizontalScrollEngineConfig = {}) {
    this.config = config;
  }

  updateConfig(config: Partial<HorizontalScrollEngineConfig>): void {
    this.config = { ...this.config, ...config };
  }

  bindRoot(root: HTMLElement): void {
    if (this.root && this.root !== root) {
      unbindHorizontalScrollEngine(this.root);
    }
    this.root = root;
    bindHorizontalScrollEngine(root, this);
  }

  registerPane(sectionId: SectionId, element: HTMLElement, role: SectionPaneRole): void {
    const state = this.sections[sectionId];
    const existingSameElement = Array.from(state.panes).find((p) => p.element === element);
    if (existingSameElement) {
      this.applyLayers(sectionId);
      return;
    }

    const existingSameRole = Array.from(state.panes).find((p) => p.role === role);
    if (existingSameRole) {
      this.detachPane(existingSameRole);
      state.panes.delete(existingSameRole);
    }

    const isFollower = role === "header" || role === "body" || role === "sticky";
    const layer = isFollower ? ensureHorizontalScrollLayer(element) : null;
    if (isFollower) {
      element.style.overflowX = "clip";
    }

    const pane: RegisteredPane = {
      element,
      role,
      layer,
      onWheel: (event) => this.handleWheel(sectionId, role, event),
      onTouchStart: (event) => this.handleTouchStart(sectionId, event),
      onTouchMove: (event) => this.handleTouchMove(sectionId, role, event),
      onTouchEnd: (event) => this.handleTouchEnd(sectionId, event),
      onScroll: () => this.handleScrollbarScroll(sectionId, element),
    };

    if (isFollower) {
      element.addEventListener("wheel", pane.onWheel, { passive: false });
      element.addEventListener("touchstart", pane.onTouchStart, { passive: true });
      element.addEventListener("touchmove", pane.onTouchMove, { passive: false });
      element.addEventListener("touchend", pane.onTouchEnd, { passive: true });
      element.addEventListener("touchcancel", pane.onTouchEnd, { passive: true });
    } else if (role === "scrollbar") {
      element.addEventListener("scroll", pane.onScroll, { passive: true });
    }

    state.panes.add(pane);
    this.applyLayers(sectionId);
    if (role === "scrollbar") this.writeScrollbars(sectionId);
  }

  unregisterPane(sectionId: SectionId, element: HTMLElement): void {
    const state = this.sections[sectionId];
    const pane = Array.from(state.panes).find((p) => p.element === element);
    if (!pane) return;
    this.detachPane(pane);
    state.panes.delete(pane);
  }

  unregisterSection(sectionId: SectionId): void {
    const state = this.sections[sectionId];
    state.panes.forEach((pane) => this.detachPane(pane));
    state.panes.clear();
  }

  setSectionMetrics(sectionId: SectionId, metrics: SectionScrollMetrics): void {
    const state = this.sections[sectionId];
    const contentWidth = Math.max(0, metrics.contentWidth);
    const viewportWidth = Math.max(0, metrics.viewportWidth);
    const unchanged =
      state.contentWidth === contentWidth && state.viewportWidth === viewportWidth;
    state.contentWidth = contentWidth;
    state.viewportWidth = viewportWidth;
    const maxX = this.getMaxX(sectionId);
    if (state.x > maxX || state.x < 0) {
      if (!unchanged) {
        state.x = clampScrollX(state.x, maxX);
        state.velocity = 0;
      } else if (state.x > maxX + MAX_RUBBER_PX) {
        state.x = maxX + MAX_RUBBER_PX;
        state.velocity = 0;
      } else if (state.x < -MAX_RUBBER_PX) {
        state.x = -MAX_RUBBER_PX;
        state.velocity = 0;
      } else {
        return;
      }
    } else if (unchanged) {
      return;
    }
    this.applyLayers(sectionId);
  }

  setSectionScrollLeft(sectionId: SectionId, value: number): void {
    this.stopFling();
    const maxX = this.getMaxX(sectionId);
    this.sections[sectionId].x = clampScrollX(value, maxX);
    this.sections[sectionId].velocity = 0;
    this.applyLayers(sectionId);
    this.writeScrollbars(sectionId);
    this.flushVirtualize(true);
  }

  getSectionScrollLeft(sectionId: SectionId): number {
    return this.sections[sectionId].x;
  }

  getMaxX(sectionId: SectionId): number {
    const state = this.sections[sectionId];
    let viewport = state.viewportWidth;
    if (viewport <= 0) {
      const pane = Array.from(state.panes).find((p) => p.role !== "scrollbar");
      viewport = pane?.element.clientWidth ?? 0;
    }
    return maxScrollX(state.contentWidth, viewport);
  }

  restoreAll(): void {
    SECTION_IDS.forEach((id) => {
      this.applyLayers(id);
      this.writeScrollbars(id);
    });
  }

  destroy(): void {
    this.stopFling();
    this.clearLeftover();
    this.stopScrollbarSync();
    this.stopVirtualize();
    this.touch = null;
    SECTION_IDS.forEach((id) => this.unregisterSection(id));
    if (this.root) {
      unbindHorizontalScrollEngine(this.root);
      this.root = null;
    }
  }

  private createSectionState(): SectionState {
    return {
      x: 0,
      velocity: 0,
      contentWidth: 0,
      viewportWidth: 0,
      panes: new Set(),
      lastWrittenBarX: null,
    };
  }

  private detachPane(pane: RegisteredPane): void {
    pane.element.removeEventListener("wheel", pane.onWheel);
    pane.element.removeEventListener("touchstart", pane.onTouchStart);
    pane.element.removeEventListener("touchmove", pane.onTouchMove);
    pane.element.removeEventListener("touchend", pane.onTouchEnd);
    pane.element.removeEventListener("touchcancel", pane.onTouchEnd);
    pane.element.removeEventListener("scroll", pane.onScroll);
  }

  /** Shift header/body/sticky layers to the current x. Does not touch the bottom bar. */
  private applyLayers(sectionId: SectionId): void {
    const state = this.sections[sectionId];
    const x = state.x;
    const transform = `translate3d(${-x}px, 0px, 0px)`;
    const xAttr = String(x);

    state.panes.forEach((pane) => {
      pane.element.dataset.stScrollX = xAttr;
      if (!pane.layer) return;
      if (pane.layer.style.transform !== transform) {
        pane.layer.style.transform = transform;
      }
      if (state.contentWidth > 0) {
        const width = `${state.contentWidth}px`;
        if (pane.layer.style.width !== width) {
          pane.layer.style.width = width;
        }
      }
    });
    if (sectionId === "main" && this.lastMainVirtualizationX === null) {
      this.lastMainVirtualizationX = x;
    }
  }

  private writeScrollbars(sectionId: SectionId): void {
    const state = this.sections[sectionId];
    const x = state.x;
    this.applying = true;
    state.panes.forEach((pane) => {
      if (pane.role !== "scrollbar") return;
      const barX = clampScrollX(x, this.getMaxX(sectionId));
      state.lastWrittenBarX = barX;
      if (pane.element.scrollLeft !== barX) {
        pane.element.scrollLeft = barX;
      }
    });
    this.applying = false;
  }

  private scheduleScrollbarSync(sectionId: SectionId): void {
    this.pendingScrollbar.add(sectionId);
    if (this.scrollbarRafId !== null) return;
    this.scrollbarRafId = requestAnimationFrame(() => {
      this.scrollbarRafId = null;
      this.pendingScrollbar.forEach((id) => this.writeScrollbars(id));
      this.pendingScrollbar.clear();
    });
  }

  private scheduleVirtualize(): void {
    if (this.virtRafId !== null) return;
    this.virtRafId = requestAnimationFrame(() => {
      this.virtRafId = null;
      this.flushVirtualize(false);
    });
  }

  private flushVirtualize(force: boolean): void {
    if (!this.config.onMainSectionScrollLeft) return;
    const x = this.sections.main.x;
    if (
      !force &&
      this.lastMainVirtualizationX !== null &&
      Math.abs(x - this.lastMainVirtualizationX) < VIRTUALIZATION_THRESHOLD_PX
    ) {
      return;
    }
    this.lastMainVirtualizationX = x;
    this.config.onMainSectionScrollLeft(x);
  }

  private applyFromInput(sectionId: SectionId): void {
    this.applyLayers(sectionId);
    this.scheduleScrollbarSync(sectionId);
    if (sectionId === "main") this.scheduleVirtualize();
  }

  private handleWheel(sectionId: SectionId, role: SectionPaneRole, event: WheelEvent): void {
    if (event.ctrlKey || event.metaKey) return;
    if (role === "scrollbar") return;

    const state = this.sections[sectionId];
    const maxX = this.getMaxX(sectionId);
    const { dx, dy } = normalizeWheelDelta(
      event.deltaX,
      event.deltaY,
      event.deltaMode,
      event.shiftKey,
      state.viewportWidth || 1,
    );

    if (Math.abs(dy) > Math.abs(dx) || dx === 0) {
      return;
    }
    if (maxX <= 0) return;

    const dir: -1 | 1 = dx < 0 ? -1 : 1;
    if (this.leftoverDir !== 0 && this.leftoverDir !== dir) this.clearLeftover();

    const overshooting = state.x < 0 || state.x > maxX;
    const pushingDeeper = (dx < 0 && state.x < 0) || (dx > 0 && state.x > maxX);
    const springing = this.flingRafId !== null;
    const atCap = isAtRubberCap(state.x, dx, maxX);
    const absDx = Math.abs(dx);
    const decayingLeftover =
      this.leftoverDir === dir &&
      absDx <= this.leftoverAbsDx + LEFTOVER_DX_SLACK &&
      ((dir < 0 && state.x === 0) || (dir > 0 && state.x === maxX));
    const ignoreLeftover =
      decayingLeftover ||
      (overshooting &&
        (springing || atCap || (pushingDeeper && absDx < LIVE_WHEEL_STRETCH_PX)));
    if (ignoreLeftover) {
      // Eat leftover ticks past the end without restarting the bounce timer.
      event.preventDefault();
      event.stopPropagation();
      this.rememberLeftover(dx);
      if (overshooting && !springing && this.wheelSpringTimer === null) {
        this.scheduleSpringBack(sectionId);
      }
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.stopFling();
    state.velocity = 0;
    const unbounded = unboundedFromDisplayedX(state.x, maxX) + dx;
    state.x = capRubberX(rubberBandX(unbounded, maxX), maxX);
    this.applyFromInput(sectionId);
    if (state.x < 0 || state.x > maxX) {
      this.rememberLeftover(dx);
      this.scheduleSpringBack(sectionId);
    }
  }

  private handleTouchStart(sectionId: SectionId, event: TouchEvent): void {
    const touch = event.touches[0];
    if (!touch) return;
    this.stopFling();
    this.sections[sectionId].velocity = 0;
    this.touch = {
      sectionId,
      lastX: touch.pageX,
      lastY: touch.pageY,
      lastTime: performance.now(),
      axis: null,
      unboundedX: this.sections[sectionId].x,
      samples: [{ t: performance.now(), x: this.sections[sectionId].x }],
    };
  }

  private handleTouchMove(sectionId: SectionId, role: SectionPaneRole, event: TouchEvent): void {
    const session = this.touch;
    const touch = event.touches[0];
    if (!session || session.sectionId !== sectionId || !touch) return;

    const dxFinger = touch.pageX - session.lastX;
    const dyFinger = touch.pageY - session.lastY;
    session.lastX = touch.pageX;
    session.lastY = touch.pageY;

    if (session.axis === null) {
      const absX = Math.abs(dxFinger);
      const absY = Math.abs(dyFinger);
      if (absX < TOUCH_LOCK_PX && absY < TOUCH_LOCK_PX) return;
      session.axis = absX >= absY ? "x" : "y";
    }

    if (session.axis === "y") {
      if (role === "header" || role === "sticky") {
        event.preventDefault();
      }
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const maxX = this.getMaxX(sectionId);
    session.unboundedX -= dxFinger;
    const next = capRubberX(rubberBandX(session.unboundedX, maxX), maxX);
    const now = performance.now();
    session.samples.push({ t: now, x: next });
    if (session.samples.length > 5) session.samples.shift();
    session.lastTime = now;
    this.sections[sectionId].x = next;
    this.applyFromInput(sectionId);
  }

  private handleTouchEnd(sectionId: SectionId, _event: TouchEvent): void {
    const session = this.touch;
    if (!session || session.sectionId !== sectionId) return;
    this.touch = null;

    if (session.axis === "y") return;

    const samples = session.samples;
    let velocity = 0;
    if (samples.length >= 2) {
      const newest = samples[samples.length - 1];
      const oldest = samples[0];
      const dt = newest.t - oldest.t;
      if (dt > 0) velocity = (newest.x - oldest.x) / dt;
    }
    this.sections[sectionId].velocity = velocity;
    this.startFling(sectionId);
  }

  private handleScrollbarScroll(sectionId: SectionId, element: HTMLElement): void {
    if (this.applying) return;
    const state = this.sections[sectionId];
    const reported = element.scrollLeft;
    const barMax = Math.max(0, element.scrollWidth - element.clientWidth);
    if (reported < state.x - 1 && barMax < state.x - 1) return;
    if (state.lastWrittenBarX != null && Math.abs(reported - state.lastWrittenBarX) < 1) {
      return;
    }
    this.stopFling();
    state.velocity = 0;
    state.x = reported;
    state.lastWrittenBarX = reported;
    this.applyLayers(sectionId);
    if (sectionId === "main") this.flushVirtualize(false);
  }

  private scheduleSpringBack(sectionId: SectionId): void {
    if (this.wheelSpringTimer !== null) {
      window.clearTimeout(this.wheelSpringTimer);
    }
    this.wheelSpringSection = sectionId;
    this.wheelSpringTimer = window.setTimeout(() => {
      this.wheelSpringTimer = null;
      const id = this.wheelSpringSection;
      this.wheelSpringSection = null;
      if (id) this.startFling(id);
    }, WHEEL_SPRING_IDLE_MS);
  }

  private startFling(sectionId: SectionId): void {
    this.stopFling();
    this.lastFlingTime = performance.now();
    const tick = () => {
      const state = this.sections[sectionId];
      const now = performance.now();
      const dt = Math.min(32, Math.max(0, now - this.lastFlingTime));
      this.lastFlingTime = now;
      const maxX = this.getMaxX(sectionId);
      const stepped = stepFling(state.x, state.velocity, dt, maxX);
      state.x = stepped.x;
      state.velocity = stepped.velocity;
      this.applyFromInput(sectionId);
      if (stepped.done) {
        this.flingRafId = null;
        return;
      }
      this.flingRafId = requestAnimationFrame(tick);
    };
    this.flingRafId = requestAnimationFrame(tick);
  }

  private rememberLeftover(dx: number): void {
    this.leftoverDir = dx < 0 ? -1 : 1;
    this.leftoverAbsDx = Math.abs(dx);
    if (this.leftoverIdleTimer !== null) {
      window.clearTimeout(this.leftoverIdleTimer);
    }
    this.leftoverIdleTimer = window.setTimeout(() => {
      this.leftoverIdleTimer = null;
      this.leftoverDir = 0;
      this.leftoverAbsDx = 0;
    }, LEFTOVER_IDLE_MS);
  }

  private clearLeftover(): void {
    if (this.leftoverIdleTimer !== null) {
      window.clearTimeout(this.leftoverIdleTimer);
      this.leftoverIdleTimer = null;
    }
    this.leftoverDir = 0;
    this.leftoverAbsDx = 0;
  }

  private stopFling(): void {
    if (this.flingRafId !== null) {
      cancelAnimationFrame(this.flingRafId);
      this.flingRafId = null;
    }
    if (this.wheelSpringTimer !== null) {
      window.clearTimeout(this.wheelSpringTimer);
      this.wheelSpringTimer = null;
      this.wheelSpringSection = null;
    }
  }

  private stopScrollbarSync(): void {
    if (this.scrollbarRafId !== null) {
      cancelAnimationFrame(this.scrollbarRafId);
      this.scrollbarRafId = null;
    }
    this.pendingScrollbar.clear();
  }

  private stopVirtualize(): void {
    if (this.virtRafId !== null) {
      cancelAnimationFrame(this.virtRafId);
      this.virtRafId = null;
    }
  }
}
