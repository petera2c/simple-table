import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import postcss from "rollup-plugin-postcss";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import del from "rollup-plugin-delete";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

export default {
  input: "src/index.tsx",
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
    peerDepsExternal(),
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
    babel({
      exclude: ["node_modules/**", "src/stories/**"],
      presets: ["@babel/preset-react"],
      babelHelpers: "bundled",
    }),
    resolve(),
    typescript({
      exclude: ["node_modules/**", "src/stories/**"],
      rollupCommonJSResolveHack: false,
      clean: true,
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
  ],
  external: ["react", "react/jsx-runtime"],
};
