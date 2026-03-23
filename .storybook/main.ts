import type { StorybookConfig } from "@storybook/html-webpack5";

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(js|ts|mjs)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/html-webpack5",
    options: {},
  },
  webpackFinal: async (config) => {
    config.module = config.module || { rules: [] };
    config.module.rules = config.module.rules || [];
    config.module.rules.unshift({
      test: /\.(ts|tsx)$/,
      use: {
        loader: "ts-loader",
        options: { transpileOnly: true },
      },
      exclude: /node_modules/,
    });
    config.resolve = config.resolve || {};
    config.resolve.extensions = [
      ...(config.resolve.extensions || []),
      ".ts",
      ".tsx",
    ].filter((v, i, a) => a.indexOf(v) === i);
    return config;
  },
};
export default config;
