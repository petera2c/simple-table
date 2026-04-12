<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";

  let { row }: CellRendererProps = $props();
  const s = $derived(String((row as Record<string, unknown>).status));
  const bg = $derived(s === "Completed" ? "#dcfce7" : s === "In Progress" ? "#fef3c7" : "#fee2e2");
  const c = $derived(s === "Completed" ? "#166534" : s === "In Progress" ? "#92400e" : "#991b1b");
</script>

<span
  style="background:{bg};color:{c};padding:4px 8px;border-radius:4px;font-size:12px;font-weight:bold;cursor:pointer;"
  title="Click to change status">{s}</span>
