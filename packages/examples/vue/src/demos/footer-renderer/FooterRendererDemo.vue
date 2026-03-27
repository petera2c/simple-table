<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { footerRendererConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

function tableFooterRenderer() {
  const rows = footerRendererConfig.rows;
  const totalQty = rows.reduce((sum, r) => sum + Number(r.quantity), 0);
  const totalVal = rows.reduce((sum, r) => sum + Number(r.quantity) * Number(r.price), 0);

  const el = document.createElement("div");
  el.style.cssText = "display:flex;justify-content:space-between;padding:8px 16px;font-size:13px;";
  el.innerHTML = `<span>Total items: <strong>${totalQty}</strong></span><span>Total value: <strong>$${totalVal.toFixed(2)}</strong></span>`;
  return el;
}
</script>

<template>
  <SimpleTable
    :default-headers="footerRendererConfig.headers"
    :rows="footerRendererConfig.rows"
    :footer-renderer="tableFooterRenderer"
    :height="height"
    :theme="theme"
  />
</template>
