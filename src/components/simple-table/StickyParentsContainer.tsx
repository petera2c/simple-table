import { Fragment, useMemo } from "react";
import { useTableContext } from "../../context/TableContext";
import TableRow from "../../types/TableRow";
import { ROW_SEPARATOR_WIDTH } from "../../consts/general-consts";
import TableRowComponent from "./TableRow";
import TableRowSeparator from "./TableRowSeparator";
import { rowIdToString } from "../../utils/rowUtils";
import { calculateColumnIndices } from "../../utils/columnIndicesUtils";
import RowIndices from "../../types/RowIndices";
import HeaderObject from "../../types/HeaderObject";
import { CumulativeHeightMap } from "../../utils/infiniteScrollUtils";

interface StickyParentsContainerProps {
  calculatedHeaderHeight: number;
  heightMap?: CumulativeHeightMap;
  mainTemplateColumns: string;
  partiallyVisibleRows: TableRow[];
  pinnedLeftColumns: HeaderObject[];
  pinnedLeftTemplateColumns: string;
  pinnedLeftWidth: number;
  pinnedRightColumns: HeaderObject[];
  pinnedRightTemplateColumns: string;
  pinnedRightWidth: number;
  rowIndices: RowIndices;
  scrollTop: number;
  scrollbarWidth: number;
  setHoveredIndex: (index: number | null) => void;
  stickyParents: TableRow[];
}

const StickyParentsContainer = ({
  calculatedHeaderHeight,
  stickyParents,
  mainTemplateColumns,
  pinnedLeftColumns,
  pinnedLeftTemplateColumns,
  pinnedLeftWidth,
  pinnedRightColumns,
  pinnedRightTemplateColumns,
  pinnedRightWidth,
  setHoveredIndex,
  rowIndices,
  scrollbarWidth,
  scrollTop,
  heightMap,
  partiallyVisibleRows,
}: StickyParentsContainerProps) => {
  const { headers, rowHeight, collapsedHeaders, customTheme } = useTableContext();

  // Calculate offset for transitioning between sibling trees in sticky parents
  const treeTransitionOffset = useMemo(() => {
    if (stickyParents.length === 0) {
      return 0;
    }

    // Find where a new sibling tree starts (same depth parents)
    let newTreeStartIndex = -1;

    for (let i = 0; i < stickyParents.length; i++) {
      const currentParent = stickyParents[i];
      const nextParent = stickyParents[i + 1];

      if (nextParent.depth === currentParent.depth) {
        newTreeStartIndex = i;
        break;
      } else if (nextParent.depth < currentParent.depth) {
        newTreeStartIndex = stickyParents.findIndex(
          (parent) => parent.depth === currentParent.depth
        );
        break;
      }
    }

    if (newTreeStartIndex === -1) {
      return 0;
    }

    const oldTreeParentPosition = stickyParents[newTreeStartIndex]?.position;

    if (oldTreeParentPosition === undefined) {
      return 0;
    }

    // Count remaining visible rows from the old tree
    let rowsLeftFromOldTree = 0;

    for (const row of partiallyVisibleRows) {
      if (row.parentIndices?.includes(oldTreeParentPosition)) {
        rowsLeftFromOldTree++;
      } else {
        break;
      }
    }

    if (rowsLeftFromOldTree === 0) {
      return 0;
    }

    const firstRowFromOldTree = partiallyVisibleRows[0];

    // Get row's top position
    let firstRowTopPosition: number;
    if (heightMap) {
      firstRowTopPosition = heightMap.rowTopPositions[firstRowFromOldTree.position];
    } else {
      firstRowTopPosition =
        firstRowFromOldTree.position * (rowHeight + customTheme.rowSeparatorWidth);
    }

    const pixelsScrolledOutOfView = Math.max(0, scrollTop - firstRowTopPosition);
    const parentsFromOldTree = newTreeStartIndex + 1;

    // Offset = freed sticky slots + pixels scrolled out
    const offset = (parentsFromOldTree - rowsLeftFromOldTree) * rowHeight + pixelsScrolledOutOfView;

    return offset;
  }, [customTheme, heightMap, partiallyVisibleRows, rowHeight, scrollTop, stickyParents]);

  // Calculate column indices
  const columnIndices = useMemo(() => {
    return calculateColumnIndices({
      headers,
      pinnedLeftColumns,
      pinnedRightColumns,
      collapsedHeaders,
    });
  }, [headers, pinnedLeftColumns, pinnedRightColumns, collapsedHeaders]);

  // Calculate total height for sticky container
  const stickyHeight =
    stickyParents.length > 0 ? stickyParents.length * (rowHeight + ROW_SEPARATOR_WIDTH) : 0;

  if (stickyParents.length === 0) return null;

  // Render sticky rows for a specific section
  const renderStickySection = (
    templateColumns: string,
    sectionHeaders: HeaderObject[],
    pinned?: "left" | "right",
    width?: number,
    columnIndexStart: number = 0
  ) => {
    return (
      <div
        className={pinned ? `st-sticky-section-${pinned}` : "st-sticky-section-main"}
        style={{
          position: "relative",
          height: `${stickyHeight}px`,
          width: pinned ? `${width}px` : undefined,
          flexGrow: pinned ? 0 : 1,
          flexShrink: pinned ? 0 : undefined,
        }}
      >
        {stickyParents.map((tableRow, stickyIndex) => {
          const rowId = tableRow.stateIndicator
            ? `sticky-state-${tableRow.stateIndicator.parentRowId}-${tableRow.position}`
            : `sticky-${rowIdToString(tableRow.rowId)}`;

          // Calculate the Y position for this sticky row's separator
          const separatorTop =
            (stickyIndex + 1) * (rowHeight + ROW_SEPARATOR_WIDTH) - ROW_SEPARATOR_WIDTH;

          return (
            <Fragment key={rowId}>
              <TableRowComponent
                columnIndexStart={columnIndexStart}
                columnIndices={columnIndices}
                gridTemplateColumns={templateColumns}
                headers={sectionHeaders}
                index={tableRow.position}
                pinned={pinned}
                rowHeight={rowHeight}
                rowIndices={rowIndices}
                setHoveredIndex={setHoveredIndex}
                tableRow={tableRow}
                isSticky={true}
                stickyIndex={stickyIndex}
              />
              {/* Add separator after each sticky row - never use strong border for sticky rows */}
              <TableRowSeparator
                displayStrongBorder={false}
                position={separatorTop}
                rowHeight={rowHeight}
                templateColumns={templateColumns}
                isSticky={true}
              />
            </Fragment>
          );
        })}
      </div>
    );
  };

  const currentHeaders = headers.filter((header) => !header.pinned);

  // Calculate width accounting for scrollbar
  const containerWidth = `calc(100% - ${scrollbarWidth}px)`;

  return (
    <div
      className="st-sticky-top"
      style={{
        height: `${stickyHeight}px`,
        width: containerWidth,
        top: `${calculatedHeaderHeight}px`,
      }}
    >
      {/* Left pinned section */}
      {pinnedLeftColumns.length > 0 &&
        renderStickySection(
          pinnedLeftTemplateColumns,
          pinnedLeftColumns,
          "left",
          pinnedLeftWidth,
          0
        )}

      {/* Main center section */}
      {renderStickySection(
        mainTemplateColumns,
        currentHeaders,
        undefined,
        undefined,
        pinnedLeftColumns.length
      )}

      {/* Right pinned section */}
      {pinnedRightColumns.length > 0 &&
        renderStickySection(
          pinnedRightTemplateColumns,
          pinnedRightColumns,
          "right",
          pinnedRightWidth,
          pinnedLeftColumns.length + currentHeaders.length
        )}
    </div>
  );
};

export default StickyParentsContainer;
