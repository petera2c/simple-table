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
};

export function tableSnippet(framework: Framework, options: TablePropOptions = {}): string {
  const { height, maxHeight, scrollParent, autoExpandColumns } = options;

  if (framework === "vanilla") {
    const lines = ["columns", "rows"];
    if (height) lines.push(`height: "${height}"`);
    if (maxHeight) lines.push(`maxHeight: "${maxHeight}"`);
    if (scrollParent) lines.push(`scrollParent: "${scrollParent}"`);
    if (autoExpandColumns !== undefined) {
      lines.push(`autoExpandColumns: ${autoExpandColumns}`);
    }
    return `new SimpleTableVanilla(container, {
  ${lines.join(",\n  ")},
});`;
  }

  if (framework === "vue") {
    const attrs = [':columns="columns"', ':rows="rows"'];
    if (height) attrs.push(`height="${height}"`);
    if (maxHeight) attrs.push(`max-height="${maxHeight}"`);
    if (scrollParent) attrs.push(`scroll-parent="${scrollParent}"`);
    if (autoExpandColumns !== undefined) {
      attrs.push(`:auto-expand-columns="${autoExpandColumns}"`);
    }
    return `<SimpleTable\n  ${attrs.join("\n  ")}\n/>`;
  }

  if (framework === "angular") {
    const attrs = ['[columns]="columns"', '[rows]="rows"'];
    if (height) attrs.push(`height="${height}"`);
    if (maxHeight) attrs.push(`maxHeight="${maxHeight}"`);
    if (scrollParent) attrs.push(`scrollParent="${scrollParent}"`);
    if (autoExpandColumns !== undefined) {
      attrs.push(`[autoExpandColumns]="${autoExpandColumns}"`);
    }
    return `<simple-table\n  ${attrs.join("\n  ")}\n></simple-table>`;
  }

  if (framework === "svelte") {
    const attrs = ["{columns}", "{rows}"];
    if (height) attrs.push(`height="${height}"`);
    if (maxHeight) attrs.push(`maxHeight="${maxHeight}"`);
    if (scrollParent) attrs.push(`scrollParent="${scrollParent}"`);
    if (autoExpandColumns !== undefined) {
      attrs.push(`autoExpandColumns={${autoExpandColumns}}`);
    }
    return `<SimpleTable ${attrs.join(" ")} />`;
  }

  // react + solid
  const attrs = ["columns={columns}", "rows={rows}"];
  if (height) attrs.push(`height="${height}"`);
  if (maxHeight) attrs.push(`maxHeight="${maxHeight}"`);
  if (scrollParent) attrs.push(`scrollParent="${scrollParent}"`);
  if (autoExpandColumns !== undefined) {
    attrs.push(`autoExpandColumns={${autoExpandColumns}}`);
  }
  return `<SimpleTable ${attrs.join(" ")} />`;
}

export function tableSnippets(options: TablePropOptions = {}): Record<Framework, string> {
  return Object.fromEntries(
    FRAMEWORKS.map((fw) => [fw, tableSnippet(fw, options)])
  ) as Record<Framework, string>;
}
