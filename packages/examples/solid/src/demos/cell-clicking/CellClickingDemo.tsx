import { createSignal, createMemo, Show, For } from "solid-js";
import { SimpleTable } from "@simple-table/solid";
import type { Theme, SolidHeaderObject, CellRendererProps } from "@simple-table/solid";
import type { CellClickProps } from "simple-table-core";
import { cellClickingHeaders, cellClickingData, CELL_CLICKING_STATUSES } from "@simple-table/examples-shared";
import type { ProjectTask } from "@simple-table/examples-shared";
import "@simple-table/solid/styles.css";

const DETAIL_KEYS = ["task", "details", "assignee", "status", "priority"] as const;

export default function CellClickingDemo(props: { height?: string | number; theme?: Theme }) {
  const [clickInfo, setClickInfo] = createSignal("");
  const [selectedTask, setSelectedTask] = createSignal<ProjectTask | null>(null);
  const [rows, setRows] = createSignal<ProjectTask[]>([...cellClickingData]);

  const headers: SolidHeaderObject[] = cellClickingHeaders.map((h) => {
    if (h.accessor === "priority") {
      return {
        ...h,
        cellRenderer: (cr: CellRendererProps) => {
          const p = String(cr.row.priority);
          const color = p === "High" ? "#ef4444" : p === "Medium" ? "#f59e0b" : "#10b981";
          return (
            <span style={{ color, "font-weight": "bold", cursor: "pointer" }} title="Click to filter">
              {p}
            </span>
          );
        },
      };
    }
    if (h.accessor === "status") {
      return {
        ...h,
        cellRenderer: (cr: CellRendererProps) => {
          const s = String(cr.row.status);
          const bg = s === "Completed" ? "#dcfce7" : s === "In Progress" ? "#fef3c7" : "#fee2e2";
          const c = s === "Completed" ? "#166534" : s === "In Progress" ? "#92400e" : "#991b1b";
          return (
            <span
              style={{
                background: bg,
                color: c,
                padding: "4px 8px",
                "border-radius": "4px",
                "font-size": "12px",
                "font-weight": "bold",
                cursor: "pointer",
              }}
              title="Click to change"
            >
              {s}
            </span>
          );
        },
      };
    }
    if (h.accessor === "details") {
      return {
        ...h,
        cellRenderer: () => (
          <button
            type="button"
            style={{
              background: "#3b82f6",
              color: "white",
              border: "none",
              padding: "6px 12px",
              "border-radius": "4px",
              cursor: "pointer",
              "font-size": "12px",
              "font-weight": "bold",
            }}
          >
            View Details
          </button>
        ),
      };
    }
    return { ...h };
  });

  const isDark = createMemo(() => props.theme === "modern-dark" || props.theme === "dark");

  const handleCellClick = ({ accessor, rowIndex, value, row }: CellClickProps) => {
    const task = row as ProjectTask;
    switch (accessor) {
      case "priority":
        setClickInfo(`Filtering by ${value} priority`);
        setRows(cellClickingData.filter((t) => t.priority === value));
        break;
      case "status": {
        const idx = CELL_CLICKING_STATUSES.indexOf(String(value));
        const next = CELL_CLICKING_STATUSES[(idx + 1) % CELL_CLICKING_STATUSES.length];
        setRows((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: next } : t)));
        setClickInfo(`Status: "${value}" → "${next}"`);
        break;
      }
      case "details":
        setSelectedTask(task);
        setClickInfo(`Opening details for: ${task.task}`);
        break;
      case "estimatedHours": {
        const n = Math.min(task.estimatedHours + 2, 40);
        setRows((prev) => prev.map((t) => (t.id === task.id ? { ...t, estimatedHours: n } : t)));
        setClickInfo(`Est. hours: ${task.estimatedHours}h → ${n}h`);
        break;
      }
      case "completedHours": {
        const n = Math.min(task.completedHours + 1, task.estimatedHours);
        setRows((prev) => prev.map((t) => (t.id === task.id ? { ...t, completedHours: n } : t)));
        setClickInfo(`Done hours: ${task.completedHours}h → ${n}h`);
        break;
      }
      default:
        setClickInfo(`Clicked [${accessor}] = "${value}" (row ${rowIndex})`);
    }
  };

  return (
    <div style={{ display: "flex", "flex-direction": "column", gap: "16px" }}>
      <div
        style={{
          padding: "12px",
          "background-color": isDark() ? "#374151" : "#f3f4f6",
          "border-radius": "8px",
          border: `1px solid ${isDark() ? "#4b5563" : "#d1d5db"}`,
          "min-height": "48px",
          display: "flex",
          "align-items": "center",
        }}
      >
        <strong style={{ "margin-right": "8px", color: isDark() ? "#f9fafb" : "#1f2937" }}>Last Click:</strong>
        <span style={{ color: isDark() ? "#d1d5db" : "#4b5563" }}>
          {clickInfo() || "Click any cell to see interaction details..."}
        </span>
      </div>

      <Show when={selectedTask()}>
        {(task) => (
          <div
            style={{
              position: "fixed",
              inset: "0",
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              "align-items": "center",
              "justify-content": "center",
              "z-index": 1000,
            }}
          >
            <div
              style={{
                background: isDark() ? "#1f2937" : "white",
                padding: "24px",
                "border-radius": "8px",
                "max-width": "500px",
                width: "90%",
              }}
            >
              <h3 style={{ margin: "0 0 16px", color: isDark() ? "#f9fafb" : "#1f2937" }}>Task Details</h3>
              <For each={DETAIL_KEYS}>
                {(key) => (
                  <p style={{ margin: "8px 0", color: isDark() ? "#d1d5db" : "#4b5563" }}>
                    <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {String(task()[key])}
                  </p>
                )}
              </For>
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                style={{
                  "margin-top": "16px",
                  background: "#3b82f6",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  "border-radius": "4px",
                  cursor: "pointer",
                  "font-weight": "bold",
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Show>

      <SimpleTable
        columnResizing
        defaultHeaders={headers}
        height={props.height ?? "320px"}
        onCellClick={handleCellClick}
        rows={rows()}
        theme={props.theme}
      />
    </div>
  );
}
