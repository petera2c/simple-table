<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import { getThemeColors } from "./sales.demo-data";
  import type { SalesRow } from "./sales.demo-data";

  let { row, theme }: CellRendererProps = $props();
  const colors = $derived(getThemeColors(theme));
  const d = $derived(row as unknown as SalesRow);
</script>

{#if row.commission === "—"}
  —
{:else if d.commission === 0}
  <span style="color:{colors.grayMuted};">$0.00</span>
{:else}
  ${d.commission.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
{/if}
