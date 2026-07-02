<script lang="ts">
  import {SimpleTable} from "@simple-table/svelte";  import type { Theme, QuickFilterMode } from "@simple-table/svelte";
  import { quickFilterConfig } from "./quick-filter.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
  let searchText = $state("");
  let filterMode: QuickFilterMode = $state("simple");
  let caseSensitive = $state(false);
</script>

<div>
  <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; align-items: center">
    <input
      type="text"
      placeholder="Search..."
      bind:value={searchText}
      style="padding: 6px 12px; border-radius: 6px; border: 1px solid #d1d5db; font-size: 13px; min-width: 200px"
    />
    <button
      onclick={() => (filterMode = "simple")}
      style="padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; border: {filterMode === 'simple' ? '2px solid #3b82f6' : '1px solid #d1d5db'}; background: {filterMode === 'simple' ? '#eff6ff' : '#fff'}; color: {filterMode === 'simple' ? '#1d4ed8' : '#374151'}; font-weight: {filterMode === 'simple' ? 600 : 400}"
    >
      Simple
    </button>
    <button
      onclick={() => (filterMode = "smart")}
      style="padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; border: {filterMode === 'smart' ? '2px solid #3b82f6' : '1px solid #d1d5db'}; background: {filterMode === 'smart' ? '#eff6ff' : '#fff'}; color: {filterMode === 'smart' ? '#1d4ed8' : '#374151'}; font-weight: {filterMode === 'smart' ? 600 : 400}"
    >
      Smart
    </button>
    <button
      onclick={() => (caseSensitive = !caseSensitive)}
      style="padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; border: {caseSensitive ? '2px solid #3b82f6' : '1px solid #d1d5db'}; background: {caseSensitive ? '#eff6ff' : '#fff'}; color: {caseSensitive ? '#1d4ed8' : '#374151'}; font-weight: {caseSensitive ? 600 : 400}"
    >
      Case Sensitive
    </button>
  </div>
  <SimpleTable
    defaultHeaders={quickFilterConfig.headers}
    rows={quickFilterConfig.rows}
    {height}
    {theme}
    quickFilter={{ text: searchText, mode: filterMode, caseSensitive }}
  />
</div>
