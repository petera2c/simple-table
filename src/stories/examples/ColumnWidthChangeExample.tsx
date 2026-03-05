import { useState, useMemo } from "react";
import { SimpleTable } from "../..";
import { HeaderObject } from "../..";
import { UniversalTableProps } from "./StoryWrapper";

const STORAGE_KEY = "simple-table-column-widths";

const createData = (rowLength: number) => {
  return Array.from({ length: rowLength }, (_, index) => ({
    id: index + 1,
    name: `Name ${index + 1}`,
    age: Math.floor(Math.random() * 100),
    role: `Role ${index + 1}`,
  }));
};

// Default column widths
const DEFAULT_WIDTHS: Record<string, number> = {
  id: 80,
  name: 150,
  age: 100,
  role: 150,
};

const ColumnWidthChangeExample = (props: UniversalTableProps) => {
  const [widthChanges, setWidthChanges] = useState<string[]>([]);

  // Load saved widths from localStorage or use defaults
  const headers: HeaderObject[] = useMemo(() => {
    let savedWidths: Record<string, number> = {};

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        savedWidths = JSON.parse(saved);
      }
    } catch (error) {
      console.error("Failed to load saved column widths:", error);
    }

    return [
      {
        accessor: "id",
        label: "ID",
        width: savedWidths.id || DEFAULT_WIDTHS.id,
        isSortable: true,
      },
      {
        accessor: "name",
        label: "Name",
        width: savedWidths.name || DEFAULT_WIDTHS.name,
        isSortable: true,
      },
      {
        accessor: "age",
        label: "Age",
        width: savedWidths.age || DEFAULT_WIDTHS.age,
        isSortable: true,
      },
      {
        accessor: "role",
        label: "Role",
        width: savedWidths.role || DEFAULT_WIDTHS.role,
        isSortable: true,
      },
    ];
  }, []);

  const handleColumnWidthChange = (updatedHeaders: HeaderObject[]) => {
    const timestamp = new Date().toLocaleTimeString();
    const widthInfo = updatedHeaders
      .map((h) => `${h.label}: ${typeof h.width === "number" ? h.width + "px" : h.width}`)
      .join(", ");

    // Save to localStorage
    try {
      const widthsToSave: Record<string, number> = {};
      updatedHeaders.forEach((header) => {
        if (typeof header.width === "number") {
          widthsToSave[header.accessor as string] = header.width;
        }
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(widthsToSave));
    } catch (error) {
      console.error("Failed to save column widths:", error);
    }

    setWidthChanges((prev) => [
      `[${timestamp}] ${widthInfo} (saved to localStorage)`,
      ...prev.slice(0, 9), // Keep last 10 entries
    ]);
  };

  const handleResetWidths = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setWidthChanges((prev) => [
        `[${new Date().toLocaleTimeString()}] Widths reset to defaults. Refresh page to see changes.`,
        ...prev.slice(0, 9),
      ]);
    } catch (error) {
      console.error("Failed to reset column widths:", error);
    }
  };

  const data = useMemo(() => createData(20), []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Column Width Change Example</h2>
      <p>
        Resize columns by dragging the resize handles or double-click the resize handle to
        auto-size. The <code>onColumnWidthChange</code> callback will be triggered with the updated
        headers. Column widths are automatically saved to localStorage and restored on page reload.
      </p>

      <SimpleTable
        {...props}
        defaultHeaders={headers}
        rows={data}
        columnResizing={true}
        height="400px"
        onColumnWidthChange={handleColumnWidthChange}
      />

      <div style={{ marginBottom: "20px" }}>
        <h3>Width Change Log:</h3>
        <button
          onClick={handleResetWidths}
          style={{
            marginBottom: "10px",
            padding: "8px 16px",
            backgroundColor: "#ff6b6b",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Reset to Default Widths
        </button>
        <div
          style={{
            maxHeight: "200px",
            overflowY: "auto",
            border: "1px solid #ccc",
            padding: "10px",
            backgroundColor: "#f5f5f5",
            fontFamily: "monospace",
            fontSize: "12px",
          }}
        >
          {widthChanges.length === 0 ? (
            <div style={{ color: "#999" }}>No width changes yet. Try resizing a column!</div>
          ) : (
            widthChanges.map((change, index) => (
              <div key={index} style={{ marginBottom: "5px" }}>
                {change}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ColumnWidthChangeExample;
