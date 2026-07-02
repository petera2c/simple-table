import { createSignal, createMemo } from "solid-js";
import {SimpleTable} from "@simple-table/solid";import type {
  Theme,
  SolidHeaderObject,
  CellRendererProps,
  RowSelectionChangeProps,
} from "@simple-table/solid";
import { rowSelectionConfig, rowSelectionData } from "./row-selection.demo-data";
import type { LibraryBook } from "./row-selection.demo-data";
import "@simple-table/solid/styles.css";

export default function RowSelectionDemo(props: {
  height?: string | number;
  theme?: Theme;
}) {
  const [selectedBooks, setSelectedBooks] = createSignal<LibraryBook[]>([]);

  const selectedTitles = createMemo(() => {
    const books = selectedBooks();
    return books.length > 0 ? books.map((b) => b.title).join(", ") : "None";
  });

  const headers: SolidHeaderObject[] = rowSelectionConfig.headers.map((h) => {
    if (h.accessor === "status") {
      return {
        ...h,
        cellRenderer: (cr: CellRendererProps) => {
          const s = String(cr.row.status);
          const color = s === "Available" ? "#16a34a" : s === "Checked Out" ? "#ea580c" : "#dc2626";
          return <span style={{ color, "font-weight": "bold" }}>{s}</span>;
        },
      };
    }
    return h;
  });

  const handleSelectionChange = (selection: RowSelectionChangeProps) => {
    const selected = rowSelectionData.filter((book) =>
      selection.selectedRows.has(String(book.id)),
    );
    setSelectedBooks(selected);
  };

  return (
    <div style={{ display: "flex", "flex-direction": "column", gap: "12px" }}>
      <div
        style={{
          padding: "12px",
          "background-color": "#f0f9ff",
          "border-radius": "8px",
          border: "1px solid #bae6fd",
        }}
      >
        <div style={{ "font-weight": "bold", "margin-bottom": "4px", color: "#0c4a6e" }}>
          Library Management Demo
        </div>
        <div style={{ "font-size": "13px", color: "#475569", "margin-bottom": "6px" }}>
          Click rows to select books. Use the checkbox column to select multiple.
        </div>
        <div style={{ "font-size": "13px", color: "#334155" }}>
          <strong>Selected Books: </strong>
          {selectedTitles()}
        </div>
      </div>

      <SimpleTable
        defaultHeaders={headers}
        rows={rowSelectionConfig.rows}
        height={props.height ?? "348px"}
        theme={props.theme}
        enableRowSelection={true}
        columnResizing={true}
        columnReordering={true}
        selectableCells={true}
        onRowSelectionChange={handleSelectionChange}
      />
    </div>
  );
}
