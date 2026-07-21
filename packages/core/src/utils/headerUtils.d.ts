import HeaderObject from "../types/HeaderObject";
/**
 * Gets all leaf column indices (bottom-level columns) for a given header and its descendants
 * @param header The header to get indices for
 * @param colIndex The column index of the header in the current context
 * @returns Array of column indices that belong to this header branch
 */
export declare const getHeaderLeafIndices: (header: HeaderObject, colIndex: number) => number[];
/**
 * Flattens a nested header structure to get all leaf headers
 * @param headers The headers array to flatten
 * @returns Flattened array of all leaf headers
 */
export declare const flattenHeaders: (headers: HeaderObject[]) => HeaderObject[];
/**
 * Flattens a nested header structure to get all headers (including parent headers)
 * @param headers The headers array to flatten
 * @returns Flattened array of all headers in the hierarchy
 */
export declare const flattenAllHeaders: (headers: HeaderObject[]) => HeaderObject[];
/**
 * Gets the range of column indices between two column indices
 * @param startColIndex Starting column index
 * @param endColIndex Ending column index
 * @returns Array of column indices in the range (inclusive)
 */
export declare const getColumnRange: (startColIndex: number, endColIndex: number) => number[];
export declare const calculatePinnedWidth: (width?: number) => number;
/**
 * Generates a unique ID for header description element
 * @param accessor The header accessor
 * @returns Unique ID string for aria-describedby
 */
export declare const getHeaderDescriptionId: (accessor: string | number) => string;
/**
 * Builds a descriptive string for screen readers about a column header
 * @param header The header object
 * @param filterable Whether the column is filterable
 * @returns Description string for aria-describedby, or empty string if no description
 */
export declare const getHeaderDescription: (header: HeaderObject, filterable: boolean) => string;
