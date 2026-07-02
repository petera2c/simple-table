<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import type { CRMLead } from "./crm.demo-data";
  import { crmCellColors } from "./crm-demo-stores";

  let { row }: CellRendererProps = $props();
  const d = $derived(row as unknown as CRMLead);
  const colors = $derived($crmCellColors);
</script>

<!-- svelte-ignore a11y_invalid_attribute -->
<a
  href="#"
  style="cursor:pointer;font-size:0.875rem;color:{colors.link};text-decoration:none;font-weight:600;"
  onclick={(e) => e.preventDefault()}>{d.list}</a>
