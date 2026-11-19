<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import type { InfrastructureServer } from "./infrastructure.demo-data";

  let { row }: CellRendererProps<InfrastructureServer> = $props();
</script>

{row.diskUsage.toFixed(1)}%
