import resolve from "@rollup/plugin-node-resolve";
import alias from "@rollup/plugin-alias";
import babel from "@rollup/plugin-babel";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import del from "rollup-plugin-delete";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
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

  external: isDev
    ? ["solid-js", "solid-js/web"]
    : ["solid-js", "solid-js/web", "simple-table-core"],

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
      tsconfigOverride: {
        compilerOptions: {
          declaration: !isDev,
          declarationDir: isDev ? undefined : "dist/types",
          paths: {},
        },
      },
    }),

    // Babel with solid preset transforms JSX to Solid's reactive runtime calls.
    babel({
      babelHelpers: "bundled",
      presets: [["solid", { generate: "dom", hydratable: false }]],
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      exclude: "node_modules/**",
    }),

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
