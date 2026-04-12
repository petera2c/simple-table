<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import type { ManufacturingRow } from "./manufacturing.demo-data";
  import { hasStations } from "./mfg-helpers";

  let { row }: CellRendererProps = $props();
  const d = $derived(row as unknown as ManufacturingRow);

  const tag = $derived.by(() => {
    if (hasStations(row)) return null;
    const [year, month, day] = d.maintenanceDate.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const today = new Date();
    const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    let tagColor = "#e6f7ff";
    let textColor = "#0050b3";
    if (diffDays <= 3) {
      tagColor = "#fff1f0";
      textColor = "#a8071a";
    } else if (diffDays <= 7) {
      tagColor = "#fff7e6";
      textColor = "#ad4e00";
    }
    return { tagColor, textColor, label: `${date.toLocaleDateString()} (${diffDays} days)` };
  });
</script>

{#if hasStations(row)}
  —
{:else if tag}
  <span
    style="background-color:{tag.tagColor};color:{tag.textColor};padding:0 7px;font-size:12px;line-height:20px;border-radius:2px;display:inline-block;"
    >{tag.label}</span>
{/if}
