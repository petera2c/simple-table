<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import type { CRMLead } from "./crm.demo-data";
  import { crmCellColors } from "./crm-demo-stores";

  let { row }: CellRendererProps = $props();
  const d = $derived(row as unknown as CRMLead);
  const colors = $derived($crmCellColors);
</script>

<div>
  <div style="color:{colors.textSecondary};margin-bottom:4px;font-size:0.875rem;">
    🧠 Just engaged with a
    <!-- svelte-ignore a11y_invalid_attribute -->
    <a href="#" style="color:#0077b5;text-decoration:underline;cursor:pointer;" onclick={(e) => e.preventDefault()}
      >post</a>
  </div>
  <div style="font-size:12px;color:{colors.textTertiary};">
    <span style="font-weight:600;">Keyword:</span>
    {` ${d.signal}`}
  </div>
</div>
