import type HeaderObject from "../../types/HeaderObject";
import type { HandleResizeStartProps } from "../../types/HandleResizeStartProps";
import {
  findLeafHeaders,
  getHeaderWidthInPixels,
  removeAllFractionalWidths,
  getHeaderMinWidth,
  getAllVisibleLeafHeaders,
} from "../headerWidthUtils";
import { getRootPinned, updateColumnWidthsInDOM } from "./domUpdates";
import { recalculateAllSectionWidths } from "./sectionWidths";
import { calculateMaxHeaderWidth } from "./maxWidth";
import { handleParentHeaderResize } from "./parentHeaderResize";
import { handleResizeWithAutoExpand } from "./autoExpandResize";

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
  reverse = false,
  setHeaders,
  setIsResizing,
  startWidth,
}: HandleResizeStartProps): void => {
  event.preventDefault();
  const startX = "clientX" in event ? event.clientX : event.touches[0].clientX;
  const isTouchEvent = "touches" in event;

  if (!header || header.hide) return;

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

      initialMainAvailable = effectiveContainerWidth - leftWidth - rightWidth;
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
        startWidth,
      });

      // When a boundary column of a pinned section is resized, the main section
      // must scale proportionally so all sections together fill the container.
      if (isBoundaryResize && mainLeafHeaders.length > 0) {
        const childDelta = childrenToResize.reduce((sum, h) => {
          const initW = initialWidthsMap.get(h.accessor as string) || 0;
          const newW = typeof h.width === "number" ? h.width : initW;
          return sum + (newW - initW);
        }, 0);

        const newMainAvailable = Math.max(0, initialMainAvailable - childDelta);
        const initialMainTotal = Array.from(mainInitialWidths.values()).reduce(
          (a, b) => a + b,
          0,
        );

        if (newMainAvailable > 0 && initialMainTotal > 0) {
          const scale = newMainAvailable / initialMainTotal;
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
        }
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
