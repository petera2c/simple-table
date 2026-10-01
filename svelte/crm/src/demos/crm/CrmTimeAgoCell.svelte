<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import type { CRMLead } from "./crm.demo-data";
  import { crmCellColors } from "./crm-demo-stores";

  let { row }: CellRendererProps<CRMLead> = $props();
  const colors = $derived($crmCellColors);
</script>

<div style="font-size:13px;color:{colors.textSecondary};">{row.timeAgo}</div>
