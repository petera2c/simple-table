import resolve from "@rollup/plugin-node-resolve";
import postcss from "rollup-plugin-postcss";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import del from "rollup-plugin-delete";
import fs from "fs";

/** Writes dist/cjs/package.json so Node.js treats the CJS bundle as CommonJS
 *  even if the root package.json has "type": "module" in the future. */
const writeCjsPackageJson = {
  name: "write-cjs-package-json",
  writeBundle({ dir }) {
    if (dir === "dist/cjs") {
      fs.writeFileSync(`${dir}/package.json`, JSON.stringify({ type: "commonjs" }, null, 2) + "\n");
    }
  },
};

export default {
  input: "src/index.ts",
  output: [
    {
      dir: "dist/cjs",
      format: "cjs",
      sourcemap: true,
      entryFileNames: "[name].js",
      chunkFileNames: "[name]-[hash].js",
      exports: "named",
    },
    {
      dir: "dist",
      format: "esm",
      sourcemap: true,
      entryFileNames: "index.es.js",
      chunkFileNames: "[name]-[hash].js",
      preserveModules: false, // Bundle chunks together
    },
  ],
  plugins: [
    del({ targets: "dist/*" }),
    postcss({
      extract: "styles.css", // All-in-one file for backward compatibility
      inject: false,
      minimize: true,
      modules: false,
      config: false,
      extensions: [".css"],
      plugins: [
        require("postcss-import")(), // Resolve @import statements first
        require("postcss-preset-env")({
          browsers: "last 2 versions",
          stage: 3,
          features: {
            "custom-properties": {
              preserve: true,
            },
            "nesting-rules": true,
            "custom-media-queries": true,
            "media-query-ranges": true,
          },
        }),
        require("cssnano")({
          preset: [
            "default",
            {
              discardComments: { removeAll: true },
              normalizeWhitespace: true,
              colormin: true,
              minifyFontValues: true,
              minifySelectors: true,
              calc: { precision: 5 },
            },
          ],
        }),
      ],
    }),
    resolve(),
    typescript({
      include: ["*.ts", "**/*.ts"],
      exclude: ["node_modules/**"],
      rollupCommonJSResolveHack: false,
      clean: true,
      tsconfigOverride: {
        compilerOptions: {
          declaration: true,
          declarationDir: "dist",
        },
      },
    }),
    terser({
      compress: {
        passes: 2, // Run compression twice for better results
        pure_getters: true, // Assume getters have no side effects
        unsafe: true, // Enable unsafe optimizations
        unsafe_comps: true, // Optimize comparisons
        unsafe_math: true, // Optimize math operations
        drop_console: false, // Keep console logs (users may want them)
      },
      mangle: {
        properties: {
          regex: /^_private_/, // Only mangle explicitly private properties
        },
      },
      format: {
        comments: false, // Remove all comments
      },
    }),
    writeCjsPackageJson,
  ],
  external: [],
};
