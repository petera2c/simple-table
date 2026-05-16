<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import type { CRMLead } from "./crm.demo-data";

  let { row }: CellRendererProps = $props();
  const d = $derived(row as unknown as CRMLead);
</script>

<div style="font-size:0.875rem;">{"🔥".repeat(d.aiScore)}</div>
