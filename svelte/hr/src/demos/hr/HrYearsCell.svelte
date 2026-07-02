<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import { getHRThemeColors } from "./hr.demo-data";

  let { row, theme }: CellRendererProps = $props();
  const c = $derived(getHRThemeColors(theme));
</script>

{#if row.yearsOfService !== null}
  <span style="color:{c.gray};">{row.yearsOfService} yrs</span>
{/if}
