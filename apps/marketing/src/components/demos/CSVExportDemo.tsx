import { useRef } from "react";
import { SimpleTable } from "@simple-table/react";
import type { ReactHeaderObject, TableAPI, Theme } from "@simple-table/react";
import "@simple-table/react/styles.css";

// Define headers with new CSV formatting features
const headers: ReactHeaderObject[] = [
  {
    accessor: "id",
    label: "Internal ID",
    width: 80,
    type: "string",
    excludeFromRender: true, // Hide from table, but include in CSV exports
  },
  { accessor: "sku", label: "SKU", width: 100, isSortable: true, type: "string" },
  {
    accessor: "product",
    label: "Product Name",
    minWidth: 120,
    width: "1fr",
    isSortable: true,
    type: "string",
  },
  {
    accessor: "category",
    label: "Category",
    width: 130,
    isSortable: true,
    type: "string",
    valueFormatter: ({ value }) => {
      return (value as string).charAt(0).toUpperCase() + (value as string).slice(1);
    },
    // Add category code in CSV export
    exportValueGetter: ({ value }) => {
      const codes: Record<string, string> = {
        electronics: "ELEC",
        furniture: "FURN",
        stationery: "STAT",
        appliances: "APPL",
      };
      const str = value as string;
      const code = codes[str.toLowerCase()] || "OTH";
      return `${str.charAt(0).toUpperCase() + str.slice(1)} (${code})`;
    },
  },
  {
    accessor: "price",
    label: "Price",
    width: 100,
    isSortable: true,
    type: "number",
    valueFormatter: ({ value }) => {
      return `$${(value as number).toFixed(2)}`;
    },
    useFormattedValueForCSV: true, // Export formatted price
    useFormattedValueForClipboard: true, // Copy formatted price
  },
  { accessor: "stock", label: "In Stock", width: 100, isSortable: true, type: "number" },
  { accessor: "sold", label: "Units Sold", width: 110, isSortable: true, type: "number" },
  {
    accessor: "revenue",
    label: "Revenue",
    width: 120,
    isSortable: true,
    type: "number",
    valueFormatter: ({ value }) => {
      return `$${(value as number).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
    useFormattedValueForCSV: true, // Export formatted revenue
    useFormattedValueForClipboard: true, // Copy formatted revenue
  },
  {
    accessor: "actions",
    label: "Actions",
    width: 100,
    type: "string",
    excludeFromCsv: true, // Hide from CSV exports (action buttons not useful in exports)
    cellRenderer: () => {
      return (
        <button className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-900 text-sm">
          View
        </button>
      );
    },
  },
];

// Sample sales data
const SALES_DATA = [
  {
    id: "db-1001",
    sku: "PRD-1001",
    product: "Wireless Keyboard",
    category: "Electronics",
    price: 49.99,
    stock: 145,
    sold: 234,
    revenue: 11697.66,
    actions: "",
  },
  {
    id: "db-1002",
    sku: "PRD-1002",
    product: "Ergonomic Mouse",
    category: "Electronics",
    price: 29.99,
    stock: 89,
    sold: 456,
    revenue: 13675.44,
    actions: "",
  },
  {
    id: "db-1003",
    sku: "PRD-1003",
    product: "USB-C Hub",
    category: "Electronics",
    price: 39.99,
    stock: 234,
    sold: 178,
    revenue: 7118.22,
    actions: "",
  },
  {
    id: "db-2001",
    sku: "PRD-2001",
    product: "Standing Desk",
    category: "Furniture",
    price: 399.99,
    stock: 23,
    sold: 67,
    revenue: 26799.33,
    actions: "",
  },
  {
    id: "db-2002",
    sku: "PRD-2002",
    product: "Office Chair",
    category: "Furniture",
    price: 249.99,
    stock: 56,
    sold: 123,
    revenue: 30748.77,
    actions: "",
  },
  {
    id: "db-2003",
    sku: "PRD-2003",
    product: "Monitor Stand",
    category: "Furniture",
    price: 79.99,
    stock: 167,
    sold: 89,
    revenue: 7119.11,
    actions: "",
  },
  {
    id: "db-3001",
    sku: "PRD-3001",
    product: "Notebook Set",
    category: "Stationery",
    price: 12.99,
    stock: 445,
    sold: 678,
    revenue: 8807.22,
    actions: "",
  },
  {
    id: "db-3002",
    sku: "PRD-3002",
    product: "Pen Collection",
    category: "Stationery",
    price: 19.99,
    stock: 312,
    sold: 534,
    revenue: 10674.66,
    actions: "",
  },
  {
    id: "db-3003",
    sku: "PRD-3003",
    product: "Desk Organizer",
    category: "Stationery",
    price: 24.99,
    stock: 198,
    sold: 289,
    revenue: 7222.11,
    actions: "",
  },
  {
    id: "db-4001",
    sku: "PRD-4001",
    product: "Coffee Maker",
    category: "Appliances",
    price: 89.99,
    stock: 78,
    sold: 156,
    revenue: 14038.44,
    actions: "",
  },
  {
    id: "db-4002",
    sku: "PRD-4002",
    product: "Electric Kettle",
    category: "Appliances",
    price: 34.99,
    stock: 134,
    sold: 267,
    revenue: 9342.33,
    actions: "",
  },
  {
    id: "db-4003",
    sku: "PRD-4003",
    product: "Desk Lamp LED",
    category: "Appliances",
    price: 44.99,
    stock: 201,
    sold: 198,
    revenue: 8908.02,
    actions: "",
  },
];

const CSVExportDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const tableRef = useRef<TableAPI>(null);

  const handleGetTableInfo = () => {
    const allRows = tableRef.current?.getAllRows();
    const headers = tableRef.current?.getHeaders();

    // Extract raw data from TableRow objects
    const totalRevenue =
      allRows?.reduce((sum, tableRow) => {
        return sum + ((tableRow.row.revenue as number) || 0);
      }, 0) || 0;

    alert(
      `Table Info:\n\n` +
        `Total Rows: ${allRows?.length || 0}\n` +
        `Total Columns: ${headers?.length || 0}\n` +
        `Column Names: ${headers?.map((h) => h.label).join(", ") || "N/A"}\n\n` +
        `Total Revenue: $${totalRevenue.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => tableRef.current?.exportToCSV()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Export to CSV
        </button>
        <button
          onClick={handleGetTableInfo}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
        >
          Get Table Info
        </button>
      </div>
      <SimpleTable
        defaultHeaders={headers}
        editColumns
        height={typeof height === "number" ? `${height - 60}px` : height}
        rows={SALES_DATA}
        customTheme={{
          rowHeight: 32,
        }}
        selectableCells
        theme={theme}
        ref={tableRef}
      />
    </div>
  );
};

export default CSVExportDemo;
