import { Fragment, useMemo, forwardRef, useRef, useImperativeHandle, useEffect } from "react";
import TableRowType from "../../types/TableRow";
import { Pinned } from "../../types/Pinned";
import HeaderObject from "../../types/HeaderObject";
import ColumnIndices from "../../types/ColumnIndices";
import RowIndices from "../../types/RowIndices";
import { scrollSyncManager } from "../../utils/scrollSyncManager";
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
import { createRowSeparator, createSpacerRow } from "../../utils/rowSeparatorRenderer";
import { createStateRow, cleanupStateRow } from "../../utils/stateRowRenderer";
import NestedGridRow from "./NestedGridRow";

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
      loadingStateRenderer,
      errorStateRenderer,
      emptyStateRenderer,
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

    // Render cells, separators, and state rows using DOM manipulation
    useEffect(() => {
      const element = internalRef.current;
      if (!element) return;

      // Track rendered special rows for cleanup
      const renderedStateRows = new Map<string, HTMLElement>();
      const renderedSeparators: HTMLElement[] = [];

      const initialScrollLeft = element.scrollLeft || 0;

      // Render regular cells
      renderBodyCells(element, absoluteCells, renderContext, initialScrollLeft);

      // Render separators and special rows
      regularRows.forEach((tableRow, index) => {
        // Render separator (except for first row)
        if (index !== 0) {
          const separator = createRowSeparator(
            tableRow.position,
            rowHeight,
            templateColumns,
            tableRow.isLastGroupRow || false,
            heightOffsets,
            customTheme,
            false,
          );
          element.appendChild(separator);
          renderedSeparators.push(separator);
        }

        // Handle state indicator rows
        if (tableRow.stateIndicator) {
          const shouldShowIndicator = tableRow.stateIndicator.state.triggerSection === pinned;

          if (shouldShowIndicator) {
            const hasRenderer =
              (tableRow.stateIndicator.state.loading && loadingStateRenderer) ||
              (tableRow.stateIndicator.state.error && errorStateRenderer) ||
              (tableRow.stateIndicator.state.isEmpty && emptyStateRenderer);

            if (hasRenderer) {
              const stateRow = createStateRow(tableRow, {
                index,
                gridTemplateColumns: templateColumns,
                rowHeight,
                heightOffsets,
                customTheme,
                loadingStateRenderer,
                errorStateRenderer,
                emptyStateRenderer,
              });

              element.appendChild(stateRow);
              renderedStateRows.set(`state-${tableRow.position}`, stateRow);
            } else {
              // Create spacer
              const spacer = createSpacerRow(
                tableRow.position,
                rowHeight,
                templateColumns,
                heightOffsets,
                customTheme,
                "st-state-row-spacer",
              );
              element.appendChild(spacer);
              renderedSeparators.push(spacer);
            }
          } else {
            // Create spacer for other sections
            const spacer = createSpacerRow(
              tableRow.position,
              rowHeight,
              templateColumns,
              heightOffsets,
              customTheme,
              "st-state-row-spacer",
            );
            element.appendChild(spacer);
            renderedSeparators.push(spacer);
          }
        }

        // Handle nested table spacers for pinned sections
        if (tableRow.nestedTable && pinned) {
          const spacer = createSpacerRow(
            tableRow.position,
            rowHeight,
            templateColumns,
            heightOffsets,
            customTheme,
            "st-nested-grid-spacer",
            tableRow.nestedTable.calculatedHeight,
          );
          element.appendChild(spacer);
          renderedSeparators.push(spacer);
        }
      });

      return () => {
        // Cleanup state rows (unmount React)
        renderedStateRows.forEach((element) => {
          cleanupStateRow(element);
        });

        // Cleanup separators and spacers
        renderedSeparators.forEach((element) => {
          element.remove();
        });

        cleanupBodyCellRendering(element);
      };
    }, [
      absoluteCells,
      renderContext,
      regularRows,
      rowHeight,
      templateColumns,
      heightOffsets,
      customTheme,
      pinned,
      loadingStateRenderer,
      errorStateRenderer,
      emptyStateRenderer,
    ]);

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

    // Register with scroll sync manager
    useEffect(() => {
      const element = internalRef.current;
      if (!element) return;

      const scrollSyncGroup = pinned ? `pinned-${pinned}` : "default";
      scrollSyncManager.registerPane(element, [scrollSyncGroup]);

      return () => {
        scrollSyncManager.unregisterPane(element, [scrollSyncGroup]);
      };
    }, [pinned]);

    // Early return after all hooks
    if (!canDisplay) return null;

    return (
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
        {/* Render nested tables with React (only in main section) */}
        {regularRows.map((tableRow, index) => {
          // Only render nested tables with React
          if (tableRow.nestedTable && !pinned) {
            return (
              <NestedGridRow
                key={`nested-${tableRow.position}`}
                calculatedHeight={tableRow.nestedTable.calculatedHeight}
                childAccessor={tableRow.nestedTable.childAccessor}
                depth={tableRow.depth - 1}
                expandableHeader={tableRow.nestedTable.expandableHeader}
                index={index}
                parentRow={tableRow.nestedTable.parentRow}
                position={tableRow.position}
              />
            );
          }

          return null;
        })}
      </div>
    );
  },
);

TableSection.displayName = "TableSection";

export default TableSection;
