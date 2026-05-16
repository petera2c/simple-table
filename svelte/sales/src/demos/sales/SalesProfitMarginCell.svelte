<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import { getThemeColors } from "./sales.demo-data";
  import type { SalesRow } from "./sales.demo-data";

  let { row, theme }: CellRendererProps = $props();
  const d = $derived(row as unknown as SalesRow);
  const colors = $derived(getThemeColors(theme));

  const pctStyle = $derived.by(() => {
    if (row.profitMargin === "—") return null;
    let color = colors.gray;
    let fontWeight = "normal";
    if (d.profitMargin >= 0.7) {
      color = colors.success.high.color;
      fontWeight = colors.success.high.fontWeight;
    } else if (d.profitMargin >= 0.5) color = colors.success.medium;
    else if (d.profitMargin >= 0.4) color = colors.success.low;
    else if (d.profitMargin >= 0.3) color = colors.info;
    else color = colors.warning;
    const barColor =
      d.profitMargin >= 0.5
        ? colors.progressColors.high
        : d.profitMargin >= 0.3
          ? colors.progressColors.medium
          : colors.progressColors.low;
    return { color, fontWeight, barColor, pct: `${(d.profitMargin * 100).toFixed(1)}%`, w: d.profitMargin * 100 };
  });
</script>

{#if row.profitMargin === "—"}
  —
{:else if pctStyle}
  <div style="display:flex;align-items:center;justify-content:flex-end;">
    <span style="color:{pctStyle.color};font-weight:{pctStyle.fontWeight};">{pctStyle.pct}</span>
    <div style="margin-left:8px;width:48px;">
      <div
        style="background-color:#f5f5f5;height:6px;width:100%;border-radius:100px;overflow:hidden;"
      >
        <div
          style="height:100%;width:{pctStyle.w}%;background-color:{pctStyle.barColor};border-radius:100px;"
        ></div>
      </div>
    </div>
  </div>
{/if}
