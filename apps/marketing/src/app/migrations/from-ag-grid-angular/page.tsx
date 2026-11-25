import type { Metadata } from "next";
import Link from "next/link";
import FromCompetitorMigrationLayout from "@/components/migrations/FromCompetitorMigrationLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";

const TITLE = "Migrate from AG Grid Angular to Simple Table for Angular";
const DESCRIPTION =
  "Step-by-step migration guide from AG Grid Angular to @simple-table/angular: install, mapping cheat sheet, before/after standalone components, and gotchas for Angular 17 and newer.";
const CANONICAL = "/migrations/from-ag-grid-angular";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    "migrate from ag grid angular, ag grid angular alternative, angular data grid migration, ag grid replacement angular, angular standalone data grid, angular 17 data grid, angular 18 data grid",
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article", images: [SEO_STRINGS.site.ogImage], siteName: SEO_STRINGS.site.name },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SEO_STRINGS.site.creator, images: SEO_STRINGS.site.ogImage.url },
  alternates: { canonical: CANONICAL },
};

const BEFORE = `// employee-grid.component.ts (AG Grid Angular)
import { Component, Input, ViewChild } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  AllCommunityModule,
  ModuleRegistry,
  type ColDef,
  type GetRowIdParams,
} from "ag-grid-community";

type Employee = {
  id: number;
  name: string;
  department: string;
  salary: number;
  startDate: string;
};

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: "employee-grid",
  standalone: true,
  imports: [AgGridAngular],
  template: \`
    <ag-grid-angular
      style="height: 400px"
      [rowData]="rows"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [getRowId]="getRowId"
      [rowSelection]="{ mode: 'multiRow' }"
      [pagination]="true"
      [paginationPageSize]="20"
      (selectionChanged)="onSelectionChanged()"
    />
    <button (click)="exportCsv()">Export CSV</button>
  \`,
})
export class EmployeeGridComponent {
  @Input() rows: Employee[] = [];
  @ViewChild(AgGridAngular) grid!: AgGridAngular<Employee>;

  columnDefs: ColDef<Employee>[] = [
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
  ];
  defaultColDef: ColDef<Employee> = { sortable: true, resizable: true };

  getRowId = (p: GetRowIdParams<Employee>) => String(p.data.id);

  onSelectionChanged() {
    console.log(this.grid.api.getSelectedRows());
  }

  exportCsv() {
    this.grid.api.exportDataAsCsv();
  }
}
`;

const AFTER = `// employee-grid.component.ts (Simple Table)
import { Component, Input, ViewChild } from "@angular/core";
import { SimpleTableComponent, SimpleTableImports } from "@simple-table/angular";
import type {
  AngularColumnDef,
  GetRowIdParams,
  RowSelectionChangeProps,
} from "@simple-table/angular";

type Employee = {
  id: number;
  name: string;
  department: string;
  salary: number;
  startDate: string;
};

@Component({
  selector: "employee-grid",
  standalone: true,
  imports: [SimpleTableImports],
  template: \`
    <simple-table
      #table
      [rows]="rows"
      [columns]="columns"
      [getRowId]="getRowId"
      [columnResizing]="true"
      [enableRowSelection]="true"
      rowSelectionMode="multiple"
      initialSortColumn="startDate"
      initialSortDirection="desc"
      [enablePagination]="true"
      [rowsPerPage]="20"
      height="400px"
      (rowSelectionChange)="onRowSelectionChange($event)"
    />
    <button (click)="exportCsv()">Export CSV</button>
  \`,
})
export class EmployeeGridComponent {
  @Input() rows: Employee[] = [];
  @ViewChild("table") table!: SimpleTableComponent<Employee>;

  columns: AngularColumnDef<Employee>[] = [
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
      valueFormatter: ({ value }) => "$" + Number(value).toLocaleString(),
    },
    { accessor: "startDate", label: "Start date", width: 140, sortable: true, filterable: true, type: "date" },
  ];

  getRowId = ({ row }: GetRowIdParams<Employee>) => row.id;

  onRowSelectionChange(event: RowSelectionChangeProps<Employee>) {
    console.log(event.isSelected, this.table.getAPI()?.getSelectedRowsData());
  }

  exportCsv() {
    this.table.getAPI()?.exportToCSV();
  }
}
`;

const docLink = (href: string, label: string) => (
  <Link href={href} className="text-blue-600 dark:text-blue-400 hover:underline">
    {label}
  </Link>
);

export default function FromAgGridAngularPage() {
  return (
    <FromCompetitorMigrationLayout
      title={TITLE}
      subtitle="A practical migration playbook from AG Grid Angular to Simple Table for Angular. Drop the Enterprise license and keep virtualization, pinning, grouping, and editing."
      canonicalPath={CANONICAL}
      datePublished="2026-04-26"
      dateModified="2026-11-25"
      framework="angular"
      competitorName="AG Grid Angular"
      competitorPackage="ag-grid-angular"
      introParagraphs={[
        "AG Grid Angular is a powerful data grid, but row grouping, pivoting, Excel export, and master/detail sit behind the Enterprise license. Simple Table for Angular is an MIT-licensed alternative that ships virtualization, column pinning, row grouping with aggregations, pivoting, nested tables, and inline editing in one free package.",
        "This guide assumes an Angular 17 or newer app with standalone components that renders ag-grid-angular, and that you want to swap it for @simple-table/angular without rewriting your data layer. Most of the work is renaming column properties and moving a few grid options onto the table.",
      ]}
      whyMigrate={[
        "Grouping, aggregations, pivoting, and nested tables are free for everyone under MIT. No Enterprise license to renew.",
        "One package and one stylesheet. No module registration step.",
        "A standalone <simple-table> component with regular inputs and outputs, plus stCell and stHeader templates for custom cells.",
        "The same column definitions work in React, Vue, Svelte, Solid, and vanilla TypeScript if your stack expands.",
      ]}
      prerequisites={[
        "Angular 17 or newer (the adapter supports Angular 17 through 21).",
        "Rows with a stable id (database id or uuid) for getRowId.",
        "A list of the AG Grid features each grid uses, including any custom cell renderers you will port.",
      ]}
      installCommand="npm install @simple-table/angular"
      beforeSnippet={BEFORE}
      afterSnippet={AFTER}
      mappingRows={[
        { competitor: "[rowData]", simpleTable: "[rows]", notes: "Same array of plain objects." },
        { competitor: "[columnDefs]", simpleTable: "[columns]", notes: "Type it as AngularColumnDef<Row>[]." },
        { competitor: "ColDef.field", simpleTable: "accessor", notes: 'Dotted paths such as "address.city" work.' },
        { competitor: "ColDef.headerName", simpleTable: "label", notes: "Required on every column." },
        { competitor: "ColDef.width / flex: 1", simpleTable: 'width: 180 / width: "1fr"', notes: 'width is required. It also accepts "%" values and "auto" to fit content.' },
        { competitor: "sortable / [defaultColDef]", simpleTable: "sortable: true", notes: "Opt in per column. There is no defaultColDef, so spread a shared object into each column." },
        { competitor: "ColDef.sort: 'desc'", simpleTable: "initialSortColumn + initialSortDirection", notes: "Inputs on <simple-table> instead of the column." },
        { competitor: "filter: 'agTextColumnFilter' / 'agNumberColumnFilter' / 'agDateColumnFilter'", simpleTable: 'filterable: true + type: "string" | "number" | "date"', notes: 'The column type picks the operators. Use type: "enum" with enumOptions for a checkbox list.' },
        { competitor: "[quickFilterText]", simpleTable: "[quickFilter]=\"{ text: search }\"", notes: "Global search across columns." },
        { competitor: "pinned: 'left' | 'right'", simpleTable: 'pinned: "left" | "right"', notes: "Same values; pinning is built in." },
        { competitor: "resizable", simpleTable: "[columnResizing]=\"true\"", notes: "Turned on for the whole table." },
        { competitor: "rowSelection: { mode: 'multiRow' | 'singleRow' }", simpleTable: '[enableRowSelection]="true" + rowSelectionMode="multiple" | "single"', notes: "(rowSelectionChange) replaces (selectionChanged). selectableCells is for spreadsheet-style cell ranges, not row selection." },
        { competitor: "api.getSelectedRows()", simpleTable: "table.getAPI()?.getSelectedRowsData()", notes: "Get the component with @ViewChild, or keep the TableAPI from (tableReady)." },
        { competitor: "api.exportDataAsCsv()", simpleTable: "table.getAPI()?.exportToCSV()", notes: "Excel export is not built in." },
        { competitor: "editable + (cellValueChanged)", simpleTable: "editable + (cellEdit)", notes: "The event carries { accessor, newValue, row }." },
        { competitor: "ColDef.cellRenderer (component)", simpleTable: '<ng-template stCell="field" let-row> or cellRenderer', notes: "Use an stCell template inside <simple-table>, or set cellRenderer to a standalone component with row and value inputs." },
        { competitor: "valueFormatter(params)", simpleTable: "valueFormatter({ value, row })", notes: "Same purpose. Return a string or number for display." },
        { competitor: "valueGetter / comparator", simpleTable: "valueGetter({ row }) / comparator({ rowA, rowB, valueA, valueB, direction })", notes: "Object arguments instead of AG Grid params." },
        { competitor: "headerTooltip / cellClass / hide", simpleTable: "tooltip / cellClass / hide", notes: "cellClass takes a string of class names." },
        { competitor: "[getRowId]", simpleTable: "[getRowId]=\"getRowId\" with ({ row }) => row.id", notes: "Strongly recommended for editing, selection, and live updates." },
        { competitor: "[pagination] + [paginationPageSize]", simpleTable: '[enablePagination]="true" + [rowsPerPage]', notes: "serverSidePagination and (pageChange) cover server paging." },
        { competitor: "domLayout: 'autoHeight'", simpleTable: 'maxHeight="600px"', notes: "The table shrinks to its rows and grows up to the cap. Use height for a fixed size." },
        { competitor: "rowGroup + aggFunc (Enterprise)", simpleTable: "[rowGrouping] + aggregation", notes: "Free. Expects nested data; see the gotchas below." },
        { competitor: "pivotMode (Enterprise)", simpleTable: "[pivot]", notes: "Free. Works on flat rows." },
        { competitor: "masterDetail (Enterprise)", simpleTable: "expandable + nestedTable", notes: "Renders a child grid under the expanded row." },
        { competitor: "AG Grid theme", simpleTable: 'theme="light" | "dark" | "modern-light" | ...', notes: "Or customTheme and CSS variables on a wrapper element." },
      ]}
      migrationSteps={[
        {
          title: "Install Simple Table next to AG Grid",
          body: (
            <p>
              Add @simple-table/angular and load its stylesheet once, for example from your global
              styles file. Both grids can live in the same app while you migrate one screen at a time.
            </p>
          ),
          code: `npm install @simple-table/angular

/* src/styles.css */
@import "@simple-table/angular/styles.css";`,
        },
        {
          title: "Convert column definitions",
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
          title: "Swap the component and its inputs",
          body: (
            <p>
              Import SimpleTableImports in the standalone component and replace ag-grid-angular with
              simple-table. rowData becomes rows, the resizable default becomes columnResizing,
              pagination becomes enablePagination with rowsPerPage, and row selection becomes
              enableRowSelection with rowSelectionMode. Pass height or maxHeight to the table instead
              of styling a wrapper.
            </p>
          ),
        },
        {
          title: "Port cell renderers",
          body: (
            <p>
              The quickest port is an stCell template next to the column it renders. Remove AG Grid
              lifecycle hooks such as agInit and refresh; the template or component receives the row
              and value directly. See {docLink("/docs/cell-renderer", "cell renderers")}.
            </p>
          ),
          code: `<simple-table [rows]="rows" [columns]="columns">
  <ng-template stCell="name" let-row>
    <strong>{{ row.name }}</strong>
  </ng-template>
</simple-table>`,
        },
        {
          title: "Replace gridApi calls",
          body: (
            <p>
              Grab the component with @ViewChild and call getAPI(), or store the TableAPI emitted by
              (tableReady). It covers exportToCSV, getSelectedRowsData, applySortState, applyFilter,
              setPage, and more. See {docLink("/docs/programmatic-control", "programmatic control")}.
            </p>
          ),
          code: `@ViewChild("table") table!: SimpleTableComponent<Employee>;

exportCsv() {
  this.table.getAPI()?.exportToCSV();
}`,
        },
        {
          title: "Remove AG Grid",
          body: <p>Once the last grid is moved over, uninstall the AG Grid packages and delete module registration and theme imports.</p>,
          code: "npm uninstall ag-grid-angular ag-grid-community ag-grid-enterprise",
        },
      ]}
      gotchas={[
        { title: "Stable row ids", body: "Pass getRowId so selection, editing, and live updates track the right row. Use a database id or a generated uuid." },
        { title: "Sorting and filtering are opt in", body: "Columns are not sortable or filterable until you set sortable: true or filterable: true. Every column also needs a width and a label." },
        {
          title: "Row grouping expects nested rows",
          body: (
            <>
              AG Grid groups flat rows with rowGroup: true. Simple Table groups data that is already
              nested: rowGrouping lists the child array keys and the first column sets expandable: true.
              For summaries of flat data, the pivot input is usually the better fit. See{" "}
              {docLink("/docs/row-grouping", "row grouping")} and {docLink("/docs/pivot", "pivot")}.
            </>
          ),
        },
        { title: "Excel export and integrated charts", body: "Simple Table exports CSV only and has no charting panel. It does ship lineAreaChart and barChart column types for inline sparklines." },
      ]}
      faqs={[
        { question: "Does this work with Angular Material themes?", answer: "Yes. Simple Table doesn't ship its own design system. Theme it with CSS variables or customTheme to match Material, Tailwind, or your own design tokens." },
        { question: "How big is the bundle compared to AG Grid?", answer: "Simple Table is a fraction of AG Grid's size. See the bundle size comparison for current numbers measured with Bundlephobia." },
        { question: "Can I migrate incrementally, route by route?", answer: "Yes. The two libraries can coexist. Migrate one feature area at a time and remove the ag-grid packages once the last consumer is gone." },
      ]}
      relatedLinks={[
        { href: "/comparisons/simple-table-vs-ag-grid-angular", label: "Comparison: Simple Table vs AG Grid Angular" },
        { href: "/migrations/from-ag-grid", label: "Migration guide: from AG Grid React" },
        { href: "/blog/react-data-grid-bundle-size-comparison", label: "Bundle size comparison" },
        { href: "/blog/angular-data-grid-simple-table", label: "Pillar guide: the best free Angular data grid in 2026" },
        { href: "/frameworks/angular", label: "Angular integration hub" },
      ]}
    />
  );
}
