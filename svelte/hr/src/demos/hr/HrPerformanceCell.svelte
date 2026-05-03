<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import { getHRThemeColors } from "./hr.demo-data";
  import type { HREmployee } from "./hr.demo-data";

  let { row, theme }: CellRendererProps = $props();
  const d = $derived(row as unknown as HREmployee);
  const score = $derived(d.performanceScore);
  const c = $derived(getHRThemeColors(theme));
  const barColor = $derived(score >= 90 ? c.progressSuccess : score >= 65 ? c.progressNormal : c.progressException);
</script>

<div style="width:100%;display:flex;flex-direction:column;">
  <div
    style="background-color:{c.progressBg};height:6px;width:100%;border-radius:100px;overflow:hidden;"
  >
    <div style="height:100%;width:{score}%;background-color:{barColor};border-radius:100px;"></div>
  </div>
  <div style="font-size:12px;text-align:center;margin-top:4px;color:{c.gray};">{score}/100</div>
</div>
