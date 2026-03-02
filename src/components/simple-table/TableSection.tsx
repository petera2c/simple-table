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

    // Filter headers for this section
    const filteredHeaders = useMemo(
      () =>
        headers.filter((header) =>
          displayCell({ header, pinned, headers, collapsedHeaders, rootPinned: header.pinned }),
        ),
      [headers, pinned, collapsedHeaders],
    );

    // Build absolute cell data for all visible cells
    const absoluteCells = useMemo(() => {
      const cells: AbsoluteBodyCell[] = [];

      regularRows.forEach((tableRow) => {
        // Skip state indicator rows and nested table rows for now
        if (tableRow.stateIndicator || tableRow.nestedTable) {
          return;
        }

        const rowId = rowIdToString(tableRow.rowId);
        const isOdd = tableRow.position % 2 === 0;

        filteredHeaders.forEach((header) => {
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
          });
        });
      });

      return cells;
    }, [regularRows, filteredHeaders, columnIndices]);

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
      if (internalRef.current) {
        renderBodyCells(internalRef.current, absoluteCells, renderContext);
      }

      return () => cleanupBodyCellRendering();
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
          {/* Render row separators and state indicator rows using React (for now) */}
          {regularRows.map((tableRow, index) => {
            const rowId = tableRow.stateIndicator
              ? `state-${tableRow.stateIndicator.parentRowId}-${tableRow.position}`
              : rowIdToString(tableRow.rowId);

            // For state indicator rows and nested table rows, still use React
            if (tableRow.stateIndicator || tableRow.nestedTable) {
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

            // For regular rows, render separator only
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
              </Fragment>
            );
          })}
        </div>
      </ScrollSyncPane>
    );
  },
);

TableSection.displayName = "TableSection";

export default TableSection;
