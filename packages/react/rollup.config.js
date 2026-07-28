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

/**
 * In dev (watch) mode the alias plugin maps `simple-table-core` directly to
 * the core package's TypeScript source, so a single file save anywhere in
 * packages/core triggers one fast rebuild here — no waiting for core's own
 * Rollup build to finish first.
 *
 * Core's source has side-effect CSS imports (all-themes.css). In dev we don't
 * process or bundle CSS here — `copy-core-styles` copies `core/dist/styles.css`
 * into this package's dist (and watches that file so a core watch rebuild
 * re-copies for Next HMR). Run core's `preview` alongside this watch
 * (`pnpm run dev:marketing:watch`) so CSS edits regenerate core's styles.css.
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

    // In watch mode, do not delete dist/ on every rebuild — Next reads those files
    // and would briefly see an empty package. Production keeps a clean dist/.
    !isDev && del({ targets: "dist/*" }),
    peerDepsExternal(),
    resolve(),

    typescript({
      tsconfig: "tsconfig.build.json",
      exclude: ["node_modules/**", "src/**/__tests__/**"],
      clean: true,
      // rpt2 forces importHelpers:true; tslib is a devDependency so typecheck
      // works. Emit still inlines helpers — consumers do not need tslib.
      // Watch aliases core source; typechecking that graph is brittle.
      check: !isDev,
      useTsconfigDeclarationDir: !isDev,
      tsconfigOverride: {
        compilerOptions: {
          declaration: !isDev,
          declarationDir: isDev ? undefined : "dist/types",
          rootDir: isDev ? ".." : "src",
        },
      },
    }),

    {
      name: "copy-core-styles",
      buildStart() {
        // When core's watch rebuild writes dist/styles.css, re-run this bundle so
        // we re-copy into @simple-table/react/styles.css for Next HMR.
        if (isDev) {
          this.addWatchFile(path.resolve(__dirname, "../core/dist/styles.css"));
        }
      },
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
