<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import type { HREmployee } from "./hr.demo-data";
  import { getHRThemeColors } from "./hr.demo-data";

  let { row, theme }: CellRendererProps<HREmployee> = $props();
  const c = $derived(getHRThemeColors(theme));
</script>

{#if row.yearsOfService !== null}
  <span style="color:{c.gray};">{row.yearsOfService} yrs</span>
{/if}
