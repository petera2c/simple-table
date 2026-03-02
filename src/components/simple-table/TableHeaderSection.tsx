import { useMemo } from "react";
import { displayCell } from "../../utils/cellUtils";
import { Pinned } from "../../types/Pinned";
import TableHeaderCell from "./TableHeaderCell";
import TableHeaderSectionProps from "../../types/TableHeaderSectionProps";
import { HeaderObject } from "../..";
import { ScrollSyncPane } from "../scroll-sync/ScrollSyncPane";
import { useTableContext } from "../../context/TableContext";

// Define a type for absolute positioned cell
type AbsoluteCell = {
  header: HeaderObject;
  left: number; // Pixel position from left
  top: number; // Pixel position from top
  width: number; // Width in pixels
  height: number; // Height in pixels
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

  // Calculate row height for each depth level
  const rowHeight = calculatedHeaderHeight / maxDepth;

  // First, flatten all headers into absolute positioned cells
  const absoluteCells = useMemo(() => {
    const cells: AbsoluteCell[] = [];

    // Helper to get column width in pixels
    const getColumnWidth = (header: HeaderObject): number => {
      const { width } = header;
      if (typeof width === "number") return width;
      if (typeof width === "string" && width.endsWith("px")) {
        return parseFloat(width);
      }
      return 150; // Default width
    };

    // Helper function to process a header and its children
    const processHeader = (
      header: HeaderObject,
      depth: number,
      parentLeft: number,
      parentHeader?: HeaderObject,
      rootPinned?: Pinned,
    ): number => {
      if (!displayCell({ header, pinned, headers, collapsedHeaders, rootPinned })) return 0;

      const childrenLength =
        header.children?.filter((child) =>
          displayCell({ header: child, pinned, headers, collapsedHeaders, rootPinned }),
        ).length ?? 0;

      const hasChildren = childrenLength > 0;
      const top = (depth - 1) * rowHeight;

      let cellWidth: number;
      let cellHeight: number;
      let cellLeft = parentLeft;

      if (header.singleRowChildren && hasChildren) {
        // Parent takes up just 1 column width, spans to bottom
        cellWidth = getColumnWidth(header);
        cellHeight = calculatedHeaderHeight - top;
        
        // Add parent cell
        cells.push({
          header,
          left: cellLeft,
          top,
          width: cellWidth,
          height: cellHeight,
          colIndex: columnIndices[header.accessor],
          parentHeader,
        });

        // Children are at same depth, positioned after parent
        let childLeft = cellLeft + cellWidth;
        header.children?.forEach((child) => {
          if (displayCell({ header: child, pinned, headers, collapsedHeaders, rootPinned })) {
            const childWidth = processHeader(child, depth, childLeft, header, rootPinned);
            childLeft += childWidth;
          }
        });

        return cellWidth + (childLeft - cellLeft - cellWidth);
      } else if (hasChildren) {
        // Normal tree mode: parent spans all children columns, only 1 row
        cellHeight = rowHeight;
        
        // Calculate total width by processing children first
        let childLeft = cellLeft;
        const childDepth = depth + 1;
        let totalChildWidth = 0;
        
        header.children?.forEach((child) => {
          if (displayCell({ header: child, pinned, headers, collapsedHeaders, rootPinned })) {
            const childWidth = processHeader(child, childDepth, childLeft, header, rootPinned);
            childLeft += childWidth;
            totalChildWidth += childWidth;
          }
        });

        cellWidth = totalChildWidth;
        
        // Add parent cell spanning all children
        cells.push({
          header,
          left: cellLeft,
          top,
          width: cellWidth,
          height: cellHeight,
          colIndex: columnIndices[header.accessor],
          parentHeader,
        });

        return cellWidth;
      } else {
        // Leaf node: own width, spans to bottom
        cellWidth = getColumnWidth(header);
        cellHeight = calculatedHeaderHeight - top;
        
        cells.push({
          header,
          left: cellLeft,
          top,
          width: cellWidth,
          height: cellHeight,
          colIndex: columnIndices[header.accessor],
          parentHeader,
        });

        return cellWidth;
      }
    };

    // Process all top-level headers
    const topLevelHeaders = headers.filter((header) =>
      displayCell({ header, pinned, headers, collapsedHeaders, rootPinned: header.pinned }),
    );

    let currentLeft = 0;
    topLevelHeaders.forEach((header) => {
      const headerWidth = processHeader(header, 1, currentLeft, undefined, header.pinned);
      currentLeft += headerWidth;
    });

    return cells;
  }, [headers, maxDepth, pinned, columnIndices, collapsedHeaders, calculatedHeaderHeight, rowHeight]);

  // Determine scroll sync group based on pinned state
  const scrollSyncGroup = pinned ? `pinned-${pinned}` : "default";

  return (
    <ScrollSyncPane childRef={sectionRef} group={scrollSyncGroup}>
      <div
        className={`st-header-${pinned ? `pinned-${pinned}` : "main"}`}
        {...(handleScroll && { onScroll: handleScroll })}
        ref={sectionRef}
        style={{
          left: leftOffset > 0 ? `${leftOffset + 1}px` : undefined,
          height: calculatedHeaderHeight,
          ...(!pinned && { flexGrow: 1 }),
          ...(!pinned && { width: `var(--st-main-section-width)` }),
          ...(pinned && { width }),
        }}
      >
        <div className="st-header-grid" style={{ height: calculatedHeaderHeight }}>
          {absoluteCells.map((cell) => (
            <TableHeaderCell
              colIndex={cell.colIndex}
              header={cell.header}
              key={cell.header.accessor}
              parentHeader={cell.parentHeader}
              reverse={pinned === "right"}
              sort={sort}
              isLastHeader={autoExpandColumns && !pinned && cell.colIndex === lastHeaderIndex}
              absolutePosition={{
                left: cell.left,
                top: cell.top,
                width: cell.width,
                height: cell.height,
              }}
            />
          ))}
        </div>
      </div>
    </ScrollSyncPane>
  );
};

export default TableHeaderSection;
