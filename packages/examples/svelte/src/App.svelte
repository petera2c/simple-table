<script lang="ts">
  import { DEMO_LIST } from "./demo-list";
  import { onMount } from "svelte";

  const params = new URLSearchParams(window.location.search);
  const height = params.get("height") || undefined;
  const theme = params.get("theme") || undefined;

  let activeDemo = $state(params.get("demo") || "quick-start");

  const registry: Record<string, () => Promise<any>> = {
    "quick-start": () => import("./demos/quick-start/QuickStartDemo.svelte"),
    "column-filtering": () => import("./demos/column-filtering/ColumnFilteringDemo.svelte"),
    "column-sorting": () => import("./demos/column-sorting/ColumnSortingDemo.svelte"),
    "value-formatter": () => import("./demos/value-formatter/ValueFormatterDemo.svelte"),
    "pagination": () => import("./demos/pagination/PaginationDemo.svelte"),
    "column-pinning": () => import("./demos/column-pinning/ColumnPinningDemo.svelte"),
    "column-alignment": () => import("./demos/column-alignment/ColumnAlignmentDemo.svelte"),
    "column-width": () => import("./demos/column-width/ColumnWidthDemo.svelte"),
    "column-resizing": () => import("./demos/column-resizing/ColumnResizingDemo.svelte"),
    "column-reordering": () => import("./demos/column-reordering/ColumnReorderingDemo.svelte"),
    "column-selection": () => import("./demos/column-selection/ColumnSelectionDemo.svelte"),
    "column-editing": () => import("./demos/column-editing/ColumnEditingDemo.svelte"),
    "cell-editing": () => import("./demos/cell-editing/CellEditingDemo.svelte"),
    "cell-highlighting": () => import("./demos/cell-highlighting/CellHighlightingDemo.svelte"),
    "themes": () => import("./demos/themes/ThemesDemo.svelte"),
    "row-height": () => import("./demos/row-height/RowHeightDemo.svelte"),
    "table-height": () => import("./demos/table-height/TableHeightDemo.svelte"),
    "quick-filter": () => import("./demos/quick-filter/QuickFilterDemo.svelte"),
    "nested-headers": () => import("./demos/nested-headers/NestedHeadersDemo.svelte"),
    "aggregate-functions": () => import("./demos/aggregate-functions/AggregateFunctionsDemo.svelte"),
    "collapsible-columns": () => import("./demos/collapsible-columns/CollapsibleColumnsDemo.svelte"),
    "external-sort": () => import("./demos/external-sort/ExternalSortDemo.svelte"),
    "external-filter": () => import("./demos/external-filter/ExternalFilterDemo.svelte"),
    "loading-state": () => import("./demos/loading-state/LoadingStateDemo.svelte"),
    "infinite-scroll": () => import("./demos/infinite-scroll/InfiniteScrollDemo.svelte"),
    "window-infinite-scroll": () => import("./demos/window-infinite-scroll/WindowInfiniteScrollDemo.svelte"),
    "row-selection": () => import("./demos/row-selection/RowSelectionDemo.svelte"),
    "csv-export": () => import("./demos/csv-export/CsvExportDemo.svelte"),
    "programmatic-control": () => import("./demos/programmatic-control/ProgrammaticControlDemo.svelte"),
    "row-grouping": () => import("./demos/row-grouping/RowGroupingDemo.svelte"),
    "cell-renderer": () => import("./demos/cell-renderer/CellRendererDemo.svelte"),
    "header-renderer": () => import("./demos/header-renderer/HeaderRendererDemo.svelte"),
    "footer-renderer": () => import("./demos/footer-renderer/FooterRendererDemo.svelte"),
    "cell-clicking": () => import("./demos/cell-clicking/CellClickingDemo.svelte"),
    "tooltip": () => import("./demos/tooltip/TooltipDemo.svelte"),
    "custom-theme": () => import("./demos/custom-theme/CustomThemeDemo.svelte"),
    "custom-icons": () => import("./demos/custom-icons/CustomIconsDemo.svelte"),
    "empty-state": () => import("./demos/empty-state/EmptyStateDemo.svelte"),
    "column-visibility": () => import("./demos/column-visibility/ColumnVisibilityDemo.svelte"),
    "column-editor-custom-renderer": () => import("./demos/column-editor-custom-renderer/ColumnEditorCustomRendererDemo.svelte"),
    "single-row-children": () => import("./demos/single-row-children/SingleRowChildrenDemo.svelte"),
    "nested-tables": () => import("./demos/nested-tables/NestedTablesDemo.svelte"),
    "dynamic-nested-tables": () => import("./demos/dynamic-nested-tables/DynamicNestedTablesDemo.svelte"),
    "dynamic-row-loading": () => import("./demos/dynamic-row-loading/DynamicRowLoadingDemo.svelte"),
    "charts": () => import("./demos/charts/ChartsDemo.svelte"),
    "live-update": () => import("./demos/live-update/LiveUpdateDemo.svelte"),
    "crm": () => import("./demos/crm/CRMDemo.svelte"),
    "infrastructure": () => import("./demos/infrastructure/InfrastructureDemo.svelte"),
    "music": () => import("./demos/music/MusicDemo.svelte"),
    "billing": () => import("./demos/billing/BillingDemo.svelte"),
    "manufacturing": () => import("./demos/manufacturing/ManufacturingDemo.svelte"),
    "hr": () => import("./demos/hr/HRDemo.svelte"),
    "sales": () => import("./demos/sales/SalesDemo.svelte"),
  };

  let loader = $derived(registry[activeDemo]);

  function selectDemo(id: string) {
    activeDemo = id;
    const url = new URL(window.location.href);
    url.searchParams.set("demo", id);
    window.history.pushState({}, "", url);
  }

  onMount(() => {
    const handlePopState = () => {
      activeDemo =
        new URLSearchParams(window.location.search).get("demo") || "quick-start";
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  });
</script>

<div class="examples-shell">
  <aside class="examples-sidebar">
    <div class="examples-sidebar-header">Svelte Examples</div>
    <nav>
      <ul class="examples-sidebar-nav">
        {#each DEMO_LIST as demo}
          <li>
            <button
              class="examples-sidebar-link"
              class:active={activeDemo === demo.id}
              onclick={() => selectDemo(demo.id)}
            >
              {demo.label}
            </button>
          </li>
        {/each}
      </ul>
    </nav>
  </aside>
  <main class="examples-content">
    {#key activeDemo}
      {#if loader}
        {#await loader() then mod}
          <mod.default {height} {theme} />
        {/await}
      {:else}
        <h2>Unknown demo: {activeDemo}</h2>
      {/if}
    {/key}
  </main>
</div>
