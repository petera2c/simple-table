import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [solid()],
  server: { port: 5175 },
  resolve: {
    alias: {
      "simple-table-solid": path.resolve(__dirname, "../solid/src/index.ts"),
      "simple-table-core": path.resolve(__dirname, "../core/src/index.ts"),
    },
  },
});
