import HeaderObject from "../types/HeaderObject";
import TableRow from "../types/TableRow";
/**
 * Converts table data to CSV format
 */
export declare const convertToCSV: (visibleRows: TableRow[], headers: HeaderObject[], includeHeadersInCSVExport?: boolean) => string;
/**
 * Triggers a download of the CSV file
 */
export declare const downloadCSV: (csvContent: string, filename?: string) => void;
/**
 * Main export function that combines CSV conversion and download
 */
export declare const exportTableToCSV: (visibleRows: TableRow[], headers: HeaderObject[], filename?: string, includeHeadersInCSVExport?: boolean) => void;
