<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import type { SalesRow } from "./sales.demo-data";

  let { row }: CellRendererProps<SalesRow> = $props();
  const s = $derived(row.isWon ? { bg: "#f6ffed", text: "#2a6a0d" } : { bg: "#fff1f0", text: "#a8071a" });
</script>

{#if row.isWon === "—"}
  —
{:else}
  <span
    style="background-color:{s.bg};color:{s.text};padding:0 7px;font-size:12px;line-height:20px;border-radius:2px;display:inline-block;"
    >{row.isWon ? "Won" : "Lost"}</span>
{/if}
