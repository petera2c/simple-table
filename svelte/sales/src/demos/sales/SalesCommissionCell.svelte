<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import { getThemeColors } from "./sales.demo-data";
  import type { SalesRow } from "./sales.demo-data";

  let { row, theme }: CellRendererProps<SalesRow> = $props();
  const colors = $derived(getThemeColors(theme));
</script>

{#if row.commission === "—"}
  —
{:else if row.commission === 0}
  <span style="color:{colors.grayMuted};">$0.00</span>
{:else}
  ${row.commission.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
{/if}
