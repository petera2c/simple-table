<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import type { BillingRow } from "./billing.demo-data";

  let { row }: CellRendererProps = $props();
  const d = $derived(row as unknown as BillingRow);
</script>

{#if d.type === "account"}
  <span style="font-weight: 600">{d.name}</span>
{:else}
  {d.name}
{/if}
