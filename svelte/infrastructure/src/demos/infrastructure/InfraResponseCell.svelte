<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import { getInfraMetricColorStyles } from "./infrastructure.demo-data";
  import type { InfrastructureServer } from "./infrastructure.demo-data";

  let { row, theme }: CellRendererProps<InfrastructureServer> = $props();
  const t = $derived(theme || "light");
  const s = $derived(getInfraMetricColorStyles(row.responseTime, t, "response"));
</script>

<span style="font-weight:500;color:{s.color};background-color:{s.backgroundColor ?? ''};">{row.responseTime.toFixed(1)}</span>
