import { useState, useMemo } from "react";
import { SimpleTable } from "@simple-table/react";
import type {
  Theme,
  ReactHeaderObject,
  CellRendererProps,
  RowSelectionChangeProps,
} from "@simple-table/react";
import { rowSelectionConfig, rowSelectionData } from "./row-selection.demo-data";
import type { LibraryBook } from "./row-selection.demo-data";
import "@simple-table/react/styles.css";

const RowSelectionDemo = ({
  height = "348px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const [selectedBooks, setSelectedBooks] = useState<LibraryBook[]>([]);

  const headers: ReactHeaderObject[] = useMemo(
    () =>
      rowSelectionConfig.headers.map((h) => {
        if (h.accessor === "status") {
          return {
            ...h,
            cellRenderer: ({ row }: CellRendererProps) => {
              const s = String(row.status);
              const color =
                s === "Available" ? "#16a34a" : s === "Checked Out" ? "#ea580c" : "#dc2626";
              return <span style={{ color, fontWeight: "bold" }}>{s}</span>;
            },
          };
        }
        return h;
      }),
    [],
  );

  const handleRowSelectionChange = (props: RowSelectionChangeProps) => {
    const selected = rowSelectionData.filter((book) => props.selectedRows.has(String(book.id)));
    setSelectedBooks(selected);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        style={{
          padding: 12,
          backgroundColor: "#f0f9ff",
          borderRadius: 8,
          border: "1px solid #bae6fd",
        }}
      >
        <div style={{ fontWeight: "bold", marginBottom: 4, color: "#0c4a6e" }}>
          Library Management Demo
        </div>
        <div style={{ fontSize: 13, color: "#475569", marginBottom: 6 }}>
          Click rows to select books. Use the checkbox column to select multiple.
        </div>
        <div style={{ fontSize: 13, color: "#334155" }}>
          <strong>Selected Books: </strong>
          {selectedBooks.length > 0 ? selectedBooks.map((b) => b.title).join(", ") : "None"}
        </div>
      </div>

      <SimpleTable
        defaultHeaders={headers}
        rows={rowSelectionConfig.rows}
        enableRowSelection
        columnResizing
        columnReordering
        selectableCells
        onRowSelectionChange={handleRowSelectionChange}
        height={height}
        theme={theme}
      />
    </div>
  );
};

export default RowSelectionDemo;
