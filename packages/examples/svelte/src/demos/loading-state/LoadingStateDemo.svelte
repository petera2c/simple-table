<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, Row } from "@simple-table/svelte";
  import { onMount } from "svelte";
  import { loadingStateConfig } from "@simple-table/examples-shared";
  import "simple-table-core/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  let isLoading = $state(true);
  let data = $state<Row[]>([]);

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
    defaultHeaders={loadingStateConfig.headers}
    rows={data}
    {isLoading}
    {height}
    {theme}
  />
</div>
