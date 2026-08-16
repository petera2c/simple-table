import ColumnDef, { Accessor } from "../../types/ColumnDef";
import TableRow from "../../types/TableRow";
import { AbsoluteCell } from "../../utils/headerCellRenderer";
import { AbsoluteBodyCell } from "../../utils/bodyCellRenderer";
import { rowIdToString } from "../../utils/rowUtils";
import { getCellId, isHeaderExcludedFromLayout } from "../../utils/cellUtils";
import type { CellPosition } from "../../managers/AnimationCoordinator";
import { calculateRowTopPosition } from "../../utils/infiniteScrollUtils";

/**
 * Per-section snapshot of just enough state to recompute every cell position
 * (left × top for every row × every leaf header) on demand. Used by the
 * animation coordinator: it needs positions for off-screen rows so cells
 * sliding in or out of the visible band have a real "from" / "to" point.
 *
 * Rebuilt on every body section render so it always reflects the layout the
 * user is currently looking at — i.e. when captureAnimationSnapshot fires
 * before the next render runs, this represents the *pre-change* layout.
 */
export interface BodySectionSnapshotConfig {
  rows: TableRow[];
  headerPositions: Array<{ accessor: Accessor; left: number; width: number }>;
  rowHeight: number;
  heightOffsets?: Array<[number, number]>;
  customTheme?: any;
  /** When > 0, each row's `position` is treated as a global flattened-list
   * index and shifted by this amount when computing `top`. This lets the
   * snapshot include off-page rows (positioned above/below the viewport)
   * for paginated tables. */
  pageStartIndex?: number;
}

/**
 * Compute every cell position (every row × every leaf header) implied by a
 * snapshot config. Used both for FLIP "First" snapshots (pre-change layout)
 * and to feed the renderer the post-change layout for cells that exit the
 * visible band — the off-screen `top` is what we want them to slide *to*.
 */
export function computeFullSectionLayout(
  config: BodySectionSnapshotConfig,
): Map<string, CellPosition> {
  const layout = new Map<string, CellPosition>();
  const dataRows = config.rows.filter((r) => !r.nestedTable && !r.stateIndicator);
  const usingGlobalPositions = config.pageStartIndex !== undefined;
  for (const tableRow of dataRows) {
    let top: number;
    if (usingGlobalPositions) {
      // Snapshot covers the full pre-pagination dataset; convert each row's
      // global flattened-list index into a viewport-relative offset so that
      // on-page rows align with the DOM (which uses page-relative `position`)
      // and off-page rows fall above (negative `top`) or below the viewport.
      // Skipping the heightOffsets/customTheme path is intentional here: the
      // off-page positions don't need to honor expanded nested-row heights —
      // they only need to be "off-screen" so cells can FLIP in/out of view.
      top = (tableRow.position - (config.pageStartIndex ?? 0)) * config.rowHeight;
    } else {
      top = config.customTheme
        ? calculateRowTopPosition({
            position: tableRow.position,
            rowHeight: config.rowHeight,
            heightOffsets: config.heightOffsets,
            customTheme: config.customTheme,
          })
        : tableRow.position * config.rowHeight;
    }
    const rowKey = tableRow.stableRowKey ?? rowIdToString(tableRow.rowId);
    for (const header of config.headerPositions) {
      const cellId = getCellId({
        accessor: header.accessor,
        rowId: rowKey,
      });
      layout.set(cellId, {
        left: header.left,
        top,
        width: header.width,
        height: config.rowHeight,
      });
    }
  }
  return layout;
}

export function getLeafHeaders(
  headers: ColumnDef[],
  collapsedHeaders: Set<Accessor>,
): ColumnDef[] {
  const leaves: ColumnDef[] = [];

  const processHeader = (header: ColumnDef): void => {
    if (isHeaderExcludedFromLayout(header)) return;

    const isCollapsed = collapsedHeaders.has(header.accessor);
    const hasChildren = header.children && header.children.length > 0;

    if (hasChildren) {
      const visibleChildren = header.children!.filter((child) => {
        if (isHeaderExcludedFromLayout(child)) return false;
        const showWhen = child.showWhen || "parentExpanded";
        if (isCollapsed) {
          return showWhen === "parentCollapsed" || showWhen === "always";
        } else {
          return showWhen === "parentExpanded" || showWhen === "always";
        }
      });

      if (header.singleRowChildren) {
        leaves.push(header);
      }

      if (visibleChildren.length > 0) {
        visibleChildren.forEach((child) => processHeader(child));
      } else if (!header.singleRowChildren) {
        leaves.push(header);
      }
    } else {
      leaves.push(header);
    }
  };

  headers.forEach((header) => processHeader(header));

  return leaves;
}

export function calculateAbsoluteHeaderCells(
  headers: ColumnDef[],
  collapsedHeaders: Set<Accessor>,
  maxDepth: number,
  headerHeight: number,
  startColIndex: number = 0,
): AbsoluteCell[] {
  const cells: AbsoluteCell[] = [];
  let colIndex = startColIndex;
  let currentLeft = 0;

  const processHeader = (
    header: ColumnDef,
    depth: number,
    parentHeader?: ColumnDef,
  ): number => {
    if (isHeaderExcludedFromLayout(header)) return 0;

    const isCollapsed = collapsedHeaders.has(header.accessor);
    const hasChildren = header.children && header.children.length > 0;

    if (hasChildren) {
      const visibleChildren = header.children!.filter((child) => {
        if (isHeaderExcludedFromLayout(child)) return false;
        const showWhen = child.showWhen || "parentExpanded";
        if (isCollapsed) {
          return showWhen === "parentCollapsed" || showWhen === "always";
        } else {
          return showWhen === "parentExpanded" || showWhen === "always";
        }
      });

      if (header.singleRowChildren) {
        const width = typeof header.width === "number" ? header.width : 150;
        cells.push({
          header,
          left: currentLeft,
          top: depth * headerHeight,
          width,
          height: (maxDepth - depth) * headerHeight,
          colIndex,
          parentHeader,
        });
        colIndex++;
        currentLeft += width;

        let childrenWidth = 0;
        visibleChildren.forEach((child) => {
          childrenWidth += processHeader(child, depth, header);
        });

        return width + childrenWidth;
      }

      if (visibleChildren.length === 0) {
        const width = typeof header.width === "number" ? header.width : 150;
        cells.push({
          header,
          left: currentLeft,
          top: depth * headerHeight,
          width,
          height: (maxDepth - depth) * headerHeight,
          colIndex,
          parentHeader,
        });
        colIndex++;
        currentLeft += width;
        return width;
      }

      // Parent with children - process children first, then add parent cell.
      // colIndex must be the first leaf index under this group: getHeaderLeafIndices
      // and column-highlight logic assume parent headers start at their first child's index.
      // (Using the post-children colIndex wrongly made the next sibling's first leaf match this group.)
      const parentLeft = currentLeft;
      const groupStartColIndex = colIndex;
      let totalChildrenWidth = 0;
      visibleChildren.forEach((child) => {
        totalChildrenWidth += processHeader(child, depth + 1, header);
      });

      // Add parent cell spanning all children
      cells.push({
        header,
        left: parentLeft,
        top: depth * headerHeight,
        width: totalChildrenWidth,
        height: headerHeight,
        colIndex: groupStartColIndex,
        parentHeader,
      });

      return totalChildrenWidth;
    } else {
      const width = typeof header.width === "number" ? header.width : 150;
      cells.push({
        header,
        left: currentLeft,
        top: depth * headerHeight,
        width,
        height: (maxDepth - depth) * headerHeight,
        colIndex,
        parentHeader,
      });
      colIndex++;
      currentLeft += width;
      return width;
    }
  };

  headers.forEach((header) => processHeader(header, 0));

  return cells;
}

export function calculateAbsoluteBodyCells(
  headers: ColumnDef[],
  rows: TableRow[],
  collapsedHeaders: Set<Accessor>,
  rowHeight: number,
  heightOffsets?: Array<[number, number]>,
  customTheme?: any,
  startColIndex: number = 0,
): AbsoluteBodyCell[] {
  const cells: AbsoluteBodyCell[] = [];

  // Exclude nested table rows and state indicator rows – both are rendered as full-width rows, not per-column cells
  const rowsForCells = rows.filter((r) => !r.nestedTable && !r.stateIndicator);

  const leafHeaders = getLeafHeaders(headers, collapsedHeaders);

  // Build header positions map with accumulated widths
  const headerPositions = new Map<string, { left: number; width: number }>();
  let currentLeft = 0;
  leafHeaders.forEach((header) => {
    const width = typeof header.width === "number" ? header.width : 150;
    headerPositions.set(header.accessor, { left: currentLeft, width });
    currentLeft += width;
  });

  rowsForCells.forEach((tableRow, rowIndex) => {
    // Calculate proper top position using calculateRowTopPosition
    const topPosition = customTheme
      ? calculateRowTopPosition({
          position: tableRow.position,
          rowHeight,
          heightOffsets,
          customTheme,
        })
      : rowIndex * rowHeight;

    // Derive odd/even from the row's absolute table position rather than
    // its index in the rendered (virtualized) slice. The slice index changes
    // every time the user scrolls, which would otherwise flip a row's
    // odd/even class as soon as it's reused for a different visible row.
    const isOdd = tableRow.position % 2 === 1;

    leafHeaders.forEach((header, leafIndex) => {
      const position = headerPositions.get(header.accessor);
      const colIndex = startColIndex + leafIndex;
      cells.push({
        header,
        row: tableRow.row,
        rowIndex,
        colIndex,
        rowId: rowIdToString(tableRow.rowId),
        stableRowKey: tableRow.stableRowKey,
        displayRowNumber: tableRow.displayPosition,
        depth: tableRow.depth,
        isOdd,
        tableRow,
        left: position?.left ?? 0,
        top: topPosition,
        width: position?.width ?? 150,
        height: rowHeight,
      });
    });
  });

  return cells;
}


export function buildBodySectionSnapshotConfig(
  headers: ColumnDef[],
  collapsedHeaders: Set<Accessor>,
  rows: TableRow[],
  rowHeight: number,
  heightOffsets?: Array<[number, number]>,
  customTheme?: any,
  pageStartIndex?: number,
): BodySectionSnapshotConfig {
  const leafHeaders = getLeafHeaders(headers, collapsedHeaders);
  const headerPositions: Array<{ accessor: Accessor; left: number; width: number }> = [];
  let currentLeft = 0;
  for (const header of leafHeaders) {
    const width = typeof header.width === "number" ? header.width : 150;
    headerPositions.push({ accessor: header.accessor, left: currentLeft, width });
    currentLeft += width;
  }
  return {
    rows,
    headerPositions,
    rowHeight,
    heightOffsets,
    customTheme,
    pageStartIndex,
  };
}
