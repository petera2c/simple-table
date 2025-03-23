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
      file: "dist/index.js",
      format: "cjs",
      sourcemap: true,
    },
    {
      file: "dist/index.es.js",
      format: "esm",
      sourcemap: true,
    },
  ],
  plugins: [
    del({ targets: "dist/*" }),
    peerDepsExternal(),
    postcss(),
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
