import type { PropInfo } from "./types";

export const TABLE_REF_TYPE_METHODS: PropInfo[] = [
  {
    key: "exportToCSV",
    name: "exportToCSV",
    required: false,
    description:
      "Exports the current table data to a CSV file. Respects active filters and sorting. Optionally accepts a props object to customize the filename.",
    type: "(props?: ExportToCSVProps) => void",
    link: "#export-to-csv-props",
    example: `// Export with default filename
tableRef.current?.exportToCSV();

// Export with custom filename
tableRef.current?.exportToCSV({ 
  filename: "my-data.csv" 
});

// Dynamic filename
const date = new Date().toISOString().split('T')[0];
tableRef.current?.exportToCSV({ 
  filename: \`report-\${date}.csv\` 
});`,
  },
  {
    key: "updateData",
    name: "updateData",
    required: false,
    description:
      "Programmatically update a specific cell value in the table. Useful for live updates and real-time data changes. Triggers cellUpdateFlash animation if enabled.",
    type: "(params: { accessor: Accessor; rowIndex: number; newValue: CellValue }) => void",
    example: `// Update a single cell
tableRef.current?.updateData({
  accessor: "price",
  rowIndex: 2,
  newValue: 29.99
});

// Update based on condition
if (stockLow) {
  tableRef.current?.updateData({
    accessor: "status",
    rowIndex: 5,
    newValue: "Low Stock"
  });
}`,
  },
  {
    key: "setHeaderRename",
    name: "setHeaderRename",
    required: false,
    description:
      "Programmatically triggers the header rename mode for a specific column. Sets the header cell to editing mode, allowing the user to rename it. The header must have enableHeaderRename enabled.",
    type: "(params: { accessor: Accessor }) => void",
    example: `// Trigger header rename mode
tableRef.current?.setHeaderRename({
  accessor: "firstName"
});

// Trigger rename from a button
const handleRenameClick = () => {
  tableRef.current?.setHeaderRename({
    accessor: "status"
  });
};`,
  },
  {
    key: "getVisibleRows",
    name: "getVisibleRows",
    required: false,
    description:
      "Returns the currently visible rows in the table. When pagination is enabled, this returns only the rows on the current page. When filters are applied, returns only filtered rows. This is useful for getting a snapshot of what the user is currently viewing.",
    type: "() => TableRow[]",
    example: `// Get visible rows
const visibleRows = tableRef.current?.getVisibleRows();
console.log(\`Showing \${visibleRows.length} rows\`);

// With pagination
const currentPageRows = tableRef.current?.getVisibleRows();
console.log(\`Page has \${currentPageRows.length} rows\`);`,
  },
  {
    key: "getAllRows",
    name: "getAllRows",
    required: false,
    description:
      "Returns all rows in the table as TableRow objects, flattened and including nested/grouped rows. Each TableRow contains the raw row data plus metadata like depth, position, and rowPath. Unlike getVisibleRows, this returns the complete dataset regardless of pagination, filters, or grouping state. Perfect for exporting complete data, analytics, or batch operations.",
    type: "() => TableRow[]",
    example: `// Get all rows including nested data
const allRows = tableRef.current?.getAllRows();
console.log(\`Total rows: \${allRows.length}\`);

// Access row data and metadata
allRows.forEach(tableRow => {
  console.log(\`Row at depth \${tableRow.depth}:\`, tableRow.row);
  console.log(\`Position: \${tableRow.position}\`);
  if (tableRow.rowPath) {
    console.log(\`Path: \${tableRow.rowPath.join(' > ')}\`);
  }
});

// Calculate totals from row data
const totalRevenue = allRows.reduce((sum, tableRow) => 
  sum + (tableRow.row.revenue || 0), 0
);

// Export raw data
const rawData = allRows.map(tableRow => tableRow.row);
exportToJSON(rawData);`,
  },
  {
    key: "getHeaders",
    name: "getHeaders",
    required: false,
    description:
      "Returns the table's current header/column definitions. Includes all column configuration such as accessors, labels, types, and formatting options. Useful for dynamic table manipulation, export configurations, or building custom UI controls.",
    type: "() => HeaderObject[]",
    example: `// Get current headers
const headers = tableRef.current?.getHeaders();
console.log(\`Table has \${headers.length} columns\`);

// Export with custom mapping
const headers = tableRef.current?.getHeaders();
const columnNames = headers.map(h => h.label);
console.log("Columns:", columnNames);

// Validate column configuration
const headers = tableRef.current?.getHeaders();
const sortableColumns = headers.filter(h => h.isSortable);`,
  },
  {
    key: "getSortState",
    name: "getSortState",
    required: false,
    description:
      "Returns the current sort state of the table. Returns null if no sorting is applied, or a SortColumn object containing the sorted column and direction. Useful for persisting table state, synchronizing with external state management, or implementing custom sort UI.",
    type: "() => SortColumn | null",
    link: "#union-types",
    example: `// Get current sort state
const sortState = tableRef.current?.getSortState();
if (sortState) {
  console.log(\`Sorted by: \${sortState.key.accessor}\`);
  console.log(\`Direction: \${sortState.direction}\`);
} else {
  console.log("No sorting applied");
}

// Save sort state to localStorage
const sortState = tableRef.current?.getSortState();
localStorage.setItem("tableSortState", JSON.stringify(sortState));

// Check if specific column is sorted
const sortState = tableRef.current?.getSortState();
const isSortedByName = sortState?.key.accessor === "name";`,
  },
  {
    key: "applySortState",
    name: "applySortState",
    required: false,
    description:
      "Programmatically applies a sort state to the table. Pass a column accessor and optional direction to sort, or undefined to clear sorting. If direction is omitted, the sort cycles through: asc → desc → removed. This method is async and returns a Promise. Perfect for implementing custom sort controls or coordinating sorting with external data sources.",
    type: "(props?: { accessor: Accessor; direction?: SortDirection }) => Promise<void>",
    link: "#union-types",
    example: `// Cycle through sort states (asc → desc → removed)
await tableRef.current?.applySortState({ accessor: "name" });

// Apply sort by price descending (explicit)
await tableRef.current?.applySortState({ accessor: "price", direction: "desc" });

// Apply sort by age ascending (explicit)
await tableRef.current?.applySortState({ accessor: "age", direction: "asc" });

// Clear all sorting
await tableRef.current?.applySortState();

// Dynamic sorting based on user selection
const handleSort = async (column: string, descending: boolean) => {
  await tableRef.current?.applySortState({
    accessor: column,
    direction: descending ? "desc" : "asc",
  });
};`,
  },
  {
    key: "getFilterState",
    name: "getFilterState",
    required: false,
    description:
      "Returns the current filter state of the table as a TableFilterState object. The object contains all active filters keyed by unique filter IDs. Each filter includes the column accessor, operator, and values. Useful for debugging, persisting filter state, or building custom filter UI.",
    type: "() => TableFilterState",
    link: "#table-filter-state",
    example: `// Get current filters
const filters = tableRef.current?.getFilterState();
console.log(\`Active filters: \${Object.keys(filters).length}\`);

// Log all filter details
const filters = tableRef.current?.getFilterState();
Object.entries(filters).forEach(([id, filter]) => {
  console.log(\`Filter \${id}: \${filter.accessor} \${filter.operator} \${filter.value}\`);
});

// Save filters to session storage
const filters = tableRef.current?.getFilterState();
sessionStorage.setItem("tableFilters", JSON.stringify(filters));

// Check if specific column is filtered
const filters = tableRef.current?.getFilterState();
const hasNameFilter = Object.values(filters).some(f => f.accessor === "name");`,
  },
  {
    key: "applyFilter",
    name: "applyFilter",
    required: false,
    description:
      "Programmatically applies a filter to a specific column. Accepts a FilterCondition object specifying the column accessor, filter operator, and value(s). This method is async and returns a Promise. Supports all filter operators including equals, contains, greaterThan, between, and more. Perfect for implementing custom filter UI, applying saved filters, or creating filter presets.",
    type: "(filter: FilterCondition) => Promise<void>",
    link: "#filter-condition",
    example: `// Filter by exact value
await tableRef.current?.applyFilter({
  accessor: "status",
  operator: "equals",
  value: "active"
});

// Filter by text contains
await tableRef.current?.applyFilter({
  accessor: "name",
  operator: "contains",
  value: "John"
});

// Filter by numeric range
await tableRef.current?.applyFilter({
  accessor: "age",
  operator: "between",
  values: [18, 65]
});

// Filter by multiple values (in operator)
await tableRef.current?.applyFilter({
  accessor: "department",
  operator: "in",
  values: ["Sales", "Marketing", "Support"]
});`,
  },
  {
    key: "clearFilter",
    name: "clearFilter",
    required: false,
    description:
      "Clears the filter for a specific column identified by its accessor. This method is async and returns a Promise. Only removes filters applied to the specified column, leaving other column filters intact. Useful for implementing 'clear filter' buttons on individual columns or resetting specific filters programmatically.",
    type: "(accessor: Accessor) => Promise<void>",
    link: "#union-types",
    example: `// Clear filter on name column
await tableRef.current?.clearFilter("name");

// Clear filter on nested accessor
await tableRef.current?.clearFilter("user.profile.name");

// Clear filter and notify user
await tableRef.current?.clearFilter("status");
console.log("Status filter cleared");`,
  },
  {
    key: "clearAllFilters",
    name: "clearAllFilters",
    required: false,
    description:
      "Clears all active filters from the table at once. This method is async and returns a Promise. Resets the table to show all data without any filtering applied. Perfect for 'reset all filters' buttons or starting fresh with filter state.",
    type: "() => Promise<void>",
    example: `// Clear all filters
await tableRef.current?.clearAllFilters();

// Clear filters and notify
await tableRef.current?.clearAllFilters();
console.log("All filters cleared");

// Clear filters before applying new ones
await tableRef.current?.clearAllFilters();
await tableRef.current?.applyFilter({
  accessor: "status",
  operator: "equals",
  value: "active"
});`,
  },
  {
    key: "setQuickFilter",
    name: "setQuickFilter",
    required: false,
    description:
      "Programmatically sets the quick filter text. This allows you to control the global search/quick filter from your code. Pass a string to set the filter text, or an empty string to clear it. The filter will use the mode and other settings from the quickFilter prop configuration.",
    type: "(text: string) => void",
    example: `// Set quick filter text
tableRef.current?.setQuickFilter("engineering");

// Clear quick filter
tableRef.current?.setQuickFilter("");

// Set filter based on user action
const handleSearch = (query: string) => {
  tableRef.current?.setQuickFilter(query);
};

// Keyboard shortcut to focus and set filter
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'f') {
      e.preventDefault();
      searchInputRef.current?.focus();
    }
  };
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);`,
  },
  {
    key: "getCurrentPage",
    name: "getCurrentPage",
    required: false,
    description:
      "Returns the current page number when pagination is enabled. Page numbers are 1-indexed (first page is 1, not 0). Returns the current page regardless of whether pagination is client-side or server-side. Useful for tracking user navigation, syncing with URL parameters, or building custom pagination UI.",
    type: "() => number",
    example: `// Get current page
const currentPage = tableRef.current?.getCurrentPage();
console.log(\`Currently on page \${currentPage}\`);

// Sync with URL
const page = tableRef.current?.getCurrentPage();
window.history.pushState({}, '', \`?page=\${page}\`);

// Save page state
const page = tableRef.current?.getCurrentPage();
localStorage.setItem("lastPage", page.toString());`,
  },
  {
    key: "setPage",
    name: "setPage",
    required: false,
    description:
      "Programmatically navigates to a specific page when pagination is enabled. Accepts a 1-indexed page number (first page is 1). This method is async and returns a Promise. Works with both client-side and server-side pagination. If the page number is out of range, it will be clamped to valid bounds. Triggers the onPageChange callback when the page changes. Perfect for implementing custom pagination controls, deep linking, or restoring saved pagination state.",
    type: "(page: number) => Promise<void>",
    example: `// Navigate to page 3
await tableRef.current?.setPage(3);

// Go to first page
await tableRef.current?.setPage(1);

// Restore saved page
const savedPage = localStorage.getItem("lastPage");
if (savedPage) {
  await tableRef.current?.setPage(parseInt(savedPage));
}

// Handle URL parameter
const urlParams = new URLSearchParams(window.location.search);
const page = parseInt(urlParams.get('page') || '1');
await tableRef.current?.setPage(page);

// With error handling
try {
  await tableRef.current?.setPage(5);
  console.log('Page changed successfully');
} catch (error) {
  console.error('Failed to change page:', error);
}`,
  },
  {
    key: "expandAll",
    name: "expandAll",
    required: false,
    description:
      "Expands all rows at all depths in the table. When working with hierarchical/grouped data, this will expand every level of the hierarchy, revealing all nested rows. Useful for 'expand all' buttons or when you want to show the complete data structure to users.",
    type: "() => void",
    example: `// Expand all rows
tableRef.current?.expandAll();

// Expand all on button click
<button onClick={() => tableRef.current?.expandAll()}>
  Expand All
</button>

// Expand all after data load
useEffect(() => {
  if (showAllData) {
    tableRef.current?.expandAll();
  }
}, [showAllData]);`,
  },
  {
    key: "collapseAll",
    name: "collapseAll",
    required: false,
    description:
      "Collapses all rows at all depths in the table. When working with hierarchical/grouped data, this will collapse every level of the hierarchy, hiding all nested rows. Perfect for 'collapse all' buttons or resetting the table to a compact view.",
    type: "() => void",
    example: `// Collapse all rows
tableRef.current?.collapseAll();

// Collapse all on button click
<button onClick={() => tableRef.current?.collapseAll()}>
  Collapse All
</button>

// Reset to collapsed state
const handleReset = () => {
  tableRef.current?.collapseAll();
};`,
  },
  {
    key: "expandDepth",
    name: "expandDepth",
    required: false,
    description:
      "Expands all rows at a specific depth level (0-indexed). Depth 0 represents the top-level rows, depth 1 is the first nested level, depth 2 is the second nested level, and so on. This allows granular control over which hierarchy levels are visible. Useful for showing specific levels of detail without expanding everything.",
    type: "(depth: number) => void",
    example: `// Expand only top-level rows (depth 0)
tableRef.current?.expandDepth(0);

// Expand first nested level (depth 1)
tableRef.current?.expandDepth(1);

// Show departments and teams, but not employees
tableRef.current?.expandDepth(0);
tableRef.current?.expandDepth(1);

// Progressive disclosure
const handleShowMore = () => {
  const currentDepth = getCurrentExpandedDepth();
  tableRef.current?.expandDepth(currentDepth + 1);
};`,
  },
  {
    key: "collapseDepth",
    name: "collapseDepth",
    required: false,
    description:
      "Collapses all rows at a specific depth level (0-indexed). Depth 0 represents the top-level rows, depth 1 is the first nested level, and so on. This allows you to selectively hide specific hierarchy levels while keeping others visible. Useful for managing complex hierarchies and controlling information density.",
    type: "(depth: number) => void",
    example: `// Collapse all first-level nested rows
tableRef.current?.collapseDepth(1);

// Hide employee details but keep departments and teams visible
tableRef.current?.expandDepth(0);
tableRef.current?.expandDepth(1);
tableRef.current?.collapseDepth(2);

// Collapse specific level on toggle
const handleCollapseLevel = (level: number) => {
  tableRef.current?.collapseDepth(level);
};`,
  },
  {
    key: "toggleDepth",
    name: "toggleDepth",
    required: false,
    description:
      "Toggles the expansion state for all rows at a specific depth level (0-indexed). If the depth is currently expanded, it will be collapsed, and vice versa. This provides a convenient way to toggle visibility of an entire hierarchy level without tracking state manually.",
    type: "(depth: number) => void",
    example: `// Toggle first nested level
tableRef.current?.toggleDepth(1);

// Toggle depth on button click
<button onClick={() => tableRef.current?.toggleDepth(0)}>
  Toggle Top Level
</button>

// Toggle multiple depths
[0, 1, 2].forEach(depth => {
  tableRef.current?.toggleDepth(depth);
});`,
  },
  {
    key: "setExpandedDepths",
    name: "setExpandedDepths",
    required: false,
    description:
      "Sets which depth levels should be expanded, replacing the current expansion state entirely. Accepts a Set of depth numbers (0-indexed). This is useful for restoring saved expansion state, implementing presets, or coordinating expansion across multiple tables. Any depth not in the Set will be collapsed.",
    type: "(depths: Set<number>) => void",
    example: `// Expand only depths 0 and 1
tableRef.current?.setExpandedDepths(new Set([0, 1]));

// Collapse everything
tableRef.current?.setExpandedDepths(new Set());

// Restore saved state
const savedDepths = JSON.parse(localStorage.getItem("expandedDepths") || "[]");
tableRef.current?.setExpandedDepths(new Set(savedDepths));

// Apply preset view
const presets = {
  summary: new Set([0]),
  detailed: new Set([0, 1, 2]),
  compact: new Set()
};
tableRef.current?.setExpandedDepths(presets.detailed);`,
  },
  {
    key: "getExpandedDepths",
    name: "getExpandedDepths",
    required: false,
    description:
      "Returns a Set containing all currently expanded depth levels (0-indexed). This allows you to inspect which hierarchy levels are currently visible. Useful for saving expansion state, building custom UI controls, or coordinating with other components.",
    type: "() => Set<number>",
    example: `// Get currently expanded depths
const expandedDepths = tableRef.current?.getExpandedDepths();
console.log("Expanded depths:", Array.from(expandedDepths));

// Save expansion state
const depths = tableRef.current?.getExpandedDepths();
localStorage.setItem("expandedDepths", JSON.stringify(Array.from(depths)));

// Check if specific depth is expanded
const depths = tableRef.current?.getExpandedDepths();
const isLevel1Expanded = depths.has(1);

// Count expanded levels
const expandedCount = tableRef.current?.getExpandedDepths().size;`,
  },
  {
    key: "getGroupingProperty",
    name: "getGroupingProperty",
    required: false,
    description:
      "Returns the grouping property name (accessor) for a specific depth index (0-indexed). This maps depth levels to their corresponding property names in your rowGrouping configuration. Returns undefined if the depth doesn't exist. Useful for understanding the hierarchy structure or building dynamic UI that adapts to the grouping configuration.",
    type: "(depth: number) => Accessor | undefined",
    example: `// Get property name for depth 1
const property = tableRef.current?.getGroupingProperty(1);
console.log(\`Depth 1 groups by: \${property}\`); // e.g., "teams"

// Build breadcrumb navigation
const depths = [0, 1, 2];
const breadcrumbs = depths.map(depth => {
  const prop = tableRef.current?.getGroupingProperty(depth);
  return prop ? \`Level \${depth}: \${prop}\` : null;
}).filter(Boolean);

// Dynamic column headers based on grouping
const property = tableRef.current?.getGroupingProperty(0);
const headerLabel = property === "departments" ? "Department" : "Group";`,
  },
  {
    key: "getGroupingDepth",
    name: "getGroupingDepth",
    required: false,
    description:
      "Returns the depth index (0-indexed) for a specific grouping property name (accessor). This is the inverse of getGroupingProperty - it maps property names to their depth levels in the hierarchy. Returns -1 if the property is not part of the grouping configuration. Useful for programmatically determining which level a property belongs to.",
    type: "(property: Accessor) => number",
    example: `// Get depth index for "teams" property
const depth = tableRef.current?.getGroupingDepth("teams");
console.log(\`Teams are at depth: \${depth}\`); // e.g., 1

// Check if property is in grouping
const depth = tableRef.current?.getGroupingDepth("employees");
if (depth !== -1) {
  console.log(\`Employees are at depth \${depth}\`);
} else {
  console.log("Employees are not part of the grouping");
}

// Expand up to a specific property
const targetDepth = tableRef.current?.getGroupingDepth("projects");
if (targetDepth !== -1) {
  for (let i = 0; i <= targetDepth; i++) {
    tableRef.current?.expandDepth(i);
  }
}`,
  },
  {
    key: "toggleColumnEditor",
    name: "toggleColumnEditor",
    required: false,
    description:
      "Opens, closes, or toggles the column editor menu programmatically. When called without arguments, it toggles the current state (open if closed, close if open). Pass true to explicitly open the menu, or false to explicitly close it. This gives you full control over when the column editor UI is displayed, enabling custom column visibility workflows and user experiences.",
    type: "(open?: boolean) => void",
    example: `// Toggle the column editor (open if closed, close if open)
tableRef.current?.toggleColumnEditor();

// Explicitly open the column editor
tableRef.current?.toggleColumnEditor(true);

// Explicitly close the column editor
tableRef.current?.toggleColumnEditor(false);

// Open editor on button click
<button onClick={() => tableRef.current?.toggleColumnEditor(true)}>
  Open Column Editor
</button>

// Toggle editor with keyboard shortcut
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'e') {
      tableRef.current?.toggleColumnEditor();
    }
  };
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);`,
  },
  {
    key: "applyColumnVisibility",
    name: "applyColumnVisibility",
    required: false,
    description:
      "Programmatically controls which columns are visible in the table. Accepts a partial or complete visibility state object where keys are column accessors and values are booleans (true = visible, false = hidden). This method is async and returns a Promise. You can pass just the columns you want to change, and other columns will maintain their current visibility state. Perfect for implementing custom column visibility presets, views, or user preferences.",
    type: "(visibilityState: Record<Accessor, boolean>) => Promise<void>",
    link: "#column-visibility-state",
    example: `// Show/hide specific columns
await tableRef.current?.applyColumnVisibility({
  name: true,      // Show name column
  email: false,    // Hide email column
  phone: false,    // Hide phone column
});

// Create a "basic info" view preset
await tableRef.current?.applyColumnVisibility({
  name: true,
  age: true,
  department: true,
  salary: false,
  email: false,
  phone: false,
});

// Show all columns
await tableRef.current?.applyColumnVisibility({
  name: true,
  age: true,
  department: true,
  salary: true,
  email: true,
  phone: true,
});

// Hide just contact columns (partial update)
await tableRef.current?.applyColumnVisibility({
  email: false,
  phone: false,
});

// Create view presets
const viewPresets = {
  basic: { name: true, age: true, department: true },
  contact: { name: true, email: true, phone: true },
  financial: { name: true, department: true, salary: true },
};

// Apply a preset
await tableRef.current?.applyColumnVisibility(viewPresets.contact);

// Save and restore visibility state
const currentVisibility = tableRef.current?.getColumnVisibilityState();
localStorage.setItem('columnVisibility', JSON.stringify(currentVisibility));

// Later...
const savedVisibility = JSON.parse(localStorage.getItem('columnVisibility') || '{}');
await tableRef.current?.applyColumnVisibility(savedVisibility);`,
  },
  {
    key: "getPinnedState",
    name: "getPinnedState",
    required: false,
    description:
      "Returns { left, main, right }: root accessors in each pin band. Use with applyPinnedState to save and restore layout.",
    type: "() => { left: Accessor[]; main: Accessor[]; right: Accessor[] }",
    link: "#table-api",
    example: `const { left, main, right } = tableRef.current?.getPinnedState() ?? {
  left: [],
  main: [],
  right: [],
};
localStorage.setItem("tablePins", JSON.stringify({ left, main, right }));`,
  },
  {
    key: "applyPinnedState",
    name: "applyPinnedState",
    required: false,
    description:
      "Set column order and pin sides in one call. Each root accessor must appear exactly once across left, main, and right. Columns with isEssential keep required order within each section.",
    type: "(state: { left: Accessor[]; main: Accessor[]; right: Accessor[] }) => Promise<void>",
    link: "#table-api",
    example: `await tableRef.current?.applyPinnedState({
  left: ["id", "name"],
  main: ["email", "department"],
  right: ["actions"],
});

const saved = JSON.parse(localStorage.getItem("tablePins") || "null");
if (saved) await tableRef.current?.applyPinnedState(saved);`,
  },
];

export const EXPORT_TO_CSV_PROPS: PropInfo[] = [
  {
    key: "filename",
    name: "filename",
    required: false,
    description:
      "Custom filename for the exported CSV file. Defaults to 'table-export.csv' if not provided.",
    type: "string",
    example: `{ filename: "sales-report-2024.csv" }`,
  },
];
