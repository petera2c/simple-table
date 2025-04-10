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
    { file: "dist/index.js", format: "cjs", sourcemap: true },
    { file: "dist/index.es.js", format: "esm", sourcemap: true },
  ],
  plugins: [
    del({ targets: "dist/*" }),
    peerDepsExternal(),
    postcss({
      extract: "styles.css",
      inject: false,
      minimize: true,
      modules: false,
      config: false,
      plugins: [
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
    terser(),
  ],
  external: ["react", "react/jsx-runtime"],
};
