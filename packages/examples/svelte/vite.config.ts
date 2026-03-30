import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [svelte()],
  server: { port: 5203 },
  resolve: {
    alias: [
      { find: "@simple-table/svelte/styles.css", replacement: path.resolve(__dirname, "../../core/src/styles/base.css") },
      { find: "@simple-table/svelte", replacement: path.resolve(__dirname, "../../svelte/src/index.ts") },
      { find: "simple-table-core", replacement: path.resolve(__dirname, "../../core/src/index.ts") },
      { find: /^@simple-table\/examples-shared\/(.*)$/, replacement: path.resolve(__dirname, "../shared/src/$1") },
      { find: "@simple-table/examples-shared", replacement: path.resolve(__dirname, "../shared/src/index.ts") },
    ],
  },
});
