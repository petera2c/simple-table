import type { NextConfig } from "next";
import fs from "node:fs";
import path from "path";

/**
 * Turbopack only resolves inside `turbopack.root`. Workspace packages live under
 * the monorepo root (`apps/marketing` → `../..`). Legacy layout: marketing repo
 * sibling to `simple-table-core` under a common parent.
 */
function turbopackFilesystemRoot(): string {
  const monorepoRoot = path.resolve(__dirname, "../..");
  if (fs.existsSync(path.join(monorepoRoot, "pnpm-workspace.yaml"))) {
    return monorepoRoot;
  }
  const legacyParent = path.resolve(__dirname, "..");
  if (fs.existsSync(path.join(legacyParent, "simple-table-core", "package.json"))) {
    return legacyParent;
  }
  return __dirname;
}

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const config: NextConfig = {
  // Use git commit hash for stable build IDs to prevent unnecessary chunk hash changes
  generateBuildId: async () => {
    // Use SOURCE_VERSION env var (Heroku) or fallback to timestamp
    return process.env.SOURCE_VERSION || process.env.HEROKU_SLUG_COMMIT || `build-${Date.now()}`;
  },
  redirects: async () => {
    return [
      {
        source: "/docs",
        destination: "/docs/installation",
        permanent: true,
      },
      {
        source: "/blog/simple-table-vs-ag-grid",
        destination: "/comparisons/simple-table-vs-ag-grid",
        permanent: true,
      },
      {
        source: "/blog/simple-table-vs-handsontable",
        destination: "/comparisons/simple-table-vs-handsontable",
        permanent: true,
      },
      {
        source: "/comparisons/ag-grid-vs-simple-table",
        destination: "/comparisons/simple-table-vs-ag-grid",
        permanent: true,
      },
      {
        source: "/examples/finance",
        destination: "/examples/infrastructure",
        permanent: true,
      },
      {
        source: "/examples",
        destination: "/examples/crm",
        permanent: true,
      },
      // Redirect 2025 blog posts to 2026 versions
      {
        source: "/blog/best-free-react-data-grid-2025",
        destination: "/blog/best-free-react-data-grid-2026",
        permanent: true,
      },
      {
        source: "/blog/best-react-table-libraries-2025",
        destination: "/blog/best-react-table-libraries-2026",
        permanent: true,
      },
      {
        source: "/blog/ag-grid-pricing-license-breakdown-2025",
        destination: "/blog/ag-grid-pricing-license-breakdown-2026",
        permanent: true,
      },
    ];
  },
  // Turbopack: widen root when local simple-table-core exists as a sibling (npm link dev).
  // Otherwise keep the app directory so a standalone clone is unchanged.
  turbopack: {
    root: turbopackFilesystemRoot(),
  },
  webpack: (config, { isServer, dev }) => {
    // Workspace table packages live outside this app; follow symlinks so `next dev --webpack`
    // sees Rollup output updates under packages/react/dist (used with dev:marketing:watch).
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        followSymlinks: true,
        aggregateTimeout: 400,
      };
    }

    // Add path aliases to webpack
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
    };

    // Optimize chunk splitting to reduce total number of chunks
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization?.splitChunks,
          chunks: "all",
          cacheGroups: {
            default: false,
            vendors: false,
            // Group all node_modules into fewer chunks
            framework: {
              name: "framework",
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
              priority: 40,
              enforce: true,
            },
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name(module: any) {
                // Group antd and related packages together
                if (
                  /[\\/]node_modules[\\/](antd|@ant-design|rc-.*?)[\\/]/.test(module.context || "")
                ) {
                  return "antd-vendor";
                }
                // Group other large libraries
                if (
                  /[\\/]node_modules[\\/](framer-motion|@fortawesome)[\\/]/.test(
                    module.context || ""
                  )
                ) {
                  return "ui-vendor";
                }
                return "vendor";
              },
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },
            commons: {
              name: "commons",
              minChunks: 2,
              priority: 20,
            },
          },
        },
      };
    }

    return config;
  },
  transpilePackages: [
    "@simple-table/react",
    "antd",
    "@ant-design",
    "rc-util",
    "rc-pagination",
    "rc-picker",
    "rc-notification",
    "rc-tooltip",
    "rc-tree",
    "rc-table",
  ],
};

export default withBundleAnalyzer(config);
