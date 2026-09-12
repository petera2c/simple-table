<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import type { CRMLead } from "./crm.demo-data";
  import { crmCellColors } from "./crm-demo-stores";
  import CrmFitButtons from "./CrmFitButtons.svelte";

  let _p: CellRendererProps<CRMLead> = $props();
  const colors = $derived($crmCellColors);
</script>

<CrmFitButtons {colors} />
