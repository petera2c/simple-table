import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [svelte()],
  server: { port: 5176 },
  resolve: {
    alias: {
      "simple-table-svelte": path.resolve(__dirname, "../svelte/src/index.ts"),
      "simple-table-core": path.resolve(__dirname, "../core/src/index.ts"),
    },
  },
});
