import { useState, useLayoutEffect, useMemo, useCallback, RefObject } from "react";
import HeaderObject from "../types/HeaderObject";
import { CSS_VAR_BORDER_WIDTH, DEFAULT_BORDER_WIDTH } from "../consts/general-consts";

interface UseTableDimensionsProps {
  effectiveHeaders: HeaderObject[];
  headerHeight?: number;
  rowHeight: number;
  tableBodyContainerRef: RefObject<HTMLDivElement>;
}

interface UseTableDimensionsReturn {
  containerWidth: number;
  calculatedHeaderHeight: number;
}

export const useTableDimensions = ({
  effectiveHeaders,
  headerHeight,
  rowHeight,
  tableBodyContainerRef,
}: UseTableDimensionsProps): UseTableDimensionsReturn => {
  const [containerWidth, setContainerWidth] = useState<number>(0);

  // Calculate header depth for nested columns
  const getHeaderDepth = useCallback((header: HeaderObject): number => {
    // If singleRowChildren is true, don't add depth for immediate children
    if (header.singleRowChildren && header.children?.length) {
      return 1;
    }
    return header.children?.length ? 1 + Math.max(...header.children.map(getHeaderDepth)) : 1;
  }, []);

  const maxHeaderDepth = useMemo(() => {
    let maxDepth = 0;
    effectiveHeaders.forEach((header) => {
      const depth = getHeaderDepth(header);
      maxDepth = Math.max(maxDepth, depth);
    });
    return maxDepth;
  }, [effectiveHeaders, getHeaderDepth]);

  // Calculate actual header height based on depth and headerHeight prop
  // Add border width for the header border-bottom (--st-border-width in CSS)
  const calculatedHeaderHeight = useMemo(() => {
    // Get the border width from CSS variable
    let borderWidth = DEFAULT_BORDER_WIDTH;
    if (typeof window !== "undefined") {
      const rootElement = document.documentElement;
      const computedStyle = getComputedStyle(rootElement);
      const borderWidthValue = computedStyle.getPropertyValue(CSS_VAR_BORDER_WIDTH).trim();
      if (borderWidthValue) {
        const parsed = parseFloat(borderWidthValue);
        if (!isNaN(parsed)) {
          borderWidth = parsed;
        }
      }
    }
    return maxHeaderDepth * (headerHeight ?? rowHeight) + borderWidth;
  }, [maxHeaderDepth, headerHeight, rowHeight]);

  // Update container width when the table container changes
  useLayoutEffect(() => {
    const updateContainerWidth = () => {
      if (tableBodyContainerRef.current) {
        setContainerWidth(tableBodyContainerRef.current.clientWidth);
      }
    };

    updateContainerWidth();

    // Set up a ResizeObserver to watch for container size changes
    let resizeObserver: ResizeObserver | null = null;
    if (tableBodyContainerRef.current) {
      resizeObserver = new ResizeObserver(updateContainerWidth);
      resizeObserver.observe(tableBodyContainerRef.current);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [tableBodyContainerRef]);

  return {
    containerWidth,
    calculatedHeaderHeight,
  };
};
