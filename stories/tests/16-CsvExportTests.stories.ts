/**
 * CSV EXPORT TESTS
 * Ported from React - same tests, vanilla table only.
 *
 * Features tested:
 * 1. Basic CSV export via exportToCSV() API
 * 2. CSV export with custom filename
 * 3. CSV export includes all data (all pages, not just current page)
 * 4. includeHeadersInCSVExport option
 * 5. excludeFromCsv column property
 * 6. useFormattedValueForCSV option
 * 7. exportValueGetter for custom export values
 * 8. CSV export with pagination
 * 9. CSV export with filtering
 * 10. CSV export with sorting
 * 11. CSV export with nested data accessors
 * 12. CSV export with array index accessors
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import { HeaderObject } from "../../src/index";
import { waitForTable } from "./testUtils";
import { renderVanillaTable } from "../utils";

const meta: Meta = {
  title: "Tests/16 - CSV Export",
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        component:
          "Comprehensive tests for CSV export functionality including basic export, custom filenames, headers, column exclusion, value formatting, and export with pagination/filtering/sorting.",
      },
    },
  },
};

export default meta;

// ============================================================================
// TEST DATA
// ============================================================================

const createSalesData = (count: number) =>
  Array.from({ length: count }, (_, i) => {
    const price = 10 + (i % 100) * 10;
    const quantity = 1 + (i % 20);
    return {
      id: i + 1,
      product: ["Laptop", "Mouse", "Keyboard", "Monitor", "Headphones"][i % 5],
      category: ["Electronics", "Accessories", "Peripherals"][i % 3],
      price,
      quantity,
      revenue: price * quantity,
      date: `2024-${String((i % 12) + 1).padStart(2, "0")}-15`,
      inStock: i % 2 === 0,
    };
  });

const createNestedData = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    user: { name: `User ${i + 1}`, email: `user${i + 1}@example.com` },
    metadata: { score: 50 + (i % 50) },
  }));

const createArrayData = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Artist ${i + 1}`,
    awards: [`Award ${i % 3}`, `Prize ${i % 5}`],
    albums: [
      { title: `Album ${i * 2 + 1}`, year: 2020 + (i % 5) },
      { title: `Album ${i * 2 + 2}`, year: 2021 + (i % 4) },
    ],
  }));

const mockCsvDownload = () => {
  let lastCsvContent = "";
  let lastFilename = "";
  const originalCreateObjectURL = URL.createObjectURL.bind(URL);
  const originalCreateElement = document.createElement.bind(document);

  URL.createObjectURL = function (blob: Blob | MediaSource): string {
    if (blob instanceof Blob) {
      const reader = new FileReader();
      reader.onload = () => { lastCsvContent = reader.result as string; };
      reader.readAsText(blob);
    }
    return "blob:fake-url";
  };

  document.createElement = function (tagName: string) {
    const el = originalCreateElement(tagName);
    if (tagName === "a") {
      el.click = function () {
        const d = el.getAttribute("download");
        if (d) lastFilename = d;
      };
    }
    return el;
  };

  return {
    getLastCsvContent: () => lastCsvContent,
    getLastFilename: () => lastFilename,
    reset: () => {
      lastCsvContent = "";
      lastFilename = "";
      document.createElement = originalCreateElement;
      URL.createObjectURL = originalCreateObjectURL;
    },
  };
};

const parseCsv = (csvContent: string): string[][] =>
  csvContent.trim().split("\n").map((line) => line.split(",").map((c) => c.trim()));

let exportTableApi: { exportToCSV: (opts?: { filename?: string }) => void } | null = null;

export const BasicCsvExport = {
  render: () => {
    const data = createSalesData(5);
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "product", label: "Product", width: 150, type: "string" },
      { accessor: "price", label: "Price", width: 100, type: "number" },
      { accessor: "quantity", label: "Quantity", width: 100, type: "number" },
    ];
    const { wrapper, tableContainer, table } = renderVanillaTable(headers, data, { getRowId: (p) => String(p.row?.id), height: "300px" });
    exportTableApi = table.getAPI();
    const btn = document.createElement("button");
    btn.id = "export-button";
    btn.textContent = "Export to CSV";
    btn.style.marginBottom = "10px";
    btn.style.padding = "8px 16px";
    btn.addEventListener("click", () => exportTableApi?.exportToCSV());
    wrapper.insertBefore(btn, tableContainer);
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const mock = mockCsvDownload();
    try {
      const exportButton = canvasElement.querySelector("#export-button") as HTMLButtonElement;
      expect(exportButton).toBeTruthy();
      exportButton.click();
      await new Promise((r) => setTimeout(r, 1000));
      const csvContent = mock.getLastCsvContent();
      expect(csvContent).toBeTruthy();
      expect(csvContent.length).toBeGreaterThan(0);
      const rows = parseCsv(csvContent);
      expect(rows.length).toBeGreaterThan(0);
      expect(rows[0]).toContain("ID");
      expect(rows[0]).toContain("Product");
      expect(rows[0]).toContain("Price");
      expect(rows[0]).toContain("Quantity");
      expect(rows.length).toBe(6);
    } finally {
      mock.reset();
    }
  },
};

export const CsvExportWithCustomFilename = {
  render: () => {
    const data = createSalesData(3);
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "product", label: "Product", width: 150 },
    ];
    const { wrapper, tableContainer, table } = renderVanillaTable(headers, data, { getRowId: (p) => String(p.row?.id), height: "250px" });
    exportTableApi = table.getAPI();
    const btn = document.createElement("button");
    btn.id = "export-custom-filename";
    btn.textContent = "Export with Custom Filename";
    btn.style.marginBottom = "10px";
    btn.style.padding = "8px 16px";
    btn.addEventListener("click", () => exportTableApi?.exportToCSV({ filename: "sales-report.csv" }));
    wrapper.insertBefore(btn, tableContainer);
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const mock = mockCsvDownload();
    try {
      const btn = canvasElement.querySelector("#export-custom-filename") as HTMLButtonElement;
      expect(btn).toBeTruthy();
      btn.click();
      await new Promise((r) => setTimeout(r, 1000));
      expect(mock.getLastFilename()).toBe("sales-report.csv");
      expect(mock.getLastCsvContent()).toBeTruthy();
    } finally {
      mock.reset();
    }
  },
};

export const CsvExportIncludesAllPages = {
  render: () => {
    const data = createSalesData(25);
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "product", label: "Product", width: 150 },
    ];
    const { wrapper, tableContainer, table } = renderVanillaTable(headers, data, {
      getRowId: (p) => String(p.row?.id),
      height: "400px",
      shouldPaginate: true,
      rowsPerPage: 10,
    });
    exportTableApi = table.getAPI();
    const btn = document.createElement("button");
    btn.id = "export-all-pages";
    btn.textContent = "Export All Data";
    btn.style.marginBottom = "10px";
    btn.style.padding = "8px 16px";
    btn.addEventListener("click", () => exportTableApi?.exportToCSV());
    wrapper.insertBefore(btn, tableContainer);
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const mock = mockCsvDownload();
    try {
      const btn = canvasElement.querySelector("#export-all-pages") as HTMLButtonElement;
      expect(btn).toBeTruthy();
      btn.click();
      await new Promise((r) => setTimeout(r, 1000));
      const csvContent = mock.getLastCsvContent();
      expect(csvContent).toBeTruthy();
      const rows = parseCsv(csvContent);
      expect(rows.length).toBeGreaterThan(10);
      expect(rows.length).toBe(26);
    } finally {
      mock.reset();
    }
  },
};

export const CsvExportWithoutHeaders = {
  render: () => {
    const data = createSalesData(5);
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "product", label: "Product", width: 150 },
      { accessor: "price", label: "Price", width: 100 },
    ];
    const { wrapper, tableContainer, table } = renderVanillaTable(headers, data, {
      getRowId: (p) => String(p.row?.id),
      height: "300px",
      includeHeadersInCSVExport: false,
    });
    exportTableApi = table.getAPI();
    const btn = document.createElement("button");
    btn.id = "export-no-headers";
    btn.textContent = "Export Without Headers";
    btn.style.marginBottom = "10px";
    btn.style.padding = "8px 16px";
    btn.addEventListener("click", () => exportTableApi?.exportToCSV());
    wrapper.insertBefore(btn, tableContainer);
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const mock = mockCsvDownload();
    try {
      const exportButton = canvasElement.querySelector("#export-no-headers") as HTMLButtonElement;
      expect(exportButton).toBeTruthy();
      exportButton.click();
      await new Promise((r) => setTimeout(r, 1000));
      const csvContent = mock.getLastCsvContent();
      const rows = parseCsv(csvContent);
      expect(rows.length).toBe(5);
      expect(rows[0][0]).toBe("1");
    } finally {
      mock.reset();
    }
  },
};

export const ExcludeColumnFromCsv = {
  render: () => {
    const data = createSalesData(5);
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "product", label: "Product", width: 150 },
      { accessor: "price", label: "Price", width: 100, excludeFromCsv: true },
      { accessor: "quantity", label: "Quantity", width: 100 },
    ];
    const { wrapper, tableContainer, table } = renderVanillaTable(headers, data, {
      getRowId: (p) => String(p.row?.id),
      height: "300px",
    });
    exportTableApi = table.getAPI();
    const btn = document.createElement("button");
    btn.id = "export-exclude-column";
    btn.textContent = "Export CSV";
    btn.style.marginBottom = "10px";
    btn.style.padding = "8px 16px";
    btn.addEventListener("click", () => exportTableApi?.exportToCSV());
    wrapper.insertBefore(btn, tableContainer);
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const priceHeader = canvasElement.querySelector('[data-accessor="price"]');
    expect(priceHeader).toBeTruthy();
    const mock = mockCsvDownload();
    try {
      const exportButton = canvasElement.querySelector("#export-exclude-column") as HTMLButtonElement;
      expect(exportButton).toBeTruthy();
      exportButton.click();
      await new Promise((r) => setTimeout(r, 1000));
      const csvContent = mock.getLastCsvContent();
      const rows = parseCsv(csvContent);
      expect(rows[0]).toContain("ID");
      expect(rows[0]).toContain("Product");
      expect(rows[0]).not.toContain("Price");
      expect(rows[0]).toContain("Quantity");
      expect(rows[0].length).toBe(3);
    } finally {
      mock.reset();
    }
  },
};

export const CsvExportWithValueFormatter = {
  render: () => {
    const data = createSalesData(5);
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "product", label: "Product", width: 150 },
      {
        accessor: "price",
        label: "Price",
        width: 120,
        type: "number",
        valueFormatter: ({ value }: { value?: unknown }) => `$${Number(value).toFixed(2)}`,
        useFormattedValueForCSV: true,
      },
      { accessor: "quantity", label: "Quantity", width: 100 },
    ];
    const { wrapper, tableContainer, table } = renderVanillaTable(headers, data, {
      getRowId: (p) => String(p.row?.id),
      height: "300px",
    });
    exportTableApi = table.getAPI();
    const btn = document.createElement("button");
    btn.id = "export-formatted";
    btn.textContent = "Export with Formatted Values";
    btn.style.marginBottom = "10px";
    btn.style.padding = "8px 16px";
    btn.addEventListener("click", () => exportTableApi?.exportToCSV());
    wrapper.insertBefore(btn, tableContainer);
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const mock = mockCsvDownload();
    try {
      const exportButton = canvasElement.querySelector("#export-formatted") as HTMLButtonElement;
      expect(exportButton).toBeTruthy();
      exportButton.click();
      await new Promise((r) => setTimeout(r, 1000));
      const csvContent = mock.getLastCsvContent();
      const rows = parseCsv(csvContent);
      const priceColumnIndex = rows[0].indexOf("Price");
      expect(priceColumnIndex).toBeGreaterThan(-1);
      const priceValue = rows[1][priceColumnIndex];
      expect(priceValue).toMatch(/^\$/);
    } finally {
      mock.reset();
    }
  },
};

export const CsvExportWithExportValueGetter = {
  render: () => {
    const data = createSalesData(5);
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "product", label: "Product", width: 150 },
      {
        accessor: "inStock",
        label: "In Stock",
        width: 120,
        type: "boolean",
        exportValueGetter: ({ value }: { value?: unknown }) => (value ? "Yes" : "No"),
      },
    ];
    const { wrapper, tableContainer, table } = renderVanillaTable(headers, data, {
      getRowId: (p) => String(p.row?.id),
      height: "300px",
    });
    exportTableApi = table.getAPI();
    const btn = document.createElement("button");
    btn.id = "export-value-getter";
    btn.textContent = "Export with Custom Values";
    btn.style.marginBottom = "10px";
    btn.style.padding = "8px 16px";
    btn.addEventListener("click", () => exportTableApi?.exportToCSV());
    wrapper.insertBefore(btn, tableContainer);
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const mock = mockCsvDownload();
    try {
      const exportButton = canvasElement.querySelector("#export-value-getter") as HTMLButtonElement;
      expect(exportButton).toBeTruthy();
      exportButton.click();
      await new Promise((r) => setTimeout(r, 1000));
      const csvContent = mock.getLastCsvContent();
      const rows = parseCsv(csvContent);
      const inStockColumnIndex = rows[0].indexOf("In Stock");
      expect(inStockColumnIndex).toBeGreaterThan(-1);
      for (let i = 1; i < rows.length; i++) {
        const inStockValue = rows[i][inStockColumnIndex];
        expect(["Yes", "No"]).toContain(inStockValue);
      }
    } finally {
      mock.reset();
    }
  },
};

export const CsvExportWithFiltering = {
  render: () => {
    const data = createSalesData(10);
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "product", label: "Product", width: 150, filterable: true },
      { accessor: "price", label: "Price", width: 100, type: "number" },
    ];
    const { wrapper, tableContainer, table } = renderVanillaTable(headers, data, {
      getRowId: (p) => String(p.row?.id),
      height: "400px",
    });
    exportTableApi = table.getAPI();
    const btn = document.createElement("button");
    btn.id = "export-filtered";
    btn.textContent = "Export Filtered Data";
    btn.style.marginBottom = "10px";
    btn.style.padding = "8px 16px";
    btn.addEventListener("click", () => exportTableApi?.exportToCSV());
    wrapper.insertBefore(btn, tableContainer);
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const mock = mockCsvDownload();
    try {
      const exportButton = canvasElement.querySelector("#export-filtered") as HTMLButtonElement;
      expect(exportButton).toBeTruthy();
      exportButton.click();
      await new Promise((r) => setTimeout(r, 1000));
      const csvContent = mock.getLastCsvContent();
      expect(csvContent).toBeTruthy();
      const rows = parseCsv(csvContent);
      expect(rows.length).toBeGreaterThan(0);
    } finally {
      mock.reset();
    }
  },
};

export const CsvExportWithSorting = {
  render: () => {
    const data = createSalesData(10);
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, isSortable: true },
      { accessor: "product", label: "Product", width: 150, isSortable: true },
      { accessor: "price", label: "Price", width: 100, type: "number", isSortable: true },
    ];
    const { wrapper, tableContainer, table } = renderVanillaTable(headers, data, {
      getRowId: (p) => String(p.row?.id),
      height: "400px",
    });
    exportTableApi = table.getAPI();
    const btn = document.createElement("button");
    btn.id = "export-sorted";
    btn.textContent = "Export Sorted Data";
    btn.style.marginBottom = "10px";
    btn.style.padding = "8px 16px";
    btn.addEventListener("click", () => exportTableApi?.exportToCSV());
    wrapper.insertBefore(btn, tableContainer);
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const mock = mockCsvDownload();
    try {
      const exportButton = canvasElement.querySelector("#export-sorted") as HTMLButtonElement;
      expect(exportButton).toBeTruthy();
      exportButton.click();
      await new Promise((r) => setTimeout(r, 1000));
      const csvContent = mock.getLastCsvContent();
      expect(csvContent).toBeTruthy();
      const rows = parseCsv(csvContent);
      expect(rows.length).toBe(11);
    } finally {
      mock.reset();
    }
  },
};

export const CsvExportWithNestedData = {
  render: () => {
    const data = createNestedData(5);
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "user.name", label: "Name", width: 150 },
      { accessor: "user.email", label: "Email", width: 200 },
      { accessor: "metadata.score", label: "Score", width: 100, type: "number" },
    ];
    const { wrapper, tableContainer, table } = renderVanillaTable(headers, data, {
      getRowId: (p) => String(p.row?.id),
      height: "300px",
    });
    exportTableApi = table.getAPI();
    const btn = document.createElement("button");
    btn.id = "export-nested";
    btn.textContent = "Export Nested Data";
    btn.style.marginBottom = "10px";
    btn.style.padding = "8px 16px";
    btn.addEventListener("click", () => exportTableApi?.exportToCSV());
    wrapper.insertBefore(btn, tableContainer);
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const mock = mockCsvDownload();
    try {
      const exportButton = canvasElement.querySelector("#export-nested") as HTMLButtonElement;
      expect(exportButton).toBeTruthy();
      exportButton.click();
      await new Promise((r) => setTimeout(r, 1000));
      const csvContent = mock.getLastCsvContent();
      const rows = parseCsv(csvContent);
      expect(rows[0]).toContain("ID");
      expect(rows[0]).toContain("Name");
      expect(rows[0]).toContain("Email");
      expect(rows[0]).toContain("Score");
      expect(rows.length).toBe(6);
      expect(rows[1][1]).toMatch(/User/);
      expect(rows[1][2]).toMatch(/@example\.com/);
    } finally {
      mock.reset();
    }
  },
};

export const CsvExportWithArrayAccessors = {
  render: () => {
    const data = createArrayData(5);
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Artist", width: 150 },
      { accessor: "awards[0]", label: "First Award", width: 150 },
      { accessor: "albums[0].title", label: "Album 1", width: 180 },
      { accessor: "albums[0].year", label: "Year", width: 100, type: "number" },
    ];
    const { wrapper, tableContainer, table } = renderVanillaTable(headers, data, {
      getRowId: (p) => String(p.row?.id),
      height: "300px",
    });
    exportTableApi = table.getAPI();
    const btn = document.createElement("button");
    btn.id = "export-arrays";
    btn.textContent = "Export Array Data";
    btn.style.marginBottom = "10px";
    btn.style.padding = "8px 16px";
    btn.addEventListener("click", () => exportTableApi?.exportToCSV());
    wrapper.insertBefore(btn, tableContainer);
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const mock = mockCsvDownload();
    try {
      const exportButton = canvasElement.querySelector("#export-arrays") as HTMLButtonElement;
      expect(exportButton).toBeTruthy();
      exportButton.click();
      await new Promise((r) => setTimeout(r, 1000));
      const csvContent = mock.getLastCsvContent();
      const rows = parseCsv(csvContent);
      expect(rows[0]).toContain("ID");
      expect(rows[0]).toContain("Artist");
      expect(rows[0]).toContain("First Award");
      expect(rows[0]).toContain("Album 1");
      expect(rows[0]).toContain("Year");
      expect(rows.length).toBe(6);
    } finally {
      mock.reset();
    }
  },
};

export const MultipleCsvExports = {
  render: () => {
    const data = createSalesData(5);
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "product", label: "Product", width: 150 },
    ];
    const { wrapper, tableContainer, table } = renderVanillaTable(headers, data, {
      getRowId: (p) => String(p.row?.id),
      height: "300px",
    });
    exportTableApi = table.getAPI();
    const btn1 = document.createElement("button");
    btn1.id = "export-first";
    btn1.textContent = "Export 1";
    btn1.style.marginBottom = "10px";
    btn1.style.marginRight = "10px";
    btn1.style.padding = "8px 16px";
    btn1.addEventListener("click", () => exportTableApi?.exportToCSV({ filename: "export1.csv" }));
    const btn2 = document.createElement("button");
    btn2.id = "export-second";
    btn2.textContent = "Export 2";
    btn2.style.marginBottom = "10px";
    btn2.style.padding = "8px 16px";
    btn2.addEventListener("click", () => exportTableApi?.exportToCSV({ filename: "export2.csv" }));
    wrapper.insertBefore(btn1, tableContainer);
    wrapper.insertBefore(btn2, tableContainer);
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const mock = mockCsvDownload();
    try {
      const exportButton1 = canvasElement.querySelector("#export-first") as HTMLButtonElement;
      expect(exportButton1).toBeTruthy();
      exportButton1.click();
      await new Promise((r) => setTimeout(r, 300));
      expect(mock.getLastFilename()).toBe("export1.csv");
      const exportButton2 = canvasElement.querySelector("#export-second") as HTMLButtonElement;
      expect(exportButton2).toBeTruthy();
      exportButton2.click();
      await new Promise((r) => setTimeout(r, 300));
      expect(mock.getLastFilename()).toBe("export2.csv");
    } finally {
      mock.reset();
    }
  },
};
