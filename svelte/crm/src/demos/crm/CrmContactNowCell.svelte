<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import { crmCellColors } from "./crm-demo-stores";

  let _p: CellRendererProps = $props();
  const colors = $derived($crmCellColors);
</script>

<!-- svelte-ignore a11y_invalid_attribute -->
<a
  href="#"
  style="cursor:pointer;font-size:0.875rem;color:{colors.link};text-decoration:none;font-weight:600;"
  onclick={(e) => e.preventDefault()}>Contact Now</a>
