import { useCallback, useEffect, useRef, RefObject } from "react";
import HeaderObject from "../types/HeaderObject";
import { Pinned } from "../types/Pinned";
import { getHeaderMinWidth } from "../utils/headerWidthUtils";

interface AutoScaleOptions {
  autoExpandColumns: boolean;
  containerWidth: number;
  pinnedLeftWidth: number;
  pinnedRightWidth: number;
  mainBodyRef: RefObject<HTMLDivElement>;
  isResizing?: boolean;
}

// Helper to get all leaf headers (actual columns that render)
// rootPinned is passed from parent - used to filter leaves by section
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

/**
 * Check if a section can apply autoExpandColumns based on minWidth constraints
 */
const canAutoExpandSection = (
  leafHeaders: HeaderObject[],
  availableSectionWidth: number,
): boolean => {
  const totalMinWidth = leafHeaders.reduce((total, header) => {
    return total + getHeaderMinWidth(header);
  }, 0);

  // If minWidths don't fit, we need horizontal scroll
  return totalMinWidth <= availableSectionWidth;
};

/**
 * Scale headers in a specific section to fill available width
 */
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

  // Only scale if needed (avoid tiny adjustments)
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
      // Last column gets the remaining width to ensure exact total
      newWidth = availableSectionWidth - accumulatedWidth;
    } else {
      // Round intermediate columns
      newWidth = Math.round(currentWidth * scaleFactor);
      accumulatedWidth += newWidth;
    }

    scaledWidths.set(header.accessor as string, newWidth);
  });

  return scaledWidths;
};

/**
 * Pure function that scales headers to fill available width if autoExpandColumns is enabled
 */
export const applyAutoScaleToHeaders = (
  headers: HeaderObject[],
  options: AutoScaleOptions,
): HeaderObject[] => {
  const {
    autoExpandColumns,
    containerWidth,
    pinnedLeftWidth,
    pinnedRightWidth,
    mainBodyRef,
    isResizing,
  } = options;

  // If auto-expand is disabled or currently resizing, return headers unchanged
  if (!autoExpandColumns || containerWidth === 0 || isResizing) {
    return headers;
  }

  // Calculate the available viewport width for the main section
  let availableMainSectionWidth: number;
  if (mainBodyRef.current) {
    // Use the actual measured width from the DOM (most accurate)
    availableMainSectionWidth = mainBodyRef.current.clientWidth;
  } else {
    // Fallback calculation: container minus pinned sections
    availableMainSectionWidth = Math.max(0, containerWidth - pinnedLeftWidth - pinnedRightWidth);
  }

  // Get leaf headers for each section
  const leftSectionHeaders = headers.filter((h) => h.pinned === "left");
  const rightSectionHeaders = headers.filter((h) => h.pinned === "right");
  const mainSectionHeaders = headers.filter((h) => !h.pinned);

  const leftLeafHeaders = getLeafHeaders(leftSectionHeaders, "left");
  const rightLeafHeaders = getLeafHeaders(rightSectionHeaders, "right");
  const mainLeafHeaders = getLeafHeaders(mainSectionHeaders, undefined);

  // Check each section to see if it can apply autoExpandColumns
  const canExpandLeft =
    leftLeafHeaders.length > 0 && canAutoExpandSection(leftLeafHeaders, pinnedLeftWidth);
  const canExpandRight =
    rightLeafHeaders.length > 0 && canAutoExpandSection(rightLeafHeaders, pinnedRightWidth);
  const canExpandMain =
    mainLeafHeaders.length > 0 &&
    availableMainSectionWidth > 0 &&
    canAutoExpandSection(mainLeafHeaders, availableMainSectionWidth);

  // Calculate scaled widths for each section that can be expanded
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

  // If no sections can be expanded, return headers unchanged
  if (scaledWidths.size === 0) {
    return headers;
  }

  // Recursively scale all headers (including nested children)
  const scaleHeader = (header: HeaderObject, rootPinned?: Pinned): HeaderObject => {
    if (header.hide) return header;

    const currentRootPinned = rootPinned ?? header.pinned;
    const scaledChildren = header.children?.map((child) => scaleHeader(child, currentRootPinned));

    // Only scale leaf headers (columns without children)
    if (!header.children || header.children.length === 0) {
      // Use pre-calculated width from the map if available
      const newWidth = scaledWidths.get(header.accessor as string);
      if (newWidth !== undefined) {
        return {
          ...header,
          width: newWidth,
          children: scaledChildren,
        };
      }

      // No scaling for this header - return as is
      return {
        ...header,
        children: scaledChildren,
      };
    }

    // For parent headers, just update children
    return {
      ...header,
      children: scaledChildren,
    };
  };

  const scaledHeaders = headers.map((header) => scaleHeader(header, header.pinned));

  return scaledHeaders;
};

interface UseAutoScaleMainSectionProps {
  autoExpandColumns: boolean;
  containerWidth: number;
  pinnedLeftWidth: number;
  pinnedRightWidth: number;
  mainBodyRef: RefObject<HTMLDivElement>;
  isResizing: boolean;
  setHeaders: React.Dispatch<React.SetStateAction<HeaderObject[]>>;
}

/**
 * Hook that wraps setHeaders to automatically apply scaling when headers are updated
 */
export const useAutoScaleMainSection = ({
  autoExpandColumns,
  containerWidth,
  pinnedLeftWidth,
  pinnedRightWidth,
  mainBodyRef,
  isResizing,
  setHeaders,
}: UseAutoScaleMainSectionProps) => {
  const optionsRef = useRef<AutoScaleOptions>({
    autoExpandColumns,
    containerWidth,
    pinnedLeftWidth,
    pinnedRightWidth,
    mainBodyRef,
    isResizing,
  });

  // Keep options ref up to date
  optionsRef.current = {
    autoExpandColumns,
    containerWidth,
    pinnedLeftWidth,
    pinnedRightWidth,
    mainBodyRef,
    isResizing,
  };

  // Wrapped setHeaders that applies auto-scaling
  const setHeadersWithScale = useCallback(
    (headersOrUpdater: HeaderObject[] | ((prev: HeaderObject[]) => HeaderObject[])) => {
      setHeaders((prevHeaders) => {
        const newHeaders =
          typeof headersOrUpdater === "function" ? headersOrUpdater(prevHeaders) : headersOrUpdater;

        const newHeadersScaled = applyAutoScaleToHeaders(newHeaders, optionsRef.current);

        return newHeadersScaled;
      });
    },
    [setHeaders],
  );

  // Track previous isResizing state to detect when resizing ends
  const prevIsResizingRef = useRef(isResizing);

  // When resizing ends, trigger a re-scale to ensure proper column widths
  useEffect(() => {
    const wasResizing = prevIsResizingRef.current;
    const isNowResizing = isResizing;

    if (wasResizing && !isNowResizing && autoExpandColumns) {
      // Resizing just ended - apply auto-scaling
      setHeaders((prevHeaders) => applyAutoScaleToHeaders(prevHeaders, optionsRef.current));
    }

    prevIsResizingRef.current = isResizing;
  }, [isResizing, autoExpandColumns, setHeaders]);

  // Also trigger re-scale when container width changes significantly
  const prevContainerWidthRef = useRef(containerWidth);
  useEffect(() => {
    const widthChange = Math.abs(containerWidth - prevContainerWidthRef.current);

    if (widthChange > 10 && !isResizing && autoExpandColumns) {
      setHeaders((prevHeaders) => applyAutoScaleToHeaders(prevHeaders, optionsRef.current));
    }

    prevContainerWidthRef.current = containerWidth;
  }, [containerWidth, isResizing, autoExpandColumns, setHeaders]);

  return setHeadersWithScale;
};
