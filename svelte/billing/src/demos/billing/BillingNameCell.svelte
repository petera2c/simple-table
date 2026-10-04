<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import type { BillingRow } from "./billing.demo-data";

  let { row }: CellRendererProps<BillingRow> = $props();
</script>

{#if row.type === "account"}
  <span style="font-weight: 600">{row.name}</span>
{:else}
  {row.name}
{/if}
