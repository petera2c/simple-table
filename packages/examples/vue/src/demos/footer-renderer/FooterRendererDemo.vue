<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { footerRendererConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const props = withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const rows = footerRendererConfig.rows;
const totalQty = rows.reduce((sum, r) => sum + (Number(r.quantity) || 0), 0);
const totalAmount = rows.reduce((sum, r) => sum + (Number(r.total) || 0), 0);

function footerRenderer() {
  const el = document.createElement("div");
  Object.assign(el.style, {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 16px",
    background: "#f8fafc",
    borderTop: "2px solid #e2e8f0",
    fontSize: "13px",
    fontWeight: "600",
  });
  el.innerHTML = `<span>${rows.length} items · ${totalQty} units</span><span>Grand Total: $${totalAmount.toLocaleString()}</span>`;
  return el;
}
</script>

<template>
  <SimpleTable
    :default-headers="footerRendererConfig.headers"
    :rows="footerRendererConfig.rows"
    :footer-renderer="footerRenderer"
    :hide-footer="false"
    :height="props.height"
    :theme="props.theme"
  />
</template>
