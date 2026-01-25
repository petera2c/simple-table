import React, { useRef, useState } from "react";
import { SimpleTable } from "../..";
import HeaderObject from "../../types/HeaderObject";
import Row from "../../types/Row";
import { UniversalTableProps } from "./StoryWrapper";
import TableRefType from "../../types/TableRefType";

// Sample data
const sampleData: Row[] = [
  {
    id: 1,
    productName: "Laptop Pro",
    category: "Electronics",
    price: 1299.99,
    stock: 45,
    rating: 4.5,
  },
  {
    id: 2,
    productName: "Wireless Mouse",
    category: "Accessories",
    price: 29.99,
    stock: 120,
    rating: 4.2,
  },
  {
    id: 3,
    productName: "USB-C Hub",
    category: "Accessories",
    price: 49.99,
    stock: 78,
    rating: 4.7,
  },
  {
    id: 4,
    productName: "4K Monitor",
    category: "Electronics",
    price: 599.99,
    stock: 23,
    rating: 4.8,
  },
  {
    id: 5,
    productName: "Mechanical Keyboard",
    category: "Accessories",
    price: 149.99,
    stock: 56,
    rating: 4.6,
  },
];

const headers: HeaderObject[] = [
  {
    accessor: "productName",
    label: "Product Name",
    width: 180,
    isSortable: true,
    type: "string",
  },
  {
    accessor: "category",
    label: "Category",
    width: 140,
    isSortable: true,
    type: "string",
  },
  {
    accessor: "price",
    label: "Price",
    width: 120,
    isSortable: true,
    type: "number",
    valueFormatter: ({ value }) => {
      if (typeof value === "number") {
        return `$${value.toFixed(2)}`;
      }
      return String(value);
    },
  },
  {
    accessor: "stock",
    label: "Stock",
    width: 100,
    isSortable: true,
    type: "number",
  },
  {
    accessor: "rating",
    label: "Rating",
    width: 100,
    isSortable: true,
    type: "number",
    valueFormatter: ({ value }) => {
      if (typeof value === "number") {
        return `⭐ ${value.toFixed(1)}`;
      }
      return String(value);
    },
  },
];

export const headerInclusionExampleDefaults: Partial<UniversalTableProps> = {
  theme: "light",
  selectableCells: true,
  height: "500px",
};

const HeaderInclusionExample: React.FC<UniversalTableProps> = (props) => {
  const tableRef = useRef<TableRefType>(null);
  const [copyHeaders, setCopyHeaders] = useState(false);
  const [exportHeaders, setExportHeaders] = useState(true);

  const handleExportCSV = () => {
    if (tableRef.current) {
      tableRef.current.exportToCSV({ filename: "products.csv" });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2>Header Inclusion Control</h2>
        <div style={{ marginTop: "10px", fontSize: "14px", lineHeight: "1.6" }}>
          <p>
            <strong>
              This example demonstrates control over including column headers in clipboard copy and
              CSV export:
            </strong>
          </p>

          <div
            style={{
              marginTop: "15px",
              padding: "15px",
              backgroundColor: "#e3f2fd",
              borderRadius: "4px",
            }}
          >
            <p>
              <strong>📋 Clipboard Copy:</strong>
            </p>
            <ul style={{ marginTop: "8px", marginBottom: "0" }}>
              <li>
                Select cells in the table below and copy them (Ctrl/Cmd + C or click the button)
              </li>
              <li>
                Toggle <code>copyHeadersToClipboard</code> to control whether column headers are
                included
              </li>
              <li>
                When enabled, headers for the selected columns will be added as the first row in the
                clipboard
              </li>
            </ul>
          </div>

          <div
            style={{
              marginTop: "15px",
              padding: "15px",
              backgroundColor: "#e8f5e9",
              borderRadius: "4px",
            }}
          >
            <p>
              <strong>📥 CSV Export:</strong>
            </p>
            <ul style={{ marginTop: "8px", marginBottom: "0" }}>
              <li>Click the "Export to CSV" button to download the table data</li>
              <li>
                Toggle <code>includeHeadersInCSVExport</code> to control whether headers are
                included in the file
              </li>
              <li>Headers are included by default (matching common CSV export behavior)</li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: "20px", display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <div
            style={{
              padding: "15px",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
              flex: "1",
              minWidth: "250px",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              <input
                type="checkbox"
                checked={copyHeaders}
                onChange={(e) => setCopyHeaders(e.target.checked)}
                style={{ marginRight: "10px", width: "18px", height: "18px", cursor: "pointer" }}
              />
              <span>Copy Headers to Clipboard</span>
            </label>
            <p style={{ marginTop: "8px", fontSize: "12px", color: "#666", marginBottom: "0" }}>
              Current: <code>{copyHeaders ? "true" : "false"}</code>
            </p>
          </div>

          <div
            style={{
              padding: "15px",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
              flex: "1",
              minWidth: "250px",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              <input
                type="checkbox"
                checked={exportHeaders}
                onChange={(e) => setExportHeaders(e.target.checked)}
                style={{ marginRight: "10px", width: "18px", height: "18px", cursor: "pointer" }}
              />
              <span>Include Headers in CSV Export</span>
            </label>
            <p style={{ marginTop: "8px", fontSize: "12px", color: "#666", marginBottom: "0" }}>
              Current: <code>{exportHeaders ? "true" : "false"}</code>
            </p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          style={{
            marginTop: "15px",
            padding: "10px 20px",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          📥 Export to CSV
        </button>
      </div>
      <SimpleTable
        tableRef={tableRef}
        rows={sampleData}
        defaultHeaders={headers}
        copyHeadersToClipboard={copyHeaders}
        includeHeadersInCSVExport={exportHeaders}
        {...props}
      />
    </div>
  );
};

export default HeaderInclusionExample;
