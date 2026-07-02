<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import { crmCellColors } from "./crm-demo-stores";
  import CrmEmailEnrich from "./CrmEmailEnrich.svelte";

  let _p: CellRendererProps = $props();
  const colors = $derived($crmCellColors);
</script>

<CrmEmailEnrich {colors} />
