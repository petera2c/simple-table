import resolve from "@rollup/plugin-node-resolve";
import alias from "@rollup/plugin-alias";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import del from "rollup-plugin-delete";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env.ROLLUP_WATCH === "true";

/**
 * In dev (watch) mode the alias plugin maps `simple-table-core` directly to
 * the core package's TypeScript source, so a single file save anywhere in
 * packages/core triggers one fast rebuild here — no waiting for core's own
 * Rollup build to finish first.
 *
 * Core's source has side-effect CSS imports (all-themes.css). In dev we don't
 * need to process or bundle CSS here — consumers should import
 * `simple-table-core/styles.css` in their app entry point — so the ignoreCss
 * plugin silently drops those imports.
 *
 * In production mode everything stays external and core is published separately.
 */

/** Drop any `.css` side-effect imports when bundling core source in dev mode. */
const ignoreCss = {
  name: "ignore-css",
  resolveId(id) {
    if (id.endsWith(".css")) return id;
  },
  load(id) {
    if (id.endsWith(".css")) return "";
  },
};

export default {
  input: "src/index.ts",

  output: isDev
    ? [
        {
          dir: "dist",
          format: "esm",
          sourcemap: true,
          entryFileNames: "index.es.js",
        },
      ]
    : [
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
        },
      ],

  // In dev, simple-table-core is resolved via the alias below (bundled from
  // source) so it must NOT appear in external.
  // In prod it stays external — consumers install it separately.
  external: isDev
    ? ["react", "react-dom", "react-dom/client"]
    : ["react", "react-dom", "react-dom/client", "simple-table-core"],

  plugins: [
    isDev &&
      alias({
        entries: [
          {
            find: "simple-table-core",
            replacement: path.resolve(__dirname, "../core/src/index.ts"),
          },
        ],
      }),

    isDev && ignoreCss,

    del({ targets: "dist/*" }),
    peerDepsExternal(),
    resolve(),

    typescript({
      exclude: ["node_modules/**"],
      clean: true,
      check: isDev,
      tsconfigOverride: {
        compilerOptions: {
          declaration: !isDev,
          declarationDir: isDev ? undefined : "dist/types",
          ...(isDev ? {} : { paths: {} }),
        },
      },
    }),

    // Skip minification in dev — watch rebuilds should be as fast as possible.
    !isDev &&
      terser({
        compress: {
          passes: 2,
          pure_getters: true,
          drop_console: false,
        },
        format: {
          comments: false,
        },
      }),
  ].filter(Boolean),
};
