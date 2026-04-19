<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import { crmCellColors } from "./crm-demo-stores";
  import CrmFitButtons from "./CrmFitButtons.svelte";

  let _p: CellRendererProps = $props();
  const colors = $derived($crmCellColors);
</script>

<CrmFitButtons {colors} />
