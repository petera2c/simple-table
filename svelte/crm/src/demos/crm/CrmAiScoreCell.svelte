<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import type { CRMLead } from "./crm.demo-data";

  let { row }: CellRendererProps<CRMLead> = $props();
</script>

<div style="font-size:0.875rem;">{"🔥".repeat(row.aiScore)}</div>
