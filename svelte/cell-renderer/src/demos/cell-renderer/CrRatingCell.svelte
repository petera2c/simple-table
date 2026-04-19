<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";

  let { value }: CellRendererProps = $props();
  const rating = $derived(Number(value) || 0);
  const full = $derived(Math.floor(rating));
  const hasHalf = $derived(rating % 1 >= 0.25);
  const empty = $derived(5 - full - (hasHalf ? 1 : 0));
</script>

<span style="display:flex;align-items:center;gap:4px;">
  <span style="color:#F59E0B;letter-spacing:1px;">
    {"★".repeat(full)}{#if hasHalf}<span style="opacity:0.5;">★</span>{/if}{"☆".repeat(Math.max(0, empty))}
  </span>
  <span style="font-size:12px;color:#6b7280;">{rating}</span>
</span>
