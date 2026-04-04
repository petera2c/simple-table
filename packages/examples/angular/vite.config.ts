import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  server: { port: 5202 },
  esbuild: {
    target: "es2022",
  },
  resolve: {
    alias: [
      { find: "@simple-table/angular/styles.css", replacement: path.resolve(__dirname, "../../core/src/styles/base.css") },
      { find: "@simple-table/angular", replacement: path.resolve(__dirname, "../../angular/src/index.ts") },
      { find: "simple-table-core", replacement: path.resolve(__dirname, "../../core/src/index.ts") },
    ],
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
