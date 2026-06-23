import HeaderObject, { Accessor } from "../types/HeaderObject";
import { Pinned } from "../types/Pinned";
import { getAllVisibleLeafHeaders, getHeaderMinWidth } from "../utils/headerWidthUtils";
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

type HeaderUpdateCallback = (headers: HeaderObject[]) => void;

const canAutoExpandSection = (
  leafHeaders: HeaderObject[],
  availableSectionWidth: number,
): boolean => {
  const totalMinWidth = leafHeaders.reduce((total, header) => {
    return total + getHeaderMinWidth(header);
  }, 0);

  return totalMinWidth <= availableSectionWidth;
};

const scaleSection = (
  leafHeaders: HeaderObject[],
  availableSectionWidth: number,
): Map<string, number> => {
  const scaledWidths = new Map<string, number>();

  const totalCurrentWidth = leafHeaders.reduce((total, header) => {
    const width =
      typeof header.width === "number"
        ? header.width
        : typeof header.width === "string" && header.width.endsWith("px")
          ? parseFloat(header.width)
          : 150;
    return total + width;
  }, 0);

  if (totalCurrentWidth === 0) return scaledWidths;

  const scaleFactor = availableSectionWidth / totalCurrentWidth;

  if (scaleFactor >= 1 && scaleFactor - 1 < 0.01) {
    return scaledWidths;
  }

  let accumulatedWidth = 0;

  leafHeaders.forEach((header, index) => {
    const currentWidth =
      typeof header.width === "number"
        ? header.width
        : typeof header.width === "string" && header.width.endsWith("px")
          ? parseFloat(header.width)
          : 150;

    let newWidth: number;
    if (index === leafHeaders.length - 1) {
      newWidth = availableSectionWidth - accumulatedWidth;
    } else {
      newWidth = Math.round(currentWidth * scaleFactor);
      accumulatedWidth += newWidth;
    }

    scaledWidths.set(header.accessor as string, newWidth);
  });

  return scaledWidths;
};

export const applyAutoScaleToHeaders = (
  headers: HeaderObject[],
  options: AutoScaleConfig,
): HeaderObject[] => {
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

  const canExpandLeft =
    leftLeafHeaders.length > 0 && canAutoExpandSection(leftLeafHeaders, pinnedLeftWidth);
  const canExpandRight =
    rightLeafHeaders.length > 0 && canAutoExpandSection(rightLeafHeaders, pinnedRightWidth);
  const canExpandMain =
    mainLeafHeaders.length > 0 &&
    availableMainSectionWidth > 0 &&
    canAutoExpandSection(mainLeafHeaders, availableMainSectionWidth);

  const scaledWidths = new Map<string, number>();

  if (canExpandLeft) {
    const leftScaledWidths = scaleSection(leftLeafHeaders, pinnedLeftWidth);
    leftScaledWidths.forEach((width, accessor) => scaledWidths.set(accessor, width));
  }

  if (canExpandRight) {
    const rightScaledWidths = scaleSection(rightLeafHeaders, pinnedRightWidth);
    rightScaledWidths.forEach((width, accessor) => scaledWidths.set(accessor, width));
  }

  if (canExpandMain) {
    const mainScaledWidths = scaleSection(mainLeafHeaders, availableMainSectionWidth);
    mainScaledWidths.forEach((width, accessor) => scaledWidths.set(accessor, width));
  }

  if (scaledWidths.size === 0) {
    return headers;
  }

  const scaleHeader = (header: HeaderObject, rootPinned?: Pinned): HeaderObject => {
    if (header.hide) return header;

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

  applyAutoScale(headers: HeaderObject[]): HeaderObject[] {
    return applyAutoScaleToHeaders(headers, this.config);
  }

  setHeaders(
    headersOrUpdater: HeaderObject[] | ((prev: HeaderObject[]) => HeaderObject[]),
    currentHeaders: HeaderObject[],
  ): HeaderObject[] {
    const newHeaders =
      typeof headersOrUpdater === "function" ? headersOrUpdater(currentHeaders) : headersOrUpdater;

    return this.applyAutoScale(newHeaders);
  }

  destroy(): void {
    this.onHeadersUpdate = () => {};
  }
}
