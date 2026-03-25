import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Angular JIT playground — no Angular CLI or Analog plugin needed.
 *
 * The app imports '@angular/compiler' at runtime, which enables JIT
 * compilation of Angular decorators and templates in the browser.
 * Vite processes TypeScript normally via esbuild with experimentalDecorators.
 *
 * Aliases point directly to adapter source for instant Vite HMR.
 */
export default defineConfig({
  server: { port: 5177 },
  esbuild: {
    target: "es2022",
  },
  resolve: {
    alias: {
      "simple-table-angular": path.resolve(__dirname, "../angular/src/index.ts"),
      "simple-table-core": path.resolve(__dirname, "../core/src/index.ts"),
    },
  },
  optimizeDeps: {
    include: [
      "@angular/compiler",
      "@angular/core",
      "@angular/common",
      "@angular/platform-browser",
    ],
  },
});
