import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import postcss from "rollup-plugin-postcss";

export default {
  input: "src/index.tsx",
  output: {
    file: "dist/index.js",
    format: "esm",
  },
  plugins: [
    postcss({
      plugins: [],
      minimize: true,
    }),
    babel({
      exclude: "node_modules/**",
      presets: ["@babel/preset-react"],
    }),
    resolve(),
  ],
  external: ["react"],
};
