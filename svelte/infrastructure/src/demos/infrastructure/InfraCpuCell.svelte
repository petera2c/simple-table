<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import { getInfraMetricColorStyles } from "./infrastructure.demo-data";
  import type { InfrastructureServer } from "./infrastructure.demo-data";

  let { row, theme }: CellRendererProps<InfrastructureServer> = $props();
  const t = $derived(theme || "light");
  const s = $derived(getInfraMetricColorStyles(row.cpuUsage, t, "cpu"));
</script>

<div style="display:flex;justify-content:end;">
  <div
    style="padding:3px 6px;border-radius:3px;font-weight:600;font-size:0.8rem;color:{s.color};background-color:{s.backgroundColor ?? ''};"
  >
    {row.cpuUsage.toFixed(1)}%
  </div>
</div>
