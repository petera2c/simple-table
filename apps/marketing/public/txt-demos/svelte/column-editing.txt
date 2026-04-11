<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import type { HeaderObject } from "simple-table-core";
  import { columnEditingData, columnEditingHeaders } from "@simple-table/examples-shared";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  let additionalColumns: HeaderObject[] = $state([]);
  let lastAdded = $state("");

  function addColumn() {
    const n = additionalColumns.length + 1;
    const col: HeaderObject = { accessor: `custom-${n}`, label: `Custom ${n}`, width: 120, type: "string" };
    additionalColumns = [...additionalColumns, col];
    lastAdded = col.label;
  }

  function handleHeaderEdit(_header: HeaderObject, newLabel: string) {
    lastAdded = `Renamed to: ${newLabel}`;
  }

  let headers = $derived([...columnEditingHeaders, ...additionalColumns]);
</script>

<div>
  <div style="margin-bottom: 12px">
    <button
      onclick={addColumn}
      style="background-color: #007bff; color: white; border: none; padding: 6px 14px; border-radius: 4px; cursor: pointer; font-size: 13px;"
    >
      + Add Column
    </button>
    {#if lastAdded}
      <span style="margin-left: 12px; color: #64748b; font-size: 13px;">Added: {lastAdded}</span>
    {/if}
  </div>
  <SimpleTable
    defaultHeaders={headers}
    rows={columnEditingData}
    {height}
    {theme}
    enableHeaderEditing={true}
    selectableColumns={true}
    onHeaderEdit={handleHeaderEdit}
  />
</div>
