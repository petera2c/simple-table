import type { PropInfo } from "./types";

export const SIMPLE_TABLE_PROPS: PropInfo[] = [
  {
    key: "defaultHeaders",
    name: "defaultHeaders",
    required: true,
    description: "Array of column definitions that specify the structure of your table.",
    type: "HeaderObject[]",
    link: "#header-object",
    example: `const headers = [
  { accessor: "id", label: "ID", width: 80 },
  { accessor: "name", label: "Name", width: "1fr" }
];`,
  },
  {
    key: "rows",
    name: "rows",
    required: true,
    description: "Array of data objects to display in the table. Each object represents a row.",
    type: "Row[]",
    link: "#union-types",
    example: `const data = [
  { id: 1, name: "John Doe", age: 30 },
  { id: 2, name: "Jane Smith", age: 25 }
];`,
  },
  {
    key: "height",
    name: "height",
    required: false,
    description:
      "Height of the table container. If both height and maxHeight are defined, height will be ignored.",
    type: "string | number",
    link: "/docs/table-height",
    example: `height="400px"
height="50vh"`,
  },
  {
    key: "maxHeight",
    name: "maxHeight",
    required: false,
    description:
      "Maximum height of the table container with adaptive behavior. Works the same as height except that it will shrink if there are fewer rows. Enables virtualization while allowing the table to be smaller when content doesn't fill the maximum height. If both height and maxHeight are defined, height will be ignored.",
    type: "string | number",
    link: "/docs/table-height",
    example: `maxHeight="600px"
maxHeight="80vh"`,
  },
  {
    key: "customTheme",
    name: "customTheme",
    required: false,
    description:
      "Custom theme configuration for dimensions and spacing. Only specify the properties you want to customize - all properties are optional and will use default values if not provided.",
    type: "CustomTheme",
    link: "#custom-theme",
    example: `customTheme={{
  rowHeight: 40,
  headerHeight: 48,
  footerHeight: 60,
  selectionColumnWidth: 50,
}}

// Or just customize what you need
customTheme={{
  rowHeight: 32,
}}`,
  },
  {
    key: "animations",
    name: "animations",
    required: false,
    description:
      "Configures animations on sort, programmatic column reorder, drag-driven column reorder, and column visibility changes. Animations are enabled by default with sensible motion settings and automatically respect the user's prefers-reduced-motion setting. Pass an object to override the duration, easing, or to disable animations entirely.",
    type: "AnimationsConfig",
    link: "#animations-config",
    example: `// Default behavior (animations on, 240ms, smooth easing)
// No prop required.

// Custom timing
animations={{
  duration: 320,
  easing: "ease-out",
}}

// Disable animations
animations={{ enabled: false }}`,
  },
  {
    key: "cellUpdateFlash",
    name: "cellUpdateFlash",
    required: false,
    description: "Flag for flash animation after cell update.",
    type: "boolean",
    example: `cellUpdateFlash={true}`,
  },
  {
    key: "columnReordering",
    name: "columnReordering",
    required: false,
    description: "Enable column reordering by drag and drop.",
    type: "boolean",
    example: `columnReordering={true}`,
  },
  {
    key: "columnResizing",
    name: "columnResizing",
    required: false,
    description: "Enable column resizing functionality.",
    type: "boolean",
    example: `columnResizing={true}`,
  },
  {
    key: "editColumns",
    name: "editColumns",
    required: false,
    description: "Flag for column editing via column editor panel.",
    type: "boolean",
    example: `editColumns={true}`,
  },
  {
    key: "editColumnsInitOpen",
    name: "editColumnsInitOpen",
    required: false,
    description: "Flag for opening the column editor when the table is loaded.",
    type: "boolean",
    example: `editColumnsInitOpen={true}`,
  },
  {
    key: "expandAll",
    name: "expandAll",
    required: false,
    description: "Flag for expanding all rows by default (for grouped rows).",
    type: "boolean",
    example: `expandAll={true}`,
  },
  {
    key: "enableStickyParents",
    name: "enableStickyParents",
    required: false,
    description:
      "Beta feature: When enabled, parent rows with children will remain sticky at the top while scrolling down through their child rows in row grouping. This helps maintain context when navigating deep hierarchical data. Defaults to false as this is still a beta feature and may have edge cases that need refinement.",
    type: "boolean",
    link: "/docs/row-grouping",
    example: `// Enable sticky parent rows
<SimpleTable
  enableStickyParents={true}
  rowGrouping={["departments", "teams"]}
  expandAll={true}
  // ... other props
/>`,
  },
  {
    key: "icons",
    name: "icons",
    required: false,
    description:
      "Unified table icons (sort, pagination, expand, filter, drag, etc.). Optional column-editor pin icons: pinnedLeftIcon, pinnedRightIcon.",
    type: "IconsConfig",
    link: "/docs/custom-icons",
    example: `import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCaretUp, 
  faCaretDown, 
  faFilter,
  faChevronRight,
  faChevronDown,
  faAngleLeft,
  faAngleRight,
  faGripVertical,
  faThumbtack
} from "@fortawesome/free-solid-svg-icons";

icons={{
  sortUp: <FontAwesomeIcon icon={faCaretUp} />,
  sortDown: <FontAwesomeIcon icon={faCaretDown} />,
  filter: <FontAwesomeIcon icon={faFilter} />,
  expand: <FontAwesomeIcon icon={faChevronRight} />,
  headerExpand: <FontAwesomeIcon icon={faChevronRight} />,
  headerCollapse: <FontAwesomeIcon icon={faChevronDown} />,
  prev: <FontAwesomeIcon icon={faAngleLeft} />,
  next: <FontAwesomeIcon icon={faAngleRight} />,
  drag: <FontAwesomeIcon icon={faGripVertical} />,
  pinnedLeftIcon: <FontAwesomeIcon icon={faThumbtack} />,
  pinnedRightIcon: <FontAwesomeIcon icon={faThumbtack} />,
}}`,
  },
  {
    key: "externalFilterHandling",
    name: "externalFilterHandling",
    required: false,
    description: "Flag to let consumer handle filter logic completely.",
    type: "boolean",
    example: `externalFilterHandling={true}`,
  },
  {
    key: "externalSortHandling",
    name: "externalSortHandling",
    required: false,
    description:
      "When true, completely disables internal sorting logic. The table will not sort data internally - you must provide pre-sorted data via the rows prop.",
    type: "boolean",
    example: `externalSortHandling={true}`,
  },
  {
    key: "initialSortColumn",
    name: "initialSortColumn",
    required: false,
    description:
      "Sets the column to sort by on initial table load. Provide the accessor of the column you want to sort by default. Works with both internal and external sorting.",
    type: "string",
    example: `initialSortColumn="revenue"
initialSortColumn="createdAt"`,
  },
  {
    key: "initialSortDirection",
    name: "initialSortDirection",
    required: false,
    description:
      "Sets the sort direction for the initial sort. Defaults to 'asc' if not specified. Only applies when initialSortColumn is also set.",
    type: '"asc" | "desc"',
    example: `initialSortDirection="desc"
initialSortDirection="asc"`,
  },
  {
    key: "hideHeader",
    name: "hideHeader",
    required: false,
    description:
      "Flag for hiding the table header row. When true, the entire header row will be hidden while maintaining all table functionality including sorting, filtering, and column operations.",
    type: "boolean",
    example: `hideHeader={true}`,
  },
  {
    key: "hideFooter",
    name: "hideFooter",
    required: false,
    description: "Flag for hiding the table footer.",
    type: "boolean",
    example: `hideFooter={true}`,
  },
  {
    key: "quickFilter",
    name: "quickFilter",
    required: false,
    description:
      "Enable global search/quick filter across all columns. Accepts a QuickFilterConfig object to control the search text, mode (simple or smart), case sensitivity, and which columns to search. The quick filter applies before column-specific filters in the filter chain.",
    type: "QuickFilterConfig",
    link: "/docs/quick-filter",
    example: `// Simple mode - basic text matching
quickFilter={{
  text: searchText,
  mode: "simple",
}}

// Smart mode with advanced operators
quickFilter={{
  text: searchText,
  mode: "smart",
  caseSensitive: false,
  onChange: (text) => console.log("Filter changed:", text),
}}

// Search specific columns only
quickFilter={{
  text: searchText,
  columns: ["name", "email", "department"],
}}`,
  },
  {
    key: "onFilterChange",
    name: "onFilterChange",
    required: false,
    description:
      "Callback function triggered when filter configuration changes. Receives the current filter state with all active filters.",
    type: "(filters: TableFilterState) => void",
    example: `onFilterChange={(filters) => {
  console.log('Active filters:', filters);
  // Make API call with filter parameters
  // filters is an object where keys are unique filter IDs
  // and values are FilterCondition objects
}}`,
  },
  {
    key: "onLoadMore",
    name: "onLoadMore",
    required: false,
    description:
      "Callback function triggered when user scrolls near the bottom of the table to load more data. Useful for implementing infinite scrolling or paginated data loading.",
    type: "() => void",
    example: `onLoadMore={() => {
  console.log('Loading more data...');
  // Fetch additional data from API
  // Append new rows to existing data
  fetchMoreData().then(newRows => {
    setRows(prevRows => [...prevRows, ...newRows]);
  });
}}`,
  },
  {
    key: "onSortChange",
    name: "onSortChange",
    required: false,
    description:
      "Callback function triggered when sort configuration changes. Receives the current sort configuration or null if no sorting is applied.",
    type: "(sort: SortConfig | null) => void",
    example: `onSortChange={(sortConfig) => {
  if (sortConfig) {
    console.log(\`Sorting by \${sortConfig.key.accessor} (\${sortConfig.direction})\`);
    // Make API call with sort parameters
  }
}}`,
  },
  {
    key: "rowGrouping",
    name: "rowGrouping",
    required: false,
    description: "Array of property names that define row grouping hierarchy.",
    type: "string[]",
    example: `rowGrouping={["department", "team"]}`,
  },
  {
    key: "getRowId",
    name: "getRowId",
    required: false,
    description:
      "Optional function to generate unique identifiers for each row. Receives detailed context (row, depth, index, rowPath, rowIndexPath, groupingKey) enabling flexible ID generation. Critical for scenarios where row order changes (sorting, filtering, dynamic data). When provided, row IDs are based on this function's return value, and rowIdPath becomes available in OnRowGroupExpandProps. Highly recommended for tables with row grouping and external sorting to maintain correct expansion state across data updates.",
    type: "(params: GetRowIdParams) => string | number",
    link: "#get-row-id-params",
    example: `// Basic usage with id field
<SimpleTable
  getRowId={({ row }) => row.id as string}
  rows={[
    { id: 'REG-1', name: 'Region 1', stores: [...] },
    { id: 'REG-2', name: 'Region 2', stores: [...] }
  ]}
  // ... other props
/>

// With nested data and custom ID generation
<SimpleTable
  getRowId={({ row, depth, groupingKey }) => {
    return \`\${groupingKey || 'root'}-\${row.id}\`;
  }}
  rowGrouping={["stores", "products"]}
  externalSortHandling={true}
  onRowGroupExpand={({ rowIdPath }) => {
    // rowIdPath: ['root-REG-1', 'stores', 'stores-STORE-101']
    // Much more stable than index-based paths when sorted
  }}
  // ... other props
/>`,
  },
  {
    key: "onRowGroupExpand",
    name: "onRowGroupExpand",
    required: false,
    description:
      "Callback function triggered when a grouped row is expanded or collapsed. Provides detailed information about the row, depth level, and grouping context, plus helper functions for managing loading, error, and empty states. The rowIndexPath array provides a direct path to update nested data. Perfect for implementing lazy-loading of hierarchical data with built-in state management.",
    type: "(props: OnRowGroupExpandProps) => void",
    link: "#on-row-group-expand-props",
    example: `onRowGroupExpand={async ({ 
  row, 
  depth, 
  groupingKey, 
  isExpanded,
  setLoading,
  setError,
  setEmpty,
  rowIndexPath
}) => {
  // Only fetch when expanding
  if (!isExpanded) return;
  
  // Don't fetch if data already exists
  if (groupingKey && row[groupingKey]?.length > 0) return;

  try {
    // Show loading state
    setLoading(true);
    
    // Lazy-load children data
    const teams = await fetchTeams(row.id);
    setLoading(false);
    
    // Handle empty results
    if (teams.length === 0) {
      setEmpty(true, "No teams found");
      return;
    }
    
    // Update using rowIndexPath
    // e.g., [0, "stores", 1] = rows[0].stores[1]
    setRows(prev => {
      const newRows = [...prev];
      newRows[rowIndexPath[0]][groupingKey] = teams;
      return newRows;
    });
  } catch (error) {
    setLoading(false);
    setError(error.message);
  }
}}`,
  },
  {
    key: "loadingStateRenderer",
    name: "loadingStateRenderer",
    required: false,
    description:
      "Custom content to display when a row is in loading state (set via setLoading in onRowGroupExpand). Can be a simple string or React component. Shown in place of row children while data is being fetched. If not provided, a default skeleton loading animation will be displayed automatically.",
    type: "string | ReactNode",
    example: `// If undefined, shows default skeleton loader
// Simple string
loadingStateRenderer="Loading..."

// Or React component
loadingStateRenderer={
  <div className="flex items-center gap-2 p-2">
    <Spinner size="sm" />
    <span>Loading data...</span>
  </div>
}`,
  },
  {
    key: "errorStateRenderer",
    name: "errorStateRenderer",
    required: false,
    description:
      "Custom content to display when a row has an error state (set via setError in onRowGroupExpand). Can be a simple string or React component. Shown in place of row children when data fetching fails.",
    type: "string | ReactNode",
    example: `// Simple string
errorStateRenderer="Failed to load data"

// Or React component
errorStateRenderer={
  <div className="text-red-600 p-2">
    ⚠️ Failed to load data
  </div>
}`,
  },
  {
    key: "emptyStateRenderer",
    name: "emptyStateRenderer",
    required: false,
    description:
      "Custom content to display when a row has no children data (set via setEmpty in onRowGroupExpand). Can be a simple string or React component. Shown when data fetch succeeds but returns zero results.",
    type: "string | ReactNode",
    example: `// Simple string
emptyStateRenderer="No items to display"

// Or React component
emptyStateRenderer={
  <div className="text-gray-500 italic p-2">
    No items to display
  </div>
}`,
  },
  {
    key: "canExpandRowGroup",
    name: "canExpandRowGroup",
    required: false,
    description:
      "Callback function to conditionally control whether a specific row group can be expanded. Return true to allow expansion, false to disable it. Useful for implementing permission-based access, hiding empty groups, or preventing expansion based on business logic.",
    type: "(row: Row) => boolean",
    link: "#union-types",
    example: `// Prevent expansion of empty groups
canExpandRowGroup={(row) => {
  return row.children && row.children.length > 0;
}}

// Permission-based expansion
canExpandRowGroup={(row) => {
  return user.role === 'admin' || row.isPublic;
}}

// Disable expansion for specific status
canExpandRowGroup={(row) => {
  return row.status !== 'archived';
}}`,
  },
  {
    key: "rowsPerPage",
    name: "rowsPerPage",
    required: false,
    description: "Number of rows per page for pagination.",
    type: "number",
    example: `rowsPerPage={25}`,
  },
  {
    key: "onPageChange",
    name: "onPageChange",
    required: false,
    description:
      "Callback function triggered when page changes. Useful for server-side pagination to fetch data for the new page.",
    type: "(page: number) => void | Promise<void>",
    example: `onPageChange={async (page) => {
  console.log('Loading page:', page);
  const newData = await fetchPageData(page);
  setRows(newData);
}}`,
  },
  {
    key: "serverSidePagination",
    name: "serverSidePagination",
    required: false,
    description:
      "Flag to disable internal pagination slicing. When true, the table expects you to provide pre-paginated data via the rows prop and handle pagination externally.",
    type: "boolean",
    example: `serverSidePagination={true}`,
  },
  {
    key: "totalRowCount",
    name: "totalRowCount",
    required: false,
    description:
      "Total number of rows available on the server (for server-side pagination). Used to calculate total pages and display correct pagination information.",
    type: "number",
    example: `totalRowCount={1000} // When showing 25 rows per page`,
  },
  {
    key: "selectableCells",
    name: "selectableCells",
    required: false,
    description: "Enable cell selection functionality.",
    type: "boolean",
    example: `selectableCells={true}`,
  },
  {
    key: "copyHeadersToClipboard",
    name: "copyHeadersToClipboard",
    required: false,
    description:
      "When true, includes column headers as the first row when copying selected cells to clipboard. Defaults to false.",
    type: "boolean",
    example: `copyHeadersToClipboard={true}`,
  },
  {
    key: "selectableColumns",
    name: "selectableColumns",
    required: false,
    description: "Flag for selectable column headers.",
    type: "boolean",
    example: `selectableColumns={true}`,
  },
  {
    key: "shouldPaginate",
    name: "shouldPaginate",
    required: false,
    description: "Flag for enabling pagination.",
    type: "boolean",
    example: `shouldPaginate={true}`,
  },
  {
    key: "isLoading",
    name: "isLoading",
    required: false,
    description:
      "When set to true, all table cells will render skeleton loaders instead of actual data. Provides visual feedback while data is being fetched from the server.",
    type: "boolean",
    example: `const [isLoading, setIsLoading] = useState(true);

// Fetch data
useEffect(() => {
  fetchData().then(data => {
    setRows(data);
    setIsLoading(false);
  });
}, []);

<SimpleTable
  isLoading={isLoading}
  rows={rows}
  // ... other props
/>`,
  },
  {
    key: "theme",
    name: "theme",
    required: false,
    description: "Theme configuration for the table styling.",
    type: "Theme",
    link: "#union-types",
    example: `theme={{
  primaryColor: "#1890ff",
  backgroundColor: "#ffffff"
}}`,
  },
  {
    key: "useOddColumnBackground",
    name: "useOddColumnBackground",
    required: false,
    description: "Flag for using alternating column background colors.",
    type: "boolean",
    example: `useOddColumnBackground={true}`,
  },
  {
    key: "useHoverRowBackground",
    name: "useHoverRowBackground",
    required: false,
    description: "Flag for using hover row background highlighting.",
    type: "boolean",
    example: `useHoverRowBackground={true}`,
  },
  {
    key: "useOddEvenRowBackground",
    name: "useOddEvenRowBackground",
    required: false,
    description: "Flag for using odd/even row background colors.",
    type: "boolean",
    example: `useOddEvenRowBackground={true}`,
  },
  {
    key: "enableRowSelection",
    name: "enableRowSelection",
    required: false,
    description: "Enable row selection functionality with checkboxes.",
    type: "boolean",
    example: `enableRowSelection={true}`,
  },
  {
    key: "onRowSelectionChange",
    name: "onRowSelectionChange",
    required: false,
    description: "Callback function triggered when row selection changes.",
    type: "(props: RowSelectionChangeProps) => void",
    link: "#row-selection-change-props",
    example: `onRowSelectionChange={({ row, isSelected, selectedRows }) => {
  console.log('Selection changed:', { row, isSelected, selectedRows });
}}`,
  },
  {
    key: "onCellClick",
    name: "onCellClick",
    required: false,
    description:
      "Callback function triggered when a cell is clicked. Provides detailed information about the clicked cell including its position, value, and containing row.",
    type: "(props: CellClickProps) => void",
    link: "#cell-click-props",
    example: `onCellClick={({ accessor, colIndex, row, rowIndex, value }) => {
  console.log(\`Clicked cell \${accessor} in row \${rowIndex}:\`, value);
  // Handle cell click - open modal, navigate, etc.
  if (accessor === 'details') {
    openDetailModal(row);
  }
}}`,
  },
  {
    key: "onCellEdit",
    name: "onCellEdit",
    required: false,
    description:
      "Callback function triggered when a cell is edited. Provides the edited cell information including the new value, row, and column accessor.",
    type: "(props: CellChangeProps) => void",
    link: "#cell-change-props",
    example: `onCellEdit={({ accessor, newValue, row }) => {
  console.log(\`Cell \${accessor} edited to:\`, newValue);
  // Update your data
  updateRowData(row.id, accessor, newValue);
}}`,
  },
  {
    key: "onColumnSelect",
    name: "onColumnSelect",
    required: false,
    description:
      "Callback when a column is selected/clicked. With `@simple-table/react`, receives `ReactHeaderObject`. Angular, Svelte, and Solid adapters use `AngularHeaderObject`, `SvelteHeaderObject`, and `SolidHeaderObject` respectively.",
    type: "(header: ReactHeaderObject) => void",
    link: "#header-object",
    example: `onColumnSelect={(header) => {
  console.log('Column selected:', header.label);
  console.log('Column accessor:', header.accessor);
  console.log('Column type:', header.type);
  // Handle column selection - show column menu, apply operations, etc.
}}`,
  },
  {
    key: "enableHeaderEditing",
    name: "enableHeaderEditing",
    required: false,
    description: "Flag for enabling header label editing when clicking already active headers.",
    type: "boolean",
    example: `enableHeaderEditing={true}`,
  },
  {
    key: "onHeaderEdit",
    name: "onHeaderEdit",
    required: false,
    description:
      "Callback when a header is edited. With `@simple-table/react`, receives `ReactHeaderObject` and the new label. Angular, Svelte, and Solid adapters use `HeaderObject` from `simple-table-core`.",
    type: "(header: ReactHeaderObject, newLabel: string) => void",
    link: "#header-object",
    example: `onHeaderEdit={(header, newLabel) => {
  console.log('Header edited:', { header, newLabel });
  // Update your headers state
  setHeaders(prev => prev.map(h => 
    h.accessor === header.accessor 
      ? { ...h, label: newLabel }
      : h
  ));
}}`,
  },
  {
    key: "onColumnOrderChange",
    name: "onColumnOrderChange",
    required: false,
    description:
      "Callback when column order changes (through drag and drop reordering). With `@simple-table/react`, receives `ReactHeaderObject[]`. Angular, Svelte, and Solid adapters use `AngularHeaderObject[]`, `SvelteHeaderObject[]`, and `SolidHeaderObject[]` respectively.",
    type: "(newHeaders: ReactHeaderObject[]) => void",
    link: "#header-object",
    example: `onColumnOrderChange={(newHeaders) => {
  console.log('Column order changed:', newHeaders);
  // Update your headers state with the new order
  setHeaders(newHeaders);
}}`,
  },
  {
    key: "onColumnVisibilityChange",
    name: "onColumnVisibilityChange",
    required: false,
    description:
      "Callback triggered when column visibility changes (when users show/hide columns through the column editor). Receives a ColumnVisibilityState object mapping each column accessor to its visibility state (true = visible, false = hidden). Perfect for persisting user preferences or syncing visibility state with external storage.",
    type: "(visibilityState: ColumnVisibilityState) => void",
    link: "/docs/column-visibility",
    example: `onColumnVisibilityChange={(visibilityState) => {
  console.log('Column visibility changed:', visibilityState);
  // Example: { name: true, email: true, phone: false, id: false }
  
  // Save to localStorage
  localStorage.setItem('tableColumnVisibility', JSON.stringify(visibilityState));
  
  // Or sync with your state management
  setColumnVisibility(visibilityState);
}}`,
  },
  {
    key: "onColumnWidthChange",
    name: "onColumnWidthChange",
    required: false,
    description:
      "Callback triggered when column widths change through user resizing or double-click auto-sizing. With `@simple-table/react`, receives `ReactHeaderObject[]`. Angular, Svelte, and Solid adapters use `AngularHeaderObject[]`, `SvelteHeaderObject[]`, and `SolidHeaderObject[]` respectively. Useful for persisting column width preferences.",
    type: "(headers: ReactHeaderObject[]) => void",
    link: "/docs/column-resizing",
    example: `onColumnWidthChange={(headers) => {
  console.log('Column widths changed:', headers);
  
  // Save to localStorage
  const widths = headers.reduce((acc, header) => {
    acc[header.accessor] = header.width;
    return acc;
  }, {});
  localStorage.setItem('columnWidths', JSON.stringify(widths));
}}`,
  },
  {
    key: "autoExpandColumns",
    name: "autoExpandColumns",
    required: false,
    description:
      "When true, automatically scales all column widths proportionally to fill the entire table container width. The width property of each column is used as the base for proportional scaling. Note: minWidth is NOT enforced during scaling (columns can shrink below minWidth), and maxWidth is NOT checked at all. Recommended: Set to false on mobile devices (< 768px) as horizontal scrolling provides better UX than cramped columns on small screens.",
    type: "boolean",
    link: "/docs/column-width",
    example: `// Columns will scale to fill container
<SimpleTable
  autoExpandColumns={true}
  defaultHeaders={[
    { accessor: "id", label: "ID", width: 80 },
    { accessor: "name", label: "Name", width: 200 },
    { accessor: "email", label: "Email", width: 250 }
  ]}
  // ... other props
/>

// Responsive: disable on mobile
const [isMobile, setIsMobile] = useState(false);
useEffect(() => {
  const check = () => setIsMobile(window.innerWidth < 768);
  check();
  window.addEventListener("resize", check);
  return () => window.removeEventListener("resize", check);
}, []);

<SimpleTable
  autoExpandColumns={!isMobile}
  // ... other props
/>`,
  },
  {
    key: "columnBorders",
    name: "columnBorders",
    required: false,
    description: "Flag for showing column borders.",
    type: "boolean",
    example: `columnBorders={true}`,
  },
  {
    key: "headerDropdown",
    name: "headerDropdown",
    required: false,
    description: "Custom dropdown component for headers.",
    type: "HeaderDropdown",
    example: `headerDropdown={({ accessor, colIndex, header, isOpen, onClose, position }) => (
  isOpen ? <CustomDropdown header={header} position={position} onClose={onClose} /> : null
)}`,
  },
  {
    key: "footerRenderer",
    name: "footerRenderer",
    required: false,
    description:
      "Custom function to render the table footer. Receives pagination state and navigation handlers, allowing complete customization of footer appearance and behavior.",
    type: "(params: FooterRendererProps) => ReactNode",
    link: "#footer-renderer-props",
    example: `footerRenderer={({ currentPage, totalPages, startRow, endRow, totalRows, onPrevPage, onNextPage }) => (
  <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between' }}>
    <span>Showing {startRow}-{endRow} of {totalRows}</span>
    <div>
      <button onClick={onPrevPage}>Previous</button>
      <span>Page {currentPage} of {totalPages}</span>
      <button onClick={onNextPage}>Next</button>
    </div>
  </div>
)}`,
  },
  {
    key: "rowButtons",
    name: "rowButtons",
    required: false,
    description: "Array of buttons to show in each row.",
    type: "RowButton[]",
    example: `rowButtons={[
  ({ row }) => <button onClick={() => editRow(row)}>Edit</button>,
  ({ row }) => <button onClick={() => deleteRow(row)}>Delete</button>
]}`,
  },
  {
    key: "className",
    name: "className",
    required: false,
    description: "CSS class name to apply to the table container element.",
    type: "string",
    example: `className="my-custom-table"`,
  },
  {
    key: "columnEditorConfig",
    name: "columnEditorConfig",
    required: false,
    description:
      "Column editor UI: text, search, allowColumnPinning, customRenderer, rowRenderer, etc. See ColumnEditorConfig in API Reference.",
    type: "ColumnEditorConfig",
    link: "/docs/column-editing",
    example: `columnEditorConfig={{
  text: "Columns",                      // Button text (default: "Columns")
  searchEnabled: true,                  // Enable search (default: true)
  searchPlaceholder: "Search columns...", // Search placeholder
  searchFunction: (header, searchTerm) => { // Optional: custom search logic
    return header.label.toLowerCase().includes(searchTerm.toLowerCase());
  }
}}`,
  },
  {
    key: "onGridReady",
    name: "onGridReady",
    required: false,
    description: "Callback function triggered when the table grid is fully initialized and ready.",
    type: "() => void",
    example: `onGridReady={() => {
  console.log('Table is ready!');
  // Perform any initialization logic
}}`,
  },
  {
    key: "onNextPage",
    name: "onNextPage",
    required: false,
    description: "Custom handler for pagination next page action.",
    type: "OnNextPage",
    example: `onNextPage={(currentPage, totalPages) => {
  console.log(\`Going to page \${currentPage + 1} of \${totalPages}\`);
  // Custom pagination logic
}}`,
  },
  {
    key: "ref",
    name: "ref",
    required: false,
    description:
      "React ref object to access table methods and state programmatically. Provides access to methods like exportToCSV and updateData.",
    type: "React.RefObject<TableAPI>",
    link: "#table-api",
    example: `const tableRef = useRef<TableAPI>(null);

<SimpleTable
  ref={tableRef}
  // ... other props
/>

// Export table data to CSV
tableRef.current?.exportToCSV({ filename: "data.csv" });

// Update cell data programmatically
tableRef.current?.updateData({
  accessor: "status",
  rowIndex: 0,
  newValue: "active"
});`,
  },
  {
    key: "includeHeadersInCSVExport",
    name: "includeHeadersInCSVExport",
    required: false,
    description:
      "When true, includes column headers as the first row in CSV exports. Defaults to true.",
    type: "boolean",
    example: `includeHeadersInCSVExport={false} // Export data without headers`,
  },
  {
    key: "tableEmptyStateRenderer",
    name: "tableEmptyStateRenderer",
    required: false,
    description:
      "Custom content to display in the table body when there are no rows to display. This can occur when filters return no results or when no data is provided.",
    type: "ReactNode",
    example: `tableEmptyStateRenderer={
  <div className="flex flex-col items-center p-8">
    <span className="text-gray-500">No results found</span>
    <button onClick={clearFilters}>Clear filters</button>
  </div>
}`,
  },
];
