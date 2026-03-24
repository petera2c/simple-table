import HeaderObject from "../types/HeaderObject";
import TableRow from "../types/TableRow";
import { getNestedValue } from "./rowUtils";

/**
 * Escapes a value for CSV format
 * - Wraps in quotes if it contains comma, quote, or newline
 * - Escapes internal quotes by doubling them
 */
const escapeCSVValue = (value: any): string => {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);

  // Check if value needs to be quoted
  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n") ||
    stringValue.includes("\r")
  ) {
    // Escape quotes by doubling them
    const escapedValue = stringValue.replace(/"/g, '""');
    return `"${escapedValue}"`;
  }

  return stringValue;
};

/**
 * Gets all visible headers (flattens nested headers and excludes hidden ones)
 */
const getVisibleHeaders = (headers: HeaderObject[]): HeaderObject[] => {
  const visible: HeaderObject[] = [];

  const processHeaders = (headerList: HeaderObject[]) => {
    for (const header of headerList) {
      // Skip hidden headers, selection columns, and columns excluded from CSV
      if (header.hide || header.isSelectionColumn || header.excludeFromCsv) {
        continue;
      }

      // If header has children, process them
      if (header.children && header.children.length > 0) {
        // With singleRowChildren, parent header should be included in CSV export
        if (header.singleRowChildren) {
          visible.push(header);
        }
        processHeaders(header.children);
      } else {
        // Leaf header - add to visible list
        visible.push(header);
      }
    }
  };

  processHeaders(headers);
  return visible;
};

/**
 * Converts table data to CSV format
 */
export const convertToCSV = (
  visibleRows: TableRow[],
  headers: HeaderObject[],
  includeHeadersInCSVExport: boolean = true
): string => {
  const visibleHeaders = getVisibleHeaders(headers);

  // Create header row
  const headerRow = visibleHeaders.map((header) => escapeCSVValue(header.label)).join(",");

  // Create data rows
  const dataRows = visibleRows.map((tableRow, rowIndex) => {
    const row = tableRow.row;
    return visibleHeaders
      .map((header, colIndex) => {
        const value = getNestedValue(row, header.accessor);

        // Priority 1: Use exportValueGetter if provided
        if (header.exportValueGetter) {
          const formattedValue = header.valueFormatter
            ? header.valueFormatter({
                accessor: header.accessor,
                colIndex,
                row,
                rowIndex,
                value,
              })
            : undefined;

          const exportValue = header.exportValueGetter({
            accessor: header.accessor,
            colIndex,
            row,
            rowIndex,
            value,
            formattedValue,
          });
          return escapeCSVValue(exportValue);
        }

        // Priority 2: Use valueFormatter if useFormattedValueForCSV is not explicitly false
        // Auto-enable if valueFormatter exists, unless explicitly disabled
        if (header.useFormattedValueForCSV !== false && header.valueFormatter) {
          const formattedValue = header.valueFormatter({
            accessor: header.accessor,
            colIndex,
            row,
            rowIndex,
            value,
          });
          return escapeCSVValue(formattedValue);
        }

        // Priority 3: Use raw value
        return escapeCSVValue(value);
      })
      .join(",");
  });

  // Combine header and data rows
  const rows = includeHeadersInCSVExport ? [headerRow, ...dataRows] : dataRows;
  return rows.join("\n");
};

/**
 * Triggers a download of the CSV file
 */
export const downloadCSV = (csvContent: string, filename: string = "table-export.csv"): void => {
  // Create a Blob from the CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Create a temporary link element
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object
  URL.revokeObjectURL(url);
};

/**
 * Main export function that combines CSV conversion and download
 */
export const exportTableToCSV = (
  visibleRows: TableRow[],
  headers: HeaderObject[],
  filename?: string,
  includeHeadersInCSVExport: boolean = true
): void => {
  const csvContent = convertToCSV(visibleRows, headers, includeHeadersInCSVExport);
  downloadCSV(csvContent, filename);
};
