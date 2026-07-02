<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import { hasStations } from "./mfg-helpers";

  let { row, accessor }: CellRendererProps = $props();
  const value = $derived(Number((row as Record<string, unknown>)[String(accessor)]));
  const parent = $derived(hasStations(row));
</script>

<div style={parent ? "font-weight:bold;" : ""}>{value.toLocaleString()}</div>
