/**
 * Standalone Jest config for unit tests added under `tests/`.
 *
 * The project ships with Storybook test-runner only, so this config wires up the
 * already-installed (transitive) jest + babel toolchain to run fast, pure-function
 * unit tests without a browser. Babel options are inlined here so we don't introduce
 * a repo-wide babel config that could affect the rollup build.
 */
module.exports = {
  rootDir: ".",
  roots: ["<rootDir>/tests"],
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.[tj]sx?$": [
      "babel-jest",
      {
        babelrc: false,
        configFile: false,
        presets: [
          ["@babel/preset-env", { targets: { node: "current" } }],
          "@babel/preset-typescript",
        ],
      },
    ],
  },
};
