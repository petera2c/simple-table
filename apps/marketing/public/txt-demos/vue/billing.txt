<template>
  <SimpleTable
    :default-headers="headers"
    :rows="billingConfig.rows"
    :height="height"
    :theme="theme"
    :column-reordering="true"
    :column-resizing="true"
    :edit-columns="true"
    :selectable-cells="true"
    :initial-sort-column="'amount'"
    :initial-sort-direction="'desc'"
    :row-grouping="['invoices', 'charges']"
    :use-odd-column-background="true"
  />
</template>

<script setup lang="ts">
import { h } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, VueHeaderObject, CellRendererProps } from "@simple-table/vue";
import { billingConfig } from "./billing.demo-data";
import type { BillingRow } from "./billing.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const nameRenderer = ({ row }: CellRendererProps) => {
  const d = row as unknown as BillingRow;
  if (d.type === "account") {
    return h("span", { style: { fontWeight: "600" } }, d.name);
  }
  return d.name;
};

const headers: VueHeaderObject[] = billingConfig.headers.map((h) => {
  if (h.accessor === "name") return { ...h, cellRenderer: nameRenderer };
  return { ...h };
});
</script>
