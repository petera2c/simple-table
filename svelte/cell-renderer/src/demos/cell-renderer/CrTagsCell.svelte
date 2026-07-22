<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";

  let { value }: CellRendererProps = $props();
  const tags = $derived(Array.isArray(value) ? (value as string[]) : []);
</script>

<div style="display:flex;gap:4px;flex-wrap:nowrap;overflow:hidden;">
  {#each tags as tag (tag)}
    <span
      style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:500;background:#DBEAFE;color:#1E40AF;white-space:nowrap;"
      >{tag}</span>
  {/each}
</div>
