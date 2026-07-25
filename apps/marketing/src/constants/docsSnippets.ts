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
};

type BoolTableProp =
  | "autoExpandColumns"
  | "columnResizing"
  | "columnReordering"
  | "enableColumnEditor"
  | "enableColumnEditorInitOpen";

const BOOL_PROP_KEBAB: Record<BoolTableProp, string> = {
  autoExpandColumns: "auto-expand-columns",
  columnResizing: "column-resizing",
  columnReordering: "column-reordering",
  enableColumnEditor: "enable-column-editor",
  enableColumnEditorInitOpen: "enable-column-editor-init-open",
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
