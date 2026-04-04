<script setup lang="ts">
import { ref, computed } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, RowSelectionChangeProps, HeaderObject } from "@simple-table/vue";
import { rowSelectionConfig, rowSelectionData } from "./row-selection.demo-data";
import type { LibraryBook } from "./row-selection.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "348px",
});

const selectedBooks = ref<LibraryBook[]>([]);

const selectedTitles = computed(() =>
  selectedBooks.value.length > 0
    ? selectedBooks.value.map((b) => b.title).join(", ")
    : "None",
);

const headers: HeaderObject[] = rowSelectionConfig.headers.map((h) => {
  if (h.accessor === "status") {
    return {
      ...h,
      cellRenderer: ({ row }: { row: Record<string, unknown> }) => {
        const s = String(row.status);
        const color = s === "Available" ? "#16a34a" : s === "Checked Out" ? "#ea580c" : "#dc2626";
        return `<span style="color:${color};font-weight:bold">${s}</span>`;
      },
    };
  }
  return { ...h };
});

function handleRowSelectionChange(props: RowSelectionChangeProps) {
  selectedBooks.value = rowSelectionData.filter((book) =>
    props.selectedRows.has(String(book.id)),
  );
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <div
      style="padding: 12px; background-color: #f0f9ff; border-radius: 8px; border: 1px solid #bae6fd"
    >
      <div style="font-weight: bold; margin-bottom: 4px; color: #0c4a6e">
        Library Management Demo
      </div>
      <div style="font-size: 13px; color: #475569; margin-bottom: 6px">
        Click rows to select books. Use the checkbox column to select multiple.
      </div>
      <div style="font-size: 13px; color: #334155">
        <strong>Selected Books: </strong>{{ selectedTitles }}
      </div>
    </div>

    <SimpleTable
      :default-headers="headers"
      :rows="rowSelectionConfig.rows"
      :enable-row-selection="true"
      :column-resizing="true"
      :column-reordering="true"
      :selectable-cells="true"
      :height="height"
      :theme="theme"
      @row-selection-change="handleRowSelectionChange"
    />
  </div>
</template>
