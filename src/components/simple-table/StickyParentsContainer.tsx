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
    let firstTreeBoundaryIndex = -1;

    for (let i = 1; i < stickyParents.length; i++) {
      const currentParent = stickyParents[i];
      const previousParent = stickyParents[i - 1];

      // Check if they're at the same depth
      if (currentParent.depth === previousParent.depth) {
        // Check if they're siblings (have the same parent indices except for the last one)
        const currentParentIndices = currentParent.parentIndices || [];
        const previousParentIndices = previousParent.parentIndices || [];

        // If they have the same parent chain length and share the same parents (except themselves)
        // then they are siblings, indicating a tree boundary
        if (currentParentIndices.length === previousParentIndices.length) {
          // For depth > 0, check if they share the same immediate parent
          if (currentParent.depth > 0) {
            const currentParentPos = currentParentIndices[currentParentIndices.length - 1];
            const previousParentPos = previousParentIndices[previousParentIndices.length - 1];

            // If they have the same immediate parent, they're siblings
            if (currentParentPos === previousParentPos) {
              firstTreeBoundaryIndex = i;
              break;
            }
          } else {
            // For depth 0, any second depth-0 parent is a new tree
            firstTreeBoundaryIndex = i;
            break;
          }
        }
      }
    }

    // If no tree boundary found, we're in a single tree - no offset needed
    if (firstTreeBoundaryIndex === -1) {
      return 0;
    }

    console.log("\n");

    // Get the old tree's sticky parents (before the boundary)
    const oldTreeStickyParents = stickyParents.slice(0, firstTreeBoundaryIndex);
    const oldTreeStickyPositions = new Set(oldTreeStickyParents.map((p) => p.position));

    console.log(stickyParents[firstTreeBoundaryIndex]);

    // TODO: Calculate the actual offset based on visibility
    return 0;
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
