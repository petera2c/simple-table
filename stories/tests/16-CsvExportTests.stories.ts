/**
 * CSV EXPORT TESTS
 * Ported from React - same tests, vanilla table only.
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
  },
};

export default meta;

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
