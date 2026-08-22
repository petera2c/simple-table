import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const reactDir = path.resolve(__dirname, "node_modules/react");
const reactDomDir = path.resolve(__dirname, "node_modules/react-dom");

export default defineConfig({
  plugins: [react()],
  server: { port: 5200 },
  resolve: {
    // Resolve React from this app so the table package and the example share one copy.
    dedupe: ["react", "react-dom"],
    alias: [
      { find: /^react$/, replacement: reactDir },
      { find: /^react\/jsx-runtime$/, replacement: path.join(reactDir, "jsx-runtime.js") },
      { find: /^react\/jsx-dev-runtime$/, replacement: path.join(reactDir, "jsx-dev-runtime.js") },
      { find: /^react-dom$/, replacement: reactDomDir },
      { find: /^react-dom\/client$/, replacement: path.join(reactDomDir, "client.js") },
      { find: "@simple-table/react/styles.css", replacement: path.resolve(__dirname, "../../core/src/styles/base.css") },
      { find: "@simple-table/react", replacement: path.resolve(__dirname, "../../react/src/index.ts") },
      { find: "simple-table-core", replacement: path.resolve(__dirname, "../../core/src/index.ts") },
    ],
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
});
