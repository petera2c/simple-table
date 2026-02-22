import { useEffect, useRef, RefObject } from "react";
import HeaderObject from "../types/HeaderObject";

interface UseAutoScaleMainSectionProps {
  autoExpandColumns: boolean;
  containerWidth: number;
  isResizing: boolean;
  headers: HeaderObject[];
  pinnedLeftWidth: number;
  pinnedRightWidth: number;
  mainBodyRef: RefObject<HTMLDivElement>;
  setHeaders: React.Dispatch<React.SetStateAction<HeaderObject[]>>;
}

/**
 * Automatically scales main section columns to fill available width
 * when autoExpandColumns is enabled
 */
export const useAutoScaleMainSection = ({
  autoExpandColumns,
  containerWidth,
  isResizing,
  headers,
  pinnedLeftWidth,
  pinnedRightWidth,
  mainBodyRef,
  setHeaders,
}: UseAutoScaleMainSectionProps): void => {
  // Track the last container width we scaled to and visible column count
  const lastScaledWidthRef = useRef<number>(0);
  const lastVisibleColumnCountRef = useRef<number>(0);

  useEffect(() => {
    if (!autoExpandColumns || containerWidth === 0 || isResizing) return;

    // Helper to get all leaf headers (actual columns that render)
    const getLeafHeaders = (headers: HeaderObject[]): HeaderObject[] => {
      const leaves: HeaderObject[] = [];
      headers.forEach((header) => {
        if (header.hide) return;
        if (header.children && header.children.length > 0) {
          leaves.push(...getLeafHeaders(header.children));
        } else {
          leaves.push(header);
        }
      });
      return leaves;
    };

    // Calculate the available viewport width for the main section
    // Use the actual DOM width of the main body section if available
    // Otherwise calculate from container minus pinned sections
    let availableMainSectionWidth: number;
    if (mainBodyRef.current) {
      // Use the actual measured width from the DOM (most accurate)
      availableMainSectionWidth = mainBodyRef.current.clientWidth;
    } else {
      // Fallback calculation: container minus pinned sections
      // Note: pinnedLeftWidth and pinnedRightWidth already include PINNED_BORDER_WIDTH
      availableMainSectionWidth = Math.max(0, containerWidth - pinnedLeftWidth - pinnedRightWidth);
    }

    // If there's no space for the main section, don't scale
    if (availableMainSectionWidth <= 0) return;

    // Count visible columns in main section only (exclude pinned columns)
    const mainSectionHeaders = headers.filter((h) => !h.pinned);
    const visibleColumnCount = getLeafHeaders(mainSectionHeaders).length;
    const visibleColumnCountChanged = visibleColumnCount !== lastVisibleColumnCountRef.current;

    // Only rescale if container width changed significantly OR visible column count changed
    if (
      !visibleColumnCountChanged &&
      Math.abs(availableMainSectionWidth - lastScaledWidthRef.current) < 10
    )
      return;

    setHeaders((currentHeaders) => {
      // Calculate total width based on leaf headers in main section only (not pinned)
      const mainSectionHeaders = currentHeaders.filter((h) => !h.pinned);
      const leafHeaders = getLeafHeaders(mainSectionHeaders);
      const totalCurrentWidth = leafHeaders.reduce((total, header) => {
        const width =
          typeof header.width === "number"
            ? header.width
            : typeof header.width === "string" && header.width.endsWith("px")
              ? parseFloat(header.width)
              : 150;
        return total + width;
      }, 0);

      if (totalCurrentWidth === 0) return currentHeaders;

      // Calculate scale factor to fill available main section width
      const scaleFactor = availableMainSectionWidth / totalCurrentWidth;

      // Only scale if needed (avoid tiny adjustments)
      if (Math.abs(scaleFactor - 1) < 0.01) {
        return currentHeaders;
      }

      lastScaledWidthRef.current = availableMainSectionWidth;
      lastVisibleColumnCountRef.current = leafHeaders.length;

      // Pre-calculate all scaled widths to handle rounding properly
      // We'll track the accumulated width and adjust the last column to match exactly
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
      // Only scale headers in the main section (not pinned)
      const scaleHeader = (header: HeaderObject): HeaderObject => {
        if (header.hide) return header;

        const scaledChildren = header.children?.map(scaleHeader);

        // Only scale leaf headers (columns without children) that are not pinned
        if (!header.children || header.children.length === 0) {
          // Don't scale pinned columns
          if (header.pinned) {
            return {
              ...header,
              children: scaledChildren,
            };
          }

          // Use pre-calculated width from the map
          const newWidth = scaledWidths.get(header.accessor as string);
          if (newWidth !== undefined) {
            // In autoExpandColumns mode, we don't enforce minWidth to prevent horizontal overflow
            // The CSS will handle this via the updated getColumnWidth function
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

      return currentHeaders.map(scaleHeader);
    });
  }, [
    autoExpandColumns,
    containerWidth,
    isResizing,
    headers,
    pinnedLeftWidth,
    pinnedRightWidth,
    mainBodyRef,
    setHeaders,
  ]);
};
