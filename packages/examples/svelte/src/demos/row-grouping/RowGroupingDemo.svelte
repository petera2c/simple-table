<script lang="ts">
  import {SimpleTable, defaultHeadersFromCore} from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { rowGroupingConfig } from "./row-grouping.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  let tableRef: any;

  function expandAll() { tableRef?.getAPI()?.expandAll(); }
  function collapseAll() { tableRef?.getAPI()?.collapseAll(); }
  function onlyDivisions() { tableRef?.getAPI()?.collapseAll(); tableRef?.getAPI()?.expandDepth(0); }
  function divisionsAndDepts() { tableRef?.getAPI()?.setExpandedDepths(new Set([0, 1])); }
  function toggleDivisions() { tableRef?.getAPI()?.toggleDepth(0); }

  function btnStyle(color: string) {
    return `padding:6px 12px;background:${color};color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:500`;
  }
</script>

<div style="display: flex; flex-direction: column; gap: 12px">
  <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center">
    <span style="font-size: 13px; font-weight: 600; margin-right: 8px">Control Expansion:</span>
    <button style={btnStyle("#28a745")} onclick={expandAll} title="expandAll()">Expand All</button>
    <button style={btnStyle("#dc3545")} onclick={collapseAll} title="collapseAll()">Collapse All</button>
    <button style={btnStyle("#007bff")} onclick={onlyDivisions} title="expandDepth(0)">Only Divisions</button>
    <button style={btnStyle("#6c757d")} onclick={divisionsAndDepts} title="setExpandedDepths(new Set([0, 1]))">Divisions + Departments</button>
    <button style={btnStyle("#6f42c1")} onclick={toggleDivisions} title="toggleDepth(0)">Toggle Divisions</button>
  </div>
  <SimpleTable
    bind:this={tableRef}
    defaultHeaders={defaultHeadersFromCore(rowGroupingConfig.headers)}
    rows={rowGroupingConfig.rows}
    rowGrouping={rowGroupingConfig.tableProps.rowGrouping}
    enableStickyParents={true}
    getRowId={rowGroupingConfig.tableProps.getRowId}
    columnResizing={true}
    {height}
    {theme}
  />
</div>
