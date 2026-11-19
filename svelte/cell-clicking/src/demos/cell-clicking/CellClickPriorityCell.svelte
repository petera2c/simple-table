<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import type { ProjectTask } from "./cell-clicking.demo-data";

  let { row }: CellRendererProps<ProjectTask> = $props();
  const p = $derived(String(row.priority));
  const color = $derived(p === "High" ? "#ef4444" : p === "Medium" ? "#f59e0b" : "#10b981");
</script>

<span style="color:{color};font-weight:bold;cursor:pointer;" title="Click to filter by priority">{p}</span>
