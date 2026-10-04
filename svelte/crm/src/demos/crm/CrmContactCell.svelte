<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import type { CRMLead } from "./crm.demo-data";
  import { crmCellColors } from "./crm-demo-stores";

  let { row }: CellRendererProps<CRMLead> = $props();
  const colors = $derived($crmCellColors);
  const initials = $derived(row.name.split(" ").map((n) => n[0]).join("").toUpperCase());
</script>

<div style="display:flex;align-items:center;gap:12px;">
  <div
    style="width:40px;height:40px;border-radius:50%;background:linear-gradient(to right, oklch(75% .183 55.934), oklch(70.4% .191 22.216));color:white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;flex-shrink:0;"
  >
    {initials}
  </div>
  <div style="display:flex;flex-direction:column;gap:2px;">
    <span style="cursor:pointer;font-size:14px;font-weight:600;color:{colors.link};">{row.name}</span>
    <div style="font-size:12px;color:{colors.textSecondary};">{row.title}</div>
    <div style="font-size:12px;color:{colors.textSecondary};">
      <span style="font-size:12px;color:{colors.textTertiary};">@</span>
      {` ${row.company}`}
    </div>
  </div>
</div>
