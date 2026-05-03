<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";

  let { value }: CellRendererProps = $props();
  const yes = $derived(Boolean(value));
</script>

<span style="color:{yes ? '#10B981' : '#EF4444'};font-weight:600;">{yes ? "✓ Yes" : "✕ No"}</span>
