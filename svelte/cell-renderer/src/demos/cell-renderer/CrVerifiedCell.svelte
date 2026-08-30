<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import type { CellRendererEmployee } from "./cell-renderer.demo-data";

  let { value }: CellRendererProps<CellRendererEmployee> = $props();
  const yes = $derived(Boolean(value));
</script>

<span style="color:{yes ? '#10B981' : '#EF4444'};font-weight:600;">{yes ? "✓ Yes" : "✕ No"}</span>
