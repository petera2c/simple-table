<script setup lang="ts">
import { ref, computed, h } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, VueHeaderObject, CellClickProps, CellRendererProps } from "@simple-table/vue";
import { cellClickingHeaders, cellClickingData, CELL_CLICKING_STATUSES } from "./cell-clicking.demo-data";
import type { ProjectTask } from "./cell-clicking.demo-data";
import "@simple-table/vue/styles.css";

const props = withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "320px",
});

const clickInfo = ref("");
const selectedTask = ref<ProjectTask | null>(null);
const rows = ref<ProjectTask[]>([...cellClickingData]);

const headers: VueHeaderObject[] = cellClickingHeaders.map((col) => {
  if (col.accessor === "priority") {
    return {
      ...col,
      cellRenderer: ({ row }: CellRendererProps) => {
        const p = String((row as Record<string, unknown>).priority);
        const color = p === "High" ? "#ef4444" : p === "Medium" ? "#f59e0b" : "#10b981";
        return h(
          "span",
          {
            style: { color, fontWeight: "bold", cursor: "pointer" },
            title: "Click to filter by priority",
          },
          p,
        );
      },
    };
  }
  if (col.accessor === "status") {
    return {
      ...col,
      cellRenderer: ({ row }: CellRendererProps) => {
        const s = String((row as Record<string, unknown>).status);
        const bg = s === "Completed" ? "#dcfce7" : s === "In Progress" ? "#fef3c7" : "#fee2e2";
        const color = s === "Completed" ? "#166534" : s === "In Progress" ? "#92400e" : "#991b1b";
        return h(
          "span",
          {
            style: {
              backgroundColor: bg,
              color,
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "bold",
              cursor: "pointer",
            },
            title: "Click to change status",
          },
          s,
        );
      },
    };
  }
  if (col.accessor === "details") {
    return {
      ...col,
      cellRenderer: () =>
        h(
          "button",
          {
            style: {
              background: "#3b82f6",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "bold",
            },
            title: "Click to view task details",
          },
          "View Details",
        ),
    };
  }
  return { ...col };
});

const isDark = computed(() => props.theme === "modern-dark" || props.theme === "dark");

function handleCellClick({ accessor, rowIndex, value, row }: CellClickProps) {
  const task = row as ProjectTask;
  switch (accessor) {
    case "priority":
      clickInfo.value = `Filtering by ${value} priority`;
      rows.value = cellClickingData.filter((t) => t.priority === value);
      break;
    case "status": {
      const idx = CELL_CLICKING_STATUSES.indexOf(String(value));
      const next = CELL_CLICKING_STATUSES[(idx + 1) % CELL_CLICKING_STATUSES.length];
      rows.value = rows.value.map((t) => (t.id === task.id ? { ...t, status: next } : t));
      clickInfo.value = `Status: "${value}" → "${next}"`;
      break;
    }
    case "details":
      selectedTask.value = task;
      clickInfo.value = `Opening details for: ${task.task}`;
      break;
    case "estimatedHours": {
      const n = Math.min(task.estimatedHours + 2, 40);
      rows.value = rows.value.map((t) => (t.id === task.id ? { ...t, estimatedHours: n } : t));
      clickInfo.value = `Est. hours: ${task.estimatedHours}h → ${n}h`;
      break;
    }
    case "completedHours": {
      const n = Math.min(task.completedHours + 1, task.estimatedHours);
      rows.value = rows.value.map((t) => (t.id === task.id ? { ...t, completedHours: n } : t));
      clickInfo.value = `Done hours: ${task.completedHours}h → ${n}h`;
      break;
    }
    default:
      clickInfo.value = `Clicked [${accessor}] = "${value}" (row ${rowIndex})`;
  }
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px">
    <div
      :style="{
        padding: '12px',
        backgroundColor: isDark ? '#374151' : '#f3f4f6',
        borderRadius: '8px',
        border: '1px solid ' + (isDark ? '#4b5563' : '#d1d5db'),
        minHeight: '48px',
        display: 'flex',
        alignItems: 'center',
      }"
    >
      <strong :style="{ marginRight: '8px', color: isDark ? '#f9fafb' : '#1f2937' }">Last Click:</strong>
      <span :style="{ color: isDark ? '#d1d5db' : '#4b5563' }">
        {{ clickInfo || "Click any cell to see interaction details..." }}
      </span>
    </div>

    <div
      v-if="selectedTask"
      style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000"
    >
      <div
        :style="{ background: isDark ? '#1f2937' : 'white', padding: '24px', borderRadius: '8px', maxWidth: '500px', width: '90%' }"
      >
        <h3 :style="{ margin: '0 0 16px', color: isDark ? '#f9fafb' : '#1f2937' }">Task Details</h3>
        <p :style="{ margin: '8px 0', color: isDark ? '#d1d5db' : '#4b5563' }"><strong>Task:</strong> {{ selectedTask.task }}</p>
        <p :style="{ margin: '8px 0', color: isDark ? '#d1d5db' : '#4b5563' }"><strong>Details:</strong> {{ selectedTask.details }}</p>
        <p :style="{ margin: '8px 0', color: isDark ? '#d1d5db' : '#4b5563' }"><strong>Assignee:</strong> {{ selectedTask.assignee }}</p>
        <p :style="{ margin: '8px 0', color: isDark ? '#d1d5db' : '#4b5563' }"><strong>Status:</strong> {{ selectedTask.status }}</p>
        <p :style="{ margin: '8px 0', color: isDark ? '#d1d5db' : '#4b5563' }"><strong>Priority:</strong> {{ selectedTask.priority }}</p>
        <button
          @click="selectedTask = null"
          style="margin-top: 16px; background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold"
        >
          Close
        </button>
      </div>
    </div>

    <SimpleTable
      :column-resizing="true"
      :default-headers="headers"
      :height="height"
      :on-cell-click="handleCellClick"
      :rows="rows"
      :theme="theme"
    />
  </div>
</template>
