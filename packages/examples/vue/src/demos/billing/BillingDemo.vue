<template>
  <SimpleTable
    :columns="headers"
    :get-row-id="getRowId"
    :rows="billingConfig.rows"
    :height="height"
    :theme="theme"
    :column-reordering="true"
    :column-resizing="true"
    :enable-column-editor="true"
    :selectable-cells="true"
    :initial-sort-column="'amount'"
    :initial-sort-direction="'desc'"
    :row-grouping="['invoices', 'charges']"
    :odd-column-background="true"
  />
</template>

<script setup lang="ts">
import { h } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, VueColumnDef, CellRendererProps, GetRowIdParams } from "@simple-table/vue";
import { billingConfig } from "./billing.demo-data";
import type { BillingRow } from "./billing.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const getRowId = ({ row }: GetRowIdParams<BillingRow>) => row.id;

const nameRenderer = ({ row }: CellRendererProps<BillingRow>) => {
  if (row.type === "account") {
    return h("span", { style: { fontWeight: "600" } }, row.name);
  }
  return row.name;
};

const headers: VueColumnDef<BillingRow>[] = billingConfig.headers.map((col) => {
  if (col.accessor === "name") return { ...col, cellRenderer: nameRenderer };
  return { ...col };
});
</script>
