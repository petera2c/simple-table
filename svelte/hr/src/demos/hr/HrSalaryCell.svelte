<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import { getHRThemeColors } from "./hr.demo-data";
  import type { HREmployee } from "./hr.demo-data";

  let { row, theme }: CellRendererProps<HREmployee> = $props();
  const c = $derived(getHRThemeColors(theme));
</script>

<span style="color:{c.gray};">${row.salary.toLocaleString()}</span>
