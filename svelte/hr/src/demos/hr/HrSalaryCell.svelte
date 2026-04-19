<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import { getHRThemeColors } from "./hr.demo-data";
  import type { HREmployee } from "./hr.demo-data";

  let { row, theme }: CellRendererProps = $props();
  const d = $derived(row as unknown as HREmployee);
  const c = $derived(getHRThemeColors(theme));
</script>

<span style="color:{c.gray};">${d.salary.toLocaleString()}</span>
