<script setup lang="ts">
import { ref, computed } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, RowSelectionChangeProps, VueColumnDef, CellRendererProps, GetRowIdParams } from "@simple-table/vue";
import { rowSelectionConfig, rowSelectionData } from "./row-selection.demo-data";
import type { LibraryBook } from "./row-selection.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "348px",
});

const selectedBooks = ref<LibraryBook[]>([]);
const getRowId = ({ row }: GetRowIdParams<LibraryBook>) => row.id;

const selectedTitles = computed(() =>
  selectedBooks.value.length > 0
    ? selectedBooks.value.map((b) => b.title).join(", ")
    : "None",
);

const headers: VueColumnDef<LibraryBook>[] = rowSelectionConfig.headers.map((col) => {
  if (col.accessor === "status") {
    return {
      ...col,
      cellRenderer: ({ row }: CellRendererProps<LibraryBook>) => {
        const s = row.status;
        const color = s === "Available" ? "#16a34a" : s === "Checked Out" ? "#ea580c" : "#dc2626";
        return `<span style="color:${color};font-weight:bold">${s}</span>`;
      },
    };
  }
  return { ...col };
});

function handleRowSelectionChange(props: RowSelectionChangeProps<LibraryBook>) {
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
      :columns="headers"
      :get-row-id="getRowId"
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
