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
  react: `import { SimpleTable } from "@simple-table/react";
import "@simple-table/react/styles.css";`,
  vue: `import { SimpleTable } from "@simple-table/vue";
import "@simple-table/vue/styles.css";`,
  angular: `import { SimpleTableComponent } from "@simple-table/angular";
import "@simple-table/angular/styles.css";`,
  svelte: `import { SimpleTable } from "@simple-table/svelte";
import "@simple-table/svelte/styles.css";`,
  solid: `import { SimpleTable } from "@simple-table/solid";
import "@simple-table/solid/styles.css";`,
  vanilla: `import { SimpleTableVanilla } from "simple-table-core";
import "simple-table-core/styles.css";`,
};

export const COLUMNS_SNIPPET = `const columns = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: "1fr", type: "string" },
  { accessor: "age", label: "Age", width: 80, type: "number" },
];`;

export const ROWS_SNIPPET = `const rows = [
  { id: 1, name: "John Doe", age: 30 },
  { id: 2, name: "Jane Smith", age: 25 },
];`;

export type TablePropOptions = {
  height?: string;
  maxHeight?: string;
  scrollParent?: string;
  autoExpandColumns?: boolean;
  columnResizing?: boolean;
  columnReordering?: boolean;
  enableColumnEditor?: boolean;
  enableColumnEditorInitOpen?: boolean;
  externalSortHandling?: boolean;
  initialSortColumn?: string;
  initialSortDirection?: "asc" | "desc";
};

type BoolTableProp =
  | "autoExpandColumns"
  | "columnResizing"
  | "columnReordering"
  | "enableColumnEditor"
  | "enableColumnEditorInitOpen"
  | "externalSortHandling";

const BOOL_PROP_KEBAB: Record<BoolTableProp, string> = {
  autoExpandColumns: "auto-expand-columns",
  columnResizing: "column-resizing",
  columnReordering: "column-reordering",
  enableColumnEditor: "enable-column-editor",
  enableColumnEditorInitOpen: "enable-column-editor-init-open",
  externalSortHandling: "external-sort-handling",
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

export function tableSnippet(framework: Framework, options: TablePropOptions = {}): string {
  const { height, maxHeight, scrollParent } = options;

  if (framework === "vanilla") {
    const lines = ["columns", "rows"];
    if (height) lines.push(`height: "${height}"`);
    if (maxHeight) lines.push(`maxHeight: "${maxHeight}"`);
    if (scrollParent) lines.push(`scrollParent: "${scrollParent}"`);
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
    pushSortProps(framework, attrs, options);
    pushTableBoolProps(framework, attrs, options);
    return `<SimpleTable\n  ${attrs.join("\n  ")}\n/>`;
  }

  if (framework === "angular") {
    const attrs = ['[columns]="columns"', '[rows]="rows"'];
    if (height) attrs.push(`height="${height}"`);
    if (maxHeight) attrs.push(`maxHeight="${maxHeight}"`);
    if (scrollParent) attrs.push(`scrollParent="${scrollParent}"`);
    pushSortProps(framework, attrs, options);
    pushTableBoolProps(framework, attrs, options);
    return `<simple-table\n  ${attrs.join("\n  ")}\n></simple-table>`;
  }

  if (framework === "svelte") {
    const attrs = ["{columns}", "{rows}"];
    if (height) attrs.push(`height="${height}"`);
    if (maxHeight) attrs.push(`maxHeight="${maxHeight}"`);
    if (scrollParent) attrs.push(`scrollParent="${scrollParent}"`);
    pushSortProps(framework, attrs, options);
    pushTableBoolProps(framework, attrs, options);
    return `<SimpleTable ${attrs.join(" ")} />`;
  }

  // react + solid
  const attrs = ["columns={columns}", "rows={rows}"];
  if (height) attrs.push(`height="${height}"`);
  if (maxHeight) attrs.push(`maxHeight="${maxHeight}"`);
  if (scrollParent) attrs.push(`scrollParent="${scrollParent}"`);
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
  [onColumnWidthChange]="handleColumnWidthChange"
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
  [onSortChange]="handleSortChange"
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
  [onFilterChange]="handleFilterChange"
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
  [onColumnSelect]="handleColumnSelect"
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
    if (includeOnChange) lines.push('[onRowSelectionChange]="handleRowSelectionChange"');
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
    angular: `this.tableRef.selectRow("1", true);
this.tableRef.toggleRowSelection("2");
const selected = this.tableRef.getSelectedRowsData();
this.tableRef.clearRowSelection();`,
    svelte: `tableRef.selectRow("1", true);
tableRef.toggleRowSelection("2");
const selected = tableRef.getSelectedRowsData();
tableRef.clearRowSelection();`,
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
  [onRowGroupExpand]="handleRowGroupExpand"
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
    angular: `this.tableRef.expandAll();
this.tableRef.collapseAll();
this.tableRef.expandDepth(0);
this.tableRef.setExpandedDepths(new Set([0, 1]));
this.tableRef.toggleDepth(0);`,
    svelte: `tableRef.expandAll();
tableRef.collapseAll();
tableRef.expandDepth(0);
tableRef.setExpandedDepths(new Set([0, 1]));
tableRef.toggleDepth(0);`,
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
    vue: `<SimpleTable
  :columns="headers"
  :rows="flatRows"
  :pivot="pivotConfig"
/>`,
    angular: `<simple-table
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
    angular: `this.tableRef.setPivot({
  rows: ["region"],
  columns: ["quarter"],
  values: [{ accessor: "sales", aggregation: { type: "sum" } }],
});
const active = this.tableRef.getPivot();
this.tableRef.setPivot(null); // back to source grid`,
    svelte: `tableRef.setPivot({
  rows: ["region"],
  columns: ["quarter"],
  values: [{ accessor: "sales", aggregation: { type: "sum" } }],
});
const active = tableRef.getPivot();
tableRef.setPivot(null); // back to source grid`,
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
const pinned = this.tableRef.getPinnedState();

// Restore
await this.tableRef.applyPinnedState(pinned);`,
    svelte: `// Save
const pinned = tableRef.getPinnedState();

// Restore
await tableRef.applyPinnedState(pinned);`,
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
