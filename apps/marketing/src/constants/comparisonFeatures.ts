/**
 * Comprehensive feature list for all table packages
 * Each feature maps to one of: "free", "paid", "in-development", or "not-available"
 */

export type FeatureStatus = "free" | "paid" | "in-development" | "not-available";

export interface FeatureMapping {
  [feature: string]: FeatureStatus;
}

// Comprehensive list of all features across all comparison pages
export const ALL_FEATURES = [
  // Core Features
  "virtualization",
  "infiniteScroll",

  // Column Features
  "columnResizing",
  "columnReordering",
  "columnVisibility",
  "columnPinning",
  "columnAlignment",
  "columnSorting",
  "columnFiltering",
  "columnAdvancedFiltering",
  "columnNestedHeaders",
  "columnAggregationFunctions",
  "columnSelection",
  "columnCollapsible",
  "columnEditing",

  // Row Features
  "rowSelection",
  "rowGrouping",
  "rowAdjustableHeight",
  "rowExpansion",

  // Cell Features
  "cellEditing",
  "cellHighlighting",
  "cellClicking",
  "cellCustomRenderers",
  "cellLiveUpdates",
  "cellFormatting",
  "cellValidation",

  // Spreadsheet Features
  "spreadsheetFormulas",
  "spreadsheetDataBinding",
  "spreadsheetContextMenu",
  "spreadsheetComments",

  // Filtering Features
  "filteringGlobalSearch",
  "filteringFacetedFilters",

  // Pagination Features
  "paginationClientSide",
  "paginationServerSide",
  "paginationCursorBased",

  // Advanced Data Features
  "advancedValueGettersSetters",
  "advancedCellRangeSelection",
  "advancedPivotTables",
  "advancedTreeData",
  "advancedRowSpanning",
  "advancedMasterDetailViews",

  // Advanced UI Features
  "uiContextMenu",
  "uiStatusBar",
  "uiColumnMenu",
  "uiFullWidthRows",
  "uiAdvancedTooltips",

  // Integration Features
  "integrationExcelExport",
  "integrationExcelImport",
  "integrationCsvExport",
  "integrationCsvImport",
  "integrationClipboardOperations",
  "integrationKeyboardNavigation",
  "integrationAccessibility",

  // Theming Features
  "themingMultipleThemes",
  "themingCustomIcons",

  // Developer Experience Features
  "developerTypeScriptSupport",

  // Undo/Redo Features
  "undoRedo",
] as const;

// Feature mappings for Simple Table
export const simpleTableFeatures: FeatureMapping = {
  virtualization: "free",
  infiniteScroll: "free",

  // Column Features
  columnResizing: "free",
  columnReordering: "free",
  columnVisibility: "free",
  columnPinning: "free",
  columnAlignment: "free",
  columnSorting: "free",
  columnFiltering: "free",
  columnAdvancedFiltering: "free",
  columnNestedHeaders: "free",
  columnAggregationFunctions: "free",
  columnSelection: "free",
  columnCollapsible: "free",
  columnEditing: "free",

  // Row Features
  rowSelection: "free",
  rowGrouping: "free",
  rowAdjustableHeight: "free",
  rowExpansion: "free",

  // Cell Features
  cellEditing: "free",
  cellHighlighting: "free",
  cellClicking: "free",
  cellCustomRenderers: "free",
  cellLiveUpdates: "free",
  cellFormatting: "free",
  cellValidation: "free",

  // Spreadsheet Features
  spreadsheetFormulas: "in-development",
  spreadsheetDataBinding: "free",
  spreadsheetContextMenu: "not-available",
  spreadsheetComments: "not-available",

  // Filtering Features
  filteringGlobalSearch: "in-development",
  filteringFacetedFilters: "free",

  // Pagination Features
  paginationClientSide: "free",
  paginationServerSide: "free",
  paginationCursorBased: "not-available",

  // Advanced Data Features
  advancedValueGettersSetters: "free",
  advancedCellRangeSelection: "free",
  advancedPivotTables: "not-available",
  advancedTreeData: "free",
  advancedRowSpanning: "not-available",
  advancedMasterDetailViews: "not-available",

  // Advanced UI Features
  uiContextMenu: "not-available",
  uiStatusBar: "not-available",
  uiColumnMenu: "in-development",
  uiFullWidthRows: "in-development",
  uiAdvancedTooltips: "in-development",

  // Integration Features
  integrationExcelExport: "in-development",
  integrationExcelImport: "in-development",
  integrationCsvExport: "free",
  integrationCsvImport: "in-development",
  integrationClipboardOperations: "free",
  integrationKeyboardNavigation: "free",
  integrationAccessibility: "in-development",

  // Theming Features
  themingMultipleThemes: "free",
  themingCustomIcons: "free",

  // Developer Experience Features
  developerTypeScriptSupport: "free",

  // Undo/Redo Features
  undoRedo: "in-development",
};

// Feature mappings for AG Grid
// Naming notes:
// - infiniteScroll -> "Infinite Row Model" (Enterprise)
// - columnAdvancedFiltering -> "Advanced Filter" or "Set Filter" (Enterprise)
// - rowGrouping -> "Row Grouping" (Enterprise)
// - rowExpansion -> "Master Detail" (Enterprise)
export const agGridFeatures: FeatureMapping = {
  virtualization: "free", // AG Grid: "Row Virtualization"
  infiniteScroll: "paid", // AG Grid: "Infinite Row Model"

  // Column Features
  columnResizing: "free",
  columnReordering: "free", // AG Grid: "Column Moving"
  columnVisibility: "free", // AG Grid: "Column Visibility"
  columnPinning: "free", // AG Grid: "Column Pinning"
  columnAlignment: "free",
  columnSorting: "free",
  columnFiltering: "free", // AG Grid: "Column Filter"
  columnAdvancedFiltering: "paid", // AG Grid: "Advanced Filter" or "Set Filter" (Enterprise)
  columnNestedHeaders: "free", // AG Grid: "Column Groups"
  columnAggregationFunctions: "paid", // AG Grid: "Aggregation" (Enterprise)
  columnSelection: "free",
  columnCollapsible: "free", // AG Grid: "Column Group Opening"
  columnEditing: "free",

  // Row Features
  rowSelection: "free",
  rowGrouping: "paid", // AG Grid: "Row Grouping" (Enterprise)
  rowAdjustableHeight: "free", // AG Grid: "Row Height"
  rowExpansion: "paid", // AG Grid: "Master Detail" (Enterprise)

  // Cell Features
  cellEditing: "free",
  cellHighlighting: "paid", // AG Grid: "Range Selection" or "Cell Selection" (Enterprise)
  cellClicking: "free", // AG Grid: "onCellClicked" event
  cellCustomRenderers: "free", // AG Grid: "Cell Renderer"
  cellLiveUpdates: "free", // AG Grid: "Change Detection"
  cellFormatting: "free", // AG Grid: "Value Formatter"
  cellValidation: "free",

  // Spreadsheet Features
  spreadsheetFormulas: "not-available",
  spreadsheetDataBinding: "free",
  spreadsheetContextMenu: "paid", // AG Grid: "Context Menu" (Enterprise)
  spreadsheetComments: "not-available",

  // Filtering Features
  filteringGlobalSearch: "free", // AG Grid: "Quick Filter"
  filteringFacetedFilters: "paid", // AG Grid: "Set Filter" (Enterprise)

  // Pagination Features
  paginationClientSide: "free", // AG Grid: "Client-Side Row Model"
  paginationServerSide: "paid", // AG Grid: "Server-Side Row Model" (Enterprise)
  paginationCursorBased: "not-available",

  // Advanced Data Features
  advancedValueGettersSetters: "free", // AG Grid: "Value Getter/Setter"
  advancedCellRangeSelection: "paid", // AG Grid: "Range Selection" (Enterprise)
  advancedPivotTables: "paid", // AG Grid: "Pivot Mode" (Enterprise)
  advancedTreeData: "paid", // AG Grid: "Tree Data" (Enterprise)
  advancedRowSpanning: "paid", // AG Grid: "Row Spanning" (Enterprise)
  advancedMasterDetailViews: "paid", // AG Grid: "Master Detail" (Enterprise)

  // Advanced UI Features
  uiContextMenu: "paid", // AG Grid: "Context Menu" (Enterprise)
  uiStatusBar: "paid", // AG Grid: "Status Bar" (Enterprise)
  uiColumnMenu: "paid", // AG Grid: "Column Menu" (Enterprise)
  uiFullWidthRows: "free", // AG Grid: "Full Width Rows"
  uiAdvancedTooltips: "free", // AG Grid: "Tooltip Component"

  // Integration Features
  integrationExcelExport: "paid", // AG Grid: "Excel Export" (Enterprise)
  integrationExcelImport: "paid", // AG Grid: "Excel Import" (Enterprise)
  integrationCsvExport: "free", // AG Grid: "CSV Export"
  integrationCsvImport: "not-available",
  integrationClipboardOperations: "paid", // AG Grid: "Clipboard" (Enterprise)
  integrationKeyboardNavigation: "free",
  integrationAccessibility: "free",

  // Theming Features
  themingMultipleThemes: "free",
  themingCustomIcons: "free",

  // Developer Experience Features
  developerTypeScriptSupport: "free",

  // Undo/Redo Features
  undoRedo: "paid",
};

// Feature mappings for Ant Design Table
// Naming notes:
// - virtualization -> "Virtual Scroll"
// - columnPinning -> "Fixed Columns"
// - columnNestedHeaders -> "Column Groups"
// - rowExpansion -> "Expandable Rows"
// - cellHighlighting -> via "rowClassName" or "onRow" props
// - cellCustomRenderers -> "render" function in column definition
export const antDesignFeatures: FeatureMapping = {
  virtualization: "free", // Ant Design: "Virtual Scroll"
  infiniteScroll: "not-available",

  // Column Features
  columnResizing: "free", // Ant Design: "resizable" prop
  columnReordering: "not-available", // Not built-in, requires custom implementation
  columnVisibility: "not-available", // Not built-in, manual column array manipulation required
  columnPinning: "free", // Ant Design: "fixed" prop (left/right)
  columnAlignment: "free", // Ant Design: "align" prop
  columnSorting: "free", // Ant Design: "sorter" prop
  columnFiltering: "free", // Ant Design: "filters" prop
  columnAdvancedFiltering: "not-available",
  columnNestedHeaders: "free", // Ant Design: "Column Groups" via nested columns
  columnAggregationFunctions: "free", // Ant Design: "summary" prop
  columnSelection: "not-available",
  columnCollapsible: "not-available",
  columnEditing: "free", // Via custom "render" function

  // Row Features
  rowSelection: "free", // Ant Design: "rowSelection" prop
  rowGrouping: "not-available",
  rowAdjustableHeight: "not-available",
  rowExpansion: "free", // Ant Design: "expandable" prop

  // Cell Features
  cellEditing: "free", // Via custom "render" or "onCell"
  cellHighlighting: "free", // Ant Design: via "rowClassName" or "onRow" callbacks
  cellClicking: "free", // Ant Design: "onCell" or "onRow" callbacks
  cellCustomRenderers: "free", // Ant Design: "render" function in column definition
  cellLiveUpdates: "free", // Works with React state updates
  cellFormatting: "free", // Ant Design: "render" function
  cellValidation: "not-available",

  // Spreadsheet Features
  spreadsheetFormulas: "not-available",
  spreadsheetDataBinding: "free",
  spreadsheetContextMenu: "not-available",
  spreadsheetComments: "not-available",

  // Filtering Features
  filteringGlobalSearch: "free",
  filteringFacetedFilters: "not-available",

  // Pagination Features
  paginationClientSide: "free",
  paginationServerSide: "free",
  paginationCursorBased: "not-available",

  // Advanced Data Features
  advancedValueGettersSetters: "not-available",
  advancedCellRangeSelection: "not-available",
  advancedPivotTables: "not-available",
  advancedTreeData: "free",
  advancedRowSpanning: "free",
  advancedMasterDetailViews: "free",

  // Advanced UI Features
  uiContextMenu: "not-available",
  uiStatusBar: "not-available",
  uiColumnMenu: "not-available",
  uiFullWidthRows: "not-available",
  uiAdvancedTooltips: "not-available",

  // Integration Features
  integrationExcelExport: "not-available",
  integrationExcelImport: "not-available",
  integrationCsvExport: "not-available",
  integrationCsvImport: "not-available",
  integrationClipboardOperations: "not-available",
  integrationKeyboardNavigation: "free",
  integrationAccessibility: "free",

  // Theming Features
  themingMultipleThemes: "free",
  themingCustomIcons: "free",

  // Developer Experience Features
  developerTypeScriptSupport: "free",

  // Undo/Redo Features
  undoRedo: "not-available",
};

// Feature mappings for Handsontable
// Note: Handsontable requires a commercial license for production use
// Free non-commercial license available for personal/non-commercial projects
// Naming notes:
// - columnReordering -> "Manual Column Move"
// - columnVisibility -> "Hidden Columns"
// - columnPinning -> "Fixed Columns"
// - columnNestedHeaders -> "Nested Headers"
// - cellHighlighting -> "Current Cell Highlighting" & "Fill Handle"
// - cellCustomRenderers -> "Cell Renderers"
// - spreadsheetFormulas -> "Formulas" plugin
// - spreadsheetComments -> "Comments" plugin
export const handsontableFeatures: FeatureMapping = {
  virtualization: "paid", // Handsontable: Built-in performance optimization
  infiniteScroll: "not-available",

  // Column Features
  columnResizing: "paid", // Handsontable: "Manual Column Resize"
  columnReordering: "paid", // Handsontable: "Manual Column Move"
  columnVisibility: "paid", // Handsontable: "Hidden Columns"
  columnPinning: "paid", // Handsontable: "Fixed Columns"
  columnAlignment: "paid", // Handsontable: via "className" or CSS
  columnSorting: "paid", // Handsontable: "Column Sorting" plugin
  columnFiltering: "paid", // Handsontable: "Filters" plugin
  columnAdvancedFiltering: "paid", // Handsontable: Advanced filter conditions
  columnNestedHeaders: "paid", // Handsontable: "Nested Headers" plugin
  columnAggregationFunctions: "not-available",
  columnSelection: "paid", // Handsontable: Column selection via headers
  columnCollapsible: "paid", // Handsontable: "Collapsing Columns" plugin
  columnEditing: "paid",

  // Row Features
  rowSelection: "paid", // Handsontable: Row selection via row headers
  rowGrouping: "not-available",
  rowAdjustableHeight: "paid", // Handsontable: "Manual Row Resize"
  rowExpansion: "not-available",

  // Cell Features
  cellEditing: "paid", // Handsontable: Core spreadsheet editing
  cellHighlighting: "paid", // Handsontable: "Current Cell Highlighting" & selection
  cellClicking: "paid", // Handsontable: Cell event hooks
  cellCustomRenderers: "paid", // Handsontable: "Cell Renderers"
  cellLiveUpdates: "paid", // Handsontable: Real-time data updates
  cellFormatting: "paid", // Handsontable: "Numeric" and other cell types
  cellValidation: "paid", // Handsontable: "Data Validation"

  // Spreadsheet Features
  spreadsheetFormulas: "paid", // Handsontable: "Formulas" plugin (HyperFormula)
  spreadsheetDataBinding: "paid",
  spreadsheetContextMenu: "paid", // Handsontable: "Context Menu" plugin
  spreadsheetComments: "paid", // Handsontable: "Comments" plugin

  // Filtering Features
  filteringGlobalSearch: "not-available",
  filteringFacetedFilters: "not-available",

  // Pagination Features
  paginationClientSide: "not-available",
  paginationServerSide: "not-available",
  paginationCursorBased: "not-available",

  // Advanced Data Features
  advancedValueGettersSetters: "paid",
  advancedCellRangeSelection: "paid",
  advancedPivotTables: "not-available",
  advancedTreeData: "paid",
  advancedRowSpanning: "paid",
  advancedMasterDetailViews: "not-available",

  // Advanced UI Features
  uiContextMenu: "paid",
  uiStatusBar: "not-available",
  uiColumnMenu: "paid",
  uiFullWidthRows: "not-available",
  uiAdvancedTooltips: "not-available",

  // Integration Features
  integrationExcelExport: "not-available",
  integrationExcelImport: "not-available",
  integrationCsvExport: "paid",
  integrationCsvImport: "paid",
  integrationClipboardOperations: "paid",
  integrationKeyboardNavigation: "paid",
  integrationAccessibility: "paid",

  // Theming Features
  themingMultipleThemes: "not-available",
  themingCustomIcons: "not-available",

  // Developer Experience Features
  developerTypeScriptSupport: "paid",

  // Undo/Redo Features
  undoRedo: "paid",
};

// Feature mappings for Material React Table (MRT)
// Built on top of TanStack Table with Material UI components
// Naming notes:
// - virtualization -> "Row Virtualization" (via @tanstack/react-virtual)
// - infiniteScroll -> Works with virtualization
// - columnReordering -> "enableColumnOrdering"
// - columnVisibility -> "Column Hiding"
// - columnPinning -> "Column Pinning"
// - columnAdvancedFiltering -> "enableColumnFilterModes"
// - columnNestedHeaders -> "Header Groups"
// - columnAggregationFunctions -> "Aggregation and Grouping"
// - rowGrouping -> "Grouping" feature
// - rowExpansion -> "Detail Panels" or "Expanding"
// - cellHighlighting -> via "muiTableBodyCellProps" styling
export const materialReactFeatures: FeatureMapping = {
  virtualization: "free", // MRT: "enableRowVirtualization"
  infiniteScroll: "free", // MRT: Works with virtualization

  // Column Features
  columnResizing: "free", // MRT: "enableColumnResizing"
  columnReordering: "free", // MRT: "enableColumnOrdering"
  columnVisibility: "free", // MRT: "Column Hiding" feature
  columnPinning: "free", // MRT: "enableColumnPinning"
  columnAlignment: "free", // MRT: via column "align" property
  columnSorting: "free", // MRT: "enableSorting"
  columnFiltering: "free", // MRT: "enableColumnFilters"
  columnAdvancedFiltering: "free", // MRT: "enableColumnFilterModes"
  columnNestedHeaders: "free", // MRT: "Header Groups" via column structure
  columnAggregationFunctions: "free", // MRT: "Aggregation and Grouping"
  columnSelection: "not-available",
  columnCollapsible: "not-available",
  columnEditing: "free", // MRT: "enableEditing"

  // Row Features
  rowSelection: "free", // MRT: "enableRowSelection"
  rowGrouping: "free", // MRT: "enableGrouping"
  rowAdjustableHeight: "free", // MRT: via "muiTableBodyRowProps"
  rowExpansion: "free", // MRT: "Detail Panels" or "enableExpanding"

  // Cell Features
  cellEditing: "free", // MRT: "enableEditing" with cell edit mode
  cellHighlighting: "free", // MRT: via "muiTableBodyCellProps" styling
  cellClicking: "free", // MRT: via "muiTableBodyCellProps" onClick
  cellCustomRenderers: "free", // MRT: "Cell" render function in columns
  cellLiveUpdates: "free", // Works with React state
  cellFormatting: "free", // MRT: "Cell" render function
  cellValidation: "not-available",

  // Spreadsheet Features
  spreadsheetFormulas: "not-available",
  spreadsheetDataBinding: "free",
  spreadsheetContextMenu: "not-available",
  spreadsheetComments: "not-available",

  // Filtering Features
  filteringGlobalSearch: "free",
  filteringFacetedFilters: "free",

  // Pagination Features
  paginationClientSide: "free",
  paginationServerSide: "free",
  paginationCursorBased: "not-available",

  // Advanced Data Features
  advancedValueGettersSetters: "free",
  advancedCellRangeSelection: "not-available",
  advancedPivotTables: "not-available",
  advancedTreeData: "free",
  advancedRowSpanning: "not-available",
  advancedMasterDetailViews: "free",

  // Advanced UI Features
  uiContextMenu: "not-available",
  uiStatusBar: "not-available",
  uiColumnMenu: "free",
  uiFullWidthRows: "free",
  uiAdvancedTooltips: "free",

  // Integration Features
  integrationExcelExport: "not-available",
  integrationExcelImport: "not-available",
  integrationCsvExport: "free",
  integrationCsvImport: "not-available",
  integrationClipboardOperations: "not-available",
  integrationKeyboardNavigation: "free",
  integrationAccessibility: "free",

  // Theming Features
  themingMultipleThemes: "free",
  themingCustomIcons: "free",

  // Developer Experience Features
  developerTypeScriptSupport: "free",

  // Undo/Redo Features
  undoRedo: "not-available",
};

// Feature mappings for TanStack Table
// Note: TanStack Table is a headless UI library - it provides logic/state management
// but no UI components. Features marked as "free" mean the logic is provided,
// but you must implement your own UI. "not-available" means no built-in logic support.
// Naming notes:
// - virtualization -> Use separate @tanstack/react-virtual library
// - columnResizing -> "Column Sizing" API
// - columnReordering -> "Column Ordering" API
// - columnVisibility -> "Column Visibility" API
// - columnPinning -> "Column Pinning" API
// - columnSorting -> "Sorting" API
// - columnFiltering -> "Filtering" API
// - columnNestedHeaders -> "Header Groups" via column structure
// - columnAggregationFunctions -> "Grouping" API with aggregation functions
// - rowSelection -> "Row Selection" API
// - rowGrouping -> "Grouping" API
// - rowExpansion -> "Expanding" API
// - cellCustomRenderers -> "cell" render function in column definition
export const tanstackFeatures: FeatureMapping = {
  virtualization: "free", // TanStack: Use @tanstack/react-virtual separately
  infiniteScroll: "not-available",

  // Column Features
  columnResizing: "free", // TanStack: "Column Sizing" API
  columnReordering: "free", // TanStack: "Column Ordering" API
  columnVisibility: "free", // TanStack: "Column Visibility" API
  columnPinning: "free", // TanStack: "Column Pinning" API
  columnAlignment: "free", // TanStack: via column meta
  columnSorting: "free", // TanStack: "Sorting" API
  columnFiltering: "free", // TanStack: "Filtering" API
  columnAdvancedFiltering: "not-available",
  columnNestedHeaders: "free", // TanStack: "Header Groups"
  columnAggregationFunctions: "free", // TanStack: "Grouping" with aggregation
  columnSelection: "not-available",
  columnCollapsible: "not-available",
  columnEditing: "not-available", // No editing logic, implement yourself

  // Row Features
  rowSelection: "free", // TanStack: "Row Selection" API
  rowGrouping: "free", // TanStack: "Grouping" API
  rowAdjustableHeight: "not-available",
  rowExpansion: "free", // TanStack: "Expanding" API

  // Cell Features
  cellEditing: "not-available", // No editing logic
  cellHighlighting: "not-available", // No styling logic
  cellClicking: "not-available", // Handle events in your UI layer
  cellCustomRenderers: "free", // TanStack: "cell" function in columns
  cellLiveUpdates: "not-available", // Handle in your state management
  cellFormatting: "not-available", // Implement in cell renderer
  cellValidation: "not-available",

  // Spreadsheet Features
  spreadsheetFormulas: "not-available",
  spreadsheetDataBinding: "free",
  spreadsheetContextMenu: "not-available",
  spreadsheetComments: "not-available",

  // Filtering Features
  filteringGlobalSearch: "free",
  filteringFacetedFilters: "free",

  // Pagination Features
  paginationClientSide: "free",
  paginationServerSide: "free",
  paginationCursorBased: "not-available",

  // Advanced Data Features
  advancedValueGettersSetters: "free",
  advancedCellRangeSelection: "not-available",
  advancedPivotTables: "not-available",
  advancedTreeData: "free",
  advancedRowSpanning: "not-available",
  advancedMasterDetailViews: "not-available",

  // Advanced UI Features
  uiContextMenu: "not-available",
  uiStatusBar: "not-available",
  uiColumnMenu: "not-available",
  uiFullWidthRows: "not-available",
  uiAdvancedTooltips: "not-available",

  // Integration Features
  integrationExcelExport: "not-available",
  integrationExcelImport: "not-available",
  integrationCsvExport: "not-available",
  integrationCsvImport: "not-available",
  integrationClipboardOperations: "not-available",
  integrationKeyboardNavigation: "not-available",
  integrationAccessibility: "not-available",

  // Theming Features
  themingMultipleThemes: "not-available",
  themingCustomIcons: "not-available",

  // Developer Experience Features
  developerTypeScriptSupport: "free",

  // Undo/Redo Features
  undoRedo: "not-available",
};

// Feature mappings for Syncfusion DataGrid
// Note: Syncfusion is a commercial component suite with free community license
// for companies with less than $1M USD in annual revenue
// Naming notes:
// - virtualization -> Built-in virtual scrolling
// - columnReordering -> "allowReordering"
// - columnResizing -> "allowResizing"
// - columnPinning -> "frozenColumns" and "frozenRows"
// - rowGrouping -> "allowGrouping"
// - cellEditing -> "editSettings"
export const syncfusionFeatures: FeatureMapping = {
  virtualization: "paid", // Syncfusion: Virtual scrolling
  infiniteScroll: "paid", // Syncfusion: Infinite scrolling mode

  // Column Features
  columnResizing: "paid", // Syncfusion: "allowResizing"
  columnReordering: "paid", // Syncfusion: "allowReordering"
  columnVisibility: "paid", // Syncfusion: "showColumnChooser"
  columnPinning: "paid", // Syncfusion: "frozenColumns"
  columnAlignment: "paid", // Syncfusion: "textAlign" in column definition
  columnSorting: "paid", // Syncfusion: "allowSorting"
  columnFiltering: "paid", // Syncfusion: "allowFiltering"
  columnAdvancedFiltering: "paid", // Syncfusion: Advanced filter UI
  columnNestedHeaders: "paid", // Syncfusion: "columns" with nested structure
  columnAggregationFunctions: "paid", // Syncfusion: "aggregates"
  columnSelection: "paid", // Syncfusion: Column selection mode
  columnCollapsible: "paid", // Syncfusion: Column groups
  columnEditing: "paid", // Syncfusion: Inline column editing

  // Row Features
  rowSelection: "paid", // Syncfusion: "selectionSettings"
  rowGrouping: "paid", // Syncfusion: "allowGrouping"
  rowAdjustableHeight: "paid", // Syncfusion: "rowHeight" and "allowRowDragAndDrop"
  rowExpansion: "paid", // Syncfusion: Detail template

  // Cell Features
  cellEditing: "paid", // Syncfusion: "editSettings"
  cellHighlighting: "paid", // Syncfusion: "selectionSettings.cellSelectionMode"
  cellClicking: "paid", // Syncfusion: "cellSelected" event
  cellCustomRenderers: "paid", // Syncfusion: Template support
  cellLiveUpdates: "paid", // Syncfusion: Data binding with notifications
  cellFormatting: "paid", // Syncfusion: "format" in column definition
  cellValidation: "paid", // Syncfusion: Edit validation rules

  // Spreadsheet Features
  spreadsheetFormulas: "not-available",
  spreadsheetDataBinding: "paid",
  spreadsheetContextMenu: "paid", // Syncfusion: Context menu support
  spreadsheetComments: "not-available",

  // Filtering Features
  filteringGlobalSearch: "paid", // Syncfusion: Search functionality
  filteringFacetedFilters: "paid", // Syncfusion: Filter menu with checkboxes

  // Pagination Features
  paginationClientSide: "paid", // Syncfusion: "allowPaging"
  paginationServerSide: "paid", // Syncfusion: Remote data with paging
  paginationCursorBased: "not-available",

  // Advanced Data Features
  advancedValueGettersSetters: "paid",
  advancedCellRangeSelection: "paid", // Syncfusion: Cell range selection
  advancedPivotTables: "not-available", // Separate Pivot Grid component
  advancedTreeData: "paid", // Syncfusion: "treeColumnIndex"
  advancedRowSpanning: "paid", // Syncfusion: Row spanning support
  advancedMasterDetailViews: "paid", // Syncfusion: Detail template

  // Advanced UI Features
  uiContextMenu: "paid", // Syncfusion: Context menu
  uiStatusBar: "not-available",
  uiColumnMenu: "paid", // Syncfusion: Column menu
  uiFullWidthRows: "paid",
  uiAdvancedTooltips: "paid", // Syncfusion: Tooltip support

  // Integration Features
  integrationExcelExport: "paid", // Syncfusion: "allowExcelExport"
  integrationExcelImport: "not-available",
  integrationCsvExport: "paid", // Syncfusion: CSV export
  integrationCsvImport: "not-available",
  integrationClipboardOperations: "paid",
  integrationKeyboardNavigation: "paid",
  integrationAccessibility: "paid",

  // Theming Features
  themingMultipleThemes: "paid", // Syncfusion: Multiple built-in themes
  themingCustomIcons: "paid",

  // Developer Experience Features
  developerTypeScriptSupport: "paid",

  // Undo/Redo Features
  undoRedo: "not-available",
};

// Feature mappings for Tabulator
// Note: Tabulator is a free, open-source library with extensive features
// Naming notes:
// - virtualization -> Built-in virtual DOM rendering
// - columnReordering -> "movableColumns"
// - columnResizing -> "resizableColumns"
// - columnPinning -> "frozen" columns
// - cellEditing -> "editor" in column definition
export const tabulatorFeatures: FeatureMapping = {
  virtualization: "free", // Tabulator: Virtual DOM for large datasets
  infiniteScroll: "free", // Tabulator: Progressive loading

  // Column Features
  columnResizing: "free", // Tabulator: "resizableColumns"
  columnReordering: "free", // Tabulator: "movableColumns"
  columnVisibility: "free", // Tabulator: "hideColumn" / "showColumn"
  columnPinning: "free", // Tabulator: "frozen" columns
  columnAlignment: "free", // Tabulator: "hozAlign" / "vertAlign"
  columnSorting: "free", // Tabulator: Built-in sorting
  columnFiltering: "free", // Tabulator: Header filters
  columnAdvancedFiltering: "free", // Tabulator: Custom filter functions
  columnNestedHeaders: "free", // Tabulator: Column groups
  columnAggregationFunctions: "free", // Tabulator: Column calculations
  columnSelection: "not-available",
  columnCollapsible: "free", // Tabulator: Toggle column groups
  columnEditing: "not-available",

  // Row Features
  rowSelection: "free", // Tabulator: "selectable" rows
  rowGrouping: "free", // Tabulator: "groupBy"
  rowAdjustableHeight: "free", // Tabulator: "resizableRows"
  rowExpansion: "free", // Tabulator: Nested data expansion

  // Cell Features
  cellEditing: "free", // Tabulator: "editor" in column definition
  cellHighlighting: "free", // Tabulator: Cell Range Selection module
  cellClicking: "free", // Tabulator: "cellClick" event
  cellCustomRenderers: "free", // Tabulator: "formatter" function
  cellLiveUpdates: "free", // Tabulator: "updateData" / "updateRow"
  cellFormatting: "free", // Tabulator: "formatter" function
  cellValidation: "free", // Tabulator: "validator" in column definition

  // Spreadsheet Features
  spreadsheetFormulas: "not-available",
  spreadsheetDataBinding: "free",
  spreadsheetContextMenu: "free", // Tabulator: Menus, Popups & Alerts
  spreadsheetComments: "not-available",

  // Filtering Features
  filteringGlobalSearch: "free", // Tabulator: "setFilter" for global search
  filteringFacetedFilters: "not-available",

  // Pagination Features
  paginationClientSide: "free", // Tabulator: Built-in pagination
  paginationServerSide: "free", // Tabulator: Remote pagination
  paginationCursorBased: "not-available",

  // Advanced Data Features
  advancedValueGettersSetters: "free", // Tabulator: "mutator" / "accessor"
  advancedCellRangeSelection: "free", // Tabulator: Cell Range Selection module
  advancedPivotTables: "not-available",
  advancedTreeData: "free", // Tabulator: Tree Structure support
  advancedRowSpanning: "not-available",
  advancedMasterDetailViews: "not-available",

  // Advanced UI Features
  uiContextMenu: "free",
  uiStatusBar: "not-available",
  uiColumnMenu: "free", // Tabulator: Header menu
  uiFullWidthRows: "not-available",
  uiAdvancedTooltips: "free", // Tabulator: Tooltip support

  // Integration Features
  integrationExcelExport: "free", // Tabulator: Download module supports XLSX
  integrationExcelImport: "not-available",
  integrationCsvExport: "free", // Tabulator: Download module
  integrationCsvImport: "not-available",
  integrationClipboardOperations: "free", // Tabulator: Clipboard module
  integrationKeyboardNavigation: "free", // Tabulator: Navigation & Keybindings
  integrationAccessibility: "free", // Tabulator: Accessibility module

  // Theming Features
  themingMultipleThemes: "free", // Tabulator: Multiple built-in themes
  themingCustomIcons: "not-available",

  // Developer Experience Features
  developerTypeScriptSupport: "free", // Tabulator: TypeScript definitions available

  // Undo/Redo Features
  undoRedo: "free", // Tabulator: Interaction History module
};

// Map of all table packages to their feature mappings
export const tablePackageFeatures: Record<string, FeatureMapping> = {
  simpleTable: simpleTableFeatures,
  agGrid: agGridFeatures,
  antDesign: antDesignFeatures,
  handsontable: handsontableFeatures,
  materialReact: materialReactFeatures,
  tanstack: tanstackFeatures,
  syncfusion: syncfusionFeatures,
  tabulator: tabulatorFeatures,
};

// Helper function to get feature status for a package
export function getFeatureStatus(packageName: string, feature: string): FeatureStatus | undefined {
  const packageFeatures = tablePackageFeatures[packageName];
  return packageFeatures?.[feature];
}

// Helper function to check if a feature is available for a package
export function hasFeature(packageName: string, feature: string): boolean {
  const status = getFeatureStatus(packageName, feature);
  return status === "free" || status === "paid";
}
