import { useRef, useState } from "react";
import { SimpleTable } from "@simple-table/react";
import type { ReactHeaderObject, TableAPI, Theme, CellRendererProps } from "@simple-table/react";
import "@simple-table/react/styles.css";

// Define headers with various types for comprehensive testing
const headers: ReactHeaderObject[] = [
  {
    accessor: "id",
    label: "ID",
    width: 70,
    type: "number",
    isSortable: true,
    filterable: true,
  },
  {
    accessor: "name",
    label: "Product Name",
    width: "1fr",
    minWidth: 150,
    type: "string",
    isSortable: true,
    filterable: true,
  },
  {
    accessor: "category",
    label: "Category",
    width: 140,
    type: "enum",
    isSortable: true,
    filterable: true,
    enumOptions: [
      { label: "Electronics", value: "Electronics" },
      { label: "Furniture", value: "Furniture" },
      { label: "Stationery", value: "Stationery" },
      { label: "Appliances", value: "Appliances" },
    ],
  },
  {
    accessor: "price",
    label: "Price",
    width: 110,
    align: "right",
    type: "number",
    isSortable: true,
    filterable: true,
    cellRenderer: ({ row }: CellRendererProps) => {
      const price = row.price as number;
      return `$${price.toFixed(2)}`;
    },
  },
  {
    accessor: "stock",
    label: "Stock",
    width: 100,
    align: "right",
    type: "number",
    isSortable: true,
    filterable: true,
  },
  {
    accessor: "status",
    label: "Status",
    width: 110,
    type: "enum",
    isSortable: true,
    filterable: true,
    enumOptions: [
      { label: "Available", value: "Available" },
      { label: "Low Stock", value: "Low Stock" },
      { label: "Out of Stock", value: "Out of Stock" },
    ],
    cellRenderer: ({ row }: CellRendererProps) => {
      const status = row.status as string;
      const colors: Record<string, string> = {
        Available: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
        "Low Stock": "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
        "Out of Stock": "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
      };
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || ""}`}>
          {status}
        </span>
      );
    },
  },
];

// Sample product data
const PRODUCT_DATA = [
  {
    id: 1,
    name: "Wireless Keyboard",
    category: "Electronics",
    price: 49.99,
    stock: 145,
    status: "Available",
  },
  {
    id: 2,
    name: "Ergonomic Mouse",
    category: "Electronics",
    price: 29.99,
    stock: 12,
    status: "Low Stock",
  },
  {
    id: 3,
    name: "USB-C Hub",
    category: "Electronics",
    price: 39.99,
    stock: 234,
    status: "Available",
  },
  {
    id: 4,
    name: "Standing Desk",
    category: "Furniture",
    price: 399.99,
    stock: 0,
    status: "Out of Stock",
  },
  {
    id: 5,
    name: "Office Chair",
    category: "Furniture",
    price: 249.99,
    stock: 56,
    status: "Available",
  },
  {
    id: 6,
    name: "Monitor Stand",
    category: "Furniture",
    price: 79.99,
    stock: 8,
    status: "Low Stock",
  },
  {
    id: 7,
    name: "Notebook Set",
    category: "Stationery",
    price: 12.99,
    stock: 445,
    status: "Available",
  },
  {
    id: 8,
    name: "Pen Collection",
    category: "Stationery",
    price: 19.99,
    stock: 312,
    status: "Available",
  },
  {
    id: 9,
    name: "Desk Organizer",
    category: "Stationery",
    price: 24.99,
    stock: 5,
    status: "Low Stock",
  },
  {
    id: 10,
    name: "Coffee Maker",
    category: "Appliances",
    price: 89.99,
    stock: 78,
    status: "Available",
  },
  {
    id: 11,
    name: "Electric Kettle",
    category: "Appliances",
    price: 34.99,
    stock: 134,
    status: "Available",
  },
  {
    id: 12,
    name: "Desk Lamp LED",
    category: "Appliances",
    price: 44.99,
    stock: 0,
    status: "Out of Stock",
  },
];

const ProgrammaticControlDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const tableRef = useRef<TableAPI>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");

  // Sort State Methods
  const handleSortByName = async () => {
    await tableRef.current?.applySortState({ accessor: "name", direction: "asc" });
    setStatusMessage("Sorted by Name (A-Z)");
  };

  // Filter State Methods
  const handleFilterAvailable = async () => {
    await tableRef.current?.applyFilter({
      accessor: "status",
      operator: "equals",
      value: "Available",
    });
    setStatusMessage("Filtered to Available products");
  };

  const handleClearAllFilters = async () => {
    await tableRef.current?.clearAllFilters();
    setStatusMessage("All filters cleared");
  };

  const handleGetTableInfo = () => {
    const allRows = tableRef.current?.getAllRows();
    const headers = tableRef.current?.getHeaders();
    const sortState = tableRef.current?.getSortState();
    const filterState = tableRef.current?.getFilterState();

    const totalValue =
      allRows?.reduce((sum, tableRow) => {
        return sum + ((tableRow.row.price as number) * (tableRow.row.stock as number) || 0);
      }, 0) || 0;

    alert(
      `📊 Table Information:\n\n` +
        `Rows: ${allRows?.length || 0}\n` +
        `Columns: ${headers?.length || 0}\n` +
        `Active Filters: ${Object.keys(filterState || {}).length}\n` +
        `Sort Applied: ${
          sortState ? `${sortState.key.label} (${sortState.direction})` : "None"
        }\n\n` +
        `📈 Analytics:\n` +
        `Total Inventory Value: $${totalValue.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
    );
  };

  const handleSortByPriceDesc = async () => {
    await tableRef.current?.applySortState({ accessor: "price", direction: "desc" });
    setStatusMessage("Sorted by price (High to Low)");
  };

  return (
    <div className="space-y-4">
      {/* Status Message */}
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
          {statusMessage || "No status message"}
        </p>
      </div>

      {/* Control Panel */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleSortByName}
          className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          Sort by Name (A-Z)
        </button>
        <button
          onClick={handleSortByPriceDesc}
          className="px-4 py-2 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
        >
          Sort by price (High to Low)
        </button>
        <button
          onClick={handleFilterAvailable}
          className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          Filter: Available
        </button>
        <button
          onClick={handleClearAllFilters}
          className="px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          Clear Filters
        </button>
        <button
          onClick={handleGetTableInfo}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Get Table Info
        </button>
      </div>

      {/* Table */}
      <SimpleTable
        defaultHeaders={headers}
        rows={PRODUCT_DATA}
        ref={tableRef}
        height={height}
        theme={theme}
      />
    </div>
  );
};

export default ProgrammaticControlDemo;
