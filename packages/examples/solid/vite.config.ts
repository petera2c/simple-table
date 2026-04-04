import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [solid()],
  server: { port: 5204 },
  resolve: {
    alias: [
      { find: "@simple-table/solid/styles.css", replacement: path.resolve(__dirname, "../../core/src/styles/base.css") },
      { find: "@simple-table/solid", replacement: path.resolve(__dirname, "../../solid/src/index.ts") },
      { find: "simple-table-core", replacement: path.resolve(__dirname, "../../core/src/index.ts") },
    ],
  },
});
