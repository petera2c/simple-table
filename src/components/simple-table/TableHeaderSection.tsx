import { useMemo, useEffect, useRef } from "react";
import { displayCell } from "../../utils/cellUtils";
import { Pinned } from "../../types/Pinned";
import TableHeaderSectionProps from "../../types/TableHeaderSectionProps";
import { HeaderObject } from "../..";
import { ScrollSyncPane } from "../scroll-sync/ScrollSyncPane";
import { useTableContext } from "../../context/TableContext";
import {
  renderHeaderCells,
  cleanupHeaderCellRendering,
  HeaderRenderContext,
} from "../../utils/headerCellRenderer";

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
  handleScroll,
  headers,
  leftOffset = 0,
  maxDepth,
  pinned,
  sectionRef,
  sort,
  width,
}: TableHeaderSectionProps) => {
  const {
    collapsedHeaders,
    autoExpandColumns,
    columnBorders,
    columnReordering,
    columnResizing,
    containerWidth,
    columnsWithSelectedCells,
    draggedHeaderRef,
    enableHeaderEditing,
    enableRowSelection,
    filters,
    forceUpdate,
    handleApplyFilter,
    handleClearFilter,
    handleSelectAll,
    hoveredHeaderRef,
    icons,
    mainBodyRef,
    onColumnOrderChange,
    onColumnSelect,
    onColumnWidthChange,
    onHeaderEdit,
    onSort,
    onTableHeaderDragEnd,
    headerHeight,
    pinnedLeftRef,
    pinnedRightRef,
    rows,
    selectColumns,
    selectableColumns,
    selectedColumns,
    setCollapsedHeaders,
    setHeaders,
    setInitialFocusedCell,
    setIsResizing,
    setSelectedCells,
    setSelectedColumns,
    headerRegistry,
    areAllRowsSelected,
  } = useTableContext();

  const headerGridRef = useRef<HTMLDivElement>(null);

  // Calculate the last header cell index for this section
  // Used to apply st-last-column class for proper border styling
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
  }, [headers, pinned, columnIndices, collapsedHeaders, calculatedHeaderHeight, rowHeight]);

  // Build context for header cell rendering
  const renderContext: HeaderRenderContext = useMemo(
    () => ({
      collapsedHeaders,
      columnBorders,
      columnReordering,
      columnResizing,
      containerWidth,
      columnsWithSelectedCells,
      enableHeaderEditing,
      enableRowSelection,
      filters,
      forceUpdate,
      icons,
      mainBodyRef,
      pinnedLeftRef,
      pinnedRightRef,
      selectedColumns,
      sort,
      autoExpandColumns,
      selectableColumns,
      headers,
      rows,
      headerHeight,
      lastHeaderIndex,
      onSort,
      handleApplyFilter,
      handleClearFilter,
      handleSelectAll,
      setCollapsedHeaders,
      setHeaders,
      setIsResizing,
      onColumnWidthChange,
      onColumnOrderChange,
      onTableHeaderDragEnd,
      onHeaderEdit,
      onColumnSelect,
      selectColumns,
      setSelectedColumns,
      setSelectedCells,
      setInitialFocusedCell,
      areAllRowsSelected,
      draggedHeaderRef,
      hoveredHeaderRef,
      headerRegistry,
      reverse: pinned === "right",
      pinned,
    }),
    [
      collapsedHeaders,
      columnBorders,
      columnReordering,
      columnResizing,
      containerWidth,
      columnsWithSelectedCells,
      enableHeaderEditing,
      enableRowSelection,
      filters,
      forceUpdate,
      icons,
      mainBodyRef,
      pinnedLeftRef,
      pinnedRightRef,
      selectedColumns,
      sort,
      autoExpandColumns,
      selectableColumns,
      headers,
      rows,
      headerHeight,
      lastHeaderIndex,
      onSort,
      handleApplyFilter,
      handleClearFilter,
      handleSelectAll,
      setCollapsedHeaders,
      setHeaders,
      setIsResizing,
      onColumnWidthChange,
      onColumnOrderChange,
      onTableHeaderDragEnd,
      onHeaderEdit,
      onColumnSelect,
      selectColumns,
      setSelectedColumns,
      setSelectedCells,
      setInitialFocusedCell,
      areAllRowsSelected,
      draggedHeaderRef,
      hoveredHeaderRef,
      headerRegistry,
      pinned,
    ],
  );

  // Render header cells using DOM manipulation
  // This effect runs on mount and when dependencies change
  useEffect(() => {
    const headerGrid = headerGridRef.current;
    if (headerGrid) {
      const initialScrollLeft = sectionRef.current?.scrollLeft || 0;
      renderHeaderCells(headerGrid, absoluteCells, renderContext, initialScrollLeft);
    }

    return () => {
      if (headerGrid) {
        cleanupHeaderCellRendering(headerGrid);
      }
    };
  }, [absoluteCells, renderContext, sectionRef]);

  // Expose render function via ref for scroll sync to call
  useEffect(() => {
    const section = sectionRef.current;
    const headerGrid = headerGridRef.current;

    if (section && headerGrid) {
      // Store render function on the section element so scroll sync can call it
      (section as any).__renderHeaderCells = (scrollLeft: number) => {
        if (headerGrid) {
          renderHeaderCells(headerGrid, absoluteCells, renderContext, scrollLeft);
        }
      };
    }

    return () => {
      if (section) {
        delete (section as any).__renderHeaderCells;
      }
    };
  }, [absoluteCells, renderContext, sectionRef]);

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
        <div
          ref={headerGridRef}
          className="st-header-grid"
          style={{ height: calculatedHeaderHeight }}
        />
      </div>
    </ScrollSyncPane>
  );
};

export default TableHeaderSection;
