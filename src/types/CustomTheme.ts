/**
 * Custom theme configuration for SimpleTable
 * Contains all customizable dimensions and spacing values used in calculations and styling
 */
export interface CustomTheme {
  // Row and header dimensions
  rowHeight: number;
  headerHeight: number;
  footerHeight: number;

  // Border widths
  rowSeparatorWidth: number; // Width of separators between rows
  borderWidth: number; // General border width (e.g., table borders, header borders)
  pinnedBorderWidth: number; // Width of borders for pinned columns
  nestedGridBorderWidth: number; // Border width for nested grid tables (top + bottom)

  // Nested grid spacing
  nestedGridPaddingTop: number;
  nestedGridPaddingBottom: number;
  nestedGridPaddingLeft: number;
  nestedGridPaddingRight: number;
  nestedGridMaxHeight: number; // Maximum height for nested grids in pixels

  // Column dimensions
  selectionColumnWidth: number; // Width of the selection column (for row selection checkboxes)
}

/**
 * Default theme values
 * These match the original hardcoded constants throughout the codebase
 */
export const DEFAULT_CUSTOM_THEME: CustomTheme = {
  // Row and header dimensions
  rowHeight: 32,
  headerHeight: 32,
  footerHeight: 49,

  // Border widths
  rowSeparatorWidth: 1,
  borderWidth: 1,
  pinnedBorderWidth: 1,
  nestedGridBorderWidth: 2, // 1px top + 1px bottom

  // Nested grid spacing
  nestedGridPaddingTop: 8,
  nestedGridPaddingBottom: 8,
  nestedGridPaddingLeft: 8,
  nestedGridPaddingRight: 8,
  nestedGridMaxHeight: 400,

  selectionColumnWidth: 42,
};
