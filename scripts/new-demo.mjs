#!/usr/bin/env node

/**
 * Scaffolding script for creating a new demo across all 6 framework example apps.
 *
 * Usage: pnpm new-demo <demo-name>
 * Example: pnpm new-demo pagination
 *
 * This will create (per framework) the same self-contained demo data module and a stub demo file:
 *   packages/examples/<fw>/src/demos/<demo-name>/<demo-name>.demo-data.ts
 *   packages/examples/react/src/demos/<demo-name>/<PascalName>Demo.tsx
 *   ... (vue, svelte, solid, angular, vanilla)
 *
 * It also prints instructions for updating demo-list.ts in each app and registries.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const EXAMPLES = path.join(ROOT, "packages", "examples");

const demoName = process.argv[2];
if (!demoName) {
  console.error("Usage: pnpm new-demo <demo-name>");
  console.error("Example: pnpm new-demo pagination");
  process.exit(1);
}

function toPascalCase(str) {
  return str
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

const pascal = toPascalCase(demoName);
const camel = toCamelCase(demoName);

function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  if (fs.existsSync(filePath)) {
    console.log(`  SKIP (exists): ${path.relative(ROOT, filePath)}`);
    return;
  }
  fs.writeFileSync(filePath, content);
  console.log(`  CREATE: ${path.relative(ROOT, filePath)}`);
}

// --- Per-demo data (duplicated in each framework package) ---
const demoDataTs = `// Self-contained demo table setup for this example.
import type { HeaderObject } from "simple-table-core";
import type { Row } from "simple-table-core";

export const ${camel}Data: Row[] = [
  // TODO: Add sample data
  { id: 1 },
];

export const ${camel}Headers: HeaderObject[] = [
  // TODO: Add column definitions
  { accessor: "id", label: "ID", width: 80 },
];

export const ${camel}Config = {
  headers: ${camel}Headers,
  rows: ${camel}Data,
} as const;
`;

// --- React ---
const reactDemo = `import { SimpleTable, defaultHeadersFromCore } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import { ${camel}Config } from "./${demoName}.demo-data";
import "@simple-table/react/styles.css";

const ${pascal}Demo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable
      defaultHeaders={defaultHeadersFromCore(${camel}Config.headers)}
      rows={${camel}Config.rows}
      height={height}
      theme={theme}
    />
  );
};

export default ${pascal}Demo;
`;

// --- Vue ---
const vueDemo = `<template>
  <SimpleTable
    :default-headers="defaultHeadersFromCore(${camel}Config.headers)"
    :rows="${camel}Config.rows"
    :height="height"
    :theme="theme"
  />
</template>

<script setup lang="ts">
import { SimpleTable, defaultHeadersFromCore } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { ${camel}Config } from "./${demoName}.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});
</script>
`;

// --- Svelte ---
const svelteDemo = `<script lang="ts">
  import { SimpleTable, defaultHeadersFromCore } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { ${camel}Config } from "./${demoName}.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
</script>

<SimpleTable
  defaultHeaders={defaultHeadersFromCore(${camel}Config.headers)}
  rows={${camel}Config.rows}
  {height}
  {theme}
/>
`;

// --- Solid ---
const solidDemo = `import { SimpleTable, defaultHeadersFromCore } from "@simple-table/solid";
import type { Theme } from "@simple-table/solid";
import { ${camel}Config } from "./${demoName}.demo-data";
import "@simple-table/solid/styles.css";

export default function ${pascal}Demo(props: {
  height?: string | number;
  theme?: Theme;
}) {
  return (
    <SimpleTable
      defaultHeaders={defaultHeadersFromCore(${camel}Config.headers)}
      rows={${camel}Config.rows}
      height={props.height ?? "400px"}
      theme={props.theme}
    />
  );
}
`;

// --- Angular ---
const angularDemo = `import { Component, Input } from "@angular/core";
import { SimpleTableComponent, defaultHeadersFromCore } from "@simple-table/angular";
import type { AngularHeaderObject, Row, Theme } from "@simple-table/angular";
import { ${camel}Config } from "./${demoName}.demo-data";
import "@simple-table/angular/styles.css";

@Component({
  selector: "${demoName}-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: \`
    <simple-table
      [rows]="rows"
      [defaultHeaders]="headers"
      [height]="height"
      [theme]="theme"
    ></simple-table>
  \`,
})
export class ${pascal}DemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = ${camel}Config.rows;
  readonly headers: AngularHeaderObject[] = defaultHeadersFromCore(${camel}Config.headers);
}
`;

// --- Vanilla ---
const vanillaDemo = `import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { ${camel}Config } from "./${demoName}.demo-data";
import "simple-table-core/styles.css";

export function render${pascal}Demo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const table = new SimpleTableVanilla(container, {
    defaultHeaders: ${camel}Config.headers,
    rows: ${camel}Config.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
  });
  return table;
}
`;

console.log(`\nScaffolding demo: ${demoName} (${pascal}Demo)\n`);

const frameworks = ["react", "vue", "svelte", "solid", "angular", "vanilla"];
for (const fw of frameworks) {
  writeFile(path.join(EXAMPLES, fw, "src/demos", demoName, `${demoName}.demo-data.ts`), demoDataTs);
}

writeFile(path.join(EXAMPLES, `react/src/demos/${demoName}/${pascal}Demo.tsx`), reactDemo);
writeFile(path.join(EXAMPLES, `vue/src/demos/${demoName}/${pascal}Demo.vue`), vueDemo);
writeFile(path.join(EXAMPLES, `svelte/src/demos/${demoName}/${pascal}Demo.svelte`), svelteDemo);
writeFile(path.join(EXAMPLES, `solid/src/demos/${demoName}/${pascal}Demo.tsx`), solidDemo);
writeFile(path.join(EXAMPLES, `angular/src/demos/${demoName}/${demoName}-demo.component.ts`), angularDemo);
writeFile(path.join(EXAMPLES, `vanilla/src/demos/${demoName}/${pascal}Demo.ts`), vanillaDemo);

console.log(`
Next steps:
  1. Flesh out ${demoName}.demo-data.ts in each framework (or copy edits across all six).
  2. Add to src/demo-list.ts in EACH example app (packages/examples/*/src/demo-list.ts):
       { id: "${demoName}", label: "${pascal}" },
  3. Register in each framework's entry/registry:
       React:   registry["${demoName}"] = () => import("./demos/${demoName}/${pascal}Demo");
       Vue:     registry["${demoName}"] = () => import("./demos/${demoName}/${pascal}Demo.vue");
       Svelte:  registry["${demoName}"] = () => import("./demos/${demoName}/${pascal}Demo.svelte");
       Solid:   registry["${demoName}"] = lazy(() => import("./demos/${demoName}/${pascal}Demo"));
       Angular: import { ${pascal}DemoComponent } from "./demos/${demoName}/${demoName}-demo.component";
                REGISTRY["${demoName}"] = ${pascal}DemoComponent;
       Vanilla: registry["${demoName}"] = () => import("./demos/${demoName}/${pascal}Demo").then(m => ({ render: m.render${pascal}Demo }));
`);
