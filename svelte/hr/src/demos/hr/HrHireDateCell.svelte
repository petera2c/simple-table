<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import { getHRThemeColors } from "./hr.demo-data";
  import type { HREmployee } from "./hr.demo-data";

  let { row, theme }: CellRendererProps<HREmployee> = $props();
  const c = $derived(getHRThemeColors(theme));
  const label = $derived.by(() => {
    if (!row.hireDate) return "";
    const [year, month, day] = row.hireDate.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  });
</script>

{#if label}
  <span style="color:{c.gray};">{label}</span>
{/if}
