import ColumnDef, { Accessor, DEFAULT_SHOW_WHEN } from "../types/ColumnDef";
import type { AnimationCoordinator, CellPosition } from "./AnimationCoordinator";
import {
  ACCORDION_ANIMATION_CLASS,
  ACCORDION_CLEANUP_BUFFER_MS,
  ACCORDION_DURATION_VAR,
  ACCORDION_EASING_VAR,
  type AccordionAxis,
} from "../utils/accordionAnimation";
import { isHeaderExcludedFromLayout } from "../utils/cellUtils";

export interface AccordionHost {
  animationCoordinator: AnimationCoordinator;
  getRoot(): HTMLElement;
  getAnimatableContainers(): HTMLElement[];
  getHeaders(): ColumnDef[];
  getCollapsedHeaders(): Set<Accessor>;
  getEffectiveRowGrouping(): Accessor[] | undefined;
  getCurrentBodyLayouts(): Map<HTMLElement, Map<string, CellPosition>>;
  getExternalVerticalScroll(): {
    clientHeight: number;
    scrollHeight: number;
    scrollTop: number;
  } | null;
}

/**
 * Owns accordion CSS class timing and when to capture a FLIP snapshot.
 * Delegates the actual FLIP work to {@link AnimationCoordinator}.
 */
export class AccordionController {
  private host: AccordionHost;
  private pendingAccordionAxis: AccordionAxis = null;
  private accordionCleanupTimerId: number | null = null;
  /** Leaf accessor + pin key from the last committed paint. */
  private lastRenderedVisibilityKey: string | null = null;

  constructor(host: AccordionHost) {
    this.host = host;
  }

  getPendingAxis(): AccordionAxis {
    return this.pendingAccordionAxis;
  }

  clearPendingAxis(): void {
    this.pendingAccordionAxis = null;
  }

  didColumnVisibilityChange(nextHeaders: ColumnDef[]): boolean {
    const nextKey = buildVisibilityKey(nextHeaders);
    return this.lastRenderedVisibilityKey !== null && nextKey !== this.lastRenderedVisibilityKey;
  }

  /** Record the leaf/pin set that the last render actually painted. */
  rememberRenderedHeaders(headers: ColumnDef[]): void {
    this.lastRenderedVisibilityKey = buildVisibilityKey(headers);
  }

  /**
   * Snapshot cells that are actually on the page. Sort does not include
   * off-screen row slots. Accordion and column reverse still do.
   */
  captureSnapshot(args?: { paintedDomSort?: boolean }): void {
    const { animationCoordinator } = this.host;
    const paintedDomSort = Boolean(args?.paintedDomSort);
    const preLayouts =
      !paintedDomSort && animationCoordinator.isEnabled()
        ? this.host.getCurrentBodyLayouts()
        : undefined;
    this.updateAnimationVerticalScroll();
    animationCoordinator.captureSnapshot({
      containers: this.host.getAnimatableContainers(),
      preLayouts,
      paintedDomSort,
    });
  }

  begin(axis: AccordionAxis): void {
    const { animationCoordinator } = this.host;
    if (!animationCoordinator.isEnabled()) return;
    if (axis === null) return;
    if (axis === "vertical" && (this.host.getEffectiveRowGrouping()?.length ?? 0) > 0) return;

    const root = this.host.getRoot();

    const interrupting =
      axis === "horizontal" &&
      (this.accordionCleanupTimerId !== null ||
        root.classList.contains(ACCORDION_ANIMATION_CLASS));
    if (interrupting) {
      animationCoordinator.cancel();
      if (this.accordionCleanupTimerId !== null) {
        window.clearTimeout(this.accordionCleanupTimerId);
        this.accordionCleanupTimerId = null;
      }
      root.classList.remove(ACCORDION_ANIMATION_CLASS);
      root.style.removeProperty(ACCORDION_DURATION_VAR);
      root.style.removeProperty(ACCORDION_EASING_VAR);
      this.pendingAccordionAxis = null;
      this.captureSnapshot();
      const duration = animationCoordinator.getDuration();
      this.accordionCleanupTimerId = window.setTimeout(() => {
        this.accordionCleanupTimerId = null;
      }, duration + ACCORDION_CLEANUP_BUFFER_MS);
      return;
    }

    this.captureSnapshot();
    animationCoordinator.setAccordionPreVisibleAccessors(
      axis === "horizontal" ? collectAccordionRenderableAccessors(this.host) : null,
    );
    this.pendingAccordionAxis = axis;

    const duration = animationCoordinator.getDuration();
    const easing = animationCoordinator.getEasing();
    root.style.setProperty(ACCORDION_DURATION_VAR, `${duration}ms`);
    root.style.setProperty(ACCORDION_EASING_VAR, easing);
    root.classList.add(ACCORDION_ANIMATION_CLASS);

    if (this.accordionCleanupTimerId !== null) {
      window.clearTimeout(this.accordionCleanupTimerId);
    }
    this.accordionCleanupTimerId = window.setTimeout(() => {
      root.classList.remove(ACCORDION_ANIMATION_CLASS);
      root.style.removeProperty(ACCORDION_DURATION_VAR);
      root.style.removeProperty(ACCORDION_EASING_VAR);
      this.accordionCleanupTimerId = null;
    }, duration + ACCORDION_CLEANUP_BUFFER_MS);
  }

  play(): void {
    this.host.animationCoordinator.play({
      containers: this.host.getAnimatableContainers(),
    });
  }

  destroy(): void {
    if (this.accordionCleanupTimerId !== null) {
      window.clearTimeout(this.accordionCleanupTimerId);
      this.accordionCleanupTimerId = null;
    }
    const root = this.host.getRoot();
    root.classList.remove(ACCORDION_ANIMATION_CLASS);
    root.style.removeProperty(ACCORDION_DURATION_VAR);
    root.style.removeProperty(ACCORDION_EASING_VAR);
    this.pendingAccordionAxis = null;
  }

  private updateAnimationVerticalScroll(): void {
    const metrics = this.host.getExternalVerticalScroll();
    this.host.animationCoordinator.setExternalVerticalScroll(metrics);
  }
}

const buildVisibilityKey = (headers: ColumnDef[]): string => {
  const parts: string[] = [];
  const walk = (header: ColumnDef, pinnedAncestor: string | undefined): void => {
    if (isHeaderExcludedFromLayout(header)) return;
    const pinned = header.pinned ?? pinnedAncestor ?? "main";
    if (header.children && header.children.length > 0) {
      for (const child of header.children) walk(child, pinned);
    } else {
      parts.push(`${String(header.accessor)}:${pinned}`);
    }
  };
  for (const header of headers) walk(header, undefined);
  parts.sort();
  return parts.join("|");
};

const collectAccordionRenderableAccessors = (host: AccordionHost): Set<string> => {
  const collapsedHeaders = host.getCollapsedHeaders();
  const set = new Set<string>();
  const visit = (header: ColumnDef): void => {
    if (isHeaderExcludedFromLayout(header)) return;
    set.add(String(header.accessor));
    if (!header.children || header.children.length === 0) return;
    const isCollapsed = collapsedHeaders.has(header.accessor);
    for (const child of header.children) {
      const showWhen = child.showWhen || DEFAULT_SHOW_WHEN;
      const childVisible = isCollapsed
        ? showWhen === "parentCollapsed" || showWhen === "always"
        : showWhen === "parentExpanded" || showWhen === "always";
      if (childVisible) visit(child);
    }
  };
  for (const header of host.getHeaders()) visit(header);
  return set;
};
