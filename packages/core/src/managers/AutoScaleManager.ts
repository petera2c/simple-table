import ColumnDef, { Accessor } from "../types/ColumnDef";
import { Pinned } from "../types/Pinned";
import { getAllVisibleLeafHeaders } from "../utils/headerWidthUtils";
import { isHeaderExcludedFromLayout } from "../utils/cellUtils";
import { PreviousValueTracker } from "../hooks/previousValue";

interface AutoScaleConfig {
  autoExpandColumns: boolean;
  containerWidth: number;
  pinnedLeftWidth: number;
  pinnedRightWidth: number;
  mainBodyRef: { current: HTMLDivElement | null };
  isResizing?: boolean;
  /**
   * Currently collapsed header accessors. Auto-scale must only account for the
   * leaf columns that are actually visible for the current collapsed state —
   * otherwise it sums the widths of hidden child columns and under-expands,
   * leaving empty space on the right.
   */
  collapsedHeaders?: Set<Accessor>;
}

type HeaderUpdateCallback = (headers: ColumnDef[]) => void;

/** Numeric pixel width of a leaf header (post-normalization all widths are px). */
const getLeafPixelWidth = (header: ColumnDef): number =>
  typeof header.width === "number"
    ? header.width
    : typeof header.width === "string" && header.width.endsWith("px")
      ? parseFloat(header.width)
      : 150;

/**
 * Scale a section's columns up from their natural widths to fill the available
 * section width.
 *
 * Expand-only: when the natural widths already overflow the section
 * (scaleFactor < 1), an empty map is returned so the columns keep their
 * natural widths and the section scrolls horizontally — columns are never
 * squeezed below their natural (declared or content-measured) width.
 *
 * `maxWidth` caps growth during expansion: columns that would exceed their
 * maxWidth are pinned there and their surplus share is redistributed to the
 * remaining columns. A maxWidth below the natural width never shrinks the
 * column (growth-only cap).
 */
const scaleSection = (
  leafHeaders: ColumnDef[],
  availableSectionWidth: number,
): Map<string, number> => {
  const scaledWidths = new Map<string, number>();

  const naturalWidths = leafHeaders.map(getLeafPixelWidth);
  const totalNaturalWidth = naturalWidths.reduce((a, b) => a + b, 0);

  if (totalNaturalWidth === 0) return scaledWidths;

  const scaleFactor = availableSectionWidth / totalNaturalWidth;

  // Expand-only: deficit (< 1) keeps natural widths; near-1 surplus is skipped
  // to avoid sub-percent jitter on container resize.
  if (scaleFactor - 1 < 0.01) {
    return scaledWidths;
  }

  const maxWidths = leafHeaders.map((header, i) => {
    const raw =
      typeof header.maxWidth === "number"
        ? header.maxWidth
        : typeof header.maxWidth === "string"
          ? parseFloat(header.maxWidth)
          : NaN;
    return Number.isFinite(raw) && raw > 0 ? Math.max(raw, naturalWidths[i]) : Infinity;
  });

  // Iteratively pin columns that hit their maxWidth and redistribute the
  // reclaimed surplus among the remaining flexible columns.
  const cappedWidths = new Map<number, number>();
  let factor = scaleFactor;
  for (;;) {
    const uncappedIndices = naturalWidths
      .map((_, i) => i)
      .filter((i) => !cappedWidths.has(i));
    if (uncappedIndices.length === 0) break;

    const cappedTotal = Array.from(cappedWidths.values()).reduce((a, b) => a + b, 0);
    const uncappedNaturalTotal = uncappedIndices.reduce(
      (sum, i) => sum + naturalWidths[i],
      0,
    );
    factor = Math.max(1, (availableSectionWidth - cappedTotal) / uncappedNaturalTotal);

    const newlyCapped = uncappedIndices.filter(
      (i) => naturalWidths[i] * factor > maxWidths[i],
    );
    if (newlyCapped.length === 0) break;
    newlyCapped.forEach((i) => cappedWidths.set(i, maxWidths[i]));
  }

  const rounded = leafHeaders.map((_, i) => {
    const cappedAt = cappedWidths.get(i);
    return Math.round(cappedAt !== undefined ? cappedAt : naturalWidths[i] * factor);
  });

  // Hand the rounding remainder to the last flexible column so the section
  // fills exactly (still respecting its cap and never dipping below natural).
  let lastUncappedIndex = -1;
  for (let i = leafHeaders.length - 1; i >= 0; i--) {
    if (!cappedWidths.has(i)) {
      lastUncappedIndex = i;
      break;
    }
  }
  if (lastUncappedIndex >= 0) {
    const otherSum = rounded.reduce(
      (sum, w, i) => (i === lastUncappedIndex ? sum : sum + w),
      0,
    );
    const remainder = availableSectionWidth - otherSum;
    rounded[lastUncappedIndex] = Math.round(
      Math.min(
        Math.max(remainder, naturalWidths[lastUncappedIndex]),
        maxWidths[lastUncappedIndex],
      ),
    );
  }

  leafHeaders.forEach((header, i) => {
    scaledWidths.set(header.accessor as string, rounded[i]);
  });

  return scaledWidths;
};

export const applyAutoScaleToHeaders = (
  headers: ColumnDef[],
  options: AutoScaleConfig,
): ColumnDef[] => {
  const {
    autoExpandColumns,
    containerWidth,
    pinnedLeftWidth,
    pinnedRightWidth,
    mainBodyRef,
    isResizing,
    collapsedHeaders,
  } = options;

  if (!autoExpandColumns || containerWidth === 0 || isResizing) {
    return headers;
  }

  // Always derive available main width from calculated pinned widths rather than
  // reading from the DOM, which may reflect stale CSS from the previous render.
  const availableMainSectionWidth = Math.max(0, containerWidth - pinnedLeftWidth - pinnedRightWidth);

  const leftSectionHeaders = headers.filter((h) => h.pinned === "left");
  const rightSectionHeaders = headers.filter((h) => h.pinned === "right");
  const mainSectionHeaders = headers.filter((h) => !h.pinned);

  // Only scale the leaf columns that are actually visible for the current
  // collapsed state. Using getAllVisibleLeafHeaders (instead of walking every
  // child) keeps the totals in sync with what the grid actually lays out, so
  // collapsed sub-columns don't inflate the width sum and cause under-expansion.
  const leftLeafHeaders = getAllVisibleLeafHeaders(leftSectionHeaders, collapsedHeaders);
  const rightLeafHeaders = getAllVisibleLeafHeaders(rightSectionHeaders, collapsedHeaders);
  const mainLeafHeaders = getAllVisibleLeafHeaders(mainSectionHeaders, collapsedHeaders);

  // scaleSection is expand-only: it returns widths only when the section's
  // natural widths leave surplus space. Sections in deficit keep their natural
  // widths and overflow into horizontal scroll.
  const scaledWidths = new Map<string, number>();

  if (leftLeafHeaders.length > 0) {
    const leftScaledWidths = scaleSection(leftLeafHeaders, pinnedLeftWidth);
    leftScaledWidths.forEach((width, accessor) => scaledWidths.set(accessor, width));
  }

  if (rightLeafHeaders.length > 0) {
    const rightScaledWidths = scaleSection(rightLeafHeaders, pinnedRightWidth);
    rightScaledWidths.forEach((width, accessor) => scaledWidths.set(accessor, width));
  }

  if (mainLeafHeaders.length > 0 && availableMainSectionWidth > 0) {
    const mainScaledWidths = scaleSection(mainLeafHeaders, availableMainSectionWidth);
    mainScaledWidths.forEach((width, accessor) => scaledWidths.set(accessor, width));
  }

  if (scaledWidths.size === 0) {
    return headers;
  }

  const scaleHeader = (header: ColumnDef, rootPinned?: Pinned): ColumnDef => {
    if (isHeaderExcludedFromLayout(header)) return header;

    const currentRootPinned = rootPinned ?? header.pinned;
    const scaledChildren = header.children?.map((child) => scaleHeader(child, currentRootPinned));

    // Apply the scaled width whenever this header is one of the visible leaves
    // for the current collapsed state. This covers plain leaf columns as well as
    // collapsed parents and singleRowChildren parents, which act as their own
    // leaf column even though they still carry children.
    const newWidth = scaledWidths.get(header.accessor as string);
    if (newWidth !== undefined) {
      return {
        ...header,
        width: newWidth,
        children: scaledChildren,
      };
    }

    return {
      ...header,
      children: scaledChildren,
    };
  };

  const scaledHeaders = headers.map((header) => scaleHeader(header, header.pinned));

  return scaledHeaders;
};

export class AutoScaleManager {
  private config: AutoScaleConfig;
  private onHeadersUpdate: HeaderUpdateCallback;
  private isResizingTracker: PreviousValueTracker<boolean>;
  private containerWidthTracker: PreviousValueTracker<number>;

  constructor(config: AutoScaleConfig, onHeadersUpdate: HeaderUpdateCallback) {
    this.config = config;
    this.onHeadersUpdate = onHeadersUpdate;
    this.isResizingTracker = new PreviousValueTracker(config.isResizing ?? false);
    this.containerWidthTracker = new PreviousValueTracker(config.containerWidth);
  }

  updateConfig(config: Partial<AutoScaleConfig>): void {
    this.config = { ...this.config, ...config };

    const newIsResizing = this.config.isResizing ?? false;
    const newContainerWidth = this.config.containerWidth;

    const wasResizing = this.isResizingTracker.get();
    this.isResizingTracker.set(newIsResizing);

    const prevContainerWidth = this.containerWidthTracker.get();
    this.containerWidthTracker.set(newContainerWidth);

    if (wasResizing && !newIsResizing && this.config.autoExpandColumns) {
      this.triggerAutoScale();
    }

    const widthChange = Math.abs(newContainerWidth - prevContainerWidth);
    if (widthChange > 10 && !newIsResizing && this.config.autoExpandColumns) {
      this.triggerAutoScale();
    }
  }

  private triggerAutoScale(): void {
    if (this.onHeadersUpdate) {
      this.onHeadersUpdate(this.config as any);
    }
  }

  applyAutoScale(headers: ColumnDef[]): ColumnDef[] {
    return applyAutoScaleToHeaders(headers, this.config);
  }

  setHeaders(
    headersOrUpdater: ColumnDef[] | ((prev: ColumnDef[]) => ColumnDef[]),
    currentHeaders: ColumnDef[],
  ): ColumnDef[] {
    const newHeaders =
      typeof headersOrUpdater === "function" ? headersOrUpdater(currentHeaders) : headersOrUpdater;

    return this.applyAutoScale(newHeaders);
  }

  destroy(): void {
    this.onHeadersUpdate = () => {};
  }
}
