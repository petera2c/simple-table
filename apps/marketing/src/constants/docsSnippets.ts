import { FRAMEWORKS, type Framework } from "@/constants/frameworks";
import { FRAMEWORK_INSTALL_COMMANDS } from "@/constants/strings/technical";

export type CodeByFramework = Partial<Record<Framework, string>>;

/** Same snippet for every framework (e.g. shared columns/rows TypeScript). */
export function forAllFrameworks(code: string): Record<Framework, string> {
  return Object.fromEntries(FRAMEWORKS.map((fw) => [fw, code])) as Record<Framework, string>;
}

export function installSnippets(): Record<Framework, string> {
  return Object.fromEntries(
    FRAMEWORKS.map((fw) => [fw, FRAMEWORK_INSTALL_COMMANDS[fw].npm])
  ) as Record<Framework, string>;
}

export const IMPORT_SNIPPETS: Record<Framework, string> = {
  react: `import { SimpleTable, type ReactColumnDef } from "@simple-table/react";
import "@simple-table/react/styles.css";`,
  vue: `import { SimpleTable, type VueColumnDef } from "@simple-table/vue";
import "@simple-table/vue/styles.css";`,
  angular: `import { SimpleTableImports, type AngularColumnDef } from "@simple-table/angular";
import "@simple-table/angular/styles.css";`,
  svelte: `import { SimpleTable, type SvelteColumnDef } from "@simple-table/svelte";
import "@simple-table/svelte/styles.css";`,
  solid: `import { SimpleTable, type SolidColumnDef } from "@simple-table/solid";
import "@simple-table/solid/styles.css";`,
  vanilla: `import { SimpleTableVanilla, type ColumnDef } from "simple-table-core";
import "simple-table-core/styles.css";`,
};

const COLUMN_OBJECTS = `  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: "1fr", type: "string" },
  { accessor: "age", label: "Age", width: 80, type: "number" },
];`;

/** Annotated column arrays — contextual typing keeps type/align literals valid without as const. */
export const COLUMNS_SNIPPETS: Record<Framework, string> = {
  react: `const columns: ReactColumnDef[] = [
${COLUMN_OBJECTS}`,
  vue: `const columns: VueColumnDef[] = [
${COLUMN_OBJECTS}`,
  angular: `const columns: AngularColumnDef[] = [
${COLUMN_OBJECTS}`,
  svelte: `const columns: SvelteColumnDef[] = [
${COLUMN_OBJECTS}`,
  solid: `const columns: SolidColumnDef[] = [
${COLUMN_OBJECTS}`,
  vanilla: `const columns: ColumnDef[] = [
${COLUMN_OBJECTS}`,
};

export const ROWS_SNIPPET = `const rows = [
  { id: 1, name: "John Doe", age: 30 },
  { id: 2, name: "Jane Smith", age: 25 },
];`;

export type TablePropOptions = {
  height?: string;
  maxHeight?: string;
  scrollParent?: string;
  rowHeight?: number;
  rowsPerPage?: number;
  autoExpandColumns?: boolean;
  columnResizing?: boolean;
  columnReordering?: boolean;
  enableColumnEditor?: boolean;
  enableColumnEditorInitOpen?: boolean;
  externalSortHandling?: boolean;
  enablePagination?: boolean;
  isLoading?: boolean;
  cellUpdateFlash?: boolean;
  selectableCells?: boolean;
  selectableColumns?: boolean;
  copyHeadersToClipboard?: boolean;
  initialSortColumn?: string;
  initialSortDirection?: "asc" | "desc";
};

type BoolTableProp =
  | "autoExpandColumns"
  | "columnResizing"
  | "columnReordering"
  | "enableColumnEditor"
  | "enableColumnEditorInitOpen"
  | "externalSortHandling"
  | "enablePagination"
  | "isLoading"
  | "cellUpdateFlash"
  | "selectableCells"
  | "selectableColumns"
  | "copyHeadersToClipboard";

const BOOL_PROP_KEBAB: Record<BoolTableProp, string> = {
  autoExpandColumns: "auto-expand-columns",
  columnResizing: "column-resizing",
  columnReordering: "column-reordering",
  enableColumnEditor: "enable-column-editor",
  enableColumnEditorInitOpen: "enable-column-editor-init-open",
  externalSortHandling: "external-sort-handling",
  enablePagination: "enable-pagination",
  isLoading: "is-loading",
  cellUpdateFlash: "cell-update-flash",
  selectableCells: "selectable-cells",
  selectableColumns: "selectable-columns",
  copyHeadersToClipboard: "copy-headers-to-clipboard",
};

function pushBoolProp(
  framework: Framework,
  target: string[],
  name: BoolTableProp,
  value: boolean | undefined
) {
  if (value === undefined) return;
  if (framework === "vanilla") {
    target.push(`${name}: ${value}`);
    return;
  }
  if (framework === "vue") {
    target.push(`:${BOOL_PROP_KEBAB[name]}="${value}"`);
    return;
  }
  if (framework === "angular") {
    target.push(`[${name}]="${value}"`);
    return;
  }
  // react, solid, svelte
  target.push(`${name}={${value}}`);
}

function pushTableBoolProps(
  framework: Framework,
  target: string[],
  options: TablePropOptions
) {
  pushBoolProp(framework, target, "autoExpandColumns", options.autoExpandColumns);
  pushBoolProp(framework, target, "columnResizing", options.columnResizing);
  pushBoolProp(framework, target, "columnReordering", options.columnReordering);
  pushBoolProp(framework, target, "enableColumnEditor", options.enableColumnEditor);
  pushBoolProp(
    framework,
    target,
    "enableColumnEditorInitOpen",
    options.enableColumnEditorInitOpen
  );
  pushBoolProp(framework, target, "externalSortHandling", options.externalSortHandling);
  pushBoolProp(framework, target, "enablePagination", options.enablePagination);
  pushBoolProp(framework, target, "isLoading", options.isLoading);
  pushBoolProp(framework, target, "cellUpdateFlash", options.cellUpdateFlash);
  pushBoolProp(framework, target, "selectableCells", options.selectableCells);
  pushBoolProp(framework, target, "selectableColumns", options.selectableColumns);
  pushBoolProp(framework, target, "copyHeadersToClipboard", options.copyHeadersToClipboard);
}

function pushRowsPerPageProp(
  framework: Framework,
  target: string[],
  rowsPerPage: number | undefined
) {
  if (rowsPerPage === undefined) return;
  if (framework === "vanilla") {
    target.push(`rowsPerPage: ${rowsPerPage}`);
    return;
  }
  if (framework === "vue") {
    target.push(`:rows-per-page="${rowsPerPage}"`);
    return;
  }
  if (framework === "angular") {
    target.push(`[rowsPerPage]="${rowsPerPage}"`);
    return;
  }
  // react, solid, svelte
  target.push(`rowsPerPage={${rowsPerPage}}`);
}

function pushSortProps(framework: Framework, target: string[], options: TablePropOptions) {
  const { initialSortColumn, initialSortDirection } = options;
  if (!initialSortColumn && !initialSortDirection) return;

  if (framework === "vanilla") {
    if (initialSortColumn) target.push(`initialSortColumn: "${initialSortColumn}"`);
    if (initialSortDirection) target.push(`initialSortDirection: "${initialSortDirection}"`);
    return;
  }
  if (framework === "vue") {
    if (initialSortColumn) target.push(`initial-sort-column="${initialSortColumn}"`);
    if (initialSortDirection) target.push(`initial-sort-direction="${initialSortDirection}"`);
    return;
  }
  if (framework === "angular") {
    if (initialSortColumn) target.push(`initialSortColumn="${initialSortColumn}"`);
    if (initialSortDirection) target.push(`initialSortDirection="${initialSortDirection}"`);
    return;
  }
  // react, solid, svelte
  if (initialSortColumn) target.push(`initialSortColumn="${initialSortColumn}"`);
  if (initialSortDirection) target.push(`initialSortDirection="${initialSortDirection}"`);
}

function pushRowHeightProp(
  framework: Framework,
  target: string[],
  rowHeight: number | undefined
) {
  if (rowHeight === undefined) return;
  if (framework === "vanilla") {
    target.push(`customTheme: { rowHeight: ${rowHeight} }`);
    return;
  }
  if (framework === "vue") {
    target.push(`:custom-theme="{ rowHeight: ${rowHeight} }"`);
    return;
  }
  if (framework === "angular") {
    target.push(`[customTheme]="{ rowHeight: ${rowHeight} }"`);
    return;
  }
  // react, solid, svelte
  target.push(`customTheme={{ rowHeight: ${rowHeight} }}`);
}

export function tableSnippet(framework: Framework, options: TablePropOptions = {}): string {
  const { height, maxHeight, scrollParent, rowHeight, rowsPerPage } = options;

  if (framework === "vanilla") {
    const lines = ["columns", "rows"];
    if (height) lines.push(`height: "${height}"`);
    if (maxHeight) lines.push(`maxHeight: "${maxHeight}"`);
    if (scrollParent) lines.push(`scrollParent: "${scrollParent}"`);
    pushRowHeightProp(framework, lines, rowHeight);
    pushRowsPerPageProp(framework, lines, rowsPerPage);
    pushSortProps(framework, lines, options);
    pushTableBoolProps(framework, lines, options);
    return `new SimpleTableVanilla(container, {
  ${lines.join(",\n  ")},
});`;
  }

  if (framework === "vue") {
    const attrs = [':columns="columns"', ':rows="rows"'];
    if (height) attrs.push(`height="${height}"`);
    if (maxHeight) attrs.push(`max-height="${maxHeight}"`);
    if (scrollParent) attrs.push(`scroll-parent="${scrollParent}"`);
    pushRowHeightProp(framework, attrs, rowHeight);
    pushRowsPerPageProp(framework, attrs, rowsPerPage);
    pushSortProps(framework, attrs, options);
    pushTableBoolProps(framework, attrs, options);
    return `<SimpleTable\n  ${attrs.join("\n  ")}\n/>`;
  }

  if (framework === "angular") {
    const attrs = ['[columns]="columns"', '[rows]="rows"'];
    if (height) attrs.push(`height="${height}"`);
    if (maxHeight) attrs.push(`maxHeight="${maxHeight}"`);
    if (scrollParent) attrs.push(`scrollParent="${scrollParent}"`);
    pushRowHeightProp(framework, attrs, rowHeight);
    pushRowsPerPageProp(framework, attrs, rowsPerPage);
    pushSortProps(framework, attrs, options);
    pushTableBoolProps(framework, attrs, options);
    return `<simple-table\n  ${attrs.join("\n  ")}\n></simple-table>`;
  }

  if (framework === "svelte") {
    const attrs = ["{columns}", "{rows}"];
    if (height) attrs.push(`height="${height}"`);
    if (maxHeight) attrs.push(`maxHeight="${maxHeight}"`);
    if (scrollParent) attrs.push(`scrollParent="${scrollParent}"`);
    pushRowHeightProp(framework, attrs, rowHeight);
    pushRowsPerPageProp(framework, attrs, rowsPerPage);
    pushSortProps(framework, attrs, options);
    pushTableBoolProps(framework, attrs, options);
    return `<SimpleTable ${attrs.join(" ")} />`;
  }

  // react + solid
  const attrs = ["columns={columns}", "rows={rows}"];
  if (height) attrs.push(`height="${height}"`);
  if (maxHeight) attrs.push(`maxHeight="${maxHeight}"`);
  if (scrollParent) attrs.push(`scrollParent="${scrollParent}"`);
  pushRowHeightProp(framework, attrs, rowHeight);
  pushRowsPerPageProp(framework, attrs, rowsPerPage);
  pushSortProps(framework, attrs, options);
  pushTableBoolProps(framework, attrs, options);
  return `<SimpleTable ${attrs.join(" ")} />`;
}

const PERSIST_HANDLER = `const handleColumnWidthChange = (headers) => {
  const widths = Object.fromEntries(
    headers.map((h) => [h.accessor, h.width])
  );
  localStorage.setItem("columnWidths", JSON.stringify(widths));
};`;

/** Persist resized widths via onColumnWidthChange (per framework). */
export function persistColumnWidthSnippets(): Record<Framework, string> {
  return {
    react: `${PERSIST_HANDLER}

<SimpleTable
  columnResizing
  columns={columns}
  rows={rows}
  onColumnWidthChange={handleColumnWidthChange}
/>`,
    solid: `${PERSIST_HANDLER}

<SimpleTable
  columnResizing
  columns={columns}
  rows={rows}
  onColumnWidthChange={handleColumnWidthChange}
/>`,
    vue: `<script setup>
${PERSIST_HANDLER}
</script>

<template>
  <SimpleTable
    :column-resizing="true"
    :columns="columns"
    :rows="rows"
    @column-width-change="handleColumnWidthChange"
  />
</template>`,
    angular: `${PERSIST_HANDLER}

<simple-table
  [columnResizing]="true"
  [columns]="columns"
  [rows]="rows"
  (columnWidthChange)="handleColumnWidthChange($event)"
></simple-table>`,
    svelte: `<script>
  ${PERSIST_HANDLER}
</script>

<SimpleTable
  columnResizing={true}
  {columns}
  {rows}
  onColumnWidthChange={handleColumnWidthChange}
/>`,
    vanilla: `${PERSIST_HANDLER}

new SimpleTableVanilla(container, {
  columns,
  rows,
  columnResizing: true,
  onColumnWidthChange: handleColumnWidthChange,
});`,
  };
}

const ORDER_HANDLER = `const handleColumnOrderChange = (headers) => {
  setColumns(headers);
};`;

/** Handle column reorder via onColumnOrderChange (per framework). */
export function persistColumnOrderSnippets(): Record<Framework, string> {
  return {
    react: `${ORDER_HANDLER}

<SimpleTable
  columnReordering
  columns={columns}
  rows={rows}
  onColumnOrderChange={handleColumnOrderChange}
/>`,
    solid: `${ORDER_HANDLER}

<SimpleTable
  columnReordering
  columns={columns}
  rows={rows}
  onColumnOrderChange={handleColumnOrderChange}
/>`,
    vue: `<script setup>
${ORDER_HANDLER}
</script>

<template>
  <SimpleTable
    :column-reordering="true"
    :columns="columns"
    :rows="rows"
    @column-order-change="handleColumnOrderChange"
  />
</template>`,
    angular: `${ORDER_HANDLER}

<simple-table
  [columnReordering]="true"
  [columns]="columns"
  [rows]="rows"
  (columnOrderChange)="handleColumnOrderChange($event)"
></simple-table>`,
    svelte: `<script>
  ${ORDER_HANDLER}
</script>

<SimpleTable
  columnReordering={true}
  {columns}
  {rows}
  onColumnOrderChange={handleColumnOrderChange}
/>`,
    vanilla: `${ORDER_HANDLER}

new SimpleTableVanilla(container, {
  columns,
  rows,
  columnReordering: true,
  onColumnOrderChange: handleColumnOrderChange,
});`,
  };
}

export function tableSnippets(options: TablePropOptions = {}): Record<Framework, string> {
  return Object.fromEntries(
    FRAMEWORKS.map((fw) => [fw, tableSnippet(fw, options)])
  ) as Record<Framework, string>;
}

const CUSTOM_RENDERER_BODY = `({ searchSection, listSection, resetColumns }) => (
  <>
    {searchSection}
    {listSection}
    <button type="button" onClick={resetColumns}>Reset</button>
  </>
)`;

/** Replace the default column editor popout via columnEditorConfig.customRenderer. */
export function customColumnEditorLayoutSnippets(): Record<Framework, string> {
  return {
    react: `<SimpleTable
  enableColumnEditor
  columns={columns}
  rows={rows}
  columnEditorConfig={{
    customRenderer: ${CUSTOM_RENDERER_BODY},
  }}
/>`,
    solid: `<SimpleTable
  enableColumnEditor
  columns={columns}
  rows={rows}
  columnEditorConfig={{
    customRenderer: ${CUSTOM_RENDERER_BODY},
  }}
/>`,
    vue: `<script setup>
const columnEditorConfig = {
  customRenderer: ({ searchSection, listSection, resetColumns }) => [
    searchSection,
    listSection,
    // optional: your own reset control calling resetColumns()
  ],
};
</script>

<template>
  <SimpleTable
    :enable-column-editor="true"
    :column-editor-config="columnEditorConfig"
    :columns="columns"
    :rows="rows"
  />
</template>`,
    angular: `columnEditorConfig = {
  customRenderer: ({ searchSection, listSection, resetColumns }) => {
    // return a custom layout using searchSection + listSection
  },
};

<simple-table
  [enableColumnEditor]="true"
  [columnEditorConfig]="columnEditorConfig"
  [columns]="columns"
  [rows]="rows"
></simple-table>`,
    svelte: `<script>
  const columnEditorConfig = {
    customRenderer: ({ searchSection, listSection, resetColumns }) => {
      // return a custom layout using searchSection + listSection
    },
  };
</script>

<SimpleTable
  enableColumnEditor={true}
  columnEditorConfig={columnEditorConfig}
  {columns}
  {rows}
/>`,
    vanilla: `new SimpleTableVanilla(container, {
  columns,
  rows,
  enableColumnEditor: true,
  columnEditorConfig: {
    customRenderer: ({ searchSection, listSection, resetColumns }) => {
      const root = document.createElement("div");
      if (searchSection) root.appendChild(searchSection);
      if (listSection) root.appendChild(listSection);
      // optional: add a reset button that calls resetColumns()
      return root;
    },
  },
});`,
  };
}

const ROW_RENDERER_BODY = `({ components }) => (
  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
    {components.checkbox}
    {components.labelContent}
    {components.dragIcon}
  </div>
)`;

/** External sort: table UI only; you sort rows yourself. */
export function externalSortSnippets(): Record<Framework, string> {
  return {
    react: `<SimpleTable
  externalSortHandling
  columns={columns}
  rows={sortedRows}
  onSortChange={(sort) => {
    // fetch or sort sortedRows from sort.key / sort.direction
  }}
/>`,
    solid: `<SimpleTable
  externalSortHandling
  columns={columns}
  rows={sortedRows()}
  onSortChange={(sort) => {
    // fetch or sort sortedRows from sort.key / sort.direction
  }}
/>`,
    vue: `<SimpleTable
  :external-sort-handling="true"
  :columns="columns"
  :rows="sortedRows"
  :on-sort-change="handleSortChange"
/>`,
    angular: `<simple-table
  [externalSortHandling]="true"
  [columns]="columns"
  [rows]="sortedRows"
  (sortChange)="handleSortChange($event)"
></simple-table>`,
    svelte: `<SimpleTable
  externalSortHandling={true}
  {columns}
  rows={sortedRows}
  onSortChange={handleSortChange}
/>`,
    vanilla: `new SimpleTableVanilla(container, {
  columns,
  rows: sortedRows,
  externalSortHandling: true,
  onSortChange: (sort) => {
    // fetch or sort sortedRows from sort.key / sort.direction
  },
});`,
  };
}

export function externalFilterSnippets(): Record<Framework, string> {
  return {
    react: `<SimpleTable
  externalFilterHandling
  columns={columns}
  rows={filteredRows}
  onFilterChange={(filters) => {
    // fetch or filter filteredRows from filters
  }}
/>`,
    solid: `<SimpleTable
  externalFilterHandling
  columns={columns}
  rows={filteredRows()}
  onFilterChange={(filters) => {
    // fetch or filter filteredRows from filters
  }}
/>`,
    vue: `<SimpleTable
  :external-filter-handling="true"
  :columns="columns"
  :rows="filteredRows"
  :on-filter-change="handleFilterChange"
/>`,
    angular: `<simple-table
  [externalFilterHandling]="true"
  [columns]="columns"
  [rows]="filteredRows"
  (filterChange)="handleFilterChange($event)"
></simple-table>`,
    svelte: `<SimpleTable
  externalFilterHandling={true}
  {columns}
  rows={filteredRows}
  onFilterChange={handleFilterChange}
/>`,
    vanilla: `new SimpleTableVanilla(container, {
  columns,
  rows: filteredRows,
  externalFilterHandling: true,
  onFilterChange: (filters) => {
    // fetch or filter filteredRows from filters
  },
});`,
  };
}

export function columnSelectionSnippets(): Record<Framework, string> {
  return {
    react: `<SimpleTable
  selectableColumns
  columns={columns}
  rows={rows}
  onColumnSelect={(column) => {
    // column.accessor, column.label, ...
  }}
/>`,
    solid: `<SimpleTable
  selectableColumns
  columns={columns}
  rows={rows()}
  onColumnSelect={(column) => {
    // column.accessor, column.label, ...
  }}
/>`,
    vue: `<SimpleTable
  :selectable-columns="true"
  :columns="columns"
  :rows="rows"
  :on-column-select="handleColumnSelect"
/>`,
    angular: `<simple-table
  [selectableColumns]="true"
  [columns]="columns"
  [rows]="rows"
  (columnSelect)="handleColumnSelect($event)"
></simple-table>`,
    svelte: `<SimpleTable
  selectableColumns={true}
  {columns}
  {rows}
  onColumnSelect={handleColumnSelect}
/>`,
    vanilla: `new SimpleTableVanilla(container, {
  columns,
  rows,
  selectableColumns: true,
  onColumnSelect: (column) => {
    // column.accessor, column.label, ...
  },
});`,
  };
}

export type RowSelectionSnippetOptions = {
  rowSelectionMode?: "single" | "multiple";
  selectRowOnClick?: boolean;
  showRowSelectionColumn?: boolean;
  selectableCells?: boolean;
  includeOnChange?: boolean;
};

function rowSelectionLines(
  framework: Framework,
  options: RowSelectionSnippetOptions
): string[] {
  const {
    rowSelectionMode,
    selectRowOnClick,
    showRowSelectionColumn,
    selectableCells,
    includeOnChange,
  } = options;

  const lines: string[] = [];

  if (framework === "vanilla") {
    lines.push("columns", "rows", "enableRowSelection: true");
    if (rowSelectionMode) lines.push(`rowSelectionMode: "${rowSelectionMode}"`);
    if (selectRowOnClick) lines.push("selectRowOnClick: true");
    if (showRowSelectionColumn === false) lines.push("showRowSelectionColumn: false");
    if (selectableCells === false) lines.push("selectableCells: false");
    lines.push(`getRowId: ({ row }) => String(row.id)`);
    if (includeOnChange) {
      lines.push(`onRowSelectionChange: ({ row, isSelected, selectedRows }) => {
    // ...
  }`);
    }
    return lines;
  }

  if (framework === "vue") {
    lines.push(':columns="columns"', ':rows="rows"', ':enable-row-selection="true"');
    if (rowSelectionMode) lines.push(`row-selection-mode="${rowSelectionMode}"`);
    if (selectRowOnClick) lines.push(':select-row-on-click="true"');
    if (showRowSelectionColumn === false) lines.push(':show-row-selection-column="false"');
    if (selectableCells === false) lines.push(':selectable-cells="false"');
    lines.push(':get-row-id="(ctx) => String(ctx.row.id)"');
    if (includeOnChange) lines.push(':on-row-selection-change="handleRowSelectionChange"');
    return lines;
  }

  if (framework === "angular") {
    lines.push('[columns]="columns"', '[rows]="rows"', '[enableRowSelection]="true"');
    if (rowSelectionMode) lines.push(`rowSelectionMode="${rowSelectionMode}"`);
    if (selectRowOnClick) lines.push('[selectRowOnClick]="true"');
    if (showRowSelectionColumn === false) lines.push('[showRowSelectionColumn]="false"');
    if (selectableCells === false) lines.push('[selectableCells]="false"');
    lines.push('[getRowId]="getRowId"');
    if (includeOnChange) lines.push('(rowSelectionChange)="handleRowSelectionChange($event)"');
    return lines;
  }

  if (framework === "svelte") {
    lines.push("{columns}", "{rows}", "enableRowSelection={true}");
    if (rowSelectionMode) lines.push(`rowSelectionMode="${rowSelectionMode}"`);
    if (selectRowOnClick) lines.push("selectRowOnClick={true}");
    if (showRowSelectionColumn === false) lines.push("showRowSelectionColumn={false}");
    if (selectableCells === false) lines.push("selectableCells={false}");
    lines.push("getRowId={({ row }) => String(row.id)}");
    if (includeOnChange) {
      lines.push("onRowSelectionChange={handleRowSelectionChange}");
    }
    return lines;
  }

  // react / solid
  const rowsExpr = framework === "solid" ? "rows={rows()}" : "rows={rows}";
  lines.push("enableRowSelection", "columns={columns}", rowsExpr);
  if (rowSelectionMode) lines.push(`rowSelectionMode="${rowSelectionMode}"`);
  if (selectRowOnClick) lines.push("selectRowOnClick");
  if (showRowSelectionColumn === false) lines.push("showRowSelectionColumn={false}");
  if (selectableCells === false) lines.push("selectableCells={false}");
  lines.push("getRowId={({ row }) => String(row.id)}");
  if (includeOnChange) {
    lines.push(`onRowSelectionChange={({ row, isSelected, selectedRows }) => {
    // ...
  }}`);
  }
  return lines;
}

export function rowSelectionSnippets(
  options: RowSelectionSnippetOptions = {}
): Record<Framework, string> {
  return Object.fromEntries(
    FRAMEWORKS.map((fw) => {
      const lines = rowSelectionLines(fw, options);
      if (fw === "vanilla") {
        return [
          fw,
          `new SimpleTableVanilla(container, {
  ${lines.join(",\n  ")},
});`,
        ];
      }
      if (fw === "angular") {
        return [
          fw,
          `<simple-table
  ${lines.join("\n  ")}
></simple-table>`,
        ];
      }
      return [
        fw,
        `<SimpleTable
  ${lines.join("\n  ")}
/>`,
      ];
    })
  ) as Record<Framework, string>;
}

export function programmaticRowSelectionSnippets(): Record<Framework, string> {
  return {
    react: `tableRef.current?.selectRow("1", true);
tableRef.current?.toggleRowSelection("2");
const selected = tableRef.current?.getSelectedRowsData();
tableRef.current?.clearRowSelection();`,
    solid: `tableRef.selectRow("1", true);
tableRef.toggleRowSelection("2");
const selected = tableRef.getSelectedRowsData();
tableRef.clearRowSelection();`,
    vue: `tableRef.value?.selectRow("1", true);
tableRef.value?.toggleRowSelection("2");
const selected = tableRef.value?.getSelectedRowsData();
tableRef.value?.clearRowSelection();`,
    angular: `this.tableRef.getAPI()?.selectRow("1", true);
this.tableRef.getAPI()?.toggleRowSelection("2");
const selected = this.tableRef.getAPI()?.getSelectedRowsData();
this.tableRef.getAPI()?.clearRowSelection();`,
    svelte: `tableRef.getAPI()?.selectRow("1", true);
tableRef.getAPI()?.toggleRowSelection("2");
const selected = tableRef.getAPI()?.getSelectedRowsData();
tableRef.getAPI()?.clearRowSelection();`,
    vanilla: `table.selectRow("1", true);
table.toggleRowSelection("2");
const selected = table.getSelectedRowsData();
table.clearRowSelection();`,
  };
}

export type RowGroupingSnippetOptions = {
  expandAll?: boolean;
  enableStickyParents?: boolean;
};

function rowGroupingTableLines(
  framework: Framework,
  options: RowGroupingSnippetOptions
): string[] {
  const { expandAll, enableStickyParents } = options;
  const lines: string[] = [];

  if (framework === "vanilla") {
    lines.push(
      "columns",
      "rows",
      'rowGrouping: ["divisions", "departments"]',
      "getRowId: ({ row }) => String(row.id)"
    );
    if (expandAll !== undefined) lines.push(`expandAll: ${expandAll}`);
    if (enableStickyParents) lines.push("enableStickyParents: true");
    return lines;
  }

  if (framework === "vue") {
    lines.push(
      ':columns="columns"',
      ':rows="rows"',
      ':row-grouping="[\'divisions\', \'departments\']"',
      ':get-row-id="(ctx) => String(ctx.row.id)"'
    );
    if (expandAll !== undefined) lines.push(`:expand-all="${expandAll}"`);
    if (enableStickyParents) lines.push(':enable-sticky-parents="true"');
    return lines;
  }

  if (framework === "angular") {
    lines.push(
      '[columns]="columns"',
      '[rows]="rows"',
      '[rowGrouping]="[\'divisions\', \'departments\']"',
      '[getRowId]="getRowId"'
    );
    if (expandAll !== undefined) lines.push(`[expandAll]="${expandAll}"`);
    if (enableStickyParents) lines.push('[enableStickyParents]="true"');
    return lines;
  }

  if (framework === "svelte") {
    lines.push(
      "{columns}",
      "{rows}",
      'rowGrouping={["divisions", "departments"]}',
      "getRowId={({ row }) => String(row.id)}"
    );
    if (expandAll !== undefined) lines.push(`expandAll={${expandAll}}`);
    if (enableStickyParents) lines.push("enableStickyParents={true}");
    return lines;
  }

  // react / solid
  const rowsExpr = framework === "solid" ? "rows={rows()}" : "rows={rows}";
  lines.push(
    "columns={columns}",
    rowsExpr,
    'rowGrouping={["divisions", "departments"]}',
    "getRowId={({ row }) => String(row.id)}"
  );
  if (expandAll !== undefined) {
    lines.push(expandAll ? "expandAll" : "expandAll={false}");
  }
  if (enableStickyParents) lines.push("enableStickyParents");
  return lines;
}

export function rowGroupingSnippets(
  options: RowGroupingSnippetOptions = {}
): Record<Framework, string> {
  return Object.fromEntries(
    FRAMEWORKS.map((fw) => {
      const lines = rowGroupingTableLines(fw, options);
      if (fw === "vanilla") {
        return [
          fw,
          `new SimpleTableVanilla(container, {
  ${lines.join(",\n  ")},
});`,
        ];
      }
      if (fw === "angular") {
        return [
          fw,
          `<simple-table
  ${lines.join("\n  ")}
></simple-table>`,
        ];
      }
      return [
        fw,
        `<SimpleTable
  ${lines.join("\n  ")}
/>`,
      ];
    })
  ) as Record<Framework, string>;
}

export function onRowGroupExpandSnippets(): Record<Framework, string> {
  const handler = `async ({ row, isExpanded, groupingKey, setLoading, setError, setEmpty, rowIndexPath }) => {
    if (!isExpanded) return;
    setLoading(true);
    try {
      const children = await fetchChildren(row.id, groupingKey);
      setLoading(false);
      if (children.length === 0) {
        setEmpty(true, "No data");
        return;
      }
      // update rows using rowIndexPath / groupingKey
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  }`;

  return {
    react: `<SimpleTable
  columns={columns}
  rows={rows}
  rowGrouping={["stores", "products"]}
  getRowId={({ row }) => String(row.id)}
  onRowGroupExpand={${handler}}
/>`,
    solid: `<SimpleTable
  columns={columns}
  rows={rows()}
  rowGrouping={["stores", "products"]}
  getRowId={({ row }) => String(row.id)}
  onRowGroupExpand={${handler}}
/>`,
    vue: `<SimpleTable
  :columns="columns"
  :rows="rows"
  :row-grouping="['stores', 'products']"
  :get-row-id="(ctx) => String(ctx.row.id)"
  :on-row-group-expand="handleRowGroupExpand"
/>`,
    angular: `<simple-table
  [columns]="columns"
  [rows]="rows"
  [rowGrouping]="['stores', 'products']"
  [getRowId]="getRowId"
  (rowGroupExpand)="handleRowGroupExpand($event)"
></simple-table>`,
    svelte: `<SimpleTable
  {columns}
  {rows}
  rowGrouping={["stores", "products"]}
  getRowId={({ row }) => String(row.id)}
  onRowGroupExpand={handleRowGroupExpand}
/>`,
    vanilla: `new SimpleTableVanilla(container, {
  columns,
  rows,
  rowGrouping: ["stores", "products"],
  getRowId: ({ row }) => String(row.id),
  onRowGroupExpand: ${handler},
});`,
  };
}

export function programmaticRowGroupingSnippets(): Record<Framework, string> {
  return {
    react: `tableRef.current?.expandAll();
tableRef.current?.collapseAll();
tableRef.current?.expandDepth(0);
tableRef.current?.setExpandedDepths(new Set([0, 1]));
tableRef.current?.toggleDepth(0);`,
    solid: `tableRef.expandAll();
tableRef.collapseAll();
tableRef.expandDepth(0);
tableRef.setExpandedDepths(new Set([0, 1]));
tableRef.toggleDepth(0);`,
    vue: `tableRef.value?.expandAll();
tableRef.value?.collapseAll();
tableRef.value?.expandDepth(0);
tableRef.value?.setExpandedDepths(new Set([0, 1]));
tableRef.value?.toggleDepth(0);`,
    angular: `this.tableRef.getAPI()?.expandAll();
this.tableRef.getAPI()?.collapseAll();
this.tableRef.getAPI()?.expandDepth(0);
this.tableRef.getAPI()?.setExpandedDepths(new Set([0, 1]));
this.tableRef.getAPI()?.toggleDepth(0);`,
    svelte: `tableRef.getAPI()?.expandAll();
tableRef.getAPI()?.collapseAll();
tableRef.getAPI()?.expandDepth(0);
tableRef.getAPI()?.setExpandedDepths(new Set([0, 1]));
tableRef.getAPI()?.toggleDepth(0);`,
    vanilla: `table.expandAll();
table.collapseAll();
table.expandDepth(0);
table.setExpandedDepths(new Set([0, 1]));
table.toggleDepth(0);`,
  };
}

export function nestedTablesSnippets(): Record<Framework, string> {
  return {
    react: `<SimpleTable
  columns={companyColumns}
  rows={rows}
  rowGrouping={["divisions"]}
  getRowId={({ row }) => String(row.id)}
/>`,
    solid: `<SimpleTable
  columns={companyColumns}
  rows={rows()}
  rowGrouping={["divisions"]}
  getRowId={({ row }) => String(row.id)}
/>`,
    vue: `<SimpleTable
  :columns="companyColumns"
  :rows="rows"
  :row-grouping="['divisions']"
  :get-row-id="(ctx) => String(ctx.row.id)"
/>`,
    angular: `<simple-table
  [columns]="companyColumns"
  [rows]="rows"
  [rowGrouping]="['divisions']"
  [getRowId]="getRowId"
></simple-table>`,
    svelte: `<SimpleTable
  columns={companyColumns}
  {rows}
  rowGrouping={["divisions"]}
  getRowId={({ row }) => String(row.id)}
/>`,
    vanilla: `new SimpleTableVanilla(container, {
  columns: companyColumns,
  rows,
  rowGrouping: ["divisions"],
  getRowId: ({ row }) => String(row.id),
});`,
  };
}

export type PivotSnippetOptions = {
  rows?: string[];
  columns?: string[];
  values?: string;
  showRowTotals?: boolean;
  showColumnTotals?: boolean;
  showGrandTotal?: boolean;
};

function pivotConfigLiteral(options: PivotSnippetOptions): string {
  const rows = options.rows ?? ["region"];
  const columns = options.columns ?? ["quarter"];
  const values =
    options.values ??
    `[{ accessor: "sales", aggregation: { type: "sum" } }]`;
  const extras: string[] = [];
  if (options.showRowTotals === false) extras.push("showRowTotals: false");
  if (options.showColumnTotals === false) extras.push("showColumnTotals: false");
  if (options.showGrandTotal === false) extras.push("showGrandTotal: false");

  const rowsLit = `[${rows.map((r) => `"${r}"`).join(", ")}]`;
  const colsLit = `[${columns.map((c) => `"${c}"`).join(", ")}]`;
  const lines = [`rows: ${rowsLit}`, `columns: ${colsLit}`, `values: ${values}`, ...extras];
  return `{
    ${lines.join(",\n    ")},
  }`;
}

/** Field catalog for pivot — labels/types for source fields (not the pivoted headers). */
const PIVOT_HEADER_OBJECTS = `  { accessor: "region", label: "Region", type: "string" },
  { accessor: "quarter", label: "Quarter", type: "string" },
  { accessor: "sales", label: "Sales", type: "number" },
];`;

export const PIVOT_HEADERS_SNIPPETS: Record<Framework, string> = {
  react: `const headers: ReactColumnDef[] = [
${PIVOT_HEADER_OBJECTS}`,
  vue: `const headers: VueColumnDef[] = [
${PIVOT_HEADER_OBJECTS}`,
  angular: `const headers: AngularColumnDef[] = [
${PIVOT_HEADER_OBJECTS}`,
  svelte: `const headers: SvelteColumnDef[] = [
${PIVOT_HEADER_OBJECTS}`,
  solid: `const headers: SolidColumnDef[] = [
${PIVOT_HEADER_OBJECTS}`,
  vanilla: `const headers: ColumnDef[] = [
${PIVOT_HEADER_OBJECTS}`,
};

export const PIVOT_FLAT_ROWS_SNIPPET = `const flatRows = [
  { region: "North", quarter: "Q1", sales: 120000 },
  { region: "North", quarter: "Q2", sales: 145000 },
  { region: "South", quarter: "Q1", sales: 98000 },
];`;

export function pivotSnippets(options: PivotSnippetOptions = {}): Record<Framework, string> {
  const config = pivotConfigLiteral(options);
  return {
    react: `<SimpleTable
  columns={headers}
  rows={flatRows}
  pivot={${config}}
/>`,
    solid: `<SimpleTable
  columns={headers}
  rows={flatRows()}
  pivot={${config}}
/>`,
    vue: `<script setup>
const pivotConfig = ${config};
</script>

<template>
  <SimpleTable
    :columns="headers"
    :rows="flatRows"
    :pivot="pivotConfig"
  />
</template>`,
    angular: `pivotConfig = ${config};

<simple-table
  [columns]="headers"
  [rows]="flatRows"
  [pivot]="pivotConfig"
></simple-table>`,
    svelte: `<SimpleTable
  columns={headers}
  rows={flatRows}
  pivot={${config}}
/>`,
    vanilla: `new SimpleTableVanilla(container, {
  columns: headers,
  rows: flatRows,
  pivot: ${config},
});`,
  };
}

export function programmaticPivotSnippets(): Record<Framework, string> {
  return {
    react: `tableRef.current?.setPivot({
  rows: ["region"],
  columns: ["quarter"],
  values: [{ accessor: "sales", aggregation: { type: "sum" } }],
});
const active = tableRef.current?.getPivot();
tableRef.current?.setPivot(null); // back to source grid`,
    solid: `tableRef.setPivot({
  rows: ["region"],
  columns: ["quarter"],
  values: [{ accessor: "sales", aggregation: { type: "sum" } }],
});
const active = tableRef.getPivot();
tableRef.setPivot(null); // back to source grid`,
    vue: `tableRef.value?.setPivot({
  rows: ["region"],
  columns: ["quarter"],
  values: [{ accessor: "sales", aggregation: { type: "sum" } }],
});
const active = tableRef.value?.getPivot();
tableRef.value?.setPivot(null); // back to source grid`,
    angular: `this.tableRef.getAPI()?.setPivot({
  rows: ["region"],
  columns: ["quarter"],
  values: [{ accessor: "sales", aggregation: { type: "sum" } }],
});
const active = this.tableRef.getAPI()?.getPivot();
this.tableRef.getAPI()?.setPivot(null); // back to source grid`,
    svelte: `tableRef.getAPI()?.setPivot({
  rows: ["region"],
  columns: ["quarter"],
  values: [{ accessor: "sales", aggregation: { type: "sum" } }],
});
const active = tableRef.getAPI()?.getPivot();
tableRef.getAPI()?.setPivot(null); // back to source grid`,
    vanilla: `table.setPivot({
  rows: ["region"],
  columns: ["quarter"],
  values: [{ accessor: "sales", aggregation: { type: "sum" } }],
});
const active = table.getPivot();
table.setPivot(null); // back to source grid`,
  };
}

/** Save and restore left / main / right pin bands via TableAPI. */
export function pinnedStateSnippets(): Record<Framework, string> {
  return {
    react: `// Save
const pinned = tableRef.current?.getPinnedState();

// Restore
await tableRef.current?.applyPinnedState(pinned);`,
    solid: `// Save
const pinned = tableRef.getPinnedState();

// Restore
await tableRef.applyPinnedState(pinned);`,
    vue: `// Save
const pinned = tableRef.value?.getPinnedState();

// Restore
await tableRef.value?.applyPinnedState(pinned);`,
    angular: `// Save
const pinned = this.tableRef.getAPI()?.getPinnedState();

// Restore
await this.tableRef.getAPI()?.applyPinnedState(pinned);`,
    svelte: `// Save
const pinned = tableRef.getAPI()?.getPinnedState();

// Restore
await tableRef.getAPI()?.applyPinnedState(pinned);`,
    vanilla: `// Save
const pinned = table.getPinnedState();

// Restore
await table.applyPinnedState(pinned);`,
  };
}

/** Customize each column-editor row via columnEditorConfig.rowRenderer. */
export function customColumnEditorRowSnippets(): Record<Framework, string> {
  return {
    react: `<SimpleTable
  enableColumnEditor
  columns={columns}
  rows={rows}
  columnEditorConfig={{
    rowRenderer: ${ROW_RENDERER_BODY},
  }}
/>`,
    solid: `<SimpleTable
  enableColumnEditor
  columns={columns}
  rows={rows}
  columnEditorConfig={{
    rowRenderer: ${ROW_RENDERER_BODY},
  }}
/>`,
    vue: `<script setup>
const columnEditorConfig = {
  rowRenderer: ({ components }) => {
    // return a custom row using components.checkbox, labelContent, dragIcon, pinControl
  },
};
</script>

<template>
  <SimpleTable
    :enable-column-editor="true"
    :column-editor-config="columnEditorConfig"
    :columns="columns"
    :rows="rows"
  />
</template>`,
    angular: `columnEditorConfig = {
  rowRenderer: ({ components }) => {
    // return a custom row using components.checkbox, labelContent, dragIcon, pinControl
  },
};

<simple-table
  [enableColumnEditor]="true"
  [columnEditorConfig]="columnEditorConfig"
  [columns]="columns"
  [rows]="rows"
></simple-table>`,
    svelte: `<script>
  const columnEditorConfig = {
    rowRenderer: ({ components }) => {
      // return a custom row using components.checkbox, labelContent, dragIcon, pinControl
    },
  };
</script>

<SimpleTable
  enableColumnEditor={true}
  columnEditorConfig={columnEditorConfig}
  {columns}
  {rows}
/>`,
    vanilla: `new SimpleTableVanilla(container, {
  columns,
  rows,
  enableColumnEditor: true,
  columnEditorConfig: {
    rowRenderer: ({ components }) => {
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.gap = "8px";
      row.style.alignItems = "center";
      if (components.checkbox) row.appendChild(components.checkbox);
      if (components.labelContent) row.appendChild(components.labelContent);
      if (components.dragIcon) row.appendChild(components.dragIcon);
      return row;
    },
  },
});`,
  };
}

/** Status badge cellRenderer examples (per framework). */
export function cellRendererSnippets(): Record<Framework, string> {
  return {
    react: `const StatusCell = ({ value }) => {
  const status = String(value);
  const color = status === "active" ? "#10B981" : "#6B7280";
  return <span style={{ color, fontWeight: 600 }}>{status}</span>;
};

const columns: ReactColumnDef[] = [
  { accessor: "status", label: "Status", width: 120, cellRenderer: StatusCell },
];`,
    solid: `const StatusCell = (props) => {
  const status = String(props.value);
  const color = status === "active" ? "#10B981" : "#6B7280";
  return <span style={{ color, "font-weight": "600" }}>{status}</span>;
};

const columns: SolidColumnDef[] = [
  { accessor: "status", label: "Status", width: 120, cellRenderer: StatusCell },
];`,
    vue: `import { h } from "vue";

const StatusCell = ({ value }) => {
  const status = String(value);
  const color = status === "active" ? "#10B981" : "#6B7280";
  return h("span", { style: { color, fontWeight: "600" } }, status);
};

const columns: VueColumnDef[] = [
  { accessor: "status", label: "Status", width: 120, cellRenderer: StatusCell },
];`,
    angular: `<simple-table [columns]="columns" [rows]="rows">
  <ng-template stCell="status" let-value="value">
    <span
      [style.color]="value === 'active' ? '#10B981' : '#6B7280'"
      style="font-weight:600"
    >{{ value }}</span>
  </ng-template>
</simple-table>

// Or pass an Angular component class on the column:
// { accessor: "status", cellRenderer: StatusCellComponent }`,
    svelte: `<!-- StatusCell.svelte -->
<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  let { value }: CellRendererProps = $props();
  const status = $derived(String(value));
  const color = $derived(status === "active" ? "#10B981" : "#6B7280");
</script>
<span style="color:{color};font-weight:600">{status}</span>

<!-- column def -->
{ accessor: "status", label: "Status", width: 120, cellRenderer: StatusCell }`,
    vanilla: `const StatusCell = ({ value }) => {
  const status = String(value);
  const color = status === "active" ? "#10B981" : "#6B7280";
  const span = document.createElement("span");
  span.style.color = color;
  span.style.fontWeight = "600";
  span.textContent = status;
  return span;
};

const columns: ColumnDef[] = [
  { accessor: "status", label: "Status", width: 120, cellRenderer: StatusCell },
];`,
  };
}

/**
 * Map React-style `tableRef.current?.…` API calls to each framework’s ref / getAPI pattern.
 * Pass code that uses `tableRef.current?` as the call site.
 */
export function tableApiCallSnippets(code: string): Record<Framework, string> {
  return {
    react: code,
    solid: code.replaceAll("tableRef.current?", "tableRef"),
    vue: code.replaceAll("tableRef.current?", "tableRef.value?.getAPI()?"),
    angular: code.replaceAll("tableRef.current?", "this.tableRef.getAPI()?"),
    svelte: code.replaceAll("tableRef.current?", "tableRef.getAPI()?"),
    vanilla: code.replaceAll("tableRef.current?", "table.getAPI()"),
  };
}

/** Wire a ref / instance so you can call TableAPI methods. */
export function tableApiAccessSnippets(): Record<Framework, string> {
  return {
    react: `const tableRef = useRef(null);

<SimpleTable ref={tableRef} columns={columns} rows={rows} />

tableRef.current?.getVisibleRows();`,
    solid: `let tableRef;

<SimpleTable
  ref={(api) => (tableRef = api)}
  columns={columns}
  rows={rows()}
/>

tableRef?.getVisibleRows();`,
    vue: `const tableRef = ref(null);

<SimpleTable ref="tableRef" :columns="columns" :rows="rows" />

tableRef.value?.getAPI()?.getVisibleRows();`,
    angular: `@ViewChild("simpleTable") tableRef!: SimpleTableComponent;

<simple-table
  #simpleTable
  [columns]="columns"
  [rows]="rows"
></simple-table>

this.tableRef.getAPI()?.getVisibleRows();`,
    svelte: `let tableRef;

<SimpleTable bind:this={tableRef} {columns} {rows} />

tableRef.getAPI()?.getVisibleRows();`,
    vanilla: `const table = new SimpleTableVanilla(container, {
  columns,
  rows,
});

table.getAPI().getVisibleRows();`,
  };
}

/** Read visible / all rows and current headers. */
export function tableApiReadDataSnippets(): Record<Framework, string> {
  return tableApiCallSnippets(`const visible = tableRef.current?.getVisibleRows();
const all = tableRef.current?.getAllRows();
const headers = tableRef.current?.getHeaders();`);
}

/** Sort, filter, quick filter, and paginate via the API. */
export function tableApiControlSnippets(): Record<Framework, string> {
  return tableApiCallSnippets(`await tableRef.current?.applySortState({
  accessor: "price",
  direction: "desc",
});

await tableRef.current?.applyFilter({
  accessor: "status",
  operator: "equals",
  value: "Available",
});

await tableRef.current?.clearAllFilters();
tableRef.current?.setQuickFilter("keyboard");
await tableRef.current?.setPage(2);`);
}

/** Short .theme-custom CSS variables example (same for every framework). */
export function customThemeCssSnippets(): Record<Framework, string> {
  return forAllFrameworks(`.theme-custom {
  --st-header-background-color: #7c3aed;
  --st-header-label-color: #fff;
  --st-odd-row-background-color: #fffbeb;
  --st-even-row-background-color: #fef3c7;
  --st-hover-row-background-color: #fde68a;
  --st-selected-cell-background-color: #f5f3ff;
}`);
}

/** Import a custom theme stylesheet. */
export function customThemeImportSnippets(): Record<Framework, string> {
  return forAllFrameworks(`import "./my-table-theme.css";`);
}

/** Layout dimensions that affect virtualization (customTheme prop). */
export function customThemeLayoutSnippets(): Record<Framework, string> {
  return {
    react: `<SimpleTable
  customTheme={{ rowHeight: 32, headerHeight: 40 }}
  columns={columns}
  rows={rows}
/>`,
    solid: `<SimpleTable
  customTheme={{ rowHeight: 32, headerHeight: 40 }}
  columns={columns}
  rows={rows()}
/>`,
    vue: `<SimpleTable
  :custom-theme="{ rowHeight: 32, headerHeight: 40 }"
  :columns="columns"
  :rows="rows"
/>`,
    angular: `<simple-table
  [customTheme]="{ rowHeight: 32, headerHeight: 40 }"
  [columns]="columns"
  [rows]="rows"
></simple-table>`,
    svelte: `<SimpleTable
  customTheme={{ rowHeight: 32, headerHeight: 40 }}
  {columns}
  {rows}
/>`,
    vanilla: `new SimpleTableVanilla(container, {
  customTheme: { rowHeight: 32, headerHeight: 40 },
  columns,
  rows,
});`,
  };
}

/** Override all icons via the icons prop. */
export function customIconsSnippets(): Record<Framework, string> {
  return {
    react: `const icons = {
  sortUp: <SortUpIcon />,
  sortDown: <SortDownIcon />,
  filter: <FilterIcon />,
  expand: <ExpandIcon />,
  headerExpand: <HeaderExpandIcon />,
  headerCollapse: <HeaderCollapseIcon />,
  prev: <PrevIcon />,
  next: <NextIcon />,
  drag: <DragIcon />,
  pinnedLeftIcon: <PinLeftIcon />,
  pinnedRightIcon: <PinRightIcon />,
};

<SimpleTable
  icons={icons}
  columns={columns}
  rows={rows}
/>`,
    solid: `const icons = {
  sortUp: <SortUpIcon />,
  sortDown: <SortDownIcon />,
  filter: <FilterIcon />,
  expand: <ExpandIcon />,
  headerExpand: <HeaderExpandIcon />,
  headerCollapse: <HeaderCollapseIcon />,
  prev: <PrevIcon />,
  next: <NextIcon />,
  drag: <DragIcon />,
  pinnedLeftIcon: <PinLeftIcon />,
  pinnedRightIcon: <PinRightIcon />,
};

<SimpleTable
  icons={icons}
  columns={columns}
  rows={rows()}
/>`,
    vue: `import { h } from "vue";

const icons = {
  sortUp: h(SortUpIcon),
  sortDown: h(SortDownIcon),
  filter: h(FilterIcon),
  expand: h(ExpandIcon),
  headerExpand: h(HeaderExpandIcon),
  headerCollapse: h(HeaderCollapseIcon),
  prev: h(PrevIcon),
  next: h(NextIcon),
  drag: h(DragIcon),
  pinnedLeftIcon: h(PinLeftIcon),
  pinnedRightIcon: h(PinRightIcon),
};

<SimpleTable
  :icons="icons"
  :columns="columns"
  :rows="rows"
/>`,
    angular: `icons: AngularIconsConfig = {
  sortUp: SortUpIconComponent,
  sortDown: SortDownIconComponent,
  filter: FilterIconComponent,
  expand: ExpandIconComponent,
  headerExpand: HeaderExpandIconComponent,
  headerCollapse: HeaderCollapseIconComponent,
  prev: PrevIconComponent,
  next: NextIconComponent,
  drag: DragIconComponent,
  pinnedLeftIcon: PinLeftIconComponent,
  pinnedRightIcon: PinRightIconComponent,
};

<simple-table
  [icons]="icons"
  [columns]="columns"
  [rows]="rows"
></simple-table>`,
    svelte: `const icons = {
  sortUp: SortUpIcon,
  sortDown: SortDownIcon,
  filter: FilterIcon,
  expand: ExpandIcon,
  headerExpand: HeaderExpandIcon,
  headerCollapse: HeaderCollapseIcon,
  prev: PrevIcon,
  next: NextIcon,
  drag: DragIcon,
  pinnedLeftIcon: PinLeftIcon,
  pinnedRightIcon: PinRightIcon,
};

<SimpleTable {icons} {columns} {rows} />`,
    vanilla: `const icons = {
  sortUp: createSvgIcon("M12 19V5M5 12l7-7 7 7"),
  sortDown: createSvgIcon("M12 5v14M19 12l-7 7-7-7"),
  filter: createSvgIcon("M3 4h18l-7 8.5V18l-4 2V12.5L3 4z"),
  expand: createSvgIcon("M9 5l7 7-7 7"),
  headerExpand: createSvgIcon("M9 5l7 7-7 7"),
  headerCollapse: createSvgIcon("M19 9l-7 7-7-7"),
  prev: createSvgIcon("M15 19l-7-7 7-7"),
  next: createSvgIcon("M9 5l7 7-7 7"),
  drag: createSvgIcon("M9 5h2M13 5h2M9 12h2M13 12h2M9 19h2M13 19h2"),
  pinnedLeftIcon: createSvgIcon("M12 17v5M9 10.76V7a3 3 0 116 0v3.76"),
  pinnedRightIcon: createSvgIcon("M12 17v5M9 10.76V7a3 3 0 116 0v3.76"),
};

new SimpleTableVanilla(container, {
  icons,
  columns,
  rows,
});`,
  };
}

/** Apply a built-in theme via the theme prop. */
export function themeSnippets(theme: string = "modern-dark"): Record<Framework, string> {
  return {
    react: `<SimpleTable
  theme="${theme}"
  columns={columns}
  rows={rows}
/>`,
    solid: `<SimpleTable
  theme="${theme}"
  columns={columns}
  rows={rows()}
/>`,
    vue: `<SimpleTable
  theme="${theme}"
  :columns="columns"
  :rows="rows"
/>`,
    angular: `<simple-table
  theme="${theme}"
  [columns]="columns"
  [rows]="rows"
></simple-table>`,
    svelte: `<SimpleTable
  theme="${theme}"
  {columns}
  {rows}
/>`,
    vanilla: `new SimpleTableVanilla(container, {
  theme: "${theme}",
  columns,
  rows,
});`,
  };
}

/** Toggle hover, zebra rows/columns, and column borders. */
export function themeStylingFlagsSnippets(): Record<Framework, string> {
  return {
    react: `<SimpleTable
  theme="light"
  hoverRowBackground
  oddEvenRowBackground
  columnBorders
  oddColumnBackground
  columns={columns}
  rows={rows}
/>`,
    solid: `<SimpleTable
  theme="light"
  hoverRowBackground
  oddEvenRowBackground
  columnBorders
  oddColumnBackground
  columns={columns}
  rows={rows()}
/>`,
    vue: `<SimpleTable
  theme="light"
  :hover-row-background="true"
  :odd-even-row-background="true"
  :column-borders="true"
  :odd-column-background="true"
  :columns="columns"
  :rows="rows"
/>`,
    angular: `<simple-table
  theme="light"
  [hoverRowBackground]="true"
  [oddEvenRowBackground]="true"
  [columnBorders]="true"
  [oddColumnBackground]="true"
  [columns]="columns"
  [rows]="rows"
></simple-table>`,
    svelte: `<SimpleTable
  theme="light"
  hoverRowBackground={true}
  oddEvenRowBackground={true}
  columnBorders={true}
  oddColumnBackground={true}
  {columns}
  {rows}
/>`,
    vanilla: `new SimpleTableVanilla(container, {
  theme: "light",
  hoverRowBackground: true,
  oddEvenRowBackground: true,
  columnBorders: true,
  oddColumnBackground: true,
  columns,
  rows,
});`,
  };
}

/** Apply a CSS class to every body cell in a column via ColumnDef.cellClass. */
export function cellClassSnippets(): Record<Framework, string> {
  return forAllFrameworks(`{
  accessor: "amount",
  label: "Amount",
  width: 120,
  type: "number",
  cellClass: "amount-col",
}

/* CSS */
.amount-col { font-variant-numeric: tabular-nums; }`);
}

/** Highlight specific rows with getRowClass (classes apply to each body cell). */
export function getRowClassSnippets(): Record<Framework, string> {
  return {
    react: `const [jumpId, setJumpId] = useState(null);

<SimpleTable
  columns={columns}
  rows={rows}
  getRowClass={({ row }) =>
    jumpId && row.id === jumpId ? "jump-row" : undefined
  }
/>

/* CSS */
.jump-row { background-color: #fef3c7; }`,
    solid: `<SimpleTable
  columns={columns}
  rows={rows()}
  getRowClass={({ row }) =>
    jumpId() && row.id === jumpId() ? "jump-row" : undefined
  }
/>

/* CSS */
.jump-row { background-color: #fef3c7; }`,
    vue: `<SimpleTable
  :columns="columns"
  :rows="rows"
  :get-row-class="({ row }) =>
    jumpId && row.id === jumpId ? 'jump-row' : undefined
  "
/>

/* CSS */
.jump-row { background-color: #fef3c7; }`,
    angular: `<simple-table
  [columns]="columns"
  [rows]="rows"
  [getRowClass]="getRowClass"
></simple-table>

/* getRowClass = ({ row }) => jumpId && row.id === jumpId ? 'jump-row' : undefined */

/* CSS */
.jump-row { background-color: #fef3c7; }`,
    svelte: `<SimpleTable
  {columns}
  {rows}
  getRowClass={({ row }) =>
    jumpId && row.id === jumpId ? "jump-row" : undefined
  }
/>

/* CSS */
.jump-row { background-color: #fef3c7; }`,
    vanilla: `new SimpleTableVanilla(container, {
  columns,
  rows,
  getRowClass: ({ row }) =>
    jumpId && row.id === jumpId ? "jump-row" : undefined,
});

/* CSS */
.jump-row { background-color: #fef3c7; }`,
  };
}

/** Call TableAPI.exportToCSV from a button / handler. */
export function exportToCSVSnippets(): Record<Framework, string> {
  return {
    react: `const tableRef = useRef(null);

<button onClick={() => tableRef.current?.exportToCSV({ filename: "report.csv" })}>
  Export CSV
</button>

<SimpleTable ref={tableRef} columns={columns} rows={rows} />`,
    solid: `let tableRef;

<button onClick={() => tableRef?.exportToCSV({ filename: "report.csv" })}>
  Export CSV
</button>

<SimpleTable
  ref={(api) => (tableRef = api)}
  columns={columns}
  rows={rows()}
/>`,
    vue: `const tableRef = ref(null);

<button @click="tableRef?.getAPI()?.exportToCSV({ filename: 'report.csv' })">
  Export CSV
</button>

<SimpleTable ref="tableRef" :columns="columns" :rows="rows" />`,
    angular: `@ViewChild("simpleTable") tableRef!: SimpleTableComponent;

exportCsv() {
  this.tableRef.getAPI()?.exportToCSV({ filename: "report.csv" });
}

<button (click)="exportCsv()">Export CSV</button>

<simple-table
  #simpleTable
  [columns]="columns"
  [rows]="rows"
></simple-table>`,
    svelte: `let tableRef;

<button onclick={() => tableRef.getAPI()?.exportToCSV({ filename: "report.csv" })}>
  Export CSV
</button>

<SimpleTable bind:this={tableRef} {columns} {rows} />`,
    vanilla: `const table = new SimpleTableVanilla(container, {
  columns,
  rows,
});

button.addEventListener("click", () => {
  table.getAPI().exportToCSV({ filename: "report.csv" });
});`,
  };
}

/** Live cell updates via TableAPI.updateData + cellUpdateFlash. */
export function liveUpdateSnippets(): Record<Framework, string> {
  return {
    react: `const tableRef = useRef(null);

<SimpleTable
  ref={tableRef}
  columns={columns}
  rows={rows}
  getRowId={({ row }) => row.id}
  cellUpdateFlash
/>

// Update the price cell on the row with this id.
tableRef.current?.updateData({
  accessor: "price",
  rowId: targetId,
  newValue: 29.99,
});`,
    solid: `let tableRef;

<SimpleTable
  ref={(api) => (tableRef = api)}
  columns={columns}
  rows={rows()}
  getRowId={({ row }) => row.id}
  cellUpdateFlash
/>

// Update the price cell on the row with this id.
tableRef?.updateData({
  accessor: "price",
  rowId: targetId,
  newValue: 29.99,
});`,
    vue: `const tableRef = ref(null);
const getRowId = ({ row }) => row.id;

<SimpleTable
  ref="tableRef"
  :columns="columns"
  :rows="rows"
  :get-row-id="getRowId"
  :cell-update-flash="true"
/>

// Update the price cell on the row with this id.
tableRef.value?.getAPI()?.updateData({
  accessor: "price",
  rowId: targetId,
  newValue: 29.99,
});`,
    angular: `@ViewChild("simpleTable") tableRef!: SimpleTableComponent;
getRowId = ({ row }: { row: { id: number } }) => row.id;

<simple-table
  #simpleTable
  [columns]="columns"
  [rows]="rows"
  [getRowId]="getRowId"
  [cellUpdateFlash]="true"
></simple-table>

// Update the price cell on the row with this id.
this.tableRef.getAPI()?.updateData({
  accessor: "price",
  rowId: targetId,
  newValue: 29.99,
});`,
    svelte: `let tableRef;

<SimpleTable
  bind:this={tableRef}
  {columns}
  {rows}
  getRowId={({ row }) => row.id}
  cellUpdateFlash={true}
/>

// Update the price cell on the row with this id.
tableRef.getAPI()?.updateData({
  accessor: "price",
  rowId: targetId,
  newValue: 29.99,
});`,
    vanilla: `const table = new SimpleTableVanilla(container, {
  columns,
  rows,
  getRowId: ({ row }) => row.id,
  cellUpdateFlash: true,
});

// Update the price cell on the row with this id.
table.getAPI().updateData({
  accessor: "price",
  rowId: targetId,
  newValue: 29.99,
});`,
  };
}

/** Infinite scroll: append rows in onLoadMore. */
export function infiniteScrollSnippets(): Record<Framework, string> {
  return {
    react: `const [rows, setRows] = useState(initialRows);
const [isLoading, setIsLoading] = useState(false);

const handleLoadMore = async () => {
  if (isLoading) return;
  setIsLoading(true);
  setRows((prev) => [...prev, ...(await fetchMore(prev.length))]);
  setIsLoading(false);
};

<SimpleTable
  columns={columns}
  rows={rows}
  height="400px"
  onLoadMore={handleLoadMore}
  isLoading={isLoading}
/>`,
    solid: `const [rows, setRows] = createSignal(initialRows);
const [isLoading, setIsLoading] = createSignal(false);

const handleLoadMore = async () => {
  if (isLoading()) return;
  setIsLoading(true);
  setRows([...rows(), ...(await fetchMore(rows().length))]);
  setIsLoading(false);
};

<SimpleTable
  columns={columns}
  rows={rows()}
  height="400px"
  onLoadMore={handleLoadMore}
  isLoading={isLoading()}
/>`,
    vue: `<script setup>
import { ref } from "vue";
const rows = ref(initialRows);
const isLoading = ref(false);

const handleLoadMore = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  rows.value = [...rows.value, ...(await fetchMore(rows.value.length))];
  isLoading.value = false;
};
</script>

<template>
  <SimpleTable
    :columns="columns"
    :rows="rows"
    height="400px"
    :on-load-more="handleLoadMore"
    :is-loading="isLoading"
  />
</template>`,
    angular: `rows = initialRows;
isLoading = false;

handleLoadMore = async () => {
  if (this.isLoading) return;
  this.isLoading = true;
  this.rows = [...this.rows, ...(await fetchMore(this.rows.length))];
  this.isLoading = false;
};

<simple-table
  [columns]="columns"
  [rows]="rows"
  height="400px"
  (loadMore)="handleLoadMore()"
  [isLoading]="isLoading"
></simple-table>`,
    svelte: `<script>
  let rows = $state(initialRows);
  let isLoading = $state(false);

  const handleLoadMore = async () => {
    if (isLoading) return;
    isLoading = true;
    rows = [...rows, ...(await fetchMore(rows.length))];
    isLoading = false;
  };
</script>

<SimpleTable
  {columns}
  {rows}
  height="400px"
  onLoadMore={handleLoadMore}
  isLoading={isLoading}
/>`,
    vanilla: `let rows = initialRows;

const table = new SimpleTableVanilla(container, {
  columns,
  rows,
  height: "400px",
  isLoading: false,
  onLoadMore: async () => {
    table.update({ isLoading: true });
    rows = [...rows, ...(await fetchMore(rows.length))];
    table.update({ rows, isLoading: false });
  },
});`,
  };
}

/** Infinite scroll driven by the page (or an external scroller). */
export function infiniteScrollWindowSnippets(): Record<Framework, string> {
  return {
    react: `<SimpleTable
  columns={columns}
  rows={rows}
  scrollParent="window"
  onLoadMore={handleLoadMore}
  isLoading={isLoading}
/>`,
    solid: `<SimpleTable
  columns={columns}
  rows={rows()}
  scrollParent="window"
  onLoadMore={handleLoadMore}
  isLoading={isLoading()}
/>`,
    vue: `<SimpleTable
  :columns="columns"
  :rows="rows"
  scroll-parent="window"
  :on-load-more="handleLoadMore"
  :is-loading="isLoading"
/>`,
    angular: `<simple-table
  [columns]="columns"
  [rows]="rows"
  scrollParent="window"
  (loadMore)="handleLoadMore()"
  [isLoading]="isLoading"
></simple-table>`,
    svelte: `<SimpleTable
  {columns}
  {rows}
  scrollParent="window"
  onLoadMore={handleLoadMore}
  isLoading={isLoading}
/>`,
    vanilla: `new SimpleTableVanilla(container, {
  columns,
  rows,
  scrollParent: "window",
  onLoadMore: handleLoadMore,
});`,
  };
}

/** Custom tableEmptyStateRenderer when there are no rows. */
export function tableEmptyStateSnippets(): Record<Framework, string> {
  return {
    react: `const EmptyState = () => (
  <div style={{ padding: 48, textAlign: "center", color: "#6b7280" }}>
    No data available
  </div>
);

<SimpleTable
  columns={columns}
  rows={[]}
  tableEmptyStateRenderer={<EmptyState />}
/>`,
    solid: `const EmptyState = () => (
  <div style={{ padding: "48px", "text-align": "center", color: "#6b7280" }}>
    No data available
  </div>
);

<SimpleTable
  columns={columns}
  rows={[]}
  tableEmptyStateRenderer={<EmptyState />}
/>`,
    vue: `import { h } from "vue";

const emptyState = h(
  "div",
  { style: { padding: "48px", textAlign: "center", color: "#6b7280" } },
  "No data available",
);

<SimpleTable
  :columns="columns"
  :rows="[]"
  :table-empty-state-renderer="emptyState"
/>`,
    angular: `<simple-table [columns]="columns" [rows]="[]">
  <ng-template stEmpty>
    <div style="padding: 48px; text-align: center; color: #6b7280">
      No data available
    </div>
  </ng-template>
</simple-table>`,
    svelte: `<!-- EmptyState.svelte -->
<div style="padding: 48px; text-align: center; color: #6b7280">
  No data available
</div>

<SimpleTable
  {columns}
  rows={[]}
  tableEmptyStateRenderer={EmptyState}
/>`,
    vanilla: `const empty = document.createElement("div");
empty.style.cssText = "padding:48px;text-align:center;color:#6b7280";
empty.textContent = "No data available";

new SimpleTableVanilla(container, {
  columns,
  rows: [],
  tableEmptyStateRenderer: empty,
});`,
  };
}

/** Toggle isLoading while fetching rows. */
export function isLoadingSnippets(): Record<Framework, string> {
  return {
    react: `const [rows, setRows] = useState([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  fetchRows().then((data) => {
    setRows(data);
    setIsLoading(false);
  });
}, []);

<SimpleTable columns={columns} rows={rows} isLoading={isLoading} />`,
    solid: `const [rows, setRows] = createSignal([]);
const [isLoading, setIsLoading] = createSignal(true);

onMount(async () => {
  setRows(await fetchRows());
  setIsLoading(false);
});

<SimpleTable columns={columns} rows={rows()} isLoading={isLoading()} />`,
    vue: `<script setup>
import { onMounted, ref } from "vue";
const rows = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  rows.value = await fetchRows();
  isLoading.value = false;
});
</script>

<template>
  <SimpleTable :columns="columns" :rows="rows" :is-loading="isLoading" />
</template>`,
    angular: `rows = [];
isLoading = true;

async ngOnInit() {
  this.rows = await fetchRows();
  this.isLoading = false;
}

<simple-table
  [columns]="columns"
  [rows]="rows"
  [isLoading]="isLoading"
></simple-table>`,
    svelte: `<script>
  let rows = $state([]);
  let isLoading = $state(true);

  $effect(async () => {
    rows = await fetchRows();
    isLoading = false;
  });
</script>

<SimpleTable {columns} {rows} isLoading={isLoading} />`,
    vanilla: `const table = new SimpleTableVanilla(container, {
  columns,
  rows: [],
  isLoading: true,
});

fetchRows().then((rows) => {
  table.update({ rows, isLoading: false });
});`,
  };
}

/** Server-side pagination: supply page rows + totalRowCount. */
export function serverSidePaginationSnippets(): Record<Framework, string> {
  return {
    react: `const [rows, setRows] = useState([]);
const [isLoading, setIsLoading] = useState(false);

const handlePageChange = async (page) => {
  setIsLoading(true);
  setRows(await fetchPage(page));
  setIsLoading(false);
};

<SimpleTable
  columns={columns}
  rows={rows}
  enablePagination
  serverSidePagination
  rowsPerPage={25}
  totalRowCount={1000}
  isLoading={isLoading}
  onPageChange={handlePageChange}
/>`,
    solid: `const [rows, setRows] = createSignal([]);
const [isLoading, setIsLoading] = createSignal(false);

const handlePageChange = async (page) => {
  setIsLoading(true);
  setRows(await fetchPage(page));
  setIsLoading(false);
};

<SimpleTable
  columns={columns}
  rows={rows()}
  enablePagination
  serverSidePagination
  rowsPerPage={25}
  totalRowCount={1000}
  isLoading={isLoading()}
  onPageChange={handlePageChange}
/>`,
    vue: `<script setup>
import { ref } from "vue";
const rows = ref([]);
const isLoading = ref(false);

const handlePageChange = async (page) => {
  isLoading.value = true;
  rows.value = await fetchPage(page);
  isLoading.value = false;
};
</script>

<template>
  <SimpleTable
    :columns="columns"
    :rows="rows"
    :enable-pagination="true"
    :server-side-pagination="true"
    :rows-per-page="25"
    :total-row-count="1000"
    :is-loading="isLoading"
    :on-page-change="handlePageChange"
  />
</template>`,
    angular: `rows = [];
isLoading = false;

handlePageChange = async (page: number) => {
  this.isLoading = true;
  this.rows = await fetchPage(page);
  this.isLoading = false;
};

<simple-table
  [columns]="columns"
  [rows]="rows"
  [enablePagination]="true"
  [serverSidePagination]="true"
  [rowsPerPage]="25"
  [totalRowCount]="1000"
  [isLoading]="isLoading"
  (pageChange)="handlePageChange($event)"
></simple-table>`,
    svelte: `<script>
  let rows = $state([]);
  let isLoading = $state(false);

  const handlePageChange = async (page) => {
    isLoading = true;
    rows = await fetchPage(page);
    isLoading = false;
  };
</script>

<SimpleTable
  {columns}
  {rows}
  enablePagination={true}
  serverSidePagination={true}
  rowsPerPage={25}
  totalRowCount={1000}
  isLoading={isLoading}
  onPageChange={handlePageChange}
/>`,
    vanilla: `let rows = [];

const table = new SimpleTableVanilla(container, {
  columns,
  rows,
  enablePagination: true,
  serverSidePagination: true,
  rowsPerPage: 25,
  totalRowCount: 1000,
  onPageChange: async (page) => {
    table.update({ isLoading: true });
    rows = await fetchPage(page);
    table.update({ rows, isLoading: false });
  },
});`,
  };
}

/** Custom footerRenderer with pagination controls (per framework). */
export function footerRendererSnippets(): Record<Framework, string> {
  return {
    react: `const FooterBar = ({
  currentPage, totalPages, startRow, endRow, totalRows,
  hasPrevPage, hasNextPage, onPrevPage, onNextPage,
}) => (
  <div style={{ display: "flex", justifyContent: "space-between", padding: 12 }}>
    <span>Showing {startRow}-{endRow} of {totalRows}</span>
    <div>
      <button disabled={!hasPrevPage} onClick={onPrevPage}>Prev</button>
      <span> {currentPage} / {totalPages} </span>
      <button disabled={!hasNextPage} onClick={() => void onNextPage()}>Next</button>
    </div>
  </div>
);

<SimpleTable
  columns={columns}
  rows={rows}
  enablePagination
  rowsPerPage={10}
  footerRenderer={FooterBar}
/>`,
    solid: `const FooterBar = (props) => (
  <div style={{ display: "flex", "justify-content": "space-between", padding: "12px" }}>
    <span>
      Showing {props.startRow}-{props.endRow} of {props.totalRows}
    </span>
    <div>
      <button disabled={!props.hasPrevPage} onClick={props.onPrevPage}>Prev</button>
      <span> {props.currentPage} / {props.totalPages} </span>
      <button disabled={!props.hasNextPage} onClick={() => void props.onNextPage()}>
        Next
      </button>
    </div>
  </div>
);

<SimpleTable
  columns={columns}
  rows={rows()}
  enablePagination
  rowsPerPage={10}
  footerRenderer={FooterBar}
/>`,
    vue: `import { h } from "vue";

const FooterBar = (fp) =>
  h("div", { style: { display: "flex", justifyContent: "space-between", padding: "12px" } }, [
    h("span", \`Showing \${fp.startRow}-\${fp.endRow} of \${fp.totalRows}\`),
    h("div", [
      h("button", { disabled: !fp.hasPrevPage, onClick: fp.onPrevPage }, "Prev"),
      h("span", \` \${fp.currentPage} / \${fp.totalPages} \`),
      h("button", {
        disabled: !fp.hasNextPage,
        onClick: () => { void fp.onNextPage(); },
      }, "Next"),
    ]),
  ]);

<SimpleTable
  :columns="columns"
  :rows="rows"
  :enable-pagination="true"
  :rows-per-page="10"
  :footer-renderer="FooterBar"
/>`,
    angular: `// footer-bar.component.ts — @Input() currentPage, totalPages, …
// Template: Prev / page / Next wired to onPrevPage / onNextPage

<simple-table
  [columns]="columns"
  [rows]="rows"
  [enablePagination]="true"
  [rowsPerPage]="10"
  [footerRenderer]="FooterBarComponent"
></simple-table>`,
    svelte: `<!-- FooterBar.svelte -->
<script lang="ts">
  import type { FooterRendererProps } from "@simple-table/svelte";
  let {
    currentPage, totalPages, startRow, endRow, totalRows,
    hasPrevPage, hasNextPage, onPrevPage, onNextPage,
  }: FooterRendererProps = $props();
</script>
<div style="display:flex;justify-content:space-between;padding:12px">
  <span>Showing {startRow}-{endRow} of {totalRows}</span>
  <div>
    <button disabled={!hasPrevPage} onclick={onPrevPage}>Prev</button>
    <span> {currentPage} / {totalPages} </span>
    <button disabled={!hasNextPage} onclick={() => void onNextPage()}>Next</button>
  </div>
</div>

<SimpleTable
  {columns}
  {rows}
  enablePagination={true}
  rowsPerPage={10}
  footerRenderer={FooterBar}
/>`,
    vanilla: `const footerRenderer = ({
  currentPage, totalPages, startRow, endRow, totalRows,
  hasPrevPage, hasNextPage, onPrevPage, onNextPage,
}) => {
  const el = document.createElement("div");
  el.style.cssText = "display:flex;justify-content:space-between;padding:12px";
  el.innerHTML = \`
    <span>Showing \${startRow}-\${endRow} of \${totalRows}</span>
    <div>
      <button \${!hasPrevPage ? "disabled" : ""} data-prev>Prev</button>
      <span> \${currentPage} / \${totalPages} </span>
      <button \${!hasNextPage ? "disabled" : ""} data-next>Next</button>
    </div>
  \`;
  el.querySelector("[data-prev]")?.addEventListener("click", onPrevPage);
  el.querySelector("[data-next]")?.addEventListener("click", () => { void onNextPage(); });
  return el;
};

new SimpleTableVanilla(container, {
  columns,
  rows,
  enablePagination: true,
  rowsPerPage: 10,
  footerRenderer,
});`,
  };
}

export function footerPositionSnippets(): Record<Framework, string> {
  return {
    react: `<SimpleTable
  columns={columns}
  rows={rows}
  enablePagination
  footerPosition="top"
  footerRenderer={FooterBar}
/>`,
    solid: `<SimpleTable
  columns={columns}
  rows={rows()}
  enablePagination
  footerPosition="top"
  footerRenderer={FooterBar}
/>`,
    vue: `<SimpleTable
  :columns="columns"
  :rows="rows"
  :enable-pagination="true"
  footer-position="top"
  :footer-renderer="FooterBar"
/>`,
    angular: `<simple-table
  [columns]="columns"
  [rows]="rows"
  [enablePagination]="true"
  footerPosition="top"
  [footerRenderer]="FooterBarComponent"
></simple-table>`,
    svelte: `<SimpleTable
  {columns}
  {rows}
  enablePagination={true}
  footerPosition="top"
  footerRenderer={FooterBar}
/>`,
    vanilla: `new SimpleTableVanilla(container, {
  columns,
  rows,
  enablePagination: true,
  footerPosition: "top",
  footerRenderer,
});`,
  };
}

/** Custom headerRenderer examples (per framework). */
export function headerRendererSnippets(): Record<Framework, string> {
  return {
    react: `const StatusHeader = ({ header }) => (
  <span style={{ fontWeight: 600 }}>{header.label}</span>
);

const columns: ReactColumnDef[] = [
  { accessor: "status", label: "Status", width: 120, headerRenderer: StatusHeader },
];`,
    solid: `const StatusHeader = (props) => (
  <span style={{ "font-weight": "600" }}>{props.header.label}</span>
);

const columns: SolidColumnDef[] = [
  { accessor: "status", label: "Status", width: 120, headerRenderer: StatusHeader },
];`,
    vue: `import { h } from "vue";

const StatusHeader = ({ header }) =>
  h("span", { style: { fontWeight: "600" } }, header.label);

const columns: VueColumnDef[] = [
  { accessor: "status", label: "Status", width: 120, headerRenderer: StatusHeader },
];`,
    angular: `// status-header.component.ts
@Component({
  standalone: true,
  selector: "app-status-header",
  template: \`<span style="font-weight:600">{{ header.label }}</span>\`,
})
export class StatusHeaderComponent {
  @Input() header!: { label: string };
}

// column def
{ accessor: "status", label: "Status", width: 120, headerRenderer: StatusHeaderComponent }`,
    svelte: `<!-- StatusHeader.svelte -->
<script lang="ts">
  import type { HeaderRendererProps } from "@simple-table/svelte";
  let { header }: HeaderRendererProps = $props();
</script>
<span style="font-weight:600">{header.label}</span>

<!-- column def -->
{ accessor: "status", label: "Status", width: 120, headerRenderer: StatusHeader }`,
    vanilla: `const StatusHeader = ({ header }) => {
  const span = document.createElement("span");
  span.style.fontWeight = "600";
  span.textContent = header.label;
  return span;
};

const columns: ColumnDef[] = [
  { accessor: "status", label: "Status", width: 120, headerRenderer: StatusHeader },
];`,
  };
}

/** Reorder built-in header components (sort/filter/label). */
export function headerRendererComponentsSnippets(): Record<Framework, string> {
  return {
    react: `{
  accessor: "name",
  label: "Name",
  sortable: true,
  filterable: true,
  headerRenderer: ({ components }) => (
    <>
      {components?.labelContent}
      {components?.sortIcon}
      {components?.filterIcon}
    </>
  ),
}`,
    solid: `{
  accessor: "name",
  label: "Name",
  sortable: true,
  filterable: true,
  headerRenderer: (props) => (
    <>
      {props.components?.labelContent}
      {props.components?.sortIcon}
      {props.components?.filterIcon}
    </>
  ),
}`,
    vue: `import { h } from "vue";

{
  accessor: "name",
  label: "Name",
  sortable: true,
  filterable: true,
  headerRenderer: ({ components }) =>
    h("div", { style: { display: "flex", gap: "4px", alignItems: "center" } }, [
      components?.labelContent,
      components?.sortIcon,
      components?.filterIcon,
    ].filter(Boolean)),
}`,
    angular: `// header-layout.component.ts — receive @Input() components
// Template: place labelContent, sortIcon, filterIcon in your order

{
  accessor: "name",
  label: "Name",
  sortable: true,
  filterable: true,
  headerRenderer: HeaderLayoutComponent,
}`,
    svelte: `<!-- HeaderLayout.svelte — place components.labelContent / sortIcon / filterIcon -->
<script lang="ts">
  import type { HeaderRendererProps } from "@simple-table/svelte";
  let { components }: HeaderRendererProps = $props();
</script>

<!-- column def -->
{ accessor: "name", label: "Name", sortable: true, filterable: true, headerRenderer: HeaderLayout }`,
    vanilla: `{
  accessor: "name",
  label: "Name",
  sortable: true,
  filterable: true,
  headerRenderer: ({ components }) => {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.gap = "4px";
    row.style.alignItems = "center";
    if (components?.labelContent) {
      if (typeof components.labelContent === "string") {
        row.append(components.labelContent);
      } else {
        row.appendChild(components.labelContent);
      }
    }
    if (components?.sortIcon instanceof Node) row.appendChild(components.sortIcon);
    if (components?.filterIcon instanceof Node) row.appendChild(components.filterIcon);
    return row;
  },
}`,
  };
}

/** Wrap valueFormatter output in a cellRenderer. */
export function cellRendererFormattedValueSnippets(): Record<Framework, string> {
  return {
    react: `{
  accessor: "salary",
  label: "Salary",
  type: "number",
  valueFormatter: ({ value }) =>
    typeof value === "number" ? \`$\${value.toLocaleString()}\` : "",
  cellRenderer: ({ formattedValue }) => (
    <strong>{formattedValue}</strong>
  ),
}`,
    solid: `{
  accessor: "salary",
  label: "Salary",
  type: "number",
  valueFormatter: (props) =>
    typeof props.value === "number" ? \`$\${props.value.toLocaleString()}\` : "",
  cellRenderer: (props) => <strong>{props.formattedValue}</strong>,
}`,
    vue: `{
  accessor: "salary",
  label: "Salary",
  type: "number",
  valueFormatter: ({ value }) =>
    typeof value === "number" ? \`$\${value.toLocaleString()}\` : "",
  cellRenderer: ({ formattedValue }) => h("strong", String(formattedValue ?? "")),
}`,
    angular: `// Format in the column, then wrap the result in the page template.
{
  accessor: "salary",
  label: "Salary",
  type: "number",
  valueFormatter: ({ value }) =>
    typeof value === "number" ? \`$\${value.toLocaleString()}\` : "",
}

<simple-table [columns]="columns" [rows]="rows">
  <ng-template stCell="salary" let-formattedValue="formattedValue">
    <strong>{{ formattedValue }}</strong>
  </ng-template>
</simple-table>`,
    svelte: `{
  accessor: "salary",
  label: "Salary",
  type: "number",
  valueFormatter: ({ value }) =>
    typeof value === "number" ? \`$\${value.toLocaleString()}\` : "",
  cellRenderer: SalaryCell, // receives formattedValue as a prop
}`,
    vanilla: `{
  accessor: "salary",
  label: "Salary",
  type: "number",
  valueFormatter: ({ value }) =>
    typeof value === "number" ? \`$\${value.toLocaleString()}\` : "",
  cellRenderer: ({ formattedValue }) => {
    const el = document.createElement("strong");
    el.textContent = String(formattedValue ?? "");
    return el;
  },
}`,
  };
}

export type QuickFilterSnippetOptions = {
  mode?: "simple" | "smart";
  columns?: string[];
  caseSensitive?: boolean;
};

function quickFilterObjectLiteral(
  options: QuickFilterSnippetOptions,
  textExpr: string,
  quote: '"' | "'" = '"'
): string {
  const { mode = "simple", columns, caseSensitive } = options;
  const parts = [`text: ${textExpr}`, `mode: ${quote}${mode}${quote}`];
  if (caseSensitive !== undefined) parts.push(`caseSensitive: ${caseSensitive}`);
  if (columns) parts.push(`columns: ${JSON.stringify(columns)}`);
  return `{ ${parts.join(", ")} }`;
}

/** Controlled quickFilter with searchText state (per framework). */
export function quickFilterSnippets(
  options: QuickFilterSnippetOptions = {}
): Record<Framework, string> {
  const jsConfig = quickFilterObjectLiteral(options, "searchText");
  const solidConfig = quickFilterObjectLiteral(options, "searchText()");
  const attrConfig = quickFilterObjectLiteral(options, "searchText", "'");

  return {
    react: `const [searchText, setSearchText] = useState("");

<input value={searchText} onChange={(e) => setSearchText(e.target.value)} />
<SimpleTable
  columns={columns}
  rows={rows}
  quickFilter={${jsConfig}}
/>`,
    solid: `const [searchText, setSearchText] = createSignal("");

<input
  value={searchText()}
  onInput={(e) => setSearchText(e.currentTarget.value)}
/>
<SimpleTable
  columns={columns}
  rows={rows()}
  quickFilter={${solidConfig}}
/>`,
    vue: `<script setup>
import { ref } from "vue";
const searchText = ref("");
</script>

<template>
  <input v-model="searchText" />
  <SimpleTable
    :columns="columns"
    :rows="rows"
    :quick-filter="${attrConfig}"
  />
</template>`,
    angular: `searchText = "";

<input [(ngModel)]="searchText" />
<simple-table
  [columns]="columns"
  [rows]="rows"
  [quickFilter]="${attrConfig}"
></simple-table>`,
    svelte: `<script>
  let searchText = $state("");
</script>

<input bind:value={searchText} />
<SimpleTable
  {columns}
  {rows}
  quickFilter={${jsConfig}}
/>`,
    vanilla: `let searchText = "";

const table = new SimpleTableVanilla(container, {
  columns,
  rows,
  quickFilter: ${jsConfig},
});

input.addEventListener("input", (e) => {
  searchText = e.target.value;
  table.update({ quickFilter: ${jsConfig} });
});`,
  };
}

export function programmaticQuickFilterSnippets(): Record<Framework, string> {
  return {
    react: `tableRef.current?.setQuickFilter("engineering");
tableRef.current?.setQuickFilter(""); // clear`,
    solid: `tableRef.setQuickFilter("engineering");
tableRef.setQuickFilter(""); // clear`,
    vue: `tableRef.value?.setQuickFilter("engineering");
tableRef.value?.setQuickFilter(""); // clear`,
    angular: `this.tableRef.getAPI()?.setQuickFilter("engineering");
this.tableRef.getAPI()?.setQuickFilter(""); // clear`,
    svelte: `tableRef.getAPI()?.setQuickFilter("engineering");
tableRef.getAPI()?.setQuickFilter(""); // clear`,
    vanilla: `table.setQuickFilter("engineering");
table.setQuickFilter(""); // clear`,
  };
}

export type AnimationsSnippetOptions = {
  enabled?: boolean;
  duration?: number;
  easing?: string;
};

/** Table with animations config (per framework). */
export function animationsSnippets(
  options: AnimationsSnippetOptions
): Record<Framework, string> {
  const parts: string[] = [];
  if (options.enabled !== undefined) parts.push(`enabled: ${options.enabled}`);
  if (options.duration !== undefined) parts.push(`duration: ${options.duration}`);
  if (options.easing !== undefined) parts.push(`easing: "${options.easing}"`);
  const objectBody = parts.join(", ");

  return {
    react: `<SimpleTable
  columns={columns}
  rows={rows}
  animations={{ ${objectBody} }}
/>`,
    solid: `<SimpleTable
  columns={columns}
  rows={rows()}
  animations={{ ${objectBody} }}
/>`,
    vue: `<SimpleTable
  :columns="columns"
  :rows="rows"
  :animations="{ ${objectBody} }"
/>`,
    angular: `<simple-table
  [columns]="columns"
  [rows]="rows"
  [animations]="{ ${objectBody} }"
></simple-table>`,
    svelte: `<SimpleTable
  {columns}
  {rows}
  animations={{ ${objectBody} }}
/>`,
    vanilla: `new SimpleTableVanilla(container, {
  columns,
  rows,
  animations: { ${objectBody} },
});`,
  };
}

const CELL_CLICK_HANDLER = `const handleCellClick = ({ accessor, value, row, rowIndex, colIndex }) => {
  // open a detail view, navigate, filter, etc.
  console.log(accessor, value, row.id, rowIndex, colIndex);
};`;

/** Handle cell clicks via onCellClick (per framework). */
export function onCellClickSnippets(): Record<Framework, string> {
  return {
    react: `${CELL_CLICK_HANDLER}

<SimpleTable
  columns={columns}
  rows={rows}
  onCellClick={handleCellClick}
/>`,
    solid: `${CELL_CLICK_HANDLER}

<SimpleTable
  columns={columns}
  rows={rows()}
  onCellClick={handleCellClick}
/>`,
    vue: `<script setup>
${CELL_CLICK_HANDLER}
</script>

<template>
  <SimpleTable
    :columns="columns"
    :rows="rows"
    :on-cell-click="handleCellClick"
  />
</template>`,
    angular: `${CELL_CLICK_HANDLER}

<simple-table
  [columns]="columns"
  [rows]="rows"
  (cellClick)="handleCellClick($event)"
></simple-table>`,
    svelte: `<script>
  ${CELL_CLICK_HANDLER}
</script>

<SimpleTable
  {columns}
  {rows}
  onCellClick={handleCellClick}
/>`,
    vanilla: `${CELL_CLICK_HANDLER}

new SimpleTableVanilla(container, {
  columns,
  rows,
  onCellClick: handleCellClick,
});`,
  };
}

const CELL_EDIT_HANDLER = `const handleCellEdit = ({ accessor, newValue, row }) => {
  setRows((prev) =>
    prev.map((r) => (r.id === row.id ? { ...r, [accessor]: newValue } : r))
  );
};`;

/** Persist edits via onCellEdit (per framework). */
export function onCellEditSnippets(): Record<Framework, string> {
  return {
    react: `${CELL_EDIT_HANDLER}

<SimpleTable
  columns={columns}
  rows={rows}
  onCellEdit={handleCellEdit}
/>`,
    solid: `const handleCellEdit = ({ accessor, newValue, row }) => {
  setRows((prev) =>
    prev.map((r) => (r.id === row.id ? { ...r, [accessor]: newValue } : r))
  );
};

<SimpleTable
  columns={columns}
  rows={rows()}
  onCellEdit={handleCellEdit}
/>`,
    vue: `<script setup>
${CELL_EDIT_HANDLER}
</script>

<template>
  <SimpleTable
    :columns="columns"
    :rows="rows"
    @cell-edit="handleCellEdit"
  />
</template>`,
    angular: `${CELL_EDIT_HANDLER}

<simple-table
  [columns]="columns"
  [rows]="rows"
  (cellEdit)="handleCellEdit($event)"
></simple-table>`,
    svelte: `<script>
  ${CELL_EDIT_HANDLER}
</script>

<SimpleTable
  {columns}
  {rows}
  onCellEdit={handleCellEdit}
/>`,
    vanilla: `${CELL_EDIT_HANDLER}

new SimpleTableVanilla(container, {
  columns,
  rows,
  onCellEdit: handleCellEdit,
});`,
  };
}
