import type HeaderObject from "../../types/HeaderObject";
import type { Pinned } from "../../types/Pinned";
import { DEFAULT_SHOW_WHEN } from "../../types/HeaderObject";
import { findLeafHeaders, getHeaderWidthInPixels } from "../headerWidthUtils";
import { findParentHeader } from "../collapseUtils";
import { getCellId } from "../cellUtils";
import { recalculateAllSectionWidths } from "./sectionWidths";

/**
 * Get the pinned value from the root header (for nested headers, children inherit from parent)
 */
export const getRootPinned = (
  header: HeaderObject,
  headers: HeaderObject[],
): Pinned | undefined => {
  if (header.pinned) return header.pinned;
  const parent = findParentHeader(headers, header.accessor);
  return parent ? getRootPinned(parent, headers) : undefined;
};

/**
 * Update column widths and positions directly in the DOM without triggering React re-renders
 * This is used during resize drag for better performance
 *
 * IMPORTANT: Positions are calculated per pinned section (left/main/right each start at 0)
 * @param collapsedHeaders - Set of collapsed header accessors; only visible children are laid out (matches findLeafHeaders / SectionRenderer).
 * @param overrideWidths - Optional map of accessor -> width to use for position calculation (e.g. after resize so DOM reflects just-set value)
 */
export const updateColumnWidthsInDOM = (
  headers: HeaderObject[],
  collapsedHeaders?: Set<string>,
  overrideWidths?: Map<string, number>,
): void => {
  // Group headers by pinned section
  const pinnedLeftHeaders: HeaderObject[] = [];
  const mainHeaders: HeaderObject[] = [];
  const pinnedRightHeaders: HeaderObject[] = [];

  headers.forEach((header) => {
    if (header.hide) return;
    const pinned = getRootPinned(header, headers);
    if (pinned === "left") {
      pinnedLeftHeaders.push(header);
    } else if (pinned === "right") {
      pinnedRightHeaders.push(header);
    } else {
      mainHeaders.push(header);
    }
  });

  // Helper to recursively calculate positions; only visible children (by collapsed state) are included
  const calculateHeaderPositions = (
    header: HeaderObject,
    currentLeft: number,
    positions: Map<string, { left: number; width: number }>,
  ): number => {
    const startLeft = currentLeft;

    if (header.children && header.children.length > 0) {
      const isCollapsed = collapsedHeaders?.has(header.accessor as string);
      const visibleChildren = header.children.filter((child) => {
        if (child.hide) return false;
        const showWhen = child.showWhen || DEFAULT_SHOW_WHEN;
        if (isCollapsed)
          return showWhen === "parentCollapsed" || showWhen === "always";
        return showWhen === "parentExpanded" || showWhen === "always";
      });

      // singleRowChildren: parent gets its own column, then each child (matches main columnUtils / RenderCells)
      if (header.singleRowChildren) {
        const parentWidth =
          overrideWidths?.get(header.accessor as string) ??
          (typeof header.width === "number"
            ? header.width
            : getHeaderWidthInPixels(header));
        positions.set(header.accessor, { left: startLeft, width: parentWidth });
        currentLeft = startLeft + parentWidth;
        visibleChildren.forEach((child) => {
          currentLeft = calculateHeaderPositions(child, currentLeft, positions);
        });
        return currentLeft;
      }

      visibleChildren.forEach((child) => {
        currentLeft = calculateHeaderPositions(child, currentLeft, positions);
      });

      // Set parent's position based on children's total width
      const parentWidth = currentLeft - startLeft;
      positions.set(header.accessor, { left: startLeft, width: parentWidth });
    } else {
      // Leaf: prefer override (e.g. just-set resize), then numeric header.width, else getHeaderWidthInPixels (DOM can be stale)
      const width =
        overrideWidths?.get(header.accessor as string) ??
        (typeof header.width === "number"
          ? header.width
          : getHeaderWidthInPixels(header));
      positions.set(header.accessor, { left: currentLeft, width });
      currentLeft += width;
    }

    return currentLeft;
  };

  // Helper to calculate positions for a section (each section starts at left: 0)
  // Returns positions for both leaf headers and parent headers
  const calculateSectionPositions = (
    sectionHeaders: HeaderObject[],
  ): Map<string, { left: number; width: number }> => {
    const positions = new Map<string, { left: number; width: number }>();
    let currentLeft = 0;

    sectionHeaders.forEach((header) => {
      currentLeft = calculateHeaderPositions(header, currentLeft, positions);
    });

    return positions;
  };

  // Calculate positions for each section independently
  const pinnedLeftPositions = calculateSectionPositions(pinnedLeftHeaders);
  const mainPositions = calculateSectionPositions(mainHeaders);
  const pinnedRightPositions = calculateSectionPositions(pinnedRightHeaders);

  // Combine all positions
  const allPositions = new Map<string, { left: number; width: number }>();
  pinnedLeftPositions.forEach((value, key) => allPositions.set(key, value));
  mainPositions.forEach((value, key) => allPositions.set(key, value));
  pinnedRightPositions.forEach((value, key) => allPositions.set(key, value));

  // Update each header and its body cells
  allPositions.forEach((position, accessor) => {
    const { left, width } = position;

    // Update header cell
    const cellId = getCellId({ accessor, rowId: "header" });
    const headerCell = document.getElementById(cellId);
    const isPinnedLeft = pinnedLeftPositions.has(accessor);
    const isPinnedRight = pinnedRightPositions.has(accessor);
    const isPinned = isPinnedLeft || isPinnedRight;
    // #region agent log
    if (isPinned) {
      const section = headerCell?.closest(
        ".st-header-pinned-left, .st-header-pinned-right",
      );
      const sectionEl = section as HTMLElement | undefined;
      fetch(
        "http://127.0.0.1:7804/ingest/f02fadf8-371e-4d39-8781-dc371552f5fd",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "88e0e6",
          },
          body: JSON.stringify({
            sessionId: "88e0e6",
            location: "resizeUtils/domUpdates.ts:updateColumnWidthsInDOM",
            message: "pinned resize DOM update",
            data: {
              accessor,
              isPinnedLeft,
              isPinnedRight,
              setWidth: width,
              headerCellFound: !!headerCell,
              sectionWidthBefore:
                sectionEl?.style?.width ?? sectionEl?.offsetWidth,
              overrideWidths: overrideWidths
                ? Object.fromEntries(overrideWidths)
                : undefined,
            },
            timestamp: Date.now(),
            hypothesisId: "H1_H2_H3",
          }),
        },
      ).catch(() => {});
    }
    // #endregion
    if (headerCell) {
      headerCell.style.left = `${left}px`;
      headerCell.style.width = `${width}px`;
    }

    // Update all body cells in this column (only for leaf headers, not parents)
    const bodyCells = document.querySelectorAll(`[id$="-${accessor}"]`);
    bodyCells.forEach((cell) => {
      if (cell instanceof HTMLElement && !cell.id.endsWith("-header")) {
        cell.style.left = `${left}px`;
        cell.style.width = `${width}px`;
      }
    });
  });

  // During resize drag, pinned section width is only set on full render. Reuse the same logic as
  // TableRenderer: recalculateAllSectionWidths then apply to section DOM (header + body).
  // Header sections do not use display:grid (see base.css), so we only need to update width.
  const tableContainer = document.querySelector(
    ".st-body-container",
  ) as HTMLElement | null;
  const containerWidth = tableContainer?.clientWidth ?? 0;
  const { leftWidth, rightWidth } = recalculateAllSectionWidths({
    headers,
    containerWidth: containerWidth > 0 ? containerWidth : undefined,
    collapsedHeaders: collapsedHeaders as Set<string> | undefined,
  });

  if (leftWidth > 0) {
    const leftHeaderSection = document.querySelector(
      ".st-header-pinned-left",
    ) as HTMLElement | null;
    const leftBodySection = document.querySelector(
      ".st-body-pinned-left",
    ) as HTMLElement | null;
    if (leftHeaderSection) leftHeaderSection.style.width = `${leftWidth}px`;
    if (leftBodySection) leftBodySection.style.width = `${leftWidth}px`;
  }
  if (rightWidth > 0) {
    const rightHeaderSection = document.querySelector(
      ".st-header-pinned-right",
    ) as HTMLElement | null;
    const rightBodySection = document.querySelector(
      ".st-body-pinned-right",
    ) as HTMLElement | null;
    if (rightHeaderSection) rightHeaderSection.style.width = `${rightWidth}px`;
    if (rightBodySection) rightBodySection.style.width = `${rightWidth}px`;
  }

  // #region agent log
  if (leftWidth > 0 || rightWidth > 0) {
    const leftHeaderSection = document.querySelector(
      ".st-header-pinned-left",
    ) as HTMLElement;
    const rightHeaderSection = document.querySelector(
      ".st-header-pinned-right",
    ) as HTMLElement;
    fetch("http://127.0.0.1:7804/ingest/f02fadf8-371e-4d39-8781-dc371552f5fd", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "88e0e6",
      },
      body: JSON.stringify({
        sessionId: "88e0e6",
        location: "resizeUtils/domUpdates.ts:updateColumnWidthsInDOM:sectionWidths",
        message: "pinned section widths",
        data: {
          leftWidth,
          rightWidth,
          leftSectionDOMWidth: leftHeaderSection?.style?.width,
          rightSectionDOMWidth: rightHeaderSection?.style?.width,
        },
        timestamp: Date.now(),
        hypothesisId: "H1",
      }),
    }).catch(() => {});
  }
  // #endregion
};
