import { Fragment, useMemo, forwardRef, useRef, useImperativeHandle, useEffect } from "react";
import TableRow from "./TableRow";
import TableRowType from "../../types/TableRow";
import TableRowSeparator from "./TableRowSeparator";
import { Pinned } from "../../types/Pinned";
import HeaderObject from "../../types/HeaderObject";
import ColumnIndices from "../../types/ColumnIndices";
import RowIndices from "../../types/RowIndices";
import { ScrollSyncPane } from "../scroll-sync/ScrollSyncPane";
import { canDisplaySection } from "../../utils/generalUtils";
import { rowIdToString } from "../../utils/rowUtils";
import { useTableContext } from "../../context/TableContext";
import { displayCell } from "../../utils/cellUtils";
import {
  renderBodyCells,
  cleanupBodyCellRendering,
  AbsoluteBodyCell,
  CellRenderContext,
} from "../../utils/bodyCellRenderer";
import { calculateRowTopPosition } from "../../utils/infiniteScrollUtils";

interface TableSectionProps {
  columnIndexStart?: number; // This is to know how many columns there were before this section to see if the columns are odd or even
  columnIndices: ColumnIndices;
  headers: HeaderObject[];
  pinned?: Pinned;
  regularRows: TableRowType[];
  rowHeight: number;
  rowIndices: RowIndices;
  rowsToRender: TableRowType[];
  setHoveredIndex: (index: number | null) => void;
  templateColumns: string;
  totalHeight: number;
  width?: number;
}

const TableSection = forwardRef<HTMLDivElement, TableSectionProps>(
  (
    {
      columnIndexStart,
      columnIndices,
      headers,
      pinned,
      rowHeight,
      rowIndices,
      setHoveredIndex,
      templateColumns,
      totalHeight,
      width,
      regularRows,
    },
    ref,
  ) => {
    const className = pinned ? `st-body-pinned-${pinned}` : "st-body-main";
    const internalRef = useRef<HTMLDivElement | null>(null);

    useImperativeHandle(ref, () => internalRef.current!, []);

    // Get context for cell rendering (must be before early return)
    const context = useTableContext();
    const {
      collapsedHeaders,
      collapsedRows,
      expandedRows,
      expandedDepths,
      selectedColumns,
      rowsWithSelectedCells,
      columnBorders,
      enableRowSelection,
      cellUpdateFlash,
      useOddColumnBackground,
      useHoverRowBackground,
      useOddEvenRowBackground,
      rowGrouping,
      onCellEdit,
      onCellClick,
      onRowGroupExpand,
      handleRowSelect,
      handleMouseDown,
      handleMouseOver,
      cellRegistry,
      setCollapsedRows,
      setExpandedRows,
      setRowStateMap,
      icons,
      theme,
      rowButtons,
      getBorderClass,
      isSelected,
      isInitialFocusedCell,
      isCopyFlashing,
      isWarningFlashing,
      isRowSelected,
      canExpandRowGroup,
      isLoading,
      customTheme,
      heightOffsets,
    } = context;

    // Check if section can be displayed
    const canDisplay = useMemo(() => canDisplaySection(headers, pinned), [headers, pinned]);

    // Get leaf headers (actual columns) for this section
    const leafHeaders = useMemo(() => {
      const leaves: HeaderObject[] = [];

      const processHeader = (header: HeaderObject, rootPinned?: Pinned) => {
        if (!displayCell({ header, pinned, headers, collapsedHeaders, rootPinned })) {
          return;
        }

        if (!header.children || header.children.length === 0) {
          // This is a leaf header
          leaves.push(header);
          return;
        }

        // Recursively get leaf headers from children
        header.children.forEach((child) => processHeader(child, rootPinned));
      };

      // Process all top-level headers for this section
      headers.forEach((header) => processHeader(header, header.pinned));

      return leaves;
    }, [headers, pinned, collapsedHeaders]);

    // Build absolute cell data for all visible cells with position information
    const absoluteCells = useMemo(() => {
      const cells: AbsoluteBodyCell[] = [];

      // Helper to get column width in pixels
      const getColumnWidth = (header: HeaderObject): number => {
        const { width } = header;
        if (typeof width === "number") return width;
        if (typeof width === "string" && width.endsWith("px")) {
          return parseFloat(width);
        }
        return 150; // Default width
      };

      // Calculate cumulative left positions for each leaf header
      const headerPositions = new Map<string, { left: number; width: number }>();
      let currentLeft = 0;

      leafHeaders.forEach((header) => {
        const width = getColumnWidth(header);
        headerPositions.set(header.accessor, { left: currentLeft, width });
        currentLeft += width;
      });

      regularRows.forEach((tableRow) => {
        // Skip state indicator rows and nested table rows for now
        if (tableRow.stateIndicator || tableRow.nestedTable) {
          return;
        }

        const rowId = rowIdToString(tableRow.rowId);
        const isOdd = tableRow.position % 2 === 0;

        // Calculate vertical position for this row
        const topPosition = calculateRowTopPosition({
          position: tableRow.position,
          rowHeight,
          heightOffsets,
          customTheme,
        });

        leafHeaders.forEach((header) => {
          const position = headerPositions.get(header.accessor);
          cells.push({
            header,
            row: tableRow.row,
            rowIndex: tableRow.position,
            colIndex: columnIndices[header.accessor],
            rowId,
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
    }, [regularRows, leafHeaders, columnIndices, rowHeight, heightOffsets, customTheme]);

    // Build render context
    const renderContext: CellRenderContext = useMemo(
      () => ({
        collapsedHeaders,
        collapsedRows,
        expandedRows,
        expandedDepths: Array.from(expandedDepths) as any,
        selectedColumns,
        rowsWithSelectedCells,
        columnBorders,
        enableRowSelection,
        cellUpdateFlash,
        useOddColumnBackground,
        useHoverRowBackground,
        useOddEvenRowBackground,
        rowGrouping,
        headers,
        rowHeight,
        templateColumns,
        heightOffsets,
        customTheme,
        onCellEdit,
        onCellClick,
        onRowGroupExpand,
        handleRowSelect,
        handleMouseDown,
        handleMouseOver,
        cellRegistry,
        setCollapsedRows,
        setExpandedRows,
        setRowStateMap,
        icons,
        theme: theme || "light",
        rowButtons,
        getBorderClass,
        isSelected,
        isInitialFocusedCell,
        isCopyFlashing,
        isWarningFlashing,
        isRowSelected,
        canExpandRowGroup,
        isLoading,
        pinned,
      }),
      [
        collapsedHeaders,
        collapsedRows,
        expandedRows,
        expandedDepths,
        selectedColumns,
        rowsWithSelectedCells,
        columnBorders,
        enableRowSelection,
        cellUpdateFlash,
        useOddColumnBackground,
        useHoverRowBackground,
        useOddEvenRowBackground,
        rowGrouping,
        headers,
        rowHeight,
        templateColumns,
        heightOffsets,
        customTheme,
        onCellEdit,
        onCellClick,
        onRowGroupExpand,
        handleRowSelect,
        handleMouseDown,
        handleMouseOver,
        cellRegistry,
        setCollapsedRows,
        setExpandedRows,
        setRowStateMap,
        icons,
        theme,
        rowButtons,
        getBorderClass,
        isSelected,
        isInitialFocusedCell,
        isCopyFlashing,
        isWarningFlashing,
        isRowSelected,
        canExpandRowGroup,
        isLoading,
        pinned,
      ],
    );

    // Render cells using DOM manipulation
    useEffect(() => {
      const element = internalRef.current;
      if (element) {
        const initialScrollLeft = element.scrollLeft || 0;
        renderBodyCells(element, absoluteCells, renderContext, initialScrollLeft);
      }

      return () => {
        if (element) {
          cleanupBodyCellRendering(element);
        }
      };
    }, [absoluteCells, renderContext]);

    // Expose render function via ref for scroll sync to call
    useEffect(() => {
      const section = internalRef.current;

      if (section) {
        // Store render function on the section element so scroll sync can call it
        (section as any).__renderBodyCells = (scrollLeft: number) => {
          if (section) {
            renderBodyCells(section, absoluteCells, renderContext, scrollLeft);
          }
        };
      }

      return () => {
        if (section) {
          delete (section as any).__renderBodyCells;
        }
      };
      // Refs are stable and don't need to be in dependencies
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [absoluteCells, renderContext]);

    // Early return after all hooks
    if (!canDisplay) return null;

    // Determine scroll sync group based on pinned state
    const scrollSyncGroup = pinned ? `pinned-${pinned}` : "default";

    return (
      <ScrollSyncPane childRef={internalRef} group={scrollSyncGroup}>
        <div
          className={className}
          ref={internalRef}
          style={{
            position: "relative",
            height: `${totalHeight}px`,
            width,
            ...(!pinned && { flexGrow: 1 }),
          }}
        >
          {/* Render row separators and special row types (state indicators, nested tables) */}
          {regularRows.map((tableRow, index) => {
            // Only render special row types with React
            if (tableRow.stateIndicator || tableRow.nestedTable) {
              const rowId = tableRow.stateIndicator
                ? `state-${tableRow.stateIndicator.parentRowId}-${tableRow.position}`
                : rowIdToString(tableRow.rowId);

              return (
                <Fragment key={rowId}>
                  {index !== 0 && (
                    <TableRowSeparator
                      displayStrongBorder={tableRow.isLastGroupRow}
                      position={tableRow.position}
                      rowHeight={rowHeight}
                      templateColumns={templateColumns}
                    />
                  )}
                  <TableRow
                    columnIndexStart={columnIndexStart}
                    columnIndices={columnIndices}
                    gridTemplateColumns={templateColumns}
                    headers={headers}
                    index={index}
                    pinned={pinned}
                    rowHeight={rowHeight}
                    rowIndices={rowIndices}
                    setHoveredIndex={setHoveredIndex}
                    tableRow={tableRow}
                  />
                </Fragment>
              );
            }

            // For regular rows, only render separator (cells are handled by DOM renderer)
            if (index !== 0) {
              const rowId = rowIdToString(tableRow.rowId);
              return (
                <TableRowSeparator
                  key={`separator-${rowId}`}
                  displayStrongBorder={tableRow.isLastGroupRow}
                  position={tableRow.position}
                  rowHeight={rowHeight}
                  templateColumns={templateColumns}
                />
              );
            }

            return null;
          })}
        </div>
      </ScrollSyncPane>
    );
  },
);

TableSection.displayName = "TableSection";

export default TableSection;
