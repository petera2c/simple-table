import {
  AG_GRID_COMMUNITY_INFO,
  AG_GRID_ENTERPRISE_INFO,
  AG_GRID_TOTAL_SIZE,
  AG_GRID_TOTAL_SIZE_KB,
  HANDSONTABLE_INFO,
  SIMPLE_TABLE_INFO,
  TANSTACK_TABLE_INFO,
} from "@/constants/packageInfo";

export interface BundleBenchmarkRow {
  library: string;
  packageName: string;
  sizeLabel: string;
  sizeKB: number;
  notes: string;
  bundlePhobiaUrl: string;
  pricingNote: string;
}

/** Published min+gzip sizes from packageInfo (Bundlephobia-aligned). */
export const BUNDLE_BENCHMARK_ROWS: BundleBenchmarkRow[] = [
  {
    library: "Simple Table",
    packageName: SIMPLE_TABLE_INFO.npmPackage,
    sizeLabel: SIMPLE_TABLE_INFO.bundleSizeMinGzip,
    sizeKB: SIMPLE_TABLE_INFO.bundleSizeMinGzipKB,
    notes: "Batteries-included grid; adapters share this core",
    bundlePhobiaUrl: SIMPLE_TABLE_INFO.bundlePhobiaUrl,
    pricingNote: "Free (zero revenue) / Pro per product",
  },
  {
    library: "TanStack Table",
    packageName: TANSTACK_TABLE_INFO.npmPackage,
    sizeLabel: TANSTACK_TABLE_INFO.bundleSizeMinGzip,
    sizeKB: TANSTACK_TABLE_INFO.bundleSizeMinGzipKB,
    notes: "Headless only — UI, virtualization, and features are DIY",
    bundlePhobiaUrl: TANSTACK_TABLE_INFO.bundlePhobiaUrl,
    pricingNote: "MIT / free",
  },
  {
    library: "Handsontable",
    packageName: HANDSONTABLE_INFO.npmPackage,
    sizeLabel: HANDSONTABLE_INFO.bundleSizeMinGzip,
    sizeKB: HANDSONTABLE_INFO.bundleSizeMinGzipKB,
    notes: "Spreadsheet-oriented commercial grid",
    bundlePhobiaUrl: HANDSONTABLE_INFO.bundlePhobiaUrl,
    pricingNote: "Commercial license for production",
  },
  {
    library: "AG Grid Community",
    packageName: AG_GRID_COMMUNITY_INFO.npmPackage,
    sizeLabel: AG_GRID_COMMUNITY_INFO.bundleSizeMinGzip,
    sizeKB: AG_GRID_COMMUNITY_INFO.bundleSizeMinGzipKB,
    notes: "Community feature set only",
    bundlePhobiaUrl: AG_GRID_COMMUNITY_INFO.bundlePhobiaUrl,
    pricingNote: "Free",
  },
  {
    library: "AG Grid Community + Enterprise",
    packageName: `${AG_GRID_COMMUNITY_INFO.npmPackage} + ${AG_GRID_ENTERPRISE_INFO.npmPackage}`,
    sizeLabel: AG_GRID_TOTAL_SIZE,
    sizeKB: AG_GRID_TOTAL_SIZE_KB,
    notes: "Typical Enterprise install path",
    bundlePhobiaUrl: AG_GRID_ENTERPRISE_INFO.bundlePhobiaUrl,
    pricingNote: "$999/developer/year (Enterprise)",
  },
];

export const BENCHMARK_METHODOLOGY = {
  bundleSource:
    "Bundle sizes are minified + gzipped figures tracked in our packageInfo constants, aligned with Bundlephobia measurements for the named npm packages.",
  scrollGuidance:
    "For large-row scrolling, use virtualization (row virtualization enabled) and measure frames in Chrome Performance while scrolling a fixed viewport. Reproduce with the 1M-rows blog demo and StackBlitz quick starts.",
  reproduceSteps: [
    "Open each library's Bundlephobia URL linked in the table below and confirm min+gzip.",
    "Clone https://github.com/petera2c/simple-table and open the StackBlitz examples branch demos.",
    "For scroll FPS: load a virtualized grid with N rows (10k / 100k / 1M), scroll for 5 seconds, record average FPS in Chrome Performance.",
    "Keep viewport height, row height, and column count constant across libraries.",
  ],
  lastReviewed: "2026-07-20",
};
