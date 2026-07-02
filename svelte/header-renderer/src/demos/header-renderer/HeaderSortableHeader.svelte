<script lang="ts">
  import type { HeaderRendererProps } from "@simple-table/svelte";
  import {
    headerDemoSortAccessor,
    headerDemoSortDirection,
    cycleHeaderDemoSort,
  } from "./header-sort-store";

  let { header }: HeaderRendererProps = $props();
  const accessor = $derived(String(header.accessor));
  const isSorted = $derived($headerDemoSortAccessor === accessor);
  const dir = $derived(isSorted ? $headerDemoSortDirection : null);
  const indicator = $derived(dir === "asc" ? " ▲" : dir === "desc" ? " ▼" : "");
</script>

<div
  style="cursor:pointer;user-select:none;font-weight:600;display:flex;align-items:center;gap:4px;"
  onclick={() => cycleHeaderDemoSort(accessor)}
  onkeydown={(e) => e.key === "Enter" && cycleHeaderDemoSort(accessor)}
  role="button"
  tabindex="0"
>
  <span>{header.label}</span>
  {#if indicator}
    <span style="font-size:10px;color:#6366f1;">{indicator}</span>
  {/if}
</div>
