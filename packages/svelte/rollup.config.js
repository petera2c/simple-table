import resolve from "@rollup/plugin-node-resolve";
import alias from "@rollup/plugin-alias";
import svelte from "rollup-plugin-svelte";
import sveltePreprocess from "svelte-preprocess";
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

  onwarn(warning, warn) {
    if (isDev) {
      if (warning.code === "SOURCEMAP_ERROR") return;
      if (warning.code === "NON_EXISTENT_EXPORT") return;
      if (warning.code === "CIRCULAR_DEPENDENCY") return;
    }
    warn(warning);
  },

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
    ? ["svelte", "svelte/internal"]
    : ["svelte", "svelte/internal", "simple-table-core"],

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

    // Process .svelte files with TypeScript support via svelte-preprocess.
    // Point svelte-preprocess to tsconfig.build.json so it uses the correct
    // target and verbatimModuleSyntax settings, and resolves simple-table-core
    // from the built dist rather than core source.
    svelte({
      preprocess: sveltePreprocess({
        typescript: { tsconfigFile: "./tsconfig.build.json" },
      }),
      compilerOptions: {
        dev: isDev,
      },
      emitCss: false,
    }),

    resolve({ browser: true, dedupe: ["svelte"] }),

    typescript({
      tsconfig: "tsconfig.build.json",
      exclude: ["node_modules/**", "**/*.svelte"],
      clean: true,
      check: isDev,
      verbosity: isDev ? 3 : 0,
      tsconfigOverride: {
        compilerOptions: {
          declaration: !isDev,
          declarationDir: isDev ? undefined : "dist/types",
          ...(isDev
            ? {
                paths: { "simple-table-core": ["../core/src/index.ts"] },
                verbatimModuleSyntax: false,
              }
            : {}),
        },
      },
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
