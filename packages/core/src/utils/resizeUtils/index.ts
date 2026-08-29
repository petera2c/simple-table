import type ColumnDef from "../../types/ColumnDef";
import type { Accessor } from "../../types/ColumnDef";
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
import { resolveTableRoot } from "../tableDomScope";

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
  mainLeafHeaders: ColumnDef[];
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

  const tableRoot = resolveTableRoot(mainBodyRef?.current);
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
  let childrenToResize: ColumnDef[];
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
      const width = getHeaderWidthInPixels(h, tableRoot);
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

  // When a pinned column resize changes the pinned strip's total width, the
  // main section must scale with it. Use the net change across all pinned
  // leaves so neighbor-only compensation (strip total unchanged) does not
  // shrink the main grid.
  const mainInitialWidths = new Map<string, number>();
  let mainLeafHeaders: ColumnDef[] = [];
  let pinnedSectionLeafs: ColumnDef[] = [];

  if (autoExpandColumns && rootPinned && effectiveContainerWidth > 0) {
    pinnedSectionLeafs = getAllVisibleLeafHeaders(
      headers.filter((h) => h.pinned === rootPinned),
      collapsedHeaders,
    );

    if (pinnedSectionLeafs.length > 0) {
      const mainHeaders = headers.filter((h) => !h.pinned);
      mainLeafHeaders = getAllVisibleLeafHeaders(mainHeaders, collapsedHeaders);
      mainLeafHeaders.forEach((h) => {
        mainInitialWidths.set(h.accessor as string, getHeaderWidthInPixels(h, tableRoot));
      });
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

      // When the pinned strip's total width changed, rescale main so the
      // sections still fill the container. Neighbor-only compensation nets
      // to 0 and leaves main alone.
      if (rootPinned && mainLeafHeaders.length > 0) {
        const sectionNetDelta = pinnedSectionLeafs.reduce((sum, h) => {
          const initW = initialWidthsMap.get(h.accessor as string) || 0;
          const newW = typeof h.width === "number" ? h.width : initW;
          return sum + (newW - initW);
        }, 0);

        if (sectionNetDelta !== 0) {
          rescaleMainSectionForBoundaryResize({
            mainLeafHeaders,
            mainInitialWidths,
            newMainAvailable: Math.max(0, initialMainAvailable - sectionNetDelta),
            shrinkFloors,
          });
        }
      }
    } else {
      // Normal resize mode
      // Calculate maximum allowable width based on container constraints
      const maxWidth = calculateMaxHeaderWidth({
        header,
        headers,
        collapsedHeaders,
        tableRoot,
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
        removeAllFractionalWidths(h, tableRoot);
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
      if (rootPinned) {
        mainLeafHeaders.forEach((h) => {
          if (typeof h.width === "number")
            overrideWidths.set(h.accessor as string, h.width);
        });
      }
      updateColumnWidthsInDOM(headers, collapsedHeaders, overrideWidths, tableRoot);
    } else {
      // During drag: update DOM only for better performance
      updateColumnWidthsInDOM(headers, collapsedHeaders, undefined, tableRoot);
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
  getTargetLeafWidth: (leafHeader: ColumnDef) => number;
  header: ColumnDef;
  headerCellElement: HTMLElement | null;
  headers: ColumnDef[];
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

  const tableRoot = resolveTableRoot(mainBodyRef?.current);
  const effectiveContainerWidth = resolveContainerWidthForResize(
    containerWidth,
    mainBodyRef,
  );

  const rootPinned = getRootPinned(header, headers);

  const isParentHeader = Boolean(header.children && header.children.length > 0);
  let childrenToResize: ColumnDef[];
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
    const width = getHeaderWidthInPixels(h, tableRoot);
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

  const mainInitialWidths = new Map<string, number>();
  let mainLeafHeaders: ColumnDef[] = [];

  if (rootPinned && effectiveContainerWidth > 0 && sectionLeafHeaders.length > 0) {
    const mainHeaders = headers.filter((h) => !h.pinned);
    mainLeafHeaders = getAllVisibleLeafHeaders(mainHeaders, collapsedHeaders);
    mainLeafHeaders.forEach((h) => {
      mainInitialWidths.set(h.accessor as string, getHeaderWidthInPixels(h, tableRoot));
    });
  }

  const targetTotal = childrenToResize.reduce(
    (sum, h) => sum + getTargetLeafWidth(h),
    0,
  );

  const startWidth =
    headerCellElement?.offsetWidth ??
    childrenToResize.reduce((sum, h) => sum + getHeaderWidthInPixels(h, tableRoot), 0);

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

  if (rootPinned && mainLeafHeaders.length > 0) {
    const sectionNetDelta = sectionLeafHeaders.reduce((sum, h) => {
      const initW = initialWidthsMap.get(h.accessor as string) || 0;
      const newW = typeof h.width === "number" ? h.width : initW;
      return sum + (newW - initW);
    }, 0);

    if (sectionNetDelta !== 0) {
      rescaleMainSectionForBoundaryResize({
        mainLeafHeaders,
        mainInitialWidths,
        newMainAvailable: Math.max(0, initialMainAvailable - sectionNetDelta),
        shrinkFloors,
      });
    }
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
  if (rootPinned) {
    mainLeafHeaders.forEach((h) => {
      if (typeof h.width === "number")
        overrideWidths.set(h.accessor as string, h.width);
    });
  }
  updateColumnWidthsInDOM(headers, collapsedHeaders, overrideWidths, tableRoot);
};
