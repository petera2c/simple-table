<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { footerRendererConfig } from "@simple-table/examples-shared";
  import "simple-table-core/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

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

<SimpleTable
  defaultHeaders={footerRendererConfig.headers}
  rows={footerRendererConfig.rows}
  {footerRenderer}
  hideFooter={false}
  {height}
  {theme}
/>
