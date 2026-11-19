<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import { getHRThemeColors, HR_STATUS_COLOR_MAP } from "./hr.demo-data";
  import type { HREmployee } from "./hr.demo-data";

  let { row, theme }: CellRendererProps<HREmployee> = $props();
  const c = $derived(getHRThemeColors(theme));
  const tagColors = $derived.by(() => {
    if (!row.status) return null;
    const colorKey = HR_STATUS_COLOR_MAP[row.status] || "default";
    return c.tagColors[colorKey] || c.tagColors.default;
  });
</script>

{#if row.status && tagColors}
  <span
    style="background-color:{tagColors.bg};color:{tagColors.text};padding:0 7px;font-size:12px;line-height:20px;border-radius:2px;display:inline-block;"
    >{row.status}</span>
{/if}
