import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const REPO_OWNER = "petera2c";
const REPO_NAME = "simple-table";
const BRANCH = "stackblitz-examples";
const BASE_STACKBLITZ_URL = `https://stackblitz.com/github/${REPO_OWNER}/${REPO_NAME}/tree/${BRANCH}`;

const FRAMEWORKS = ["react", "vue", "angular", "svelte", "solid", "vanilla"];

const DEMO_LIST = [
  { id: "quick-start", label: "Quick Start" },
  { id: "column-filtering", label: "Column Filtering" },
  { id: "column-sorting", label: "Column Sorting" },
  { id: "value-formatter", label: "Value Formatter" },
  { id: "pagination", label: "Pagination" },
  { id: "column-pinning", label: "Column Pinning" },
  { id: "column-alignment", label: "Column Alignment" },
  { id: "column-width", label: "Column Width" },
  { id: "column-resizing", label: "Column Resizing" },
  { id: "column-reordering", label: "Column Reordering" },
  { id: "column-selection", label: "Column Selection" },
  { id: "column-editing", label: "Column Editing" },
  { id: "cell-editing", label: "Cell Editing" },
  { id: "cell-highlighting", label: "Cell Highlighting" },
  { id: "themes", label: "Themes" },
  { id: "row-height", label: "Row Height" },
  { id: "table-height", label: "Table Height" },
  { id: "quick-filter", label: "Quick Filter" },
  { id: "nested-headers", label: "Nested Headers" },
  { id: "external-sort", label: "External Sort" },
  { id: "external-filter", label: "External Filter" },
  { id: "loading-state", label: "Loading State" },
  { id: "infinite-scroll", label: "Infinite Scroll" },
  { id: "row-selection", label: "Row Selection" },
  { id: "csv-export", label: "CSV Export" },
  { id: "programmatic-control", label: "Programmatic Control" },
  { id: "row-grouping", label: "Row Grouping" },
  { id: "aggregate-functions", label: "Aggregate Functions" },
  { id: "collapsible-columns", label: "Collapsible Columns" },
  { id: "cell-renderer", label: "Cell Renderer" },
  { id: "header-renderer", label: "Header Renderer" },
  { id: "footer-renderer", label: "Footer Renderer" },
  { id: "cell-clicking", label: "Cell Clicking" },
  { id: "tooltip", label: "Tooltip" },
  { id: "custom-theme", label: "Custom Theme" },
  { id: "custom-icons", label: "Custom Icons" },
  { id: "empty-state", label: "Empty State" },
  { id: "column-visibility", label: "Column Visibility" },
  { id: "column-editor-custom-renderer", label: "Column Editor Custom Renderer" },
  { id: "single-row-children", label: "Single Row Children" },
  { id: "nested-tables", label: "Nested Tables" },
  { id: "dynamic-nested-tables", label: "Dynamic Nested Tables" },
  { id: "dynamic-row-loading", label: "Dynamic Row Loading" },
  { id: "charts", label: "Charts" },
  { id: "live-update", label: "Live Update" },
  { id: "crm", label: "CRM" },
  { id: "infrastructure", label: "Infrastructure" },
  { id: "music", label: "Music" },
  { id: "billing", label: "Billing" },
  { id: "manufacturing", label: "Manufacturing" },
  { id: "hr", label: "HR" },
  { id: "sales", label: "Sales" },
];

const ACRONYM_MAP = { crm: "CRM", hr: "HR" };

function kebabToPascal(kebab) {
  return kebab
    .split("-")
    .map((w) => ACRONYM_MAP[w] || w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

function readVersion(pkgDir) {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, pkgDir, "package.json"), "utf-8"));
  return pkg.version;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const result = { demos: null, output: path.join(ROOT, "stackblitz-examples") };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--demos" && args[i + 1]) {
      result.demos = args[++i].split(",").map((d) => d.trim());
    } else if (args[i] === "--output" && args[i + 1]) {
      result.output = path.resolve(args[++i]);
    }
  }

  return result;
}

function generateIndexHtml(framework, demoLabel) {
  const titleMap = {
    react: "React",
    vue: "Vue",
    angular: "Angular",
    svelte: "Svelte",
    solid: "Solid",
    vanilla: "Vanilla TS",
  };
  const rootEl = framework === "angular" ? "<app-root></app-root>" : `<div id="${framework === "vue" || framework === "svelte" ? "app" : "root"}"></div>`;
  const mainExt = framework === "react" || framework === "solid" ? "tsx" : "ts";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${demoLabel} - Simple Table ${titleMap[framework]}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      #root {
        padding: 24px;
      }
      app-root {
        display: block;
        padding: 24px;
      }
    </style>
  </head>
  <body>
    ${rootEl}
    <script type="module" src="/src/main.${mainExt}"></script>
  </body>
</html>`;
}

function generatePackageJson(framework, demoId, versions) {
  const base = {
    private: true,
    type: "module",
    scripts: { dev: "vite", build: "vite build", preview: "vite preview" },
  };

  const configs = {
    react: {
      dependencies: {
        react: "^18.0.0",
        "react-dom": "^18.0.0",
        "simple-table-core": versions.core,
        "@simple-table/react": versions.react,
      },
      devDependencies: {
        "@types/react": "^18.0.0",
        "@types/react-dom": "^18.0.0",
        "@vitejs/plugin-react": "^4.0.0",
        typescript: "^5.0.0",
        vite: "^5.0.0",
      },
    },
    vue: {
      dependencies: {
        vue: "^3.0.0",
        "simple-table-core": versions.core,
        "@simple-table/vue": versions.vue,
      },
      devDependencies: {
        "@vitejs/plugin-vue": "^5.0.0",
        typescript: "^5.0.0",
        vite: "^5.0.0",
      },
    },
    angular: {
      dependencies: {
        "@angular/common": "^19.0.0",
        "@angular/compiler": "^19.0.0",
        "@angular/core": "^19.0.0",
        "@angular/forms": "^19.0.0",
        "@angular/platform-browser": "^19.0.0",
        rxjs: "^7.0.0",
        "zone.js": "^0.15.0",
        "simple-table-core": versions.core,
        "@simple-table/angular": versions.angular,
      },
      devDependencies: {
        typescript: "^5.5.0",
        vite: "^5.0.0",
      },
    },
    svelte: {
      dependencies: {
        svelte: "^5.0.0",
        "simple-table-core": versions.core,
        "@simple-table/svelte": versions.svelte,
      },
      devDependencies: {
        "@sveltejs/vite-plugin-svelte": "^4.0.0",
        typescript: "^5.0.0",
        vite: "^5.0.0",
      },
    },
    solid: {
      dependencies: {
        "solid-js": "^1.0.0",
        "simple-table-core": versions.core,
        "@simple-table/solid": versions.solid,
      },
      devDependencies: {
        typescript: "^5.0.0",
        vite: "^5.0.0",
        "vite-plugin-solid": "^2.0.0",
      },
    },
    vanilla: {
      dependencies: {
        "simple-table-core": versions.core,
      },
      devDependencies: {
        typescript: "^5.0.0",
        vite: "^5.0.0",
      },
    },
  };

  return JSON.stringify({ name: `simple-table-${framework}-${demoId}`, ...base, ...configs[framework] }, null, 2);
}

function generateViteConfig(framework) {
  const configs = {
    react: `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});`,
    vue: `import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
});`,
    angular: `import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    target: "es2022",
  },
  optimizeDeps: {
    include: [
      "@angular/compiler",
      "@angular/core",
      "@angular/common",
      "@angular/platform-browser",
    ],
  },
});`,
    svelte: `import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
});`,
    solid: `import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
});`,
    vanilla: `import { defineConfig } from "vite";

export default defineConfig({});`,
  };

  return configs[framework];
}

function generateTsconfig(framework) {
  const configs = {
    react: {
      compilerOptions: {
        target: "ES2020",
        useDefineForClassFields: true,
        lib: ["ES2020", "DOM", "DOM.Iterable"],
        module: "ESNext",
        skipLibCheck: true,
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        isolatedModules: true,
        noEmit: true,
        jsx: "react-jsx",
        strict: true,
        noUnusedLocals: false,
        noUnusedParameters: false,
      },
      include: ["src"],
    },
    vue: {
      compilerOptions: {
        target: "ES2020",
        useDefineForClassFields: true,
        module: "ESNext",
        lib: ["ES2020", "DOM", "DOM.Iterable"],
        skipLibCheck: true,
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        isolatedModules: true,
        noEmit: true,
        jsx: "preserve",
        strict: true,
        noUnusedLocals: false,
        noUnusedParameters: false,
      },
      include: ["src/**/*.ts", "src/**/*.vue"],
    },
    angular: {
      compilerOptions: {
        target: "ES2022",
        useDefineForClassFields: false,
        module: "ESNext",
        lib: ["ES2022", "DOM", "DOM.Iterable"],
        skipLibCheck: true,
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        isolatedModules: true,
        noEmit: true,
        strict: true,
        noUnusedLocals: false,
        noUnusedParameters: false,
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
      },
      include: ["src"],
    },
    svelte: {
      compilerOptions: {
        target: "ES2020",
        useDefineForClassFields: true,
        module: "ESNext",
        lib: ["ES2020", "DOM", "DOM.Iterable"],
        skipLibCheck: true,
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        isolatedModules: true,
        noEmit: true,
        strict: true,
        noUnusedLocals: false,
        noUnusedParameters: false,
      },
      include: ["src/**/*.ts", "src/**/*.svelte"],
    },
    solid: {
      compilerOptions: {
        target: "ES2020",
        useDefineForClassFields: true,
        module: "ESNext",
        lib: ["ES2020", "DOM", "DOM.Iterable"],
        skipLibCheck: true,
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        isolatedModules: true,
        noEmit: true,
        jsx: "preserve",
        jsxImportSource: "solid-js",
        strict: true,
        noUnusedLocals: false,
        noUnusedParameters: false,
      },
      include: ["src"],
    },
    vanilla: {
      compilerOptions: {
        target: "ES2020",
        useDefineForClassFields: true,
        module: "ESNext",
        lib: ["ES2020", "DOM", "DOM.Iterable"],
        skipLibCheck: true,
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        isolatedModules: true,
        noEmit: true,
        strict: true,
        noUnusedLocals: false,
        noUnusedParameters: false,
      },
      include: ["src"],
    },
  };

  return JSON.stringify(configs[framework], null, 2);
}

function generateEntryPoint(framework, demoId) {
  const pascal = kebabToPascal(demoId);

  const entryPoints = {
    react: `import React from "react";
import ReactDOM from "react-dom/client";
import Demo from "./demos/${demoId}/${pascal}Demo";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Demo />
  </React.StrictMode>,
);`,

    vue: { main: `import { createApp } from "vue";
import App from "./App.vue";

const el = document.getElementById("app")!;
el.style.padding = "24px";
createApp(App).mount(el);`,
      app: `<template>
  <Demo />
</template>

<script setup lang="ts">
import Demo from "./demos/${demoId}/${pascal}Demo.vue";
</script>` },

    angular: `import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { ${pascal}DemoComponent } from "./demos/${demoId}/${demoId}-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [${pascal}DemoComponent],
  template: \`<${demoId}-demo></${demoId}-demo>\`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);`,

    svelte: `import { mount } from "svelte";
import Demo from "./demos/${demoId}/${pascal}Demo.svelte";

const el = document.getElementById("app")!;
el.style.padding = "24px";
mount(Demo, {
  target: el,
});`,

    solid: `import { render } from "solid-js/web";
import Demo from "./demos/${demoId}/${pascal}Demo";

render(
  () => <Demo />,
  document.getElementById("root")!,
);`,

    vanilla: `import { render${pascal}Demo } from "./demos/${demoId}/${pascal}Demo";

const container = document.getElementById("root")!;
const instance = render${pascal}Demo(container, {});
if (instance?.mount) instance.mount();`,
  };

  return entryPoints[framework];
}

function generateStackblitzRc() {
  return JSON.stringify({ startCommand: "npm run dev", installDependencies: true }, null, 2);
}

function generateProject(outputDir, framework, demoId, demoLabel, versions) {
  const projectDir = path.join(outputDir, framework, demoId);

  fs.mkdirSync(path.join(projectDir, "src"), { recursive: true });

  fs.writeFileSync(path.join(projectDir, "index.html"), generateIndexHtml(framework, demoLabel));
  fs.writeFileSync(path.join(projectDir, "package.json"), generatePackageJson(framework, demoId, versions));
  fs.writeFileSync(path.join(projectDir, "vite.config.ts"), generateViteConfig(framework));
  fs.writeFileSync(path.join(projectDir, "tsconfig.json"), generateTsconfig(framework));
  fs.writeFileSync(path.join(projectDir, ".stackblitzrc"), generateStackblitzRc());

  const entryPoint = generateEntryPoint(framework, demoId);
  if (framework === "vue") {
    fs.writeFileSync(path.join(projectDir, "src", "main.ts"), entryPoint.main);
    fs.writeFileSync(path.join(projectDir, "src", "App.vue"), entryPoint.app);
  } else {
    const ext = framework === "react" || framework === "solid" ? "tsx" : "ts";
    fs.writeFileSync(path.join(projectDir, "src", `main.${ext}`), entryPoint);
  }

  const demoSrcDir = path.join(ROOT, "packages", "examples", framework, "src", "demos", demoId);
  const demoDstDir = path.join(projectDir, "src", "demos", demoId);
  if (fs.existsSync(demoSrcDir)) {
    fs.cpSync(demoSrcDir, demoDstDir, { recursive: true });
  } else {
    console.warn(`  Warning: demo source not found: ${demoSrcDir}`);
  }

}

function generateManifest(outputDir, demos, versions) {
  const manifest = {
    baseUrl: BASE_STACKBLITZ_URL,
    version: versions.core,
    generatedAt: new Date().toISOString(),
    demos: {},
  };

  for (const demo of demos) {
    manifest.demos[demo.id] = {
      label: demo.label,
      frameworks: {},
    };
    for (const fw of FRAMEWORKS) {
      manifest.demos[demo.id].frameworks[fw] = `${BASE_STACKBLITZ_URL}/${fw}/${demo.id}`;
    }
  }

  fs.writeFileSync(path.join(outputDir, "manifest.json"), JSON.stringify(manifest, null, 2));
}

function main() {
  const args = parseArgs();
  const outputDir = args.output;

  const versions = {
    core: readVersion("packages/core"),
    react: readVersion("packages/react"),
    vue: readVersion("packages/vue"),
    angular: readVersion("packages/angular"),
    svelte: readVersion("packages/svelte"),
    solid: readVersion("packages/solid"),
  };

  const demos = args.demos
    ? DEMO_LIST.filter((d) => args.demos.includes(d.id))
    : DEMO_LIST;

  if (demos.length === 0) {
    console.error("No matching demos found for:", args.demos);
    process.exit(1);
  }

  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true });
  }
  fs.mkdirSync(outputDir, { recursive: true });

  console.log(`Generating StackBlitz projects...`);
  console.log(`  Versions: core=${versions.core}, adapters=${versions.react}`);
  console.log(`  Demos: ${demos.length} (${demos.map((d) => d.id).join(", ")})`);
  console.log(`  Frameworks: ${FRAMEWORKS.join(", ")}`);
  console.log(`  Output: ${outputDir}`);
  console.log();

  let count = 0;
  for (const framework of FRAMEWORKS) {
    for (const demo of demos) {
      process.stdout.write(`  ${framework}/${demo.id}...`);
      generateProject(outputDir, framework, demo.id, demo.label, versions);
      count++;
      console.log(" done");
    }
  }

  generateManifest(outputDir, demos, versions);

  console.log();
  console.log(`Generated ${count} StackBlitz projects + manifest.json`);
  console.log(`\nStackBlitz URL pattern:`);
  console.log(`  ${BASE_STACKBLITZ_URL}/{framework}/{demo-id}`);
}

main();
