import { useMemo } from "react";
import { displayCell } from "../../utils/cellUtils";
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
  columnIndices,
  gridTemplateColumns,
  handleScroll,
  headers,
  maxDepth,
  pinned,
  sectionRef,
  sort,
  width,
}: TableHeaderSectionProps) => {
  const { collapsedHeaders } = useTableContext();

  // First, flatten all headers into grid cells
  const gridCells = useMemo(() => {
    const cells: GridCell[] = [];
    let columnCounter = 1;

    // Helper function to process a header and its children
    const processHeader = (
      header: HeaderObject,
      depth: number,
      isFirst = false,
      parentHeader?: HeaderObject
    ) => {
      if (!displayCell({ header, pinned, headers, collapsedHeaders })) return 0;

      // Only increment for non-first siblings
      if (!isFirst) {
        columnCounter++;
      }

      const childrenLength =
        header.children?.filter((child) =>
          displayCell({ header: child, pinned, headers, collapsedHeaders })
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
          if (displayCell({ header: child, pinned, headers, collapsedHeaders })) {
            // Pass current header as parent for children
            processHeader(child, childDepth, isFirstChild, header);
            isFirstChild = false;
          }
        });
      }

      return gridColumnEnd - gridColumnStart;
    };

    // Process all top-level headers
    const topLevelHeaders = headers.filter((header) =>
      displayCell({ header, pinned, headers, collapsedHeaders })
    );

    let isFirstHeader = true;
    topLevelHeaders.forEach((header) => {
      processHeader(header, 1, isFirstHeader);
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
          position: "relative",
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
            />
          ))}
        </>
      </div>
    </ScrollSyncPane>
  );
};

export default TableHeaderSection;
