<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import type { CRMLead } from "./crm.demo-data";
  import { crmCellColors } from "./crm-demo-stores";
  import CrmEmailEnrich from "./CrmEmailEnrich.svelte";

  let _p: CellRendererProps<CRMLead> = $props();
  const colors = $derived($crmCellColors);
</script>

<CrmEmailEnrich {colors} />
