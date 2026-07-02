<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import { getInfraMetricColorStyles } from "./infrastructure.demo-data";
  import type { InfrastructureServer } from "./infrastructure.demo-data";

  let { row, theme }: CellRendererProps = $props();
  const d = $derived(row as unknown as InfrastructureServer);
  const t = $derived(theme || "light");
  const s = $derived(getInfraMetricColorStyles(d.responseTime, t, "response"));
</script>

<span style="font-weight:500;color:{s.color};background-color:{s.backgroundColor ?? ''};">{d.responseTime.toFixed(1)}</span>
