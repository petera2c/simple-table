<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";

  let { value }: CellRendererProps = $props();
  const pct = $derived(Number(value) || 0);
  const color = $derived(pct < 30 ? "#EF4444" : pct < 70 ? "#F59E0B" : "#10B981");
</script>

<div>
  <div style="font-size:12px;margin-bottom:2px;">{pct}%</div>
  <div style="height:10px;background:#E5E7EB;border-radius:5px;overflow:hidden;">
    <div style="width:{pct}%;height:100%;background:{color};border-radius:5px;transition:width 0.3s;"></div>
  </div>
</div>
