<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import type { InfrastructureServer } from "./infrastructure.demo-data";

  let { row }: CellRendererProps = $props();
  const d = $derived(row as unknown as InfrastructureServer);
</script>

<span style="font-family:monospace;font-size:0.85rem;">{d.serverId}</span>
