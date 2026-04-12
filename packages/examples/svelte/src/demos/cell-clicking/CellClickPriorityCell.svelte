<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";

  let { row }: CellRendererProps = $props();
  const p = $derived(String((row as Record<string, unknown>).priority));
  const color = $derived(p === "High" ? "#ef4444" : p === "Medium" ? "#f59e0b" : "#10b981");
</script>

<span style="color:{color};font-weight:bold;cursor:pointer;" title="Click to filter by priority">{p}</span>
