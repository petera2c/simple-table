<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import { getThemeColors } from "./sales.demo-data";
  import type { SalesRow } from "./sales.demo-data";

  let { row, theme }: CellRendererProps<SalesRow> = $props();
  const colors = $derived(getThemeColors(theme));
  const style = $derived.by(() => {
    if (row.dealValue === "—") return { text: "—", color: "", weight: "" };
    let color = colors.gray;
    let fontWeight = "normal";
    if (row.dealValue > 100000) {
      color = colors.success.high.color;
      fontWeight = colors.success.high.fontWeight;
    } else if (row.dealValue > 50000) color = colors.success.medium;
    else if (row.dealValue > 10000) color = colors.success.low;
    return {
      text: `$${row.dealValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      color,
      weight: fontWeight,
    };
  });
</script>

{#if row.dealValue === "—"}
  —
{:else}
  <span style="color:{style.color};font-weight:{style.weight};">{style.text}</span>
{/if}
