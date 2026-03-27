<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, Row } from "@simple-table/svelte";
  import { onMount } from "svelte";
  import { loadingStateConfig } from "@simple-table/examples-shared";
  import "simple-table-core/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  let isLoading = $state(true);
  let data = $state<Row[]>([]);

  function load() {
    isLoading = true;
    data = [];
    setTimeout(() => {
      data = [...loadingStateConfig.rows];
      isLoading = false;
    }, 2000);
  }

  onMount(() => {
    load();
  });
</script>

<div>
  <div style="display: flex; gap: 8px; margin-bottom: 12px;">
    <button onclick={load}>Reload Data</button>
  </div>
  <SimpleTable
    defaultHeaders={loadingStateConfig.headers}
    rows={data}
    {isLoading}
    {height}
    {theme}
  />
</div>
