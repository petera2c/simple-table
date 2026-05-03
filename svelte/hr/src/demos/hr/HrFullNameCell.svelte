<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import { getHRThemeColors } from "./hr.demo-data";
  import type { HREmployee } from "./hr.demo-data";

  let { row, theme }: CellRendererProps = $props();
  const d = $derived(row as unknown as HREmployee);
  const c = $derived(getHRThemeColors(theme));
  const initials = $derived(`${d.firstName?.charAt(0) || ""}${d.lastName?.charAt(0) || ""}`);
</script>

<div style="display:flex;align-items:center;">
  <div
    style="width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;background-color:{c.avatarBg};color:{c.avatarText};font-size:12px;"
  >
    {initials}
  </div>
  <div style="margin-left:8px;">
    <div>{d.fullName}</div>
    <div style="font-size:12px;color:{c.grayMuted};">{d.position}</div>
  </div>
</div>
