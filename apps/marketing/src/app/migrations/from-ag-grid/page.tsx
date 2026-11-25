import type { Metadata } from "next";
import Link from "next/link";
import FromCompetitorMigrationLayout from "@/components/migrations/FromCompetitorMigrationLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";

const TITLE = "Migrating from AG Grid to Simple Table (React)";
const DESCRIPTION =
  "Step-by-step guide to replace AG Grid React with @simple-table/react: columnDefs to columns mapping, sorting, filtering, pinning, selection, CSV export, and before/after code. MIT licensed, no Enterprise key.";
const CANONICAL = "/migrations/from-ag-grid";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    "migrate from ag grid, ag grid migration, ag grid react alternative, replace ag grid, ag grid to simple table, ag grid columnDefs, free ag grid alternative, react data grid migration",
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: CANONICAL },
};

const BEFORE = `// EmployeeGrid.tsx (AG Grid React)
import { useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry, type ColDef } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

type Employee = {
  id: number;
  name: string;
  department: string;
  salary: number;
  startDate: string;
};

export function EmployeeGrid({ rows }: { rows: Employee[] }) {
  const gridRef = useRef<AgGridReact<Employee>>(null);

  const columnDefs = useMemo<ColDef<Employee>[]>(
    () => [
      { field: "name", headerName: "Name", width: 180, pinned: "left" },
      { field: "department", headerName: "Department", flex: 1, filter: "agTextColumnFilter" },
      {
        field: "salary",
        headerName: "Salary",
        width: 130,
        filter: "agNumberColumnFilter",
        valueFormatter: (p) => "$" + Number(p.value).toLocaleString(),
      },
      { field: "startDate", headerName: "Start date", width: 140, sort: "desc" },
    ],
    [],
  );

  return (
    <>
      <div style={{ height: 400 }}>
        <AgGridReact
          ref={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          defaultColDef={{ sortable: true, resizable: true }}
          getRowId={(p) => String(p.data.id)}
          pagination
          paginationPageSize={20}
        />
      </div>
      <button onClick={() => gridRef.current?.api.exportDataAsCsv()}>Export CSV</button>
    </>
  );
}`;

const AFTER = `// EmployeeGrid.tsx (Simple Table)
import { useRef } from "react";
import { SimpleTable } from "@simple-table/react";
import type { ReactColumnDef, TableAPI } from "@simple-table/react";
import "@simple-table/react/styles.css";

type Employee = {
  id: number;
  name: string;
  department: string;
  salary: number;
  startDate: string;
};

const columns: ReactColumnDef<Employee>[] = [
  { accessor: "name", label: "Name", width: 180, pinned: "left", sortable: true, type: "string" },
  {
    accessor: "department",
    label: "Department",
    width: "1fr",
    sortable: true,
    filterable: true,
    type: "string",
  },
  {
    accessor: "salary",
    label: "Salary",
    width: 130,
    align: "right",
    sortable: true,
    filterable: true,
    type: "number",
    valueFormatter: ({ value }) => \`$\${Number(value).toLocaleString()}\`,
  },
  { accessor: "startDate", label: "Start date", width: 140, sortable: true, filterable: true, type: "date" },
];

export function EmployeeGrid({ rows }: { rows: Employee[] }) {
  const tableRef = useRef<TableAPI<Employee>>(null);

  return (
    <>
      <SimpleTable
        ref={tableRef}
        rows={rows}
        columns={columns}
        getRowId={({ row }) => row.id}
        columnResizing
        initialSortColumn="startDate"
        initialSortDirection="desc"
        enablePagination
        rowsPerPage={20}
        height="400px"
      />
      <button onClick={() => tableRef.current?.exportToCSV()}>Export CSV</button>
    </>
  );
}`;

const docLink = (href: string, label: string) => (
  <Link href={href} className="text-blue-600 dark:text-blue-400 hover:underline">
    {label}
  </Link>
);

export default function FromAgGridPage() {
  return (
    <FromCompetitorMigrationLayout
      title={TITLE}
      subtitle="A practical playbook for swapping AG Grid React for Simple Table: how columnDefs map to columns, where sorting, filtering, pinning, and selection live, and a full before/after component."
      canonicalPath={CANONICAL}
      datePublished="2026-11-25"
      dateModified="2026-11-25"
      framework="react"
      competitorName="AG Grid React"
      competitorPackage="ag-grid-react"
      introParagraphs={[
        "AG Grid is a capable grid, but row grouping, pivoting, Excel export, and master/detail sit behind an Enterprise license. Simple Table is an MIT-licensed data grid that ships virtualization, column pinning, row grouping with aggregations, pivoting, nested tables, inline editing, and CSV export in one free package.",
        "The two APIs are close enough that most migrations are mechanical: rename a handful of column properties, move a few grid options onto the table, and switch imperative calls from gridRef.current.api to a TableAPI ref. This guide uses React. The same column definitions work in the Vue, Angular, Svelte, Solid, and vanilla TypeScript adapters.",
      ]}
      whyMigrate={[
        "Grouping, aggregations, pivoting, and nested tables are free under MIT. No Enterprise key to buy or renew.",
        "One package and one stylesheet. No module registration step.",
        "Column definitions are plain objects with the same shape in every framework adapter.",
        "Imperative TableAPI on a ref for export, selection, sorting, filtering, and pagination.",
      ]}
      prerequisites={[
        "A React 18 or newer app that currently renders AgGridReact.",
        "Rows with a stable id (database id or uuid) for getRowId.",
        "A list of the AG Grid features each grid uses, so you can check them against the mapping below.",
      ]}
      installCommand="npm install @simple-table/react"
      beforeSnippet={BEFORE}
      afterSnippet={AFTER}
      mappingRows={[
        { competitor: "rowData", simpleTable: "rows", notes: "Same array of plain objects." },
        { competitor: "columnDefs", simpleTable: "columns", notes: "Type it as ReactColumnDef<Row>[]." },
        { competitor: "ColDef.field", simpleTable: "accessor", notes: 'Dotted paths such as "address.city" work.' },
        { competitor: "ColDef.headerName", simpleTable: "label", notes: "Required on every column." },
        { competitor: "ColDef.width / flex: 1", simpleTable: 'width: 180 / width: "1fr"', notes: 'width is required. It also accepts "%" values and "auto" to fit content.' },
        { competitor: "minWidth / maxWidth", simpleTable: "minWidth / maxWidth", notes: "Same names." },
        { competitor: "sortable", simpleTable: "sortable: true", notes: "Opt in per column. There is no defaultColDef, so spread a shared object if you want the same defaults everywhere." },
        { competitor: "ColDef.sort: 'desc'", simpleTable: "initialSortColumn + initialSortDirection", notes: "Set on the table instead of the column." },
        { competitor: "comparator(a, b, nodeA, nodeB, isDesc)", simpleTable: "comparator({ rowA, rowB, valueA, valueB, direction })", notes: "Receives whole rows, so sorting by other fields is easy." },
        { competitor: "filter: 'agTextColumnFilter' / 'agNumberColumnFilter' / 'agDateColumnFilter'", simpleTable: 'filterable: true + type: "string" | "number" | "date"', notes: 'The column type picks the operators. Use type: "enum" with enumOptions for a checkbox list, and filterOperators to limit the choices.' },
        { competitor: "quickFilterText", simpleTable: "quickFilter={{ text }}", notes: "Global search across columns, with simple and smart modes." },
        { competitor: "pinned: 'left' | 'right'", simpleTable: 'pinned: "left" | "right"', notes: "Same values." },
        { competitor: "resizable", simpleTable: "columnResizing", notes: "Turned on for the whole table." },
        { competitor: "editable + onCellValueChanged", simpleTable: "editable + onCellEdit", notes: "onCellEdit receives { accessor, newValue, row }." },
        { competitor: "cellRenderer (ICellRendererParams)", simpleTable: "cellRenderer({ row, value, accessor, rowIndex })", notes: "Return any React node. There is no params.data or params.api; use row and a TableAPI ref." },
        { competitor: "valueFormatter(params)", simpleTable: "valueFormatter({ value, row })", notes: "Return a string or number for display." },
        { competitor: "valueGetter(params)", simpleTable: "valueGetter({ row, accessor })", notes: "Used for sorting and other operations." },
        { competitor: "headerTooltip / cellClass / hide", simpleTable: "tooltip / cellClass / hide", notes: "cellClass takes a string of class names." },
        { competitor: "Column groups (children)", simpleTable: "children", notes: "Nested headers. Add collapsible: true for collapsible groups." },
        { competitor: "getRowId: (p) => p.data.id", simpleTable: "getRowId: ({ row }) => row.id", notes: "Strongly recommended for editing, selection, and live updates." },
        { competitor: "pagination + paginationPageSize", simpleTable: "enablePagination + rowsPerPage", notes: "serverSidePagination and onPageChange cover server paging." },
        { competitor: "rowSelection: { mode: 'multiRow' | 'singleRow' }", simpleTable: 'enableRowSelection + rowSelectionMode: "multiple" | "single"', notes: "onRowSelectionChange replaces onSelectionChanged." },
        { competitor: "api.getSelectedRows()", simpleTable: "tableRef.current?.getSelectedRowsData()", notes: "The ref is a TableAPI directly, with no .api step." },
        { competitor: "api.exportDataAsCsv()", simpleTable: "tableRef.current?.exportToCSV()", notes: "Excel export is not built in." },
        { competitor: "onSortChanged / onFilterChanged", simpleTable: "onSortChange / onFilterChange", notes: "Pair with externalSortHandling or externalFilterHandling for server-side logic." },
        { competitor: "domLayout: 'autoHeight'", simpleTable: 'maxHeight="600px"', notes: "The table shrinks to its rows and grows up to the cap. Use height for a fixed size." },
        { competitor: "rowGroup + aggFunc (Enterprise)", simpleTable: "rowGrouping + aggregation", notes: "Free. Expects nested data; see the gotchas below." },
        { competitor: "pivotMode (Enterprise)", simpleTable: "pivot={{ rows, columns, values }}", notes: "Free. Works on flat rows." },
        { competitor: "masterDetail (Enterprise)", simpleTable: "expandable + nestedTable", notes: "Renders a child grid under the expanded row." },
        { competitor: "theme={themeQuartz}", simpleTable: 'theme="light" | "dark" | "modern-light" | ...', notes: "Or customTheme and CSS variables. See the theme builder." },
      ]}
      migrationSteps={[
        {
          title: "Install Simple Table next to AG Grid",
          body: (
            <p>
              Both libraries can live in the same app while you migrate one grid at a time. Import the
              stylesheet once, for example in your root layout.
            </p>
          ),
          code: `npm install @simple-table/react

// app/layout.tsx or main.tsx
import "@simple-table/react/styles.css";`,
        },
        {
          title: "Convert columnDefs to columns",
          body: (
            <p>
              Rename field to accessor and headerName to label, give every column a width, and add
              sortable and filterable where you want them. Set type on each column so filters and
              editors know what they are working with. See {docLink("/docs/column-sorting", "sorting")},{" "}
              {docLink("/docs/column-filtering", "filtering")}, and{" "}
              {docLink("/docs/column-pinning", "pinning")}.
            </p>
          ),
          code: `// Before
{ field: "salary", headerName: "Salary", flex: 1, filter: "agNumberColumnFilter", pinned: "right" }

// After
{ accessor: "salary", label: "Salary", width: "1fr", filterable: true, sortable: true, type: "number", pinned: "right" }`,
        },
        {
          title: "Move grid options onto the table",
          body: (
            <p>
              Swap AgGridReact for SimpleTable. rowData becomes rows, the resizable default becomes
              columnResizing, and pagination becomes enablePagination with rowsPerPage. Pass height
              or maxHeight to the table instead of sizing a wrapper div.
            </p>
          ),
        },
        {
          title: "Port renderers, formatters, and editing",
          body: (
            <p>
              cellRenderer gets {"{ row, value, accessor, rowIndex }"} and can return JSX, so most
              renderers only need their params.data references changed to row. valueFormatter and
              valueGetter keep their purpose with object arguments. For editing, set editable on the
              column and handle onCellEdit. See {docLink("/docs/cell-renderer", "cell renderers")} and{" "}
              {docLink("/docs/cell-editing", "cell editing")}.
            </p>
          ),
          code: `const columns: ReactColumnDef<Employee>[] = [
  {
    accessor: "name",
    label: "Name",
    width: 180,
    editable: true,
    cellRenderer: ({ row, value }) => <strong title={row.department}>{String(value)}</strong>,
  },
];

<SimpleTable
  rows={rows}
  columns={columns}
  getRowId={({ row }) => row.id}
  onCellEdit={({ accessor, newValue, row }) => save(row.id, accessor, newValue)}
/>`,
        },
        {
          title: "Replace gridRef.current.api calls",
          body: (
            <p>
              Type the ref as TableAPI and call methods on it directly: exportToCSV, getSelectedRowsData,
              applySortState, applyFilter, setPage, and more. See{" "}
              {docLink("/docs/programmatic-control", "programmatic control")}.
            </p>
          ),
          code: `const tableRef = useRef<TableAPI<Employee>>(null);

tableRef.current?.exportToCSV();
const picked = tableRef.current?.getSelectedRowsData();`,
        },
        {
          title: "Remove AG Grid",
          body: <p>Once the last grid is moved over, uninstall the AG Grid packages and delete any module registration and theme imports.</p>,
          code: "npm uninstall ag-grid-react ag-grid-community ag-grid-enterprise",
        },
      ]}
      gotchas={[
        {
          title: "Sorting and filtering are opt in",
          body: "Columns are not sortable or filterable until you set sortable: true or filterable: true. Without a defaultColDef, a shared object spread into each column keeps things short.",
        },
        {
          title: "Every column needs a width and a label",
          body: 'Use a number for pixels, "1fr" to fill like flex: 1, a percentage, or "auto" to fit the content.',
        },
        {
          title: "Row grouping expects nested rows",
          body: (
            <>
              AG Grid groups flat rows with rowGroup: true. Simple Table groups data that is already
              nested: rowGrouping lists the child array keys, for example rowGrouping={'{["teams"]}'} with each
              row holding a teams array, and the first column sets expandable: true. If your data is flat
              and you want a summary, the pivot prop is usually the better fit. See{" "}
              {docLink("/docs/row-grouping", "row grouping")} and {docLink("/docs/pivot", "pivot")}.
            </>
          ),
        },
        {
          title: "Renderers get row, not params.data",
          body: "There is no params.node, params.api, or params.context. Read fields from row and call table methods through a TableAPI ref.",
        },
        {
          title: "Excel export and integrated charts",
          body: "Simple Table exports CSV only and has no charting panel. It does ship lineAreaChart and barChart column types for inline sparklines.",
        },
      ]}
      faqs={[
        {
          question: "Is Simple Table free for commercial use?",
          answer: "Yes. Every feature is MIT licensed, including row grouping, aggregations, pivoting, and nested tables. There is no license key.",
        },
        {
          question: "Can AG Grid and Simple Table run in the same app during the migration?",
          answer: "Yes. They are independent packages, so you can move one screen at a time and uninstall AG Grid when the last grid is converted.",
        },
        {
          question: "Do I have to rewrite my data layer?",
          answer: "Usually not. Simple Table takes the same array of plain objects as rowData. The exception is row grouping, which expects child rows nested under the keys listed in rowGrouping.",
        },
        {
          question: "Does this guide apply to Vue, Angular, Svelte, or Solid?",
          answer: "The column definitions and table props are the same in every adapter. Only the component import and renderer syntax change. There is also a dedicated AG Grid Angular guide.",
        },
      ]}
      relatedLinks={[
        { href: "/comparisons/simple-table-vs-ag-grid", label: "Comparison: Simple Table vs AG Grid" },
        { href: "/blog/free-alternative-to-ag-grid", label: "Free alternative to AG Grid" },
        { href: "/migrations/from-ag-grid-angular", label: "Migration guide: from AG Grid Angular" },
        { href: "/docs/quick-start", label: "Quick start" },
        { href: "/frameworks/react", label: "React integration hub" },
      ]}
    />
  );
}
