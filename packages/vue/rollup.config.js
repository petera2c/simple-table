import resolve from "@rollup/plugin-node-resolve";
import alias from "@rollup/plugin-alias";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import del from "rollup-plugin-delete";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env.ROLLUP_WATCH === "true";

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

  external: isDev ? ["vue"] : ["vue", "simple-table-core"],

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
      useTsconfigDeclarationDir: !isDev,
      tsconfigOverride: {
        compilerOptions: {
          declaration: !isDev,
          declarationDir: isDev ? undefined : "dist/types",
          paths: {},
        },
      },
    }),

    !isDev && {
      name: "copy-core-styles",
      writeBundle() {
        const src = path.resolve(__dirname, "../core/dist/styles.css");
        const dest = path.resolve(__dirname, "dist/styles.css");
        if (fs.existsSync(src)) fs.copyFileSync(src, dest);
      },
    },

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
