import HeaderObject from "../../types/HeaderObject";
import CellValue from "../../types/CellValue";
import { formatDate } from "../formatters";
import { getNestedValue, hasNestedRows, isRowExpanded as getIsRowExpanded } from "../rowUtils";
import { renderLineAreaChart, renderBarChart } from "../chartRenderer";
import { AbsoluteBodyCell, CellRenderContext } from "./types";
import { createSelectionCheckbox, createRowButtons } from "./selection";
import { createExpandIcon } from "./expansion";

// Format cell content for display
export const formatCellContent = (
  content: CellValue,
  header: HeaderObject,
  colIndex: number,
  row: any,
  rowIndex: number,
): string | null => {
  // Apply valueFormatter first if it exists
  if (header.valueFormatter) {
    const formatted = header.valueFormatter({
      accessor: header.accessor,
      colIndex,
      row,
      rowIndex,
      value: content,
    });
    // If formatter returns a React element, we can't use it - return string representation
    if (typeof formatted === "object" && formatted !== null) {
      return String(content);
    }
    return String(formatted);
  }

  // Handle different types
  if (typeof content === "boolean") {
    return content ? "True" : "False";
  } else if (Array.isArray(content)) {
    if (content.length === 0) {
      return "[]";
    }
    return content
      .map((item) => {
        if (typeof item === "object" && item !== null) {
          return JSON.stringify(item);
        }
        return String(item);
      })
      .join(", ");
  } else if (
    header.type === "date" &&
    content !== null &&
    content !== undefined &&
    (typeof content === "string" ||
      typeof content === "number" ||
      (typeof content === "object" && (content as any) instanceof Date))
  ) {
    return formatDate(content);
  } else if (content === null || content === undefined) {
    return "";
  }

  return String(content);
};

// Create cell content (main display area)
export const createCellContent = (
  cell: AbsoluteBodyCell,
  context: CellRenderContext,
  contentSpan: HTMLElement,
): void => {
  const { header, row, rowIndex, colIndex, depth, rowId } = cell;
  const content = getNestedValue(row, header.accessor);

  const isSelectionColumn = header.isSelectionColumn && context.enableRowSelection;

  if (context.isLoading || cell.tableRow.isLoadingSkeleton) {
    // Show loading skeleton
    const skeleton = document.createElement("div");
    skeleton.className = "st-loading-skeleton";
    contentSpan.appendChild(skeleton);
    return;
  }

  if (isSelectionColumn) {
    // Selection column: checkbox/row number + row buttons
    const selectionContent = document.createElement("div");
    selectionContent.className = "st-selection-cell-content";

    const selectionControl = document.createElement("div");
    selectionControl.className = "st-selection-control";

    // For now, always show checkbox (hover state handled by CSS)
    const isChecked = context.isRowSelected ? context.isRowSelected(String(rowId)) : false;
    const checkbox = createSelectionCheckbox(cell, context, isChecked);
    selectionControl.appendChild(checkbox);

    selectionContent.appendChild(selectionControl);

    // Add row buttons if any
    const buttons = createRowButtons(cell, context);
    if (buttons) {
      selectionContent.appendChild(buttons);
    }

    contentSpan.appendChild(selectionContent);
    return;
  }

  // Check if we need to render expand icon
  const currentGroupingKey = context.rowGrouping && context.rowGrouping[depth];
  const cellHasChildren = currentGroupingKey ? hasNestedRows(row, currentGroupingKey) : false;
  const canExpandFurther = context.rowGrouping && depth < context.rowGrouping.length;
  const isRowExpandable = context.canExpandRowGroup ? context.canExpandRowGroup(row) : true;
  const hasNestedTableConfig = !!header.nestedTable;
  const shouldShowExpandIcon =
    header.expandable &&
    ((cellHasChildren && canExpandFurther && isRowExpandable) || hasNestedTableConfig);

  if (shouldShowExpandIcon) {
    const expandedDepthsSet = new Set(context.expandedDepths);
    const isExpanded = getIsRowExpanded(
      rowId,
      depth,
      expandedDepthsSet,
      context.expandedRows,
      context.collapsedRows,
    );
    const expandIcon = createExpandIcon(cell, context, isExpanded);
    contentSpan.appendChild(expandIcon);
  }

  // Handle chart rendering
  if (header.type === "lineAreaChart" && Array.isArray(content)) {
    const numericData = (content as any[]).filter(
      (item: any) => typeof item === "number",
    ) as number[];
    if (numericData.length > 0) {
      const canvas = document.createElement("canvas");
      canvas.width = 100; // Will be adjusted by chart renderer
      canvas.height = 30;
      renderLineAreaChart(canvas, numericData, header.chartOptions);
      contentSpan.appendChild(canvas);
      return;
    }
  } else if (header.type === "barChart" && Array.isArray(content)) {
    const numericData = (content as any[]).filter(
      (item: any) => typeof item === "number",
    ) as number[];
    if (numericData.length > 0) {
      const canvas = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 30;
      renderBarChart(canvas, numericData, header.chartOptions);
      contentSpan.appendChild(canvas);
      return;
    }
  }

  // Handle custom cell renderer
  if (header.cellRenderer) {
    try {
      const rendered = header.cellRenderer({
        accessor: header.accessor,
        colIndex,
        row,
        rowIndex: cell.tableRow.absoluteRowIndex || rowIndex,
        rowPath: cell.tableRow.rowPath,
        theme: context.theme as any,
        value: content,
        formattedValue: header.valueFormatter?.({
          accessor: header.accessor,
          colIndex,
          row,
          rowIndex,
          value: content,
        }),
      });

      // If renderer returns a string, use it
      if (typeof rendered === "string") {
        const textNode = document.createTextNode(rendered);
        contentSpan.appendChild(textNode);
      } else if (rendered && typeof rendered === "object") {
        // If it returns a React element, we can't render it - show formatted content instead
        const formatted = formatCellContent(content, header, colIndex, row, rowIndex);
        if (formatted !== null) {
          const textNode = document.createTextNode(formatted);
          contentSpan.appendChild(textNode);
        }
      }
    } catch (error) {
      console.error("Error rendering cell:", error);
      const formatted = formatCellContent(content, header, colIndex, row, rowIndex);
      if (formatted !== null) {
        const textNode = document.createTextNode(formatted);
        contentSpan.appendChild(textNode);
      }
    }
    return;
  }

  // Default: format and display content
  const formatted = formatCellContent(content, header, colIndex, row, rowIndex);
  if (formatted !== null) {
    const textNode = document.createTextNode(formatted);
    contentSpan.appendChild(textNode);
  }
};
