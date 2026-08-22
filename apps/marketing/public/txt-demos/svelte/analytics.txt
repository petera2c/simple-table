<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { TableAPI, Theme, GetRowIdParams } from "@simple-table/svelte";
  import { analyticsDemoConfig, analyticsPresets } from "./analytics.demo-data";
  import type { AnalyticsFactRow } from "./analytics.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "480px", theme }: { height?: string | number | null; theme?: Theme } = $props();

  let activeId = $state(analyticsPresets[0].id);
  let tableRef = $state<{ getAPI: () => TableAPI<AnalyticsFactRow> | null } | null>(null);
  const active = $derived(analyticsPresets.find((p) => p.id === activeId) ?? analyticsPresets[0]);
  const isPivoted = $derived(active.pivot != null);
  const chrome = $derived(
    theme === "modern-black"
      ? {
          border: "#262626",
          chipActive: "#3b82f6",
          chipIdleBg: "#1c1c1c",
          chipIdleColor: "#a3a3a3",
          title: "#fafafa",
        }
      : theme === "modern-dark" || theme === "dark"
        ? {
            border: "#374151",
            chipActive: "#3b82f6",
            chipIdleBg: "#1f2937",
            chipIdleColor: "#d1d5db",
            title: "#f9fafb",
          }
        : {
            border: "#e5e5e5",
            chipActive: "#2563eb",
            chipIdleBg: "#f5f5f5",
            chipIdleColor: "#525252",
            title: "#171717",
          }
  );
  const formatHeight = $derived(
    height == null ? "100%" : typeof height === "number" ? `${height}px` : height
  );

  const getRowId = ({ row }: GetRowIdParams<AnalyticsFactRow>) => row.id;
</script>

<div
  style="display: flex; flex-direction: column; width: 100%; height: {formatHeight}; overflow: hidden"
>
  <div style="padding: 0 0 12px; border-bottom: 1px solid {chrome.border}; flex-shrink: 0">
    <div style="margin-bottom: 10px">
      <h2
        style="margin: 0; font-size: 18px; font-weight: 650; color: {chrome.title}; letter-spacing: -0.02em"
      >
        Revenue Analytics
      </h2>
    </div>
    <div
      style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center; justify-content: space-between; width: 100%"
    >
      <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center">
        {#each analyticsPresets as preset}
          <button
            type="button"
            onclick={() => (activeId = preset.id)}
            style="padding: 7px 12px; border-radius: 6px; border: none; cursor: pointer; font-size: 13px; font-weight: 550; background: {preset.id ===
            activeId
              ? chrome.chipActive
              : chrome.chipIdleBg}; color: {preset.id === activeId ? '#fff' : chrome.chipIdleColor}"
          >
            {preset.label}
          </button>
        {/each}
      </div>
      <button
        type="button"
        onclick={() => tableRef?.getAPI()?.exportToCSV()}
        style="padding: 7px 12px; border-radius: 6px; border: 1px solid {chrome.border}; cursor: pointer; font-size: 13px; font-weight: 550; background: {chrome.chipIdleBg}; color: {chrome.chipIdleColor}"
      >
        Export CSV
      </button>
    </div>
  </div>
  <div
    style="flex: 1; min-height: 0; display: flex; flex-direction: column"
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
          columns={analyticsDemoConfig.headers}
          enableColumnEditor={true}
          {getRowId}
          height="100%"
          includeHeadersInCSVExport={true}
          initialSortColumn={isPivoted ? undefined : "sales"}
          initialSortDirection={isPivoted ? undefined : "desc"}
          pivot={active.pivot}
          rows={analyticsDemoConfig.rows}
          selectableCells={true}
          {theme}
          hoverRowBackground={true}
          oddEvenRowBackground={true}
        />
      {/key}
    </div>
  </div>
</div>
