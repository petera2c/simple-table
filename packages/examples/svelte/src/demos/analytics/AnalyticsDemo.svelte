<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { TableAPI, Theme } from "@simple-table/svelte";
  import {
    analyticsDemoConfig,
    analyticsPresets,
    analyticsRows,
  } from "./analytics.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "480px", theme }: { height?: string | number | null; theme?: Theme } = $props();

  let activeId = $state(analyticsPresets[0].id);
  let searchText = $state("");
  let tableRef = $state<{ getAPI: () => TableAPI | null } | null>(null);
  const active = $derived(analyticsPresets.find((p) => p.id === activeId) ?? analyticsPresets[0]);
  const isPivoted = $derived(active.pivot != null);
  const nestedRows = $derived((active.pivot?.rows.length ?? 0) > 1);
  const isDark = $derived(theme === "dark" || theme === "modern-dark");
  const chromeBg = $derived(isDark ? "#0f172a" : "#f8fafc");
  const chromeBorder = $derived(isDark ? "#1e293b" : "#e2e8f0");
  const titleColor = $derived(isDark ? "#f1f5f9" : "#0f172a");
  const mutedColor = $derived(isDark ? "#94a3b8" : "#64748b");
  const chipIdleBg = $derived(isDark ? "#1e293b" : "#e2e8f0");
  const chipIdleColor = $derived(isDark ? "#cbd5e1" : "#334155");
  const inputBg = $derived(isDark ? "#1e293b" : "#fff");
  const inputBorder = $derived(isDark ? "#334155" : "#cbd5e1");
  const inputColor = $derived(isDark ? "#e2e8f0" : "#0f172a");
  const formatHeight = $derived(
    height == null ? "100%" : typeof height === "number" ? `${height}px` : height
  );

  function getRowId({ row }: { row: { id?: unknown } }) {
    return row.id == null ? undefined : String(row.id);
  }
</script>

<div
  style="display: flex; flex-direction: column; width: 100%; height: {formatHeight}; background: {chromeBg}; border: 1px solid {chromeBorder}; border-radius: 8px; overflow: hidden"
>
  <div style="padding: 16px 20px 12px; border-bottom: 1px solid {chromeBorder}; flex-shrink: 0">
    <div style="margin-bottom: 10px">
      <h2
        style="margin: 0; font-size: 18px; font-weight: 650; color: {titleColor}; letter-spacing: -0.02em"
      >
        Revenue Analytics
      </h2>
      <p style="margin: 4px 0 0; font-size: 13px; color: {mutedColor}">
        {active.description} · {analyticsRows.length} fact rows{isPivoted
          ? " → pivoted matrix"
          : ""}
      </p>
    </div>
    <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px">
      {#each analyticsPresets as preset}
        <button
          type="button"
          onclick={() => (activeId = preset.id)}
          style="padding: 7px 12px; border-radius: 6px; border: none; cursor: pointer; font-size: 13px; font-weight: 550; background: {preset.id ===
          activeId
            ? '#2563eb'
            : chipIdleBg}; color: {preset.id === activeId ? '#fff' : chipIdleColor}"
        >
          {preset.label}
        </button>
      {/each}
    </div>
    <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center">
      <input
        type="search"
        bind:value={searchText}
        placeholder="Quick filter…"
        aria-label="Quick filter"
        style="flex: 1 1 180px; max-width: 280px; padding: 7px 10px; border-radius: 6px; border: 1px solid {inputBorder}; background: {inputBg}; color: {inputColor}; font-size: 13px; outline: none"
      />
      <button
        type="button"
        onclick={() => tableRef?.getAPI()?.exportToCSV()}
        style="padding: 7px 12px; border-radius: 6px; border: 1px solid {inputBorder}; cursor: pointer; font-size: 13px; font-weight: 550; background: {chipIdleBg}; color: {chipIdleColor}"
      >
        Export CSV
      </button>
    </div>
  </div>
  <div
    style="flex: 1; min-height: 0; padding: 12px 20px 20px; display: flex; flex-direction: column"
  >
    <div style="flex: 1; min-height: 0; height: 100%">
      {#key activeId}
        <SimpleTable
          bind:this={tableRef}
          autoExpandColumns={true}
          columnBorders={true}
          columnReordering={true}
          columnResizing={true}
          copyHeadersToClipboard={true}
          defaultHeaders={analyticsDemoConfig.headers}
          editColumns={true}
          enableStickyParents={nestedRows}
          expandAll={nestedRows}
          {getRowId}
          height="100%"
          includeHeadersInCSVExport={true}
          initialSortColumn={isPivoted ? undefined : "sales"}
          initialSortDirection={isPivoted ? undefined : "desc"}
          pivot={active.pivot}
          quickFilter={{ text: searchText, mode: "simple", caseSensitive: false }}
          rows={analyticsDemoConfig.rows}
          selectableCells={true}
          {theme}
          useHoverRowBackground={true}
          useOddEvenRowBackground={true}
        />
      {/key}
    </div>
  </div>
</div>
