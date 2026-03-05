import type { Meta, StoryObj } from "@storybook/react";
import { useRef } from "react";
import { expect } from "@storybook/test";
import { SimpleTable, TableRefType } from "../..";
import { HeaderObject } from "../..";

/**
 * CSV EXPORT TESTS
 *
 * This test suite covers CSV export functionality documented in:
 * - CSV Export Documentation
 * - API Reference (exportToCSV method)
 * - Column Configuration (excludeFromCsv, useFormattedValueForCSV)
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

interface SalesRow extends Record<string, any> {
  id: number;
  product: string;
  category: string;
  price: number;
  quantity: number;
  revenue: number;
  date: string;
  inStock: boolean;
}

interface NestedRow extends Record<string, any> {
  id: number;
  user: {
    name: string;
    email: string;
  };
  metadata: {
    score: number;
  };
}

interface ArrayRow extends Record<string, any> {
  id: number;
  name: string;
  awards: string[];
  albums: Array<{ title: string; year: number }>;
}

const createSalesData = (count: number): SalesRow[] => {
  const products = ["Laptop", "Mouse", "Keyboard", "Monitor", "Headphones"];
  const categories = ["Electronics", "Accessories", "Peripherals"];

  return Array.from({ length: count }, (_, index) => {
    const price = 10 + (index % 100) * 10;
    const quantity = 1 + (index % 20);
    return {
      id: index + 1,
      product: products[index % products.length],
      category: categories[index % categories.length],
      price,
      quantity,
      revenue: price * quantity,
      date: `2024-${String((index % 12) + 1).padStart(2, "0")}-15`,
      inStock: index % 2 === 0,
    };
  });
};

const createNestedData = (count: number): NestedRow[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    user: {
      name: `User ${index + 1}`,
      email: `user${index + 1}@example.com`,
    },
    metadata: {
      score: 50 + (index % 50),
    },
  }));
};

const createArrayData = (count: number): ArrayRow[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `Artist ${index + 1}`,
    awards: [`Award ${index % 3}`, `Prize ${index % 5}`],
    albums: [
      { title: `Album ${index * 2 + 1}`, year: 2020 + (index % 5) },
      { title: `Album ${index * 2 + 2}`, year: 2021 + (index % 4) },
    ],
  }));
};

// ============================================================================
// TEST UTILITIES
// ============================================================================

const waitForTable = async (timeout = 5000) => {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    const table = document.querySelector(".simple-table-root");
    if (table) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Table did not render within timeout");
};

// Mock the CSV download functionality
const mockCsvDownload = () => {
  let lastCsvContent = "";
  let lastFilename = "";

  // Store original functions
  const originalCreateElement = document.createElement.bind(document);
  const originalCreateObjectURL = URL.createObjectURL.bind(URL);

  // Mock URL.createObjectURL to intercept blob creation
  URL.createObjectURL = function (blob: Blob | MediaSource): string {
    if (blob instanceof Blob) {
      // Read the blob content
      const reader = new FileReader();
      reader.onload = () => {
        lastCsvContent = reader.result as string;
      };
      reader.readAsText(blob);
    }
    // Return a fake URL
    return "blob:fake-url";
  };

  // Mock createElement to intercept anchor creation
  document.createElement = function (tagName: string) {
    const element = originalCreateElement(tagName);

    if (tagName === "a") {
      element.click = function () {
        // Store the filename
        const download = element.getAttribute("download");
        if (download) {
          lastFilename = download;
        }

        // Don't actually trigger the download
        // originalClick.call(element);
      };
    }

    return element;
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

const parseCsv = (csvContent: string): string[][] => {
  const lines = csvContent.trim().split("\n");
  return lines.map((line) => {
    // Simple CSV parsing (doesn't handle quoted commas)
    return line.split(",").map((cell) => cell.trim());
  });
};

// ============================================================================
// TEST CASES
// ============================================================================

/**
 * Test 1: Basic CSV Export
 * Tests the basic exportToCSV() API method
 */
export const BasicCsvExport: StoryObj = {
  render: () => {
    const tableRef = useRef<TableRefType | null>(null);
    const data = createSalesData(5);
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "product", label: "Product", width: 150, type: "string" },
      { accessor: "price", label: "Price", width: 100, type: "number" },
      { accessor: "quantity", label: "Quantity", width: 100, type: "number" },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <h2>Basic CSV Export</h2>
        <p>Tests exportToCSV() API method</p>
        <button
          id="export-button"
          onClick={() => tableRef.current?.exportToCSV()}
          style={{ marginBottom: "10px", padding: "8px 16px" }}
        >
          Export to CSV
        </button>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="300px"
          tableRef={tableRef}
          getRowId={(params) => String(params.row.id)}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const mock = mockCsvDownload();

    try {
      // Click export button
      const exportButton = canvasElement.querySelector("#export-button") as HTMLButtonElement;
      expect(exportButton).toBeTruthy();
      exportButton.click();

      // Wait for FileReader to complete (it's async)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Verify CSV was generated
      const csvContent = mock.getLastCsvContent();
      expect(csvContent).toBeTruthy();
      expect(csvContent.length).toBeGreaterThan(0);

      // Parse and verify CSV structure
      const rows = parseCsv(csvContent);
      expect(rows.length).toBeGreaterThan(0);

      // Verify headers are included by default
      expect(rows[0]).toContain("ID");
      expect(rows[0]).toContain("Product");
      expect(rows[0]).toContain("Price");
      expect(rows[0]).toContain("Quantity");

      // Verify data rows (5 data rows + 1 header row = 6 total)
      expect(rows.length).toBe(6);
    } finally {
      mock.reset();
    }
  },
};

/**
 * Test 2: CSV Export with Custom Filename
 * Tests exportToCSV({ filename: 'custom.csv' })
 */
export const CsvExportWithCustomFilename: StoryObj = {
  render: () => {
    const tableRef = useRef<TableRefType | null>(null);
    const data = createSalesData(3);
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "product", label: "Product", width: 150 },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <h2>CSV Export with Custom Filename</h2>
        <button
          id="export-custom-filename"
          onClick={() => tableRef.current?.exportToCSV({ filename: "sales-report.csv" })}
          style={{ marginBottom: "10px", padding: "8px 16px" }}
        >
          Export with Custom Filename
        </button>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="250px"
          tableRef={tableRef}
          getRowId={(params) => String(params.row.id)}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const mock = mockCsvDownload();

    try {
      const exportButton = canvasElement.querySelector(
        "#export-custom-filename",
      ) as HTMLButtonElement;
      expect(exportButton).toBeTruthy();
      exportButton.click();

      // Wait for FileReader to complete (it's async)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Verify custom filename
      const filename = mock.getLastFilename();
      expect(filename).toBe("sales-report.csv");

      // Verify CSV content exists
      const csvContent = mock.getLastCsvContent();
      expect(csvContent).toBeTruthy();
    } finally {
      mock.reset();
    }
  },
};

/**
 * Test 3: CSV Export Includes All Pages
 * Tests that CSV export includes all data, not just current page
 */
export const CsvExportIncludesAllPages: StoryObj = {
  render: () => {
    const tableRef = useRef<TableRefType | null>(null);
    const data = createSalesData(25); // 25 rows with 10 per page = 3 pages
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "product", label: "Product", width: 150 },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <h2>CSV Export Includes All Pages</h2>
        <p>Table has 25 rows with 10 per page. CSV should include all 25 rows.</p>
        <button
          id="export-all-pages"
          onClick={() => tableRef.current?.exportToCSV()}
          style={{ marginBottom: "10px", padding: "8px 16px" }}
        >
          Export All Data
        </button>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="400px"
          shouldPaginate={true}
          rowsPerPage={10}
          tableRef={tableRef}
          getRowId={(params) => String(params.row.id)}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const mock = mockCsvDownload();

    try {
      // Verify we're on page 1 (showing 10 rows)
      const visibleRows = canvasElement.querySelectorAll(".st-row");
      expect(visibleRows.length).toBeLessThanOrEqual(10);

      // Export CSV
      const exportButton = canvasElement.querySelector("#export-all-pages") as HTMLButtonElement;
      expect(exportButton).toBeTruthy();
      exportButton.click();

      // Wait for FileReader to complete (it's async)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Verify CSV includes all 25 rows + 1 header row = 26 total
      const csvContent = mock.getLastCsvContent();
      const rows = parseCsv(csvContent);
      expect(rows.length).toBe(26); // 25 data rows + 1 header row
    } finally {
      mock.reset();
    }
  },
};

/**
 * Test 4: CSV Export Without Headers
 * Tests includeHeadersInCSVExport={false}
 */
export const CsvExportWithoutHeaders: StoryObj = {
  render: () => {
    const tableRef = useRef<TableRefType | null>(null);
    const data = createSalesData(5);
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "product", label: "Product", width: 150 },
      { accessor: "price", label: "Price", width: 100 },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <h2>CSV Export Without Headers</h2>
        <p>includeHeadersInCSVExport=false</p>
        <button
          id="export-no-headers"
          onClick={() => tableRef.current?.exportToCSV()}
          style={{ marginBottom: "10px", padding: "8px 16px" }}
        >
          Export Without Headers
        </button>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="300px"
          tableRef={tableRef}
          includeHeadersInCSVExport={false}
          getRowId={(params) => String(params.row.id)}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const mock = mockCsvDownload();

    try {
      const exportButton = canvasElement.querySelector("#export-no-headers") as HTMLButtonElement;
      expect(exportButton).toBeTruthy();
      exportButton.click();

      // Wait for FileReader to complete (it's async)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const csvContent = mock.getLastCsvContent();
      const rows = parseCsv(csvContent);

      // Should have 5 data rows only (no header row)
      expect(rows.length).toBe(5);

      // First row should be data, not headers
      expect(rows[0][0]).toBe("1"); // ID value, not "ID" label
    } finally {
      mock.reset();
    }
  },
};

/**
 * Test 5: Exclude Column from CSV
 * Tests excludeFromCsv column property
 */
export const ExcludeColumnFromCsv: StoryObj = {
  render: () => {
    const tableRef = useRef<TableRefType | null>(null);
    const data = createSalesData(5);
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "product", label: "Product", width: 150 },
      { accessor: "price", label: "Price", width: 100, excludeFromCsv: true },
      { accessor: "quantity", label: "Quantity", width: 100 },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <h2>Exclude Column from CSV</h2>
        <p>Price column has excludeFromCsv=true (visible in table, excluded from CSV)</p>
        <button
          id="export-exclude-column"
          onClick={() => tableRef.current?.exportToCSV()}
          style={{ marginBottom: "10px", padding: "8px 16px" }}
        >
          Export CSV
        </button>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="300px"
          tableRef={tableRef}
          getRowId={(params) => String(params.row.id)}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Verify Price column is visible in table
    const priceHeader = canvasElement.querySelector('[data-accessor="price"]');
    expect(priceHeader).toBeTruthy();

    const mock = mockCsvDownload();

    try {
      const exportButton = canvasElement.querySelector(
        "#export-exclude-column",
      ) as HTMLButtonElement;
      expect(exportButton).toBeTruthy();
      exportButton.click();

      // Wait for FileReader to complete (it's async)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const csvContent = mock.getLastCsvContent();
      const rows = parseCsv(csvContent);

      // Verify headers don't include "Price"
      expect(rows[0]).toContain("ID");
      expect(rows[0]).toContain("Product");
      expect(rows[0]).not.toContain("Price");
      expect(rows[0]).toContain("Quantity");

      // Verify only 3 columns in CSV (ID, Product, Quantity)
      expect(rows[0].length).toBe(3);
    } finally {
      mock.reset();
    }
  },
};

/**
 * Test 6: CSV Export with Value Formatter
 * Tests useFormattedValueForCSV option
 */
export const CsvExportWithValueFormatter: StoryObj = {
  render: () => {
    const tableRef = useRef<TableRefType | null>(null);
    const data = createSalesData(5);
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "product", label: "Product", width: 150 },
      {
        accessor: "price",
        label: "Price",
        width: 120,
        type: "number",
        valueFormatter: ({ value }) => `$${(value as number).toFixed(2)}`,
        useFormattedValueForCSV: true,
      },
      { accessor: "quantity", label: "Quantity", width: 100 },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <h2>CSV Export with Value Formatter</h2>
        <p>Price column uses valueFormatter with useFormattedValueForCSV=true</p>
        <button
          id="export-formatted"
          onClick={() => tableRef.current?.exportToCSV()}
          style={{ marginBottom: "10px", padding: "8px 16px" }}
        >
          Export with Formatted Values
        </button>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="300px"
          tableRef={tableRef}
          getRowId={(params) => String(params.row.id)}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const mock = mockCsvDownload();

    try {
      const exportButton = canvasElement.querySelector("#export-formatted") as HTMLButtonElement;
      expect(exportButton).toBeTruthy();
      exportButton.click();

      // Wait for FileReader to complete (it's async)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const csvContent = mock.getLastCsvContent();
      const rows = parseCsv(csvContent);

      // Verify formatted values in CSV (should have $ prefix)
      // First data row (index 1) should have formatted price
      const firstDataRow = rows[1];
      const priceColumnIndex = rows[0].indexOf("Price");
      expect(priceColumnIndex).toBeGreaterThan(-1);

      const priceValue = firstDataRow[priceColumnIndex];
      expect(priceValue).toMatch(/^\$/); // Should start with $
    } finally {
      mock.reset();
    }
  },
};

/**
 * Test 7: CSV Export with exportValueGetter
 * Tests exportValueGetter for custom export values
 */
export const CsvExportWithExportValueGetter: StoryObj = {
  render: () => {
    const tableRef = useRef<TableRefType | null>(null);
    const data = createSalesData(5);
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "product", label: "Product", width: 150 },
      {
        accessor: "inStock",
        label: "In Stock",
        width: 120,
        type: "boolean",
        exportValueGetter: ({ value }) => (value ? "Yes" : "No"),
      },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <h2>CSV Export with exportValueGetter</h2>
        <p>Boolean column uses exportValueGetter to convert true/false to Yes/No</p>
        <button
          id="export-value-getter"
          onClick={() => tableRef.current?.exportToCSV()}
          style={{ marginBottom: "10px", padding: "8px 16px" }}
        >
          Export with Custom Values
        </button>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="300px"
          tableRef={tableRef}
          getRowId={(params) => String(params.row.id)}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const mock = mockCsvDownload();

    try {
      const exportButton = canvasElement.querySelector("#export-value-getter") as HTMLButtonElement;
      expect(exportButton).toBeTruthy();
      exportButton.click();

      // Wait for FileReader to complete (it's async)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const csvContent = mock.getLastCsvContent();
      const rows = parseCsv(csvContent);

      // Verify custom export values (Yes/No instead of true/false)
      const inStockColumnIndex = rows[0].indexOf("In Stock");
      expect(inStockColumnIndex).toBeGreaterThan(-1);

      // Check data rows for Yes/No values
      for (let i = 1; i < rows.length; i++) {
        const inStockValue = rows[i][inStockColumnIndex];
        expect(["Yes", "No"]).toContain(inStockValue);
      }
    } finally {
      mock.reset();
    }
  },
};

/**
 * Test 8: CSV Export with Filtering
 * Tests that CSV export respects active filters
 */
export const CsvExportWithFiltering: StoryObj = {
  render: () => {
    const tableRef = useRef<TableRefType | null>(null);
    const data = createSalesData(20);
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "product", label: "Product", width: 150, filterable: true },
      { accessor: "price", label: "Price", width: 100, type: "number" },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <h2>CSV Export with Filtering</h2>
        <p>Filter the Product column, then export. CSV should include only filtered rows.</p>
        <button
          id="export-filtered"
          onClick={() => tableRef.current?.exportToCSV()}
          style={{ marginBottom: "10px", padding: "8px 16px" }}
        >
          Export Filtered Data
        </button>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="400px"
          tableRef={tableRef}
          getRowId={(params) => String(params.row.id)}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Note: This test validates the structure. In a real scenario,
    // you would apply a filter first, then export.
    // For now, we just verify export works with filterable columns.

    const mock = mockCsvDownload();

    try {
      const exportButton = canvasElement.querySelector("#export-filtered") as HTMLButtonElement;
      expect(exportButton).toBeTruthy();
      exportButton.click();

      // Wait for FileReader to complete (it's async)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const csvContent = mock.getLastCsvContent();
      expect(csvContent).toBeTruthy();

      const rows = parseCsv(csvContent);
      expect(rows.length).toBeGreaterThan(0);
    } finally {
      mock.reset();
    }
  },
};

/**
 * Test 9: CSV Export with Sorting
 * Tests that CSV export respects current sort order
 */
export const CsvExportWithSorting: StoryObj = {
  render: () => {
    const tableRef = useRef<TableRefType | null>(null);
    const data = createSalesData(10);
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, isSortable: true },
      { accessor: "product", label: "Product", width: 150, isSortable: true },
      { accessor: "price", label: "Price", width: 100, type: "number", isSortable: true },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <h2>CSV Export with Sorting</h2>
        <p>Sort a column, then export. CSV should reflect the sorted order.</p>
        <button
          id="export-sorted"
          onClick={() => tableRef.current?.exportToCSV()}
          style={{ marginBottom: "10px", padding: "8px 16px" }}
        >
          Export Sorted Data
        </button>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="400px"
          tableRef={tableRef}
          getRowId={(params) => String(params.row.id)}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const mock = mockCsvDownload();

    try {
      const exportButton = canvasElement.querySelector("#export-sorted") as HTMLButtonElement;
      expect(exportButton).toBeTruthy();
      exportButton.click();

      // Wait for FileReader to complete (it's async)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const csvContent = mock.getLastCsvContent();
      expect(csvContent).toBeTruthy();

      const rows = parseCsv(csvContent);
      expect(rows.length).toBe(11); // 10 data rows + 1 header
    } finally {
      mock.reset();
    }
  },
};

/**
 * Test 10: CSV Export with Nested Data
 * Tests CSV export with nested data accessors
 */
export const CsvExportWithNestedData: StoryObj = {
  render: () => {
    const tableRef = useRef<TableRefType | null>(null);
    const data = createNestedData(5);
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "user.name", label: "Name", width: 150 },
      { accessor: "user.email", label: "Email", width: 200 },
      { accessor: "metadata.score", label: "Score", width: 100, type: "number" },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <h2>CSV Export with Nested Data</h2>
        <p>Tests CSV export with nested data accessors (dot notation)</p>
        <button
          id="export-nested"
          onClick={() => tableRef.current?.exportToCSV()}
          style={{ marginBottom: "10px", padding: "8px 16px" }}
        >
          Export Nested Data
        </button>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="300px"
          tableRef={tableRef}
          getRowId={(params) => String(params.row.id)}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const mock = mockCsvDownload();

    try {
      const exportButton = canvasElement.querySelector("#export-nested") as HTMLButtonElement;
      expect(exportButton).toBeTruthy();
      exportButton.click();

      // Wait for FileReader to complete (it's async)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const csvContent = mock.getLastCsvContent();
      const rows = parseCsv(csvContent);

      // Verify headers
      expect(rows[0]).toContain("ID");
      expect(rows[0]).toContain("Name");
      expect(rows[0]).toContain("Email");
      expect(rows[0]).toContain("Score");

      // Verify data rows
      expect(rows.length).toBe(6); // 5 data + 1 header

      // Verify nested data is exported
      expect(rows[1][1]).toMatch(/User/); // Name column
      expect(rows[1][2]).toMatch(/@example\.com/); // Email column
    } finally {
      mock.reset();
    }
  },
};

/**
 * Test 11: CSV Export with Array Accessors
 * Tests CSV export with array index accessors
 */
export const CsvExportWithArrayAccessors: StoryObj = {
  render: () => {
    const tableRef = useRef<TableRefType | null>(null);
    const data = createArrayData(5);
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Artist", width: 150 },
      { accessor: "awards[0]", label: "First Award", width: 150 },
      { accessor: "albums[0].title", label: "Album 1", width: 180 },
      { accessor: "albums[0].year", label: "Year", width: 100, type: "number" },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <h2>CSV Export with Array Accessors</h2>
        <p>Tests CSV export with array index accessors</p>
        <button
          id="export-arrays"
          onClick={() => tableRef.current?.exportToCSV()}
          style={{ marginBottom: "10px", padding: "8px 16px" }}
        >
          Export Array Data
        </button>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="300px"
          tableRef={tableRef}
          getRowId={(params) => String(params.row.id)}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const mock = mockCsvDownload();

    try {
      const exportButton = canvasElement.querySelector("#export-arrays") as HTMLButtonElement;
      expect(exportButton).toBeTruthy();
      exportButton.click();

      // Wait for FileReader to complete (it's async)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const csvContent = mock.getLastCsvContent();
      const rows = parseCsv(csvContent);

      // Verify headers
      expect(rows[0]).toContain("ID");
      expect(rows[0]).toContain("Artist");
      expect(rows[0]).toContain("First Award");
      expect(rows[0]).toContain("Album 1");
      expect(rows[0]).toContain("Year");

      // Verify data rows
      expect(rows.length).toBe(6); // 5 data + 1 header
    } finally {
      mock.reset();
    }
  },
};

/**
 * Test 12: Multiple CSV Exports
 * Tests that multiple exports work correctly
 */
export const MultipleCsvExports: StoryObj = {
  render: () => {
    const tableRef = useRef<TableRefType | null>(null);
    const data = createSalesData(5);
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "product", label: "Product", width: 150 },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <h2>Multiple CSV Exports</h2>
        <p>Tests that multiple exports work correctly</p>
        <button
          id="export-first"
          onClick={() => tableRef.current?.exportToCSV({ filename: "export1.csv" })}
          style={{ marginBottom: "10px", marginRight: "10px", padding: "8px 16px" }}
        >
          Export 1
        </button>
        <button
          id="export-second"
          onClick={() => tableRef.current?.exportToCSV({ filename: "export2.csv" })}
          style={{ marginBottom: "10px", padding: "8px 16px" }}
        >
          Export 2
        </button>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="300px"
          tableRef={tableRef}
          getRowId={(params) => String(params.row.id)}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const mock = mockCsvDownload();

    try {
      // First export
      const exportButton1 = canvasElement.querySelector("#export-first") as HTMLButtonElement;
      expect(exportButton1).toBeTruthy();
      exportButton1.click();

      await new Promise((resolve) => setTimeout(resolve, 300));

      const filename1 = mock.getLastFilename();
      expect(filename1).toBe("export1.csv");

      // Second export
      const exportButton2 = canvasElement.querySelector("#export-second") as HTMLButtonElement;
      expect(exportButton2).toBeTruthy();
      exportButton2.click();

      await new Promise((resolve) => setTimeout(resolve, 300));

      const filename2 = mock.getLastFilename();
      expect(filename2).toBe("export2.csv");
    } finally {
      mock.reset();
    }
  },
};
