<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import { getThemeColors } from "./sales.demo-data";
  import type { SalesRow } from "./sales.demo-data";

  let { row, theme }: CellRendererProps<SalesRow> = $props();
  const colors = $derived(getThemeColors(theme));
  const style = $derived.by(() => {
    if (row.dealProfit === "—") return null;
    if (row.dealProfit === 0) return { kind: "zero" as const };
    let color = colors.gray;
    let fontWeight = "normal";
    if (row.dealProfit > 50000) {
      color = colors.success.high.color;
      fontWeight = colors.success.high.fontWeight;
    } else if (row.dealProfit > 20000) color = colors.success.medium;
    else if (row.dealProfit > 10000) color = colors.success.low;
    return {
      kind: "val" as const,
      color,
      weight: fontWeight,
      text: `$${row.dealProfit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    };
  });
</script>

{#if row.dealProfit === "—"}
  —
{:else if style?.kind === "zero"}
  <span style="color:{colors.grayMuted};">$0.00</span>
{:else if style?.kind === "val"}
  <span style="color:{style.color};font-weight:{style.weight};">{style.text}</span>
{/if}
