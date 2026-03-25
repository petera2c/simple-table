<script lang="ts">
  import type { CellRendererProps } from "simple-table-svelte";

  let { value }: CellRendererProps = $props();

  const count = $derived(Number(value) || 0);
  const color = $derived(count >= 20 ? "#22c55e" : count >= 10 ? "#f59e0b" : "#94a3b8");
</script>

<span style="font-weight: 700; color: {color}">{count} 🏅</span>
