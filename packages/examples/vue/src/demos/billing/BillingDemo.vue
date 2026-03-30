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
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import type { HeaderObject, CellRenderer } from "simple-table-core";
import { billingConfig } from "@simple-table/examples-shared";
import type { BillingRow } from "@simple-table/examples-shared";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const nameRenderer: CellRenderer = ({ row }) => {
  const d = row as unknown as BillingRow;
  if (d.type === "account") {
    const span = document.createElement("span");
    span.style.fontWeight = "600";
    span.textContent = d.name;
    return span;
  }
  return d.name;
};

const headers: HeaderObject[] = billingConfig.headers.map((h) => {
  if (h.accessor === "name") return { ...h, cellRenderer: nameRenderer };
  return { ...h };
});
</script>
