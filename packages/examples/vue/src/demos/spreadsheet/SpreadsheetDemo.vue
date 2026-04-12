<script setup lang="ts">
import { ref, computed, h } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, HeaderObject, CellChangeProps } from "@simple-table/vue";
import { spreadsheetConfig, recalculateAmortization } from "./spreadsheet.demo-data";
import type { SpreadsheetRow } from "./spreadsheet.demo-data";
import "@simple-table/vue/styles.css";
import "./spreadsheet-custom.css";

const props = withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const data = ref([...spreadsheetConfig.rows]);
const additionalColumns = ref<HeaderObject[]>([]);

const headers = computed((): HeaderObject[] => {
  const baseHeaders: HeaderObject[] = [...spreadsheetConfig.headers];
  return [
    ...baseHeaders,
    ...additionalColumns.value,
    {
      accessor: "actions",
      label: "",
      width: 100,
      minWidth: 100,
      filterable: false,
      type: "other" as const,
      disableReorder: true,
      headerRenderer: () =>
        h("div", { style: { display: "flex", justifyContent: "center" } }, [
          h(
            "button",
            {
              style: {
                color: "white",
                border: "none",
                padding: "4px 10px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "11px",
                fontWeight: "500",
                whiteSpace: "nowrap",
                background: "#3b82f6",
              },
              onClick: () => {
                const totalCols = spreadsheetConfig.headers.length + additionalColumns.value.length;
                const newCol: HeaderObject = {
                  accessor: `column${totalCols + 1}`,
                  label: `Column ${totalCols + 1}`,
                  width: 120,
                  minWidth: 80,
                  type: "number",
                  align: "right",
                  isEditable: true,
                  aggregation: { type: "sum" },
                };
                additionalColumns.value = [...additionalColumns.value, newCol];
              },
            },
            "+ Add Column",
          ),
        ]),
    },
  ];
});

const handleCellEdit = ({ accessor, newValue, row }: CellChangeProps) => {
  data.value = data.value.map((item) => {
    if (item.id === row.id) {
      return recalculateAmortization(item as SpreadsheetRow, accessor, newValue as string | number);
    }
    return item;
  });
};
</script>

<template>
  <div class="spreadsheet-container">
    <SimpleTable
      :default-headers="headers"
      :rows="data"
      :height="props.height"
      :theme="props.theme"
      :column-borders="true"
      :column-reordering="true"
      :column-resizing="true"
      :enable-header-editing="true"
      :enable-row-selection="true"
      :selectable-cells="true"
      :selectable-columns="true"
      :use-odd-even-row-background="true"
      :custom-theme="{ rowHeight: 22 }"
      @cell-edit="handleCellEdit"
    />
  </div>
</template>
