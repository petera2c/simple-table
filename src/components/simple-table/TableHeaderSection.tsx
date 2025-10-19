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
    const processHeader = (header: HeaderObject, depth: number, isFirst = false) => {
      if (!displayCell({ header, pinned, headers, collapsedHeaders })) return 0;

      // Only increment for non-first siblings
      if (!isFirst) {
        columnCounter++;
      }

      const childrenLength =
        header.children?.filter((child) =>
          displayCell({ header: child, pinned, headers, collapsedHeaders })
        ).length ?? 0;

      // Calculate grid position
      const gridColumnStart = columnCounter;
      const gridColumnEnd =
        childrenLength > 0 ? gridColumnStart + childrenLength : gridColumnStart + 1;
      const gridRowStart = depth;
      const gridRowEnd = childrenLength > 0 ? depth + 1 : maxDepth + 1;

      // Add cell to our flat array
      cells.push({
        header,
        gridColumnStart,
        gridColumnEnd,
        gridRowStart,
        gridRowEnd,
        colIndex: columnIndices[header.accessor],
      });

      // Process children if any
      if (header.children && header.children.length > 0) {
        let isFirstChild = true;
        header.children.forEach((child) => {
          if (displayCell({ header: child, pinned, headers, collapsedHeaders })) {
            processHeader(child, depth + 1, isFirstChild);
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
