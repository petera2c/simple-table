import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [vue()],
  server: { port: 5174 },
  resolve: {
    alias: {
      "simple-table-vue": path.resolve(__dirname, "../vue/src/index.ts"),
      "simple-table-core": path.resolve(__dirname, "../core/src/index.ts"),
    },
  },
});
