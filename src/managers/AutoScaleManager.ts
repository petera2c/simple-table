import HeaderObject from "../types/HeaderObject";
import { Pinned } from "../types/Pinned";
import { getHeaderMinWidth } from "../utils/headerWidthUtils";
import { PreviousValueTracker } from "../hooks/previousValue";

interface AutoScaleConfig {
  autoExpandColumns: boolean;
  containerWidth: number;
  pinnedLeftWidth: number;
  pinnedRightWidth: number;
  mainBodyRef: { current: HTMLDivElement | null };
  isResizing?: boolean;
}

type HeaderUpdateCallback = (headers: HeaderObject[]) => void;

const getLeafHeaders = (headers: HeaderObject[], rootPinned?: Pinned): HeaderObject[] => {
  const leaves: HeaderObject[] = [];
  headers.forEach((header) => {
    if (header.hide) return;
    const currentRootPinned = rootPinned ?? header.pinned;
    if (header.children && header.children.length > 0) {
      leaves.push(...getLeafHeaders(header.children, currentRootPinned));
    } else {
      leaves.push(header);
    }
  });
  return leaves;
};

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

  if (Math.abs(scaleFactor - 1) < 0.01) {
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
  } = options;

  if (!autoExpandColumns || containerWidth === 0 || isResizing) {
    return headers;
  }

  let availableMainSectionWidth: number;
  if (mainBodyRef.current) {
    availableMainSectionWidth = mainBodyRef.current.clientWidth;
  } else {
    availableMainSectionWidth = Math.max(0, containerWidth - pinnedLeftWidth - pinnedRightWidth);
  }

  const leftSectionHeaders = headers.filter((h) => h.pinned === "left");
  const rightSectionHeaders = headers.filter((h) => h.pinned === "right");
  const mainSectionHeaders = headers.filter((h) => !h.pinned);

  const leftLeafHeaders = getLeafHeaders(leftSectionHeaders, "left");
  const rightLeafHeaders = getLeafHeaders(rightSectionHeaders, "right");
  const mainLeafHeaders = getLeafHeaders(mainSectionHeaders, undefined);

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

    if (!header.children || header.children.length === 0) {
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
    const oldIsResizing = this.config.isResizing;
    const oldContainerWidth = this.config.containerWidth;

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
