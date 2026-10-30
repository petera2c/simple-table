<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import type { InfrastructureServer } from "./infrastructure.demo-data";

  let { row }: CellRendererProps<InfrastructureServer> = $props();
</script>

<span style="font-family:monospace;font-size:0.85rem;">{row.serverId}</span>
