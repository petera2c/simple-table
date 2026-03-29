import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [vue()],
  server: { port: 5201 },
  resolve: {
    alias: [
      { find: "@simple-table/vue", replacement: path.resolve(__dirname, "../../vue/src/index.ts") },
      { find: "simple-table-core/styles.css", replacement: path.resolve(__dirname, "../../core/src/styles/base.css") },
      { find: "simple-table-core", replacement: path.resolve(__dirname, "../../core/src/index.ts") },
      { find: /^@simple-table\/examples-shared\/(.*)$/, replacement: path.resolve(__dirname, "../shared/src/$1") },
      { find: "@simple-table/examples-shared", replacement: path.resolve(__dirname, "../shared/src/index.ts") },
    ],
  },
});
