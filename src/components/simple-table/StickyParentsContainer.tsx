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

const copyObject = (obj: Record<string, any>) => {
  const newObj = {} as Record<string, any>;
  for (const key in obj) {
    if (key === "row") {
      newObj[key] = {
        id: obj.row.id,
        organization: obj.row.organization,
      };
    } else {
      newObj[key] = obj[key];
    }
  }
  return newObj;
};

interface StickyParentsContainerProps {
  calculatedHeaderHeight: number;
  stickyParents: TableRow[];
  mainTemplateColumns: string;
  pinnedLeftColumns: HeaderObject[];
  pinnedLeftTemplateColumns: string;
  pinnedLeftWidth: number;
  pinnedRightColumns: HeaderObject[];
  pinnedRightTemplateColumns: string;
  pinnedRightWidth: number;
  setHoveredIndex: (index: number | null) => void;
  rowIndices: RowIndices;
  scrollbarWidth: number;
  scrollTop: number;
  contentHeight: number;
  heightMap?: CumulativeHeightMap;
  partiallyVisibleRows: TableRow[];
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
  contentHeight,
  heightMap,
  partiallyVisibleRows,
}: StickyParentsContainerProps) => {
  const { headers, rowHeight, collapsedHeaders, tableRows, customTheme, rowGrouping } =
    useTableContext();

  // Calculate tree transition offset for multi-tree scenarios
  const treeTransitionOffset = useMemo(() => {
    // Early return if no sticky parents
    if (stickyParents.length === 0) {
      return 0;
    }

    // Check if there are multiple trees/sibling groups in stickyParents
    // A new tree/sibling starts when we have parents at the same depth that are siblings
    // We detect this by checking if consecutive sticky parents at the same depth have different parent chains
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

    // Get the position of the parent row we're transitioning away from
    // This is the sticky parent right after newTreeStartIndex (the one being pushed out)
    const oldTreeParentPosition = stickyParents[newTreeStartIndex]?.position;

    if (oldTreeParentPosition === undefined) {
      return 0;
    }

    // Count how many rows in partiallyVisibleRows belong to the old tree parent
    // A row belongs to the old tree if it has oldTreeParentPosition in its parentIndices
    let rowsLeftFromOldTree = 0;

    for (const row of partiallyVisibleRows) {
      if (row.parentIndices?.includes(oldTreeParentPosition)) {
        rowsLeftFromOldTree++;
      } else {
        // Stop when we encounter a row that doesn't belong to the old tree parent
        break;
      }
    }

    if (rowsLeftFromOldTree === 0) {
      return 0;
    }

    // Get the first row from the old tree
    const firstRowFromOldTree = partiallyVisibleRows[0];

    // Calculate the top position of this row
    let firstRowTopPosition: number;
    if (heightMap) {
      firstRowTopPosition = heightMap.rowTopPositions[firstRowFromOldTree.position];
    } else {
      // Fallback to fixed-height calculation
      firstRowTopPosition =
        firstRowFromOldTree.position * (rowHeight + customTheme.rowSeparatorWidth);
    }

    // Calculate how many pixels of the first row are scrolled out of view (above the viewport)
    const pixelsScrolledOutOfView = Math.max(0, scrollTop - firstRowTopPosition);

    // Count how many sticky parents belong to the old tree (before the new tree starts)
    // This is all sticky parents from index 0 up to (but not including) newTreeStartIndex
    const parentsFromOldTree = newTreeStartIndex + 1;

    // Calculate the offset:
    // - If we have fewer rows left than sticky parents, some parent slots are "freed up"
    // - Each freed slot contributes rowHeight pixels
    // - Plus the pixels of the first row that are scrolled out of view
    const offset = (parentsFromOldTree - rowsLeftFromOldTree) * rowHeight + pixelsScrolledOutOfView;

    return offset;
  }, [stickyParents, scrollTop, partiallyVisibleRows]);

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
