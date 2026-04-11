/**
 * Feature labels and tooltips for display in comparison pages
 */
export const FEATURE_LABELS: Record<string, { label: string; tooltip: string }> = {
  // Core Features
  virtualization: {
    label: "Virtualization",
    tooltip: "Supports millions of rows with advanced row virtualization",
  },
  infiniteScroll: {
    label: "Infinite Scroll",
    tooltip: "Scroll to the bottom of the table to load more data",
  },

  // Column Features
  columnResizing: {
    label: "Column Resizing",
    tooltip: "Resize columns by dragging their edges",
  },
  columnReordering: {
    label: "Column Reordering",
    tooltip: "Drag and drop columns to reorder them",
  },
  columnVisibility: {
    label: "Column Visibility",
    tooltip: "Show/hide columns dynamically",
  },
  columnPinning: {
    label: "Column Pinning",
    tooltip: "Pin columns to the left or right side",
  },
  columnAlignment: {
    label: "Column Alignment",
    tooltip: "Align content left, center, or right",
  },
  columnSorting: {
    label: "Column Sorting",
    tooltip: "Sort data by clicking column headers",
  },
  columnFiltering: {
    label: "Column Filtering",
    tooltip: "Filter data with type-specific controls",
  },
  columnAdvancedFiltering: {
    label: "Advanced Filtering",
    tooltip: "Complex multi-condition filtering with custom operators",
  },
  columnNestedHeaders: {
    label: "Nested Headers",
    tooltip: "Column grouping and nesting",
  },
  columnAggregationFunctions: {
    label: "Aggregation Functions",
    tooltip: "Built-in aggregation functions (sum, average, count, min, max, etc.)",
  },
  columnSelection: {
    label: "Column Selection",
    tooltip: "Select entire columns by clicking column headers",
  },
  columnCollapsible: {
    label: "Collapsible Columns",
    tooltip: "Collapse and expand column groups to manage screen space",
  },
  columnEditing: {
    label: "Column Editing",
    tooltip: "Edit column definitions dynamically",
  },

  // Row Features
  rowSelection: {
    label: "Row Selection",
    tooltip: "Select single or multiple rows with checkboxes or clicks",
  },
  rowGrouping: {
    label: "Row Grouping",
    tooltip: "Group rows by column values with expand/collapse functionality",
  },
  rowAdjustableHeight: {
    label: "Adjustable Row Height",
    tooltip: "Adjust row height dynamically or set fixed heights",
  },
  rowExpansion: {
    label: "Row Expansion",
    tooltip: "Expand rows to show additional details or nested content",
  },

  // Cell Features
  cellEditing: {
    label: "Cell Editing",
    tooltip: "Edit cell values inline with validation and formatting",
  },
  cellHighlighting: {
    label: "Cell Highlighting",
    tooltip: "Highlight cells and select cell ranges",
  },
  cellClicking: {
    label: "Cell Clicking",
    tooltip: "Handle cell click events with custom actions",
  },
  cellCustomRenderers: {
    label: "Custom Renderers",
    tooltip: "Create custom cell renderers for complex content",
  },
  cellLiveUpdates: {
    label: "Live Updates",
    tooltip: "Update cell values in real-time without page refresh",
  },
  cellFormatting: {
    label: "Cell Formatting",
    tooltip: "Format cell values (numbers, dates, currency, etc.)",
  },
  cellValidation: {
    label: "Cell Validation",
    tooltip: "Validate cell input with custom rules and error messages",
  },

  // Spreadsheet Features
  spreadsheetFormulas: {
    label: "Formulas",
    tooltip: "Excel-like formula support",
  },
  spreadsheetDataBinding: {
    label: "Data Binding",
    tooltip: "Two-way data binding with React state",
  },
  spreadsheetContextMenu: {
    label: "Context Menu",
    tooltip: "Right-click context menu for spreadsheet operations",
  },
  spreadsheetComments: {
    label: "Comments",
    tooltip: "Cell comments and annotations",
  },

  filteringGlobalSearch: {
    label: "Global Search",
    tooltip: "Search across all columns",
  },
  filteringFacetedFilters: {
    label: "Faceted Filters",
    tooltip: "Multiple filter modes and options",
  },

  // Pagination Features
  paginationClientSide: {
    label: "Client-side Pagination",
    tooltip: "Built-in pagination with customizable controls",
  },
  paginationServerSide: {
    label: "Server-side Pagination",
    tooltip: "Support for controlled pagination",
  },
  paginationCursorBased: {
    label: "Cursor-based Pagination",
    tooltip: "Support for cursor-based pagination",
  },

  // Advanced Data Features
  advancedValueGettersSetters: {
    label: "Value Getters/Setters",
    tooltip: "Custom functions to get and set cell values",
  },
  advancedCellRangeSelection: {
    label: "Cell Range Selection",
    tooltip: "Select multiple cells in a range",
  },
  advancedPivotTables: {
    label: "Pivot Tables",
    tooltip: "Create pivot tables for data analysis",
  },
  advancedTreeData: {
    label: "Tree Data",
    tooltip: "Display hierarchical data in a tree structure",
  },
  advancedRowSpanning: {
    label: "Row Spanning",
    tooltip: "Span cells across multiple rows",
  },
  advancedMasterDetailViews: {
    label: "Master/Detail Views",
    tooltip: "Display master-detail relationships between rows",
  },

  // Advanced UI Features
  uiContextMenu: {
    label: "Context Menu",
    tooltip: "Right-click context menu",
  },
  uiStatusBar: {
    label: "Status Bar",
    tooltip: "Status bar showing selected rows and other info",
  },
  uiColumnMenu: {
    label: "Column Menu",
    tooltip: "Column menu for filtering, sorting, and more",
  },
  uiFullWidthRows: {
    label: "Full Width Rows",
    tooltip: "Rows that span the full width of the table",
  },
  uiAdvancedTooltips: {
    label: "Advanced Tooltips",
    tooltip: "Advanced tooltips with rich content",
  },

  // Integration Features
  integrationExcelExport: {
    label: "Excel Export",
    tooltip: "Export table data to Excel format",
  },
  integrationExcelImport: {
    label: "Excel Import",
    tooltip: "Import data from Excel format",
  },
  integrationCsvExport: {
    label: "CSV Export",
    tooltip: "Export table data to CSV format",
  },
  integrationCsvImport: {
    label: "CSV Import",
    tooltip: "Import data from CSV format",
  },
  integrationClipboardOperations: {
    label: "Clipboard Operations",
    tooltip: "Copy and paste data to/from clipboard",
  },
  integrationKeyboardNavigation: {
    label: "Advanced Keyboard Navigation",
    tooltip: "Advanced keyboard navigation and shortcuts",
  },
  integrationAccessibility: {
    label: "Accessibility Features",
    tooltip: "ARIA attributes and keyboard navigation",
  },

  // Theming Features
  themingMultipleThemes: {
    label: "Multiple Themes",
    tooltip: "Support for light and dark themes with easy customization",
  },
  themingCustomIcons: {
    label: "Custom Icons",
    tooltip: "Replace default icons with custom ones",
  },

  // Developer Experience Features
  developerTypeScriptSupport: {
    label: "TypeScript Support",
    tooltip: "Full TypeScript support with strong typing",
  },

  // Undo/Redo Features
  undoRedo: {
    label: "Undo/Redo",
    tooltip: "Excel-like history management",
  },
};
