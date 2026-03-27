import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  server: { port: 5205 },
  resolve: {
    alias: [
      { find: "simple-table-core/styles.css", replacement: path.resolve(__dirname, "../../core/src/styles/base.css") },
      { find: "simple-table-core", replacement: path.resolve(__dirname, "../../core/src/index.ts") },
      { find: "@simple-table/examples-shared", replacement: path.resolve(__dirname, "../shared/src/index.ts") },
    ],
  },
});
