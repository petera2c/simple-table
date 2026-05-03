import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    target: "es2022",
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