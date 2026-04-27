/**
 * Package information constants for table libraries
 * Single source of truth for bundle sizes, pricing, and URLs
 */

import { SIMPLE_TABLE_ANNUAL_COST_RANGE } from "@/constants/simpleTablePricing";

export interface PackageInfo {
  name: string;
  npmPackage: string;
  version?: string;
  bundleSizeMinGzip: string;
  bundleSizeMinGzipKB: number;
  bundlePhobiaUrl: string;
  pricing: {
    free: boolean;
    cost?: string;
    hasFreeTier?: boolean;
    paidTier?: {
      name: string;
      pricePerDeveloperPerYear: number;
      additionalInfo?: string;
    };
  };
  officialWebsite?: string;
}

// Simple Table
export const SIMPLE_TABLE_INFO: PackageInfo = {
  name: "Simple Table",
  npmPackage: "simple-table-core",
  version: "3.1.0",
  bundleSizeMinGzip: "62.4 kB",
  bundleSizeMinGzipKB: 62.4,
  bundlePhobiaUrl: "https://bundlephobia.com/package/simple-table-core",
  pricing: {
    free: false,
    cost: SIMPLE_TABLE_ANNUAL_COST_RANGE,
    hasFreeTier: true,
  },
  officialWebsite: "https://www.simple-table.com",
};

// AG Grid
export const AG_GRID_COMMUNITY_INFO: PackageInfo = {
  name: "AG Grid Community",
  npmPackage: "ag-grid-community",
  bundleSizeMinGzip: "298.2 kB",
  bundleSizeMinGzipKB: 298.2,
  bundlePhobiaUrl: "https://bundlephobia.com/package/ag-grid-community",
  pricing: {
    free: true,
  },
  officialWebsite: "https://www.ag-grid.com",
};

export const AG_GRID_ENTERPRISE_INFO: PackageInfo = {
  name: "AG Grid Enterprise",
  npmPackage: "ag-grid-enterprise",
  bundleSizeMinGzip: "230.9 kB",
  bundleSizeMinGzipKB: 230.9,
  bundlePhobiaUrl: "https://bundlephobia.com/package/ag-grid-enterprise",
  pricing: {
    free: false,
    paidTier: {
      name: "Enterprise",
      pricePerDeveloperPerYear: 999,
      additionalInfo: "Plus $750 per additional deployment license",
    },
  },
  officialWebsite: "https://www.ag-grid.com/license-pricing",
};

export const AG_GRID_TOTAL_SIZE = "529.1 kB";
export const AG_GRID_TOTAL_SIZE_KB = 529.1;

// TanStack Table
export const TANSTACK_TABLE_INFO: PackageInfo = {
  name: "TanStack Table",
  npmPackage: "@tanstack/react-table",
  bundleSizeMinGzip: "15.2 kB",
  bundleSizeMinGzipKB: 15.2,
  bundlePhobiaUrl: "https://bundlephobia.com/package/@tanstack/react-table",
  pricing: {
    free: true,
  },
  officialWebsite: "https://tanstack.com/table",
};

// Handsontable
export const HANDSONTABLE_INFO: PackageInfo = {
  name: "Handsontable",
  npmPackage: "handsontable",
  bundleSizeMinGzip: "247.1 kB",
  bundleSizeMinGzipKB: 247.1,
  bundlePhobiaUrl: "https://bundlephobia.com/package/handsontable",
  pricing: {
    free: false,
    paidTier: {
      name: "Commercial",
      pricePerDeveloperPerYear: 990,
      additionalInfo: "Free for non-commercial use",
    },
  },
  officialWebsite: "https://handsontable.com/pricing",
};

// Material-UI Table (MRT)
export const MATERIAL_REACT_TABLE_INFO: PackageInfo = {
  name: "Material React Table",
  npmPackage: "material-react-table",
  bundleSizeMinGzip: "51.8 kB",
  bundleSizeMinGzipKB: 51.8,
  bundlePhobiaUrl: "https://bundlephobia.com/package/material-react-table",
  pricing: {
    free: true,
  },
  officialWebsite: "https://www.material-react-table.com",
};

// Ant Design Table
export const ANT_DESIGN_TABLE_INFO: PackageInfo = {
  name: "Ant Design Table",
  npmPackage: "antd",
  bundleSizeMinGzip: "126.3 kB",
  bundleSizeMinGzipKB: 126.3,
  bundlePhobiaUrl: "https://bundlephobia.com/package/antd",
  pricing: {
    free: true,
  },
  officialWebsite: "https://ant.design/components/table",
};

// Syncfusion
export const SYNCFUSION_GRID_INFO: PackageInfo = {
  name: "Syncfusion Spreadsheet",
  npmPackage: "@syncfusion/ej2-spreadsheet",
  bundleSizeMinGzip: "1 MB",
  bundleSizeMinGzipKB: 1000,
  bundlePhobiaUrl: "https://bundlephobia.com/package/@syncfusion/ej2-spreadsheet",
  pricing: {
    free: false,
    paidTier: {
      name: "Commercial",
      pricePerDeveloperPerYear: 995,
      additionalInfo: "Free for companies with less than $1M revenue",
    },
  },
  officialWebsite: "https://www.syncfusion.com/react-components/react-data-grid",
};

// Tabulator
export const TABULATOR_INFO: PackageInfo = {
  name: "Tabulator",
  npmPackage: "tabulator-tables",
  bundleSizeMinGzip: "98.9 kB",
  bundleSizeMinGzipKB: 98.9,
  bundlePhobiaUrl: "https://bundlephobia.com/package/tabulator-tables",
  pricing: {
    free: true,
  },
  officialWebsite: "http://tabulator.info",
};

// React wrapper for Tabulator
export const REACT_TABULATOR_INFO: PackageInfo = {
  name: "React Tabulator",
  npmPackage: "react-tabulator",
  bundleSizeMinGzip: "4.3 kB",
  bundleSizeMinGzipKB: 4.3,
  bundlePhobiaUrl: "https://bundlephobia.com/package/react-tabulator",
  pricing: {
    free: true,
  },
  officialWebsite: "http://tabulator.info/docs/5.5/frameworks#react",
};

export const TABULATOR_TOTAL_SIZE = "103.2 kB";
export const TABULATOR_TOTAL_SIZE_KB = 103.2;

// ka-table
export const KA_TABLE_INFO: PackageInfo = {
  name: "ka-table",
  npmPackage: "ka-table",
  bundleSizeMinGzip: "60 kB",
  bundleSizeMinGzipKB: 60,
  bundlePhobiaUrl: "https://bundlephobia.com/package/ka-table",
  pricing: {
    free: true,
  },
  officialWebsite: "https://ka-table.com",
};

// Mantine DataTable
export const MANTINE_DATATABLE_INFO: PackageInfo = {
  name: "Mantine DataTable",
  npmPackage: "mantine-datatable",
  bundleSizeMinGzip: "95 kB",
  bundleSizeMinGzipKB: 95,
  bundlePhobiaUrl: "https://bundlephobia.com/package/mantine-datatable",
  pricing: {
    free: true,
  },
  officialWebsite: "https://icflorescu.github.io/mantine-datatable/",
};

// MUI-Datatables
export const MUI_DATATABLES_INFO: PackageInfo = {
  name: "MUI-Datatables",
  npmPackage: "mui-datatables",
  bundleSizeMinGzip: "88 kB",
  bundleSizeMinGzipKB: 88,
  bundlePhobiaUrl: "https://bundlephobia.com/package/mui-datatables",
  pricing: {
    free: true,
  },
  officialWebsite: "https://github.com/gregnb/mui-datatables",
};

// React Data Table Component
export const REACT_DATA_TABLE_COMPONENT_INFO: PackageInfo = {
  name: "React Data Table Component",
  npmPackage: "react-data-table-component",
  bundleSizeMinGzip: "94 kB",
  bundleSizeMinGzipKB: 94,
  bundlePhobiaUrl: "https://bundlephobia.com/package/react-data-table-component",
  pricing: {
    free: true,
  },
  officialWebsite: "https://react-data-table-component.netlify.app",
};

// React Table Library
export const REACT_TABLE_LIBRARY_INFO: PackageInfo = {
  name: "React Table Library",
  npmPackage: "@table-library/react-table-library",
  bundleSizeMinGzip: "28 kB",
  bundleSizeMinGzipKB: 28,
  bundlePhobiaUrl: "https://bundlephobia.com/package/@table-library/react-table-library",
  pricing: {
    free: true,
  },
  officialWebsite: "https://react-table-library.com",
};

// RSuite Table
export const RSUITE_TABLE_INFO: PackageInfo = {
  name: "RSuite Table",
  npmPackage: "rsuite-table",
  bundleSizeMinGzip: "102 kB",
  bundleSizeMinGzipKB: 102,
  bundlePhobiaUrl: "https://bundlephobia.com/package/rsuite-table",
  pricing: {
    free: true,
  },
  officialWebsite: "https://rsuitejs.com/components/table",
};

// DevExtreme React Grid (Commercial)
export const DEVEXTREME_GRID_INFO: PackageInfo = {
  name: "DevExtreme React Grid",
  npmPackage: "devextreme-react",
  bundleSizeMinGzip: "N/A",
  bundleSizeMinGzipKB: 0,
  bundlePhobiaUrl: "",
  pricing: {
    free: false,
    cost: "$899/year",
  },
  officialWebsite: "https://js.devexpress.com/React/",
};

// KendoReact Grid (Commercial)
export const KENDOREACT_GRID_INFO: PackageInfo = {
  name: "KendoReact Grid",
  npmPackage: "@progress/kendo-react-grid",
  bundleSizeMinGzip: "N/A",
  bundleSizeMinGzipKB: 0,
  bundlePhobiaUrl: "",
  pricing: {
    free: false,
    cost: "$649-$1,199/year",
    hasFreeTier: true,
  },
  officialWebsite: "https://www.telerik.com/kendo-react-ui",
};

// Smart React Grid (Commercial)
export const SMART_GRID_INFO: PackageInfo = {
  name: "Smart React Grid",
  npmPackage: "smart-webcomponents-react",
  bundleSizeMinGzip: "N/A",
  bundleSizeMinGzipKB: 0,
  bundlePhobiaUrl: "",
  pricing: {
    free: false,
    cost: "$399-$1,499",
    hasFreeTier: true,
  },
  officialWebsite: "https://www.htmlelements.com/react/grid/",
};

// Helper function to get total bundle size
export function getTotalBundleSize(packages: PackageInfo[]): string {
  const totalKB = packages.reduce((sum, pkg) => sum + pkg.bundleSizeMinGzipKB, 0);
  return `${totalKB.toFixed(1)} kB`;
}

// Helper function to get pricing info
export function getPricingString(packageInfo: PackageInfo): string {
  if (packageInfo.pricing.free && !packageInfo.pricing.paidTier) {
    return "Free";
  }
  if (packageInfo.pricing.paidTier) {
    return `$${packageInfo.pricing.paidTier.pricePerDeveloperPerYear}/developer/year`;
  }
  if (packageInfo.pricing.cost) {
    return packageInfo.pricing.cost;
  }
  return "Unknown";
}
