<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import { getInfraStatusColors } from "./infrastructure.demo-data";
  import type { InfrastructureServer } from "./infrastructure.demo-data";

  let { row, theme }: CellRendererProps = $props();
  const d = $derived(row as unknown as InfrastructureServer);
  const t = $derived(theme || "light");
  const s = $derived(getInfraStatusColors(d.status, t));
  const label = $derived(d.status.charAt(0).toUpperCase() + d.status.slice(1));
</script>

<div
  style="color:{s.color};background-color:{s.backgroundColor};font-weight:{s.fontWeight};padding:4px 8px;border-radius:4px;font-size:0.75rem;"
>
  {label}
</div>
