import Cell from "../types/Cell";
import HeaderObject from "../types/HeaderObject";
import type TableRowType from "../types/TableRow";
import { rowIdToString, getNestedValue, setNestedValue } from "./rowUtils";

interface CellRegistryEntry {
  updateContent: (newValue: any) => void;
}

/**
 * Copies selected cells to clipboard in tab-separated format
 */
export const copySelectedCellsToClipboard = (
  selectedCells: Set<string>,
  leafHeaders: HeaderObject[],
  tableRows: TableRowType[],
  copyHeadersToClipboard: boolean = false
): string => {
  // Filter out hidden headers and columns excluded from render
  const flattenedLeafHeaders = leafHeaders.filter(
    (header) => !header.hide && !header.excludeFromRender
  );

  // Create a mapping of column indices to accessors and headers for quick lookup
  const colIndexToAccessor = new Map<number, string>();
  const colIndexToHeader = new Map<number, HeaderObject>();
  flattenedLeafHeaders.forEach((header, index) => {
    colIndexToAccessor.set(index, header.accessor);
    colIndexToHeader.set(index, header);
  });

  // Convert selectedCells to a text format suitable for clipboard
  const rowsText = Array.from(selectedCells).reduce((acc, cellKey) => {
    const [row, col] = cellKey.split("-").map(Number);

    if (!acc[row]) acc[row] = [];

    const accessor = colIndexToAccessor.get(col);
    const header = colIndexToHeader.get(col);

    if (accessor && tableRows[row]?.row) {
      const rowData = tableRows[row].row;
      const value = getNestedValue(rowData, accessor);

      // Priority 1: Check if we should use formatted value for clipboard
      // Auto-enable if valueFormatter exists, unless explicitly disabled
      const shouldUseFormattedValue =
        header?.useFormattedValueForClipboard !== false && header?.valueFormatter;

      if (shouldUseFormattedValue) {
        const formattedValue = header.valueFormatter!({
          accessor,
          colIndex: col,
          row: rowData,
          rowIndex: row,
          value,
        });
        acc[row][col] = formattedValue;
      }
      // Priority 2: Format chart data as comma-separated values for better usability
      else if (header && (header.type === "lineAreaChart" || header.type === "barChart")) {
        if (Array.isArray(value)) {
          acc[row][col] = value.join(", ");
        } else {
          acc[row][col] = "";
        }
      }
      // Priority 3: Use raw value
      else {
        acc[row][col] = value;
      }
    } else {
      acc[row][col] = "";
    }

    return acc;
  }, {} as { [key: number]: { [key: number]: any } });

  // Determine which columns have selected cells for header generation
  const selectedColumnIndices = new Set<number>();
  if (copyHeadersToClipboard) {
    Array.from(selectedCells).forEach((cellKey) => {
      const [, col] = cellKey.split("-").map(Number);
      selectedColumnIndices.add(col);
    });
  }

  // Create header row if enabled
  let headerRow = "";
  if (copyHeadersToClipboard && selectedColumnIndices.size > 0) {
    // Sort column indices to maintain order
    const sortedColIndices = Array.from(selectedColumnIndices).sort((a, b) => a - b);

    // Map column indices to their header labels
    const headerLabels = sortedColIndices.map((colIndex) => {
      const header = colIndexToHeader.get(colIndex);
      return header?.label ?? "";
    });

    headerRow = headerLabels.join("\t");
  }

  // Convert the structured data to a tab-separated string
  const dataText = Object.values(rowsText)
    .map((row) => Object.values(row).join("\t"))
    .join("\n");

  // Combine header and data rows
  const text = copyHeadersToClipboard && headerRow ? `${headerRow}\n${dataText}` : dataText;

  return text;
};

/**
 * Pastes clipboard data into cells starting from the initial focused cell
 */
export const pasteClipboardDataToCells = (
  clipboardText: string,
  initialFocusedCell: Cell,
  leafHeaders: HeaderObject[],
  tableRows: TableRowType[],
  onCellEdit?: (props: any) => void,
  cellRegistry?: Map<string, CellRegistryEntry>
): { updatedCells: Set<string>; warningCells: Set<string> } => {
  const updatedCells = new Set<string>();
  const warningCells = new Set<string>();

  // Parse clipboard data (tab-separated values, newline-separated rows)
  const rows = clipboardText.split("\n").filter((row) => row.length > 0);
  if (rows.length === 0) return { updatedCells, warningCells };

  const flattenedLeafHeaders = leafHeaders.filter(
    (header) => !header.hide && !header.excludeFromRender
  );

  // Starting position
  const startRowIndex = initialFocusedCell.rowIndex;
  const startColIndex = initialFocusedCell.colIndex;

  rows.forEach((rowText, rowOffset) => {
    const cellValues = rowText.split("\t");

    cellValues.forEach((cellValue, colOffset) => {
      const targetRowIndex = startRowIndex + rowOffset;
      const targetColIndex = startColIndex + colOffset;

      // Check boundaries
      if (targetRowIndex >= tableRows.length || targetColIndex >= flattenedLeafHeaders.length) {
        return;
      }

      const targetRow = tableRows[targetRowIndex];
      const targetHeader = flattenedLeafHeaders[targetColIndex];
      const targetRowId = rowIdToString(targetRow.rowId);

      // Track warning flash for non-editable cells
      if (!targetHeader?.isEditable) {
        const cellId = `${targetRowIndex}-${targetColIndex}-${targetRowId}`;
        warningCells.add(cellId);
        return;
      }

      // Convert value to appropriate type based on header type
      let convertedValue: any = cellValue;
      if (targetHeader.type === "number") {
        const numValue = Number(cellValue);
        if (!isNaN(numValue)) {
          convertedValue = numValue;
        }
      } else if (targetHeader.type === "boolean") {
        convertedValue = cellValue.toLowerCase() === "true" || cellValue === "1";
      } else if (targetHeader.type === "date") {
        const dateValue = new Date(cellValue);
        if (!isNaN(dateValue.getTime())) {
          convertedValue = dateValue;
        }
      } else if (targetHeader.type === "lineAreaChart" || targetHeader.type === "barChart") {
        // Parse comma-separated values back into number array for charts
        const values = cellValue.split(",").map((v) => {
          const num = Number(v.trim());
          return isNaN(num) ? 0 : num;
        });
        convertedValue = values;
      }

      // Update the data
      setNestedValue(targetRow.row, targetHeader.accessor, convertedValue);

      // Use cell registry for direct update if available
      if (cellRegistry) {
        const key = `${targetRowId}-${targetHeader.accessor}`;
        const cell = cellRegistry.get(key);
        if (cell) {
          cell.updateContent(convertedValue);
        }
      }

      // Call onCellEdit callback
      onCellEdit?.({
        accessor: targetHeader.accessor,
        newValue: convertedValue,
        row: targetRow.row,
        rowIndex: targetRowIndex,
      });

      // Track updated cell for flash effect
      const cellId = `${targetRowIndex}-${targetColIndex}-${targetRowId}`;
      updatedCells.add(cellId);
    });
  });

  return { updatedCells, warningCells };
};

/**
 * Deletes content from selected cells (sets them to appropriate empty values)
 */
export const deleteSelectedCellsContent = (
  selectedCells: Set<string>,
  leafHeaders: HeaderObject[],
  tableRows: TableRowType[],
  onCellEdit?: (props: any) => void,
  cellRegistry?: Map<string, CellRegistryEntry>
): { deletedCells: Set<string>; warningCells: Set<string> } => {
  const deletedCells = new Set<string>();
  const warningCells = new Set<string>();

  const flattenedLeafHeaders = leafHeaders.filter(
    (header) => !header.hide && !header.excludeFromRender
  );
  const colIndexToAccessor = new Map<number, string>();
  flattenedLeafHeaders.forEach((header, index) => {
    colIndexToAccessor.set(index, header.accessor);
  });

  Array.from(selectedCells).forEach((cellKey) => {
    const [rowIndex, colIndex] = cellKey.split("-").map(Number);

    // Check boundaries
    if (rowIndex >= tableRows.length || colIndex >= flattenedLeafHeaders.length) {
      return;
    }

    const targetRow = tableRows[rowIndex];
    const targetHeader = flattenedLeafHeaders[colIndex];
    const targetRowId = rowIdToString(targetRow.rowId);

    // Track warning flash for non-editable cells
    if (!targetHeader?.isEditable) {
      warningCells.add(cellKey);
      return;
    }

    // Determine appropriate empty value based on type
    let emptyValue: any = null;
    if (targetHeader.type === "string") {
      emptyValue = "";
    } else if (targetHeader.type === "number") {
      emptyValue = null;
    } else if (targetHeader.type === "boolean") {
      emptyValue = false;
    } else if (targetHeader.type === "date") {
      emptyValue = null;
    } else if (targetHeader.type === "lineAreaChart" || targetHeader.type === "barChart") {
      emptyValue = [];
    } else if (Array.isArray(getNestedValue(targetRow.row, targetHeader.accessor))) {
      emptyValue = [];
    } else {
      emptyValue = "";
    }

    // Update the data
    setNestedValue(targetRow.row, targetHeader.accessor, emptyValue);

    // Use cell registry for direct update if available
    if (cellRegistry) {
      const key = `${targetRowId}-${targetHeader.accessor}`;
      const cell = cellRegistry.get(key);
      if (cell) {
        cell.updateContent(emptyValue);
      }
    }

    // Call onCellEdit callback
    onCellEdit?.({
      accessor: targetHeader.accessor,
      newValue: emptyValue,
      row: targetRow.row,
      rowIndex: rowIndex,
    });

    deletedCells.add(cellKey);
  });

  return { deletedCells, warningCells };
};
