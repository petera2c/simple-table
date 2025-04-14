import { createRef, useMemo } from "react";
import { displayCell } from "../../utils/cellUtils";
import Animate from "../Animate";
import TableHeaderCell from "./TableHeaderCell";
import TableHeaderSectionProps from "../../types/TableHeaderSectionProps";
import { HeaderObject } from "../..";

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
  headersRef,
  hiddenColumns,
  maxDepth,
  pinned,
  sectionRef,
  sort,
}: TableHeaderSectionProps) => {
  // First, flatten all headers into grid cells
  const gridCells = useMemo(() => {
    const cells: GridCell[] = [];
    let columnCounter = 1;

    // Helper function to process a header and its children
    const processHeader = (header: HeaderObject, depth: number, isFirst = false) => {
      if (!displayCell({ hiddenColumns, header, pinned })) return 0;

      // Only increment for non-first siblings
      if (!isFirst) {
        columnCounter++;
      }

      const childrenLength =
        header.children?.filter((child) => displayCell({ hiddenColumns, header: child, pinned }))
          .length ?? 0;

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
      if (header.children) {
        let isFirstChild = true;
        header.children.forEach((child) => {
          if (displayCell({ hiddenColumns, header: child, pinned })) {
            processHeader(child, depth + 1, isFirstChild);
            isFirstChild = false;
          }
        });
      }

      return gridColumnEnd - gridColumnStart;
    };

    // Process all top-level headers
    const headers = headersRef.current.filter((header) =>
      displayCell({ hiddenColumns, header, pinned })
    );

    let isFirstHeader = true;
    headers.forEach((header) => {
      processHeader(header, 1, isFirstHeader);
      isFirstHeader = false;
    });

    return cells;
  }, [headersRef, hiddenColumns, maxDepth, pinned, columnIndices]);

  return (
    <div
      className={`st-header-${pinned ? `pinned-${pinned}` : "main"}`}
      {...(handleScroll && { onScroll: handleScroll })}
      ref={sectionRef}
      style={{
        gridTemplateColumns,
        display: "grid",
        position: "relative",
      }}
    >
      <Animate rowIndex={0}>
        {gridCells.map((cell) => (
          <TableHeaderCell
            key={cell.header.accessor}
            colIndex={cell.colIndex}
            gridColumnStart={cell.gridColumnStart}
            gridColumnEnd={cell.gridColumnEnd}
            gridRowStart={cell.gridRowStart}
            gridRowEnd={cell.gridRowEnd}
            header={cell.header}
            ref={createRef()}
            reverse={pinned === "right"}
            sort={sort}
          />
        ))}
      </Animate>
    </div>
  );
};

export default TableHeaderSection;
