<script setup lang="ts">
import { h } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { emptyStateConfig } from "./empty-state.demo-data";
import "@simple-table/vue/styles.css";

const props = withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const tableEmptyStateRenderer = h(
  "div",
  {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px 24px",
      color: "#64748b",
      gap: "12px",
    },
  },
  [
    h(
      "svg",
      {
        width: 48,
        height: 48,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "#94a3b8",
        strokeWidth: "1.5",
      },
      [
        h("path", { d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7" }),
        h("path", { d: "M16 3H8L3 7h18l-5-4z" }),
        h("line", { x1: "10", y1: "12", x2: "14", y2: "12" }),
      ],
    ),
    h("div", { style: { fontSize: "16px", fontWeight: "600" } }, "No data available"),
    h(
      "div",
      { style: { fontSize: "13px" } },
      "Try adjusting your filters or adding new records.",
    ),
  ],
);
</script>

<template>
  <SimpleTable
    :default-headers="emptyStateConfig.headers"
    :rows="emptyStateConfig.rows"
    :table-empty-state-renderer="tableEmptyStateRenderer"
    :height="props.height"
    :theme="props.theme"
  />
</template>
