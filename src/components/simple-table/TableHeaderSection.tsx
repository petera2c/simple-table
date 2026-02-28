import { useMemo } from "react";
import { displayCell } from "../../utils/cellUtils";
import { Pinned } from "../../types/Pinned";
import TableHeaderCell from "./TableHeaderCell";
import TableHeaderSectionProps from "../../types/TableHeaderSectionProps";
import { HeaderObject } from "../..";
import { ScrollSyncPane } from "../scroll-sync/ScrollSyncPane";
import { useTableContext } from "../../context/TableContext";

// Define a type for grid cell position
type GridCell = {
  header: HeaderObject;
  gridColumnStart: number;
  gridColumnEnd: number;
  gridRowStart: number;
  gridRowEnd: number;
  colIndex: number;
  parentHeader?: HeaderObject; // Reference to parent header for styling purposes
};

const TableHeaderSection = ({
  calculatedHeaderHeight,
  columnIndices,
  gridTemplateColumns,
  handleScroll,
  headers,
  leftOffset = 0,
  maxDepth,
  pinned,
  sectionRef,
  sort,
  width,
}: TableHeaderSectionProps) => {
  const { collapsedHeaders, autoExpandColumns } = useTableContext();

  // Calculate the last header cell index for this section
  // We need to find the last leaf header (actual column) in this section
  const lastHeaderIndex = useMemo(() => {
    // Helper to get all leaf headers recursively
    const getLeafHeaders = (header: HeaderObject, rootPinned?: Pinned): HeaderObject[] => {
      if (!displayCell({ header, pinned, headers, collapsedHeaders, rootPinned })) {
        return [];
      }

      if (!header.children || header.children.length === 0) {
        // This is a leaf header
        return [header];
      }

      // Recursively get leaf headers from children
      return header.children.flatMap((child) => getLeafHeaders(child, rootPinned));
    };

    // Get all leaf headers from all top-level headers in this section
    const allLeafHeaders = headers.flatMap((header) => getLeafHeaders(header, header.pinned));

    if (allLeafHeaders.length === 0) return -1;

    // Get the last leaf header's index
    const lastLeafHeader = allLeafHeaders[allLeafHeaders.length - 1];
    return columnIndices[lastLeafHeader.accessor];
  }, [headers, pinned, collapsedHeaders, columnIndices]);

  // First, flatten all headers into grid cells
  const gridCells = useMemo(() => {
    const cells: GridCell[] = [];
    let columnCounter = 1;

    // Helper function to process a header and its children
    const processHeader = (
      header: HeaderObject,
      depth: number,
      isFirst = false,
      parentHeader?: HeaderObject,
      rootPinned?: Pinned,
    ) => {
      if (!displayCell({ header, pinned, headers, collapsedHeaders, rootPinned })) return 0;

      // Only increment for non-first siblings
      if (!isFirst) {
        columnCounter++;
      }

      const childrenLength =
        header.children?.filter((child) =>
          displayCell({ header: child, pinned, headers, collapsedHeaders, rootPinned }),
        ).length ?? 0;

      const gridColumnStart = columnCounter;
      const gridRowStart = depth;

      // With singleRowChildren, parent and children are all on the same row
      let gridColumnEnd: number;
      let gridRowEnd: number;

      if (header.singleRowChildren && childrenLength > 0) {
        // Parent takes up just 1 column, spans to bottom
        gridColumnEnd = gridColumnStart + 1;
        gridRowEnd = maxDepth + 1;
      } else if (childrenLength > 0) {
        // Normal tree mode: parent spans all children columns, only 1 row
        gridColumnEnd = gridColumnStart + childrenLength;
        gridRowEnd = depth + 1;
      } else {
        // Leaf node: 1 column, spans to bottom
        gridColumnEnd = gridColumnStart + 1;
        gridRowEnd = maxDepth + 1;
      }

      // Add parent cell to grid
      cells.push({
        header,
        gridColumnStart,
        gridColumnEnd,
        gridRowStart,
        gridRowEnd,
        colIndex: columnIndices[header.accessor],
        parentHeader, // Pass parent reference for styling
      });

      // Process children if any
      if (header.children && header.children.length > 0) {
        // If singleRowChildren is true, render children at the same depth as parent
        const childDepth = header.singleRowChildren ? depth : depth + 1;

        // For singleRowChildren, we need to continue incrementing columns
        // But for normal mode, children start at the same column as parent
        const shouldIncrementForChildren = header.singleRowChildren;

        let isFirstChild = !shouldIncrementForChildren; // If we increment, first child is not "first"
        header.children.forEach((child) => {
          if (displayCell({ header: child, pinned, headers, collapsedHeaders, rootPinned })) {
            // Pass current header as parent for children
            processHeader(child, childDepth, isFirstChild, header, rootPinned);
            isFirstChild = false;
          }
        });
      }

      return gridColumnEnd - gridColumnStart;
    };

    // Process all top-level headers
    const topLevelHeaders = headers.filter((header) =>
      displayCell({ header, pinned, headers, collapsedHeaders, rootPinned: header.pinned }),
    );

    let isFirstHeader = true;
    topLevelHeaders.forEach((header) => {
      processHeader(header, 1, isFirstHeader, undefined, header.pinned);
      isFirstHeader = false;
    });

    return cells;
  }, [headers, maxDepth, pinned, columnIndices, collapsedHeaders]);

  // Determine scroll sync group based on pinned state
  const scrollSyncGroup = pinned ? `pinned-${pinned}` : "default";

  return (
    <ScrollSyncPane childRef={sectionRef} group={scrollSyncGroup}>
      <div
        className={`st-header-${pinned ? `pinned-${pinned}` : "main"}`}
        {...(handleScroll && { onScroll: handleScroll })}
        ref={sectionRef}
        style={{
          gridTemplateColumns,
          width,
          left: leftOffset > 0 ? `${leftOffset + 1}px` : undefined,
          height: calculatedHeaderHeight,
        }}
      >
        <>
          {gridCells.map((cell) => (
            <TableHeaderCell
              colIndex={cell.colIndex}
              gridColumnEnd={cell.gridColumnEnd}
              gridColumnStart={cell.gridColumnStart}
              gridRowEnd={cell.gridRowEnd}
              gridRowStart={cell.gridRowStart}
              header={cell.header}
              key={cell.header.accessor}
              parentHeader={cell.parentHeader}
              reverse={pinned === "right"}
              sort={sort}
              isLastHeader={autoExpandColumns && !pinned && cell.colIndex === lastHeaderIndex}
            />
          ))}
        </>
      </div>
    </ScrollSyncPane>
  );
};

export default TableHeaderSection;
