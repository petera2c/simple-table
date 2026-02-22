import { useCallback, useEffect, useRef, RefObject } from "react";
import HeaderObject from "../types/HeaderObject";
import { Pinned } from "../types/Pinned";

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
const getLeafHeaders = (
  headers: HeaderObject[],
  rootPinned?: Pinned,
): HeaderObject[] => {
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

  // If there's no space for the main section, don't scale
  if (availableMainSectionWidth <= 0) return headers;

  // Calculate total width based on leaf headers in main section only (not pinned)
  const mainSectionHeaders = headers.filter((h) => !h.pinned);
  const leafHeaders = getLeafHeaders(mainSectionHeaders, undefined);

  if (leafHeaders.length === 0) return headers;

  const totalCurrentWidth = leafHeaders.reduce((total, header) => {
    const width =
      typeof header.width === "number"
        ? header.width
        : typeof header.width === "string" && header.width.endsWith("px")
          ? parseFloat(header.width)
          : 150;
    return total + width;
  }, 0);

  if (totalCurrentWidth === 0) return headers;

  // Calculate scale factor to fill available main section width
  const scaleFactor = availableMainSectionWidth / totalCurrentWidth;

  // Only scale if needed (avoid tiny adjustments)
  if (Math.abs(scaleFactor - 1) < 0.01) {
    return headers;
  }

  // Pre-calculate all scaled widths to handle rounding properly
  const scaledWidths = new Map<string, number>();
  let accumulatedWidth = 0;

  leafHeaders.forEach((header, index) => {
    if (header.pinned) return; // Skip pinned columns

    const currentWidth =
      typeof header.width === "number"
        ? header.width
        : typeof header.width === "string" && header.width.endsWith("px")
          ? parseFloat(header.width)
          : 150;

    let newWidth: number;
    if (index === leafHeaders.length - 1) {
      // Last column gets the remaining width to ensure exact total
      newWidth = availableMainSectionWidth - accumulatedWidth;
    } else {
      // Round intermediate columns
      newWidth = Math.round(currentWidth * scaleFactor);
      accumulatedWidth += newWidth;
    }

    scaledWidths.set(header.accessor as string, newWidth);
  });

  // Recursively scale all headers (including nested children)
  const scaleHeader = (header: HeaderObject, rootPinned?: Pinned): HeaderObject => {
    if (header.hide) return header;

    const currentRootPinned = rootPinned ?? header.pinned;
    const scaledChildren = header.children?.map((child) => scaleHeader(child, currentRootPinned));

    // Only scale leaf headers (columns without children) that are not pinned
    if (!header.children || header.children.length === 0) {
      // Don't scale pinned columns (use rootPinned - child may inherit from parent)
      if (currentRootPinned) {
        return {
          ...header,
          children: scaledChildren,
        };
      }

      // Use pre-calculated width from the map
      const newWidth = scaledWidths.get(header.accessor as string);
      if (newWidth !== undefined) {
        return {
          ...header,
          width: newWidth,
          children: scaledChildren,
        };
      }

      // Fallback (shouldn't happen)
      const currentWidth =
        typeof header.width === "number"
          ? header.width
          : typeof header.width === "string" && header.width.endsWith("px")
            ? parseFloat(header.width)
            : 150;

      return {
        ...header,
        width: Math.round(currentWidth * scaleFactor),
        children: scaledChildren,
      };
    }

    // For parent headers, just update children
    return {
      ...header,
      children: scaledChildren,
    };
  };

  return headers.map((header) => scaleHeader(header, header.pinned));
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
