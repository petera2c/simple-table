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
};

type BoolTableProp = "autoExpandColumns" | "columnResizing" | "columnReordering";

const BOOL_PROP_KEBAB: Record<BoolTableProp, string> = {
  autoExpandColumns: "auto-expand-columns",
  columnResizing: "column-resizing",
  columnReordering: "column-reordering",
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
}

export function tableSnippet(framework: Framework, options: TablePropOptions = {}): string {
  const { height, maxHeight, scrollParent } = options;

  if (framework === "vanilla") {
    const lines = ["columns", "rows"];
    if (height) lines.push(`height: "${height}"`);
    if (maxHeight) lines.push(`maxHeight: "${maxHeight}"`);
    if (scrollParent) lines.push(`scrollParent: "${scrollParent}"`);
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
    pushTableBoolProps(framework, attrs, options);
    return `<SimpleTable\n  ${attrs.join("\n  ")}\n/>`;
  }

  if (framework === "angular") {
    const attrs = ['[columns]="columns"', '[rows]="rows"'];
    if (height) attrs.push(`height="${height}"`);
    if (maxHeight) attrs.push(`maxHeight="${maxHeight}"`);
    if (scrollParent) attrs.push(`scrollParent="${scrollParent}"`);
    pushTableBoolProps(framework, attrs, options);
    return `<simple-table\n  ${attrs.join("\n  ")}\n></simple-table>`;
  }

  if (framework === "svelte") {
    const attrs = ["{columns}", "{rows}"];
    if (height) attrs.push(`height="${height}"`);
    if (maxHeight) attrs.push(`maxHeight="${maxHeight}"`);
    if (scrollParent) attrs.push(`scrollParent="${scrollParent}"`);
    pushTableBoolProps(framework, attrs, options);
    return `<SimpleTable ${attrs.join(" ")} />`;
  }

  // react + solid
  const attrs = ["columns={columns}", "rows={rows}"];
  if (height) attrs.push(`height="${height}"`);
  if (maxHeight) attrs.push(`maxHeight="${maxHeight}"`);
  if (scrollParent) attrs.push(`scrollParent="${scrollParent}"`);
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
