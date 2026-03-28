<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import type { HeaderObject, CellClickProps } from "simple-table-core";
  import { cellClickingHeaders, cellClickingData, CELL_CLICKING_STATUSES } from "@simple-table/examples-shared";
  import type { ProjectTask } from "@simple-table/examples-shared";
  import "simple-table-core/styles.css";

  let { height = "320px", theme }: { height?: string | number; theme?: Theme } = $props();

  let clickInfo = $state("");
  let selectedTask: ProjectTask | null = $state(null);
  let rows: ProjectTask[] = $state([...cellClickingData]);

  const headers: HeaderObject[] = cellClickingHeaders.map((h) => {
    if (h.accessor === "priority") {
      return { ...h, cellRenderer: ({ row }: { row: Record<string, unknown> }) => {
        const p = String(row.priority);
        const color = p === "High" ? "#ef4444" : p === "Medium" ? "#f59e0b" : "#10b981";
        const el = document.createElement("span");
        Object.assign(el.style, { color, fontWeight: "bold", cursor: "pointer" });
        el.title = "Click to filter by priority";
        el.textContent = p;
        return el;
      }};
    }
    if (h.accessor === "status") {
      return { ...h, cellRenderer: ({ row }: { row: Record<string, unknown> }) => {
        const s = String(row.status);
        const bg = s === "Completed" ? "#dcfce7" : s === "In Progress" ? "#fef3c7" : "#fee2e2";
        const c = s === "Completed" ? "#166534" : s === "In Progress" ? "#92400e" : "#991b1b";
        const el = document.createElement("span");
        Object.assign(el.style, { background: bg, color: c, padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" });
        el.title = "Click to change status";
        el.textContent = s;
        return el;
      }};
    }
    if (h.accessor === "details") {
      return { ...h, cellRenderer: () => {
        const btn = document.createElement("button");
        Object.assign(btn.style, { background: "#3b82f6", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" });
        btn.textContent = "View Details";
        return btn;
      }};
    }
    return { ...h };
  });

  let isDark = $derived(theme === "modern-dark" || theme === "dark");

  function handleCellClick({ accessor, rowIndex, value, row }: CellClickProps) {
    const task = row as ProjectTask;
    switch (accessor) {
      case "priority":
        clickInfo = `Filtering by ${value} priority`;
        rows = cellClickingData.filter((t) => t.priority === value);
        break;
      case "status": {
        const idx = CELL_CLICKING_STATUSES.indexOf(String(value));
        const next = CELL_CLICKING_STATUSES[(idx + 1) % CELL_CLICKING_STATUSES.length];
        rows = rows.map((t) => (t.id === task.id ? { ...t, status: next } : t));
        clickInfo = `Status: "${value}" → "${next}"`;
        break;
      }
      case "details":
        selectedTask = task;
        clickInfo = `Opening details for: ${task.task}`;
        break;
      case "estimatedHours": {
        const n = Math.min(task.estimatedHours + 2, 40);
        rows = rows.map((t) => (t.id === task.id ? { ...t, estimatedHours: n } : t));
        clickInfo = `Est. hours: ${task.estimatedHours}h → ${n}h`;
        break;
      }
      case "completedHours": {
        const n = Math.min(task.completedHours + 1, task.estimatedHours);
        rows = rows.map((t) => (t.id === task.id ? { ...t, completedHours: n } : t));
        clickInfo = `Done hours: ${task.completedHours}h → ${n}h`;
        break;
      }
      default:
        clickInfo = `Clicked [${accessor}] = "${value}" (row ${rowIndex})`;
    }
  }
</script>

<div style="display: flex; flex-direction: column; gap: 16px">
  <div style="padding: 12px; background-color: {isDark ? '#374151' : '#f3f4f6'}; border-radius: 8px; border: 1px solid {isDark ? '#4b5563' : '#d1d5db'}; min-height: 48px; display: flex; align-items: center;">
    <strong style="margin-right: 8px; color: {isDark ? '#f9fafb' : '#1f2937'}">Last Click:</strong>
    <span style="color: {isDark ? '#d1d5db' : '#4b5563'}">{clickInfo || "Click any cell to see interaction details..."}</span>
  </div>

  {#if selectedTask}
    <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000">
      <div style="background: {isDark ? '#1f2937' : 'white'}; padding: 24px; border-radius: 8px; max-width: 500px; width: 90%;">
        <h3 style="margin: 0 0 16px; color: {isDark ? '#f9fafb' : '#1f2937'}">Task Details</h3>
        <p style="margin: 8px 0; color: {isDark ? '#d1d5db' : '#4b5563'}"><strong>Task:</strong> {selectedTask.task}</p>
        <p style="margin: 8px 0; color: {isDark ? '#d1d5db' : '#4b5563'}"><strong>Details:</strong> {selectedTask.details}</p>
        <p style="margin: 8px 0; color: {isDark ? '#d1d5db' : '#4b5563'}"><strong>Assignee:</strong> {selectedTask.assignee}</p>
        <p style="margin: 8px 0; color: {isDark ? '#d1d5db' : '#4b5563'}"><strong>Status:</strong> {selectedTask.status}</p>
        <p style="margin: 8px 0; color: {isDark ? '#d1d5db' : '#4b5563'}"><strong>Priority:</strong> {selectedTask.priority}</p>
        <button
          onclick={() => selectedTask = null}
          style="margin-top: 16px; background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold"
        >
          Close
        </button>
      </div>
    </div>
  {/if}

  <SimpleTable
    columnResizing={true}
    defaultHeaders={headers}
    {height}
    onCellClick={handleCellClick}
    rows={rows}
    {theme}
  />
</div>
