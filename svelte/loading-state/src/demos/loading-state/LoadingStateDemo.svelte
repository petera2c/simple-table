<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, GetRowIdParams } from "@simple-table/svelte";
  import { onMount } from "svelte";
  import { loadingStateConfig } from "./loading-state.demo-data";
  import type { LoadingStateEmployee } from "./loading-state.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  let isLoading = $state(true);
  let data = $state<LoadingStateEmployee[]>([]);

  const getRowId = ({ row }: GetRowIdParams<LoadingStateEmployee>) => row.id;

  function loadData() {
    isLoading = true;
    data = [];
    setTimeout(() => {
      data = [...loadingStateConfig.rows];
      isLoading = false;
    }, 2000);
  }

  onMount(() => {
    loadData();
  });
</script>

<div>
  <div style="margin-bottom: 12px">
    <button
      onclick={loadData}
      disabled={isLoading}
      style="padding: 6px 16px; cursor: {isLoading ? 'not-allowed' : 'pointer'}"
    >
      {isLoading ? "Loading\u2026" : "Reload Data"}
    </button>
  </div>
  <SimpleTable
    columns={loadingStateConfig.headers}
    rows={data}
    getRowId={getRowId}
    {isLoading}
    {height}
    {theme}
  />
</div>
