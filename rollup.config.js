import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import postcss from "rollup-plugin-postcss";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import copy from "rollup-plugin-copy";
import del from "rollup-plugin-delete";

export default {
  input: "src/index.tsx",
  output: {
    file: "dist/index.js",
    format: "esm",
  },
  plugins: [
    del({ targets: "dist/*" }),
    postcss({
      plugins: [],
      minimize: true,
      extract: "simple-table.css",
    }),
    babel({
      exclude: ["node_modules/**", "src/stories/**"],
      presets: ["@babel/preset-react"],
    }),
    resolve(),
    typescript({
      exclude: ["node_modules/**", "src/stories/**"],
      rollupCommonJSResolveHack: false,
      clean: true,
    }),
    terser(),
    copy({
      targets: [{ src: "src/styles/simple-table.css", dest: "dist/styles" }],
    }),
  ],
  external: ["react", "react/jsx-runtime"],
};
