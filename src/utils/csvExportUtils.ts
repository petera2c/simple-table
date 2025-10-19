import HeaderObject, { Accessor } from "../types/HeaderObject";
import TableRow from "../types/TableRow";

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
      // Skip hidden headers and selection columns
      if (header.hide || header.isSelectionColumn) {
        continue;
      }

      // If header has children, process them
      if (header.children && header.children.length > 0) {
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
export const convertToCSV = (visibleRows: TableRow[], headers: HeaderObject[]): string => {
  const visibleHeaders = getVisibleHeaders(headers);

  // Create header row
  const headerRow = visibleHeaders.map((header) => escapeCSVValue(header.label)).join(",");

  // Create data rows
  const dataRows = visibleRows.map((tableRow) => {
    const row = tableRow.row;
    return visibleHeaders
      .map((header) => {
        const value = row[header.accessor];
        return escapeCSVValue(value);
      })
      .join(",");
  });

  // Combine header and data rows
  return [headerRow, ...dataRows].join("\n");
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
  filename?: string
): void => {
  const csvContent = convertToCSV(visibleRows, headers);
  downloadCSV(csvContent, filename);
};
