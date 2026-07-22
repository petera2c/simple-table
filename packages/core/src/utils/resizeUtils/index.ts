import type HeaderObject from "../../types/HeaderObject";
import type { Accessor } from "../../types/HeaderObject";
import type { HandleResizeStartProps } from "../../types/HandleResizeStartProps";
import {
  findLeafHeaders,
  getHeaderWidthInPixels,
  removeAllFractionalWidths,
  getHeaderMinWidth,
  getAllVisibleLeafHeaders,
} from "../headerWidthUtils";
import { MIN_COLUMN_WIDTH } from "../../consts/column-constraints";
import { getRootPinned, updateColumnWidthsInDOM } from "./domUpdates";
import { recalculateAllSectionWidths } from "./sectionWidths";
import { calculateMaxHeaderWidth } from "./maxWidth";
import { handleParentHeaderResize } from "./parentHeaderResize";
import { handleResizeWithAutoExpand } from "./autoExpandResize";
import { isHeaderExcludedFromLayout } from "../cellUtils";

/**
 * Rescale the main section after a pinned boundary column resize changed the
 * main viewport. Growing distributes proportionally (last column takes the
 * rounding remainder). Shrinking respects each column's natural shrink floor:
 * columns give up only expanded surplus, and once every column is at its
 * floor the main section overflows into horizontal scroll instead of being
 * squeezed further.
 */
const rescaleMainSectionForBoundaryResize = ({
  mainLeafHeaders,
  mainInitialWidths,
  newMainAvailable,
  shrinkFloors,
}: {
  mainLeafHeaders: HeaderObject[];
  mainInitialWidths: Map<string, number>;
  newMainAvailable: number;
  shrinkFloors?: Map<string, number>;
}): void => {
  const initialMainTotal = Array.from(mainInitialWidths.values()).reduce((a, b) => a + b, 0);
  if (newMainAvailable <= 0 || initialMainTotal <= 0) return;

  const scale = newMainAvailable / initialMainTotal;

  if (scale >= 1) {
    let acc = 0;
    mainLeafHeaders.forEach((h, i) => {
      const initW = mainInitialWidths.get(h.accessor as string) || 100;
      if (i === mainLeafHeaders.length - 1) {
        h.width = newMainAvailable - acc;
      } else {
        h.width = Math.round(initW * scale);
        acc += h.width as number;
      }
    });
    return;
  }

  mainLeafHeaders.forEach((h) => {
    const initW = mainInitialWidths.get(h.accessor as string) || 100;
    const floor = Math.min(
      Math.max(shrinkFloors?.get(h.accessor as string) ?? MIN_COLUMN_WIDTH, MIN_COLUMN_WIDTH),
      initW,
    );
    h.width = Math.max(Math.round(initW * scale), floor);
  });
};

/**
 * Header resize handlers may capture an old `containerWidth` (e.g. 0) from when the
 * cell was created. When the manager still reports 0, read the grid viewport from
 * the DOM, scoped via mainBodyRef to this table instance.
 */
const resolveContainerWidthForResize = (
  fromContext: number,
  mainBodyRef: HandleResizeStartProps["mainBodyRef"],
): number => {
  if (fromContext > 0) return fromContext;
  const main = mainBodyRef?.current;
  if (!main) return 0;
  const root = main.closest(".simple-table-root");
  const bodyContainer = root?.querySelector(".st-body-container");
  if (bodyContainer instanceof HTMLElement) {
    return bodyContainer.clientWidth;
  }
  return main.clientWidth;
};

/**
 * Handler for when resize dragging starts
 */
export const handleResizeStart = ({
  autoExpandColumns,
  collapsedHeaders,
  containerWidth,
  event,
  header,
  headers,
  mainBodyRef,
  onColumnWidthChange,
  onAutoExpandNaturalWidths,
  reverse = false,
  setHeaders,
  setIsResizing,
  shrinkFloors,
  startWidth,
}: HandleResizeStartProps): void => {
  event.preventDefault();
  const startX = "clientX" in event ? event.clientX : event.touches[0].clientX;
  const isTouchEvent = "touches" in event;

  if (!header || isHeaderExcludedFromLayout(header)) return;

  const effectiveContainerWidth = resolveContainerWidthForResize(
    containerWidth,
    mainBodyRef,
  );

  // Set resizing state to true
  setIsResizing(true);

  // Get pinned from root header (nested children inherit from parent)
  const rootPinned = getRootPinned(header, headers);

  // Get the minimum width for this header
  const minWidth = getHeaderMinWidth(header);

  // Always work with leaf children - they are the single source of truth for widths
  const isParentHeader = header.children && header.children.length > 0;

  // Get the children that should be resized:
  // - For parents: resize only currently visible leaf children, or parent itself if no visible children
  // - For leaf headers: resize the header itself
  let childrenToResize: HeaderObject[];
  if (isParentHeader) {
    const visibleChildren = findLeafHeaders(header, collapsedHeaders);
    childrenToResize = visibleChildren.length > 0 ? visibleChildren : [header];
  } else {
    childrenToResize = [header];
  }

  // For autoExpandColumns, store the initial widths of all columns at drag start
  const initialWidthsMap = new Map<string, number>();
  let sectionWidth = 0;
  let initialMainAvailable = 0;

  if (autoExpandColumns) {
    const sectionHeaders = headers.filter((h) => h.pinned === rootPinned);
    const leafHeaders = getAllVisibleLeafHeaders(
      sectionHeaders,
      collapsedHeaders,
    );
    leafHeaders.forEach((h) => {
      const width = getHeaderWidthInPixels(h);
      initialWidthsMap.set(h.accessor as string, width);
    });

    // Calculate widths of pinned sections using the effective container width
    if (effectiveContainerWidth > 0) {
      const { leftWidth, rightWidth, mainWidth } = recalculateAllSectionWidths({
        headers,
        containerWidth: effectiveContainerWidth,
        collapsedHeaders,
      });

      // Use the appropriate width based on which section is being resized
      if (rootPinned === "left") {
        sectionWidth = leftWidth;
      } else if (rootPinned === "right") {
        sectionWidth = rightWidth;
      } else {
        // Main section: use the raw content width (no pinned border subtraction)
        sectionWidth = mainWidth;
      }

      const computedMainAvailable = Math.max(
        0,
        effectiveContainerWidth - leftWidth - rightWidth,
      );
      const mainViewportWidth =
        mainBodyRef?.current != null && mainBodyRef.current.clientWidth > 0
          ? mainBodyRef.current.clientWidth
          : 0;
      // Pinned widths from the model + container width do not always match the real
      // main scroll viewport (splitter, extra chrome). Prefer the DOM viewport when known.
      initialMainAvailable =
        mainViewportWidth > 0
          ? Math.min(computedMainAvailable, mainViewportWidth)
          : computedMainAvailable;
    }
  }

  // For boundary column resize (rightmost in left-pinned, leftmost in right-pinned)
  // with autoExpandColumns, the main section must scale proportionally as the
  // pinned section grows or shrinks.
  let isBoundaryResize = false;
  const mainInitialWidths = new Map<string, number>();
  let mainLeafHeaders: HeaderObject[] = [];

  if (autoExpandColumns && rootPinned && effectiveContainerWidth > 0) {
    const sectionLeafs = getAllVisibleLeafHeaders(
      headers.filter((h) => h.pinned === rootPinned),
      collapsedHeaders,
    );

    if (sectionLeafs.length > 0) {
      let atBoundary = false;

      if (childrenToResize.length > 1) {
        const firstIdx = sectionLeafs.findIndex(
          (h) => h.accessor === childrenToResize[0].accessor,
        );
        const lastIdx = sectionLeafs.findIndex(
          (h) => h.accessor === childrenToResize[childrenToResize.length - 1].accessor,
        );
        atBoundary =
          (rootPinned === "left" && lastIdx === sectionLeafs.length - 1) ||
          (rootPinned === "right" && firstIdx === 0);
      } else {
        const target = childrenToResize[0] || header;
        const idx = sectionLeafs.findIndex((h) => h.accessor === target.accessor);
        atBoundary =
          (rootPinned === "left" && idx === sectionLeafs.length - 1) ||
          (rootPinned === "right" && idx === 0);
      }

      if (atBoundary) {
        isBoundaryResize = true;
        const mainHeaders = headers.filter((h) => !h.pinned);
        mainLeafHeaders = getAllVisibleLeafHeaders(mainHeaders, collapsedHeaders);
        mainLeafHeaders.forEach((h) => {
          mainInitialWidths.set(h.accessor as string, getHeaderWidthInPixels(h));
        });
      }
    }
  }

  const handleMove = (clientX: number, finalUpdate: boolean = false) => {
    // Calculate the width delta (how much the width has changed)
    // For right-pinned headers, delta is reversed
    const delta = rootPinned === "right" ? startX - clientX : clientX - startX;

    if (autoExpandColumns) {
      // AutoExpandColumns mode: use proportional shrinking logic
      // Get headers in the same section (left/main/right)
      const sectionHeaders = headers.filter((h) => h.pinned === rootPinned);

      // If this is a parent header with children, we need to resize the children, not the parent
      const headerToResize =
        childrenToResize.length > 0
          ? childrenToResize[childrenToResize.length - 1]
          : header;

      handleResizeWithAutoExpand({
        childrenToResize,
        collapsedHeaders,
        containerWidth: effectiveContainerWidth,
        delta,
        headers,
        initialWidthsMap,
        isParentResize: childrenToResize.length > 1,
        resizedHeader: headerToResize,
        reverse,
        rootPinned,
        sectionHeaders,
        sectionWidth,
        sectionViewportWidth: rootPinned ? sectionWidth : initialMainAvailable,
        shrinkFloors,
        startWidth,
      });

      // When a boundary column of a pinned section is resized, the main section
      // must rescale so all sections together fill the container — but main
      // columns are never squeezed below their natural shrink floors.
      if (isBoundaryResize && mainLeafHeaders.length > 0) {
        const childDelta = childrenToResize.reduce((sum, h) => {
          const initW = initialWidthsMap.get(h.accessor as string) || 0;
          const newW = typeof h.width === "number" ? h.width : initW;
          return sum + (newW - initW);
        }, 0);

        rescaleMainSectionForBoundaryResize({
          mainLeafHeaders,
          mainInitialWidths,
          newMainAvailable: Math.max(0, initialMainAvailable - childDelta),
          shrinkFloors,
        });
      }
    } else {
      // Normal resize mode
      // Calculate maximum allowable width based on container constraints
      const maxWidth = calculateMaxHeaderWidth({
        header,
        headers,
        collapsedHeaders,
      });

      // Simplified logic: always resize the leaf children (single source of truth)
      if (childrenToResize.length > 1) {
        // Multiple children: distribute width proportionally
        handleParentHeaderResize({
          delta,
          leafHeaders: childrenToResize,
          minWidth,
          startWidth,
          maxWidth,
        });
      } else {
        // Single child (or leaf header): direct resize
        const newWidth = Math.max(
          Math.min(startWidth + delta, maxWidth),
          minWidth,
        );
        childrenToResize[0].width = newWidth;
      }

      // After a header is resized, update any headers that use fractional widths
      headers.forEach((h) => {
        removeAllFractionalWidths(h);
      });
    }

    if (finalUpdate) {
      // The user explicitly chose these widths: record them as the columns'
      // new natural widths (their shrink floors for subsequent resizes).
      if (autoExpandColumns && onAutoExpandNaturalWidths) {
        const naturals = new Map<string, number>();
        childrenToResize.forEach((h) => {
          if (typeof h.width === "number") naturals.set(h.accessor as string, h.width);
        });
        if (naturals.size > 0) onAutoExpandNaturalWidths(naturals);
      }
      // Final update: sync React state and ensure DOM is updated (e.g. when mouseup
      // runs before the mousemove RAF, as in tests that fire events in one tick)
      const newHeaders = [...headers];
      setHeaders(newHeaders);
      // Pass just-set width(s) so updateColumnWidthsInDOM uses them (header model may not be same ref / can read stale from DOM)
      const overrideWidths = new Map<string, number>();
      childrenToResize.forEach((h) => {
        if (typeof h.width === "number")
          overrideWidths.set(h.accessor as string, h.width);
      });
      if (isBoundaryResize) {
        mainLeafHeaders.forEach((h) => {
          if (typeof h.width === "number")
            overrideWidths.set(h.accessor as string, h.width);
        });
      }
      updateColumnWidthsInDOM(headers, collapsedHeaders, overrideWidths);
    } else {
      // During drag: update DOM only for better performance
      updateColumnWidthsInDOM(headers, collapsedHeaders);
    }
  };

  // Use RAF to batch resize updates
  let rafId: number | null = null;
  let pendingClientX: number | null = null;
  let lastClientX = startX; // Track last position for final update

  const scheduleUpdate = (clientX: number) => {
    lastClientX = clientX;
    pendingClientX = clientX;

    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        if (pendingClientX !== null) {
          handleMove(pendingClientX, false); // false = DOM only, no React update
          pendingClientX = null;
        }
        rafId = null;
      });
    }
  };

  if (isTouchEvent) {
    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      scheduleUpdate(touch.clientX);
    };

    const handleTouchEnd = () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);

      // Cancel any pending RAF
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }

      // Final update with React state sync
      handleMove(lastClientX, true); // true = update React state

      setIsResizing(false);

      // Notify consumer of width change
      if (onColumnWidthChange) {
        onColumnWidthChange([...headers]);
      }
    };

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  } else {
    const handleMouseMove = (event: MouseEvent) => {
      scheduleUpdate(event.clientX);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      // Cancel any pending RAF
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }

      // Final update with React state sync
      handleMove(lastClientX, true); // true = update React state

      setIsResizing(false);

      // Notify consumer of width change
      if (onColumnWidthChange) {
        onColumnWidthChange([...headers]);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }
};

export type ApplyColumnAutoFitWithAutoExpandParams = {
  collapsedHeaders: Set<Accessor>;
  containerWidth: number;
  getTargetLeafWidth: (leafHeader: HeaderObject) => number;
  header: HeaderObject;
  headerCellElement: HTMLElement | null;
  headers: HeaderObject[];
  mainBodyRef: HandleResizeStartProps["mainBodyRef"];
  /** Persist the auto-fitted column(s)' widths as their natural widths. */
  onAutoExpandNaturalWidths?: (widths: Map<string, number>) => void;
  reverse: boolean;
  /** Natural-width shrink floors (accessor -> px) for compensating neighbors. */
  shrinkFloors?: Map<string, number>;
};

/**
 * Apply a one-shot "fit to content" width for a column while preserving autoExpand
 * compensation (same redistribution rules as dragging the resize handle).
 */
export const applyColumnAutoFitWithAutoExpand = ({
  header,
  headers,
  collapsedHeaders,
  containerWidth,
  mainBodyRef,
  reverse,
  headerCellElement,
  getTargetLeafWidth,
  onAutoExpandNaturalWidths,
  shrinkFloors,
}: ApplyColumnAutoFitWithAutoExpandParams): void => {
  if (!header || isHeaderExcludedFromLayout(header)) return;

  const effectiveContainerWidth = resolveContainerWidthForResize(
    containerWidth,
    mainBodyRef,
  );

  const rootPinned = getRootPinned(header, headers);

  const isParentHeader = Boolean(header.children && header.children.length > 0);
  let childrenToResize: HeaderObject[];
  if (isParentHeader) {
    const visibleChildren = findLeafHeaders(header, collapsedHeaders);
    childrenToResize = visibleChildren.length > 0 ? visibleChildren : [header];
  } else {
    childrenToResize = [header];
  }

  const initialWidthsMap = new Map<string, number>();
  let sectionWidth = 0;
  let initialMainAvailable = 0;

  const sectionHeaders = headers.filter((h) => h.pinned === rootPinned);
  const sectionLeafHeaders = getAllVisibleLeafHeaders(
    sectionHeaders,
    collapsedHeaders,
  );
  sectionLeafHeaders.forEach((h) => {
    const width = getHeaderWidthInPixels(h);
    initialWidthsMap.set(h.accessor as string, width);
  });

  if (effectiveContainerWidth > 0) {
    const { leftWidth, rightWidth, mainWidth } = recalculateAllSectionWidths({
      headers,
      containerWidth: effectiveContainerWidth,
      collapsedHeaders,
    });

    if (rootPinned === "left") {
      sectionWidth = leftWidth;
    } else if (rootPinned === "right") {
      sectionWidth = rightWidth;
    } else {
      sectionWidth = mainWidth;
    }

    const computedMainAvailable = Math.max(
      0,
      effectiveContainerWidth - leftWidth - rightWidth,
    );
    const mainViewportWidth =
      mainBodyRef?.current != null && mainBodyRef.current.clientWidth > 0
        ? mainBodyRef.current.clientWidth
        : 0;
    initialMainAvailable =
      mainViewportWidth > 0
        ? Math.min(computedMainAvailable, mainViewportWidth)
        : computedMainAvailable;
  }

  let isBoundaryResize = false;
  const mainInitialWidths = new Map<string, number>();
  let mainLeafHeaders: HeaderObject[] = [];

  if (rootPinned && effectiveContainerWidth > 0) {
    const sectionLeafs = getAllVisibleLeafHeaders(
      headers.filter((h) => h.pinned === rootPinned),
      collapsedHeaders,
    );

    if (sectionLeafs.length > 0) {
      let atBoundary = false;

      if (childrenToResize.length > 1) {
        const firstIdx = sectionLeafs.findIndex(
          (h) => h.accessor === childrenToResize[0].accessor,
        );
        const lastIdx = sectionLeafs.findIndex(
          (h) =>
            h.accessor ===
            childrenToResize[childrenToResize.length - 1].accessor,
        );
        atBoundary =
          (rootPinned === "left" && lastIdx === sectionLeafs.length - 1) ||
          (rootPinned === "right" && firstIdx === 0);
      } else {
        const target = childrenToResize[0] || header;
        const idx = sectionLeafs.findIndex((h) => h.accessor === target.accessor);
        atBoundary =
          (rootPinned === "left" && idx === sectionLeafs.length - 1) ||
          (rootPinned === "right" && idx === 0);
      }

      if (atBoundary) {
        isBoundaryResize = true;
        const mainHeaders = headers.filter((h) => !h.pinned);
        mainLeafHeaders = getAllVisibleLeafHeaders(mainHeaders, collapsedHeaders);
        mainLeafHeaders.forEach((h) => {
          mainInitialWidths.set(h.accessor as string, getHeaderWidthInPixels(h));
        });
      }
    }
  }

  const targetTotal = childrenToResize.reduce(
    (sum, h) => sum + getTargetLeafWidth(h),
    0,
  );

  const startWidth =
    headerCellElement?.offsetWidth ??
    childrenToResize.reduce((sum, h) => sum + getHeaderWidthInPixels(h), 0);

  const headerToResize =
    childrenToResize.length > 0
      ? childrenToResize[childrenToResize.length - 1]
      : header;

  const delta = targetTotal - startWidth;

  handleResizeWithAutoExpand({
    childrenToResize,
    collapsedHeaders,
    containerWidth: effectiveContainerWidth,
    delta,
    headers,
    initialWidthsMap,
    isParentResize: childrenToResize.length > 1,
    resizedHeader: headerToResize,
    reverse,
    rootPinned,
    sectionHeaders,
    sectionWidth,
    sectionViewportWidth: rootPinned ? sectionWidth : initialMainAvailable,
    shrinkFloors,
    startWidth,
  });

  if (isBoundaryResize && mainLeafHeaders.length > 0) {
    const childDelta = childrenToResize.reduce((sum, h) => {
      const initW = initialWidthsMap.get(h.accessor as string) || 0;
      const newW = typeof h.width === "number" ? h.width : initW;
      return sum + (newW - initW);
    }, 0);

    rescaleMainSectionForBoundaryResize({
      mainLeafHeaders,
      mainInitialWidths,
      newMainAvailable: Math.max(0, initialMainAvailable - childDelta),
      shrinkFloors,
    });
  }

  // The auto-fitted widths are content-derived: record them as the columns'
  // natural widths (shrink floors for subsequent resizes).
  if (onAutoExpandNaturalWidths) {
    const naturals = new Map<string, number>();
    childrenToResize.forEach((h) => {
      if (typeof h.width === "number") naturals.set(h.accessor as string, h.width);
    });
    if (naturals.size > 0) onAutoExpandNaturalWidths(naturals);
  }

  const overrideWidths = new Map<string, number>();
  childrenToResize.forEach((h) => {
    if (typeof h.width === "number")
      overrideWidths.set(h.accessor as string, h.width);
  });
  if (isBoundaryResize) {
    mainLeafHeaders.forEach((h) => {
      if (typeof h.width === "number")
        overrideWidths.set(h.accessor as string, h.width);
    });
  }
  updateColumnWidthsInDOM(headers, collapsedHeaders, overrideWidths);
};
