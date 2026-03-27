import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  server: { port: 5200 },
  resolve: {
    alias: [
      { find: "@simple-table/react", replacement: path.resolve(__dirname, "../../react/src/index.ts") },
      { find: "simple-table-core/styles.css", replacement: path.resolve(__dirname, "../../core/src/styles/base.css") },
      { find: "simple-table-core", replacement: path.resolve(__dirname, "../../core/src/index.ts") },
      { find: "@simple-table/examples-shared", replacement: path.resolve(__dirname, "../shared/src/index.ts") },
    ],
  },
});
