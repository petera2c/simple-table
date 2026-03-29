import { useState, useMemo } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme, ReactHeaderObject, CellClickProps } from "@simple-table/react";
import { cellClickingHeaders, cellClickingData, CELL_CLICKING_STATUSES } from "@simple-table/examples-shared";
import type { ProjectTask } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const CellClickingDemo = ({
  height,
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const [clickInfo, setClickInfo] = useState("");
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);
  const [rows, setRows] = useState<ProjectTask[]>([...cellClickingData]);

  const headers: ReactHeaderObject[] = useMemo(
    () =>
      cellClickingHeaders.map((h) => {
        if (h.accessor === "priority") {
          return {
            ...h,
            cellRenderer: ({ row }) => {
              const p = String(row.priority);
              return (
                <span
                  style={{
                    color: p === "High" ? "#ef4444" : p === "Medium" ? "#f59e0b" : "#10b981",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                  title="Click to filter by priority"
                >
                  {p}
                </span>
              );
            },
          } as ReactHeaderObject;
        }
        if (h.accessor === "status") {
          return {
            ...h,
            cellRenderer: ({ row }) => {
              const s = String(row.status);
              const bg = s === "Completed" ? "#dcfce7" : s === "In Progress" ? "#fef3c7" : "#fee2e2";
              const color = s === "Completed" ? "#166534" : s === "In Progress" ? "#92400e" : "#991b1b";
              return (
                <span
                  style={{
                    backgroundColor: bg,
                    color,
                    padding: "4px 8px",
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                  title="Click to change status"
                >
                  {s}
                </span>
              );
            },
          } as ReactHeaderObject;
        }
        if (h.accessor === "details") {
          return {
            ...h,
            cellRenderer: () => (
              <button
                style={{
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
                title="Click to view task details"
              >
                View Details
              </button>
            ),
          } as ReactHeaderObject;
        }
        return { ...h } as ReactHeaderObject;
      }),
    [],
  );

  const handleCellClick = ({ accessor, rowIndex, value, row }: CellClickProps) => {
    const task = row as ProjectTask;
    switch (accessor) {
      case "priority": {
        setClickInfo(`Filtering by ${value} priority`);
        setRows(cellClickingData.filter((t) => t.priority === value));
        break;
      }
      case "status": {
        const idx = CELL_CLICKING_STATUSES.indexOf(String(value));
        const next = CELL_CLICKING_STATUSES[(idx + 1) % CELL_CLICKING_STATUSES.length];
        setRows((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: next } : t)));
        setClickInfo(`Status changed from "${value}" to "${next}"`);
        break;
      }
      case "details":
        setSelectedTask(task);
        setClickInfo(`Opening details for: ${task.task}`);
        break;
      case "estimatedHours": {
        const newVal = Math.min(task.estimatedHours + 2, 40);
        setRows((prev) => prev.map((t) => (t.id === task.id ? { ...t, estimatedHours: newVal } : t)));
        setClickInfo(`Est. hours: ${task.estimatedHours}h → ${newVal}h`);
        break;
      }
      case "completedHours": {
        const newVal = Math.min(task.completedHours + 1, task.estimatedHours);
        setRows((prev) => prev.map((t) => (t.id === task.id ? { ...t, completedHours: newVal } : t)));
        setClickInfo(`Done hours: ${task.completedHours}h → ${newVal}h`);
        break;
      }
      default:
        setClickInfo(`Clicked [${accessor}] = "${value}" (row ${rowIndex})`);
    }
  };

  const isDark = theme === "modern-dark" || theme === "dark";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          padding: 12,
          backgroundColor: isDark ? "#374151" : "#f3f4f6",
          borderRadius: 8,
          border: `1px solid ${isDark ? "#4b5563" : "#d1d5db"}`,
          minHeight: 48,
          display: "flex",
          alignItems: "center",
        }}
      >
        <strong style={{ marginRight: 8, color: isDark ? "#f9fafb" : "#1f2937" }}>Last Click:</strong>
        <span style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>
          {clickInfo || "Click any cell to see interaction details..."}
        </span>
      </div>

      {selectedTask && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: isDark ? "#1f2937" : "white",
              padding: 24,
              borderRadius: 8,
              maxWidth: 500,
              width: "90%",
            }}
          >
            <h3 style={{ margin: "0 0 16px", color: isDark ? "#f9fafb" : "#1f2937" }}>Task Details</h3>
            {(["task", "details", "assignee", "status", "priority"] as const).map((key) => (
              <p key={key} style={{ margin: "8px 0", color: isDark ? "#d1d5db" : "#4b5563" }}>
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {selectedTask[key]}
              </p>
            ))}
            <button
              onClick={() => setSelectedTask(null)}
              style={{
                marginTop: 16,
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: 4,
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <SimpleTable
        columnResizing
        defaultHeaders={headers}
        height={height ?? "320px"}
        onCellClick={handleCellClick}
        rows={rows}
        theme={theme}
      />
    </div>
  );
};

export default CellClickingDemo;
