<script setup lang="ts">
import { ref, shallowRef, defineAsyncComponent, onMounted, onUnmounted } from "vue";
import { DEMO_LIST } from "./demo-list";

const registry: Record<string, () => Promise<{ default: any }>> = {
  "quick-start": () => import("./demos/quick-start/QuickStartDemo.vue"),
  "column-filtering": () => import("./demos/column-filtering/ColumnFilteringDemo.vue"),
  "column-sorting": () => import("./demos/column-sorting/ColumnSortingDemo.vue"),
  "value-formatter": () => import("./demos/value-formatter/ValueFormatterDemo.vue"),
  "pagination": () => import("./demos/pagination/PaginationDemo.vue"),
  "column-pinning": () => import("./demos/column-pinning/ColumnPinningDemo.vue"),
  "column-alignment": () => import("./demos/column-alignment/ColumnAlignmentDemo.vue"),
  "column-width": () => import("./demos/column-width/ColumnWidthDemo.vue"),
  "column-resizing": () => import("./demos/column-resizing/ColumnResizingDemo.vue"),
  "column-reordering": () => import("./demos/column-reordering/ColumnReorderingDemo.vue"),
  "column-selection": () => import("./demos/column-selection/ColumnSelectionDemo.vue"),
  "column-editing": () => import("./demos/column-editing/ColumnEditingDemo.vue"),
  "cell-editing": () => import("./demos/cell-editing/CellEditingDemo.vue"),
  "cell-highlighting": () => import("./demos/cell-highlighting/CellHighlightingDemo.vue"),
  "themes": () => import("./demos/themes/ThemesDemo.vue"),
  "row-height": () => import("./demos/row-height/RowHeightDemo.vue"),
  "table-height": () => import("./demos/table-height/TableHeightDemo.vue"),
  "quick-filter": () => import("./demos/quick-filter/QuickFilterDemo.vue"),
  "nested-headers": () => import("./demos/nested-headers/NestedHeadersDemo.vue"),
  "aggregate-functions": () => import("./demos/aggregate-functions/AggregateFunctionsDemo.vue"),
  "collapsible-columns": () => import("./demos/collapsible-columns/CollapsibleColumnsDemo.vue"),
  "external-sort": () => import("./demos/external-sort/ExternalSortDemo.vue"),
  "external-filter": () => import("./demos/external-filter/ExternalFilterDemo.vue"),
  "loading-state": () => import("./demos/loading-state/LoadingStateDemo.vue"),
  "infinite-scroll": () => import("./demos/infinite-scroll/InfiniteScrollDemo.vue"),
  "row-selection": () => import("./demos/row-selection/RowSelectionDemo.vue"),
  "csv-export": () => import("./demos/csv-export/CsvExportDemo.vue"),
  "programmatic-control": () => import("./demos/programmatic-control/ProgrammaticControlDemo.vue"),
  "row-grouping": () => import("./demos/row-grouping/RowGroupingDemo.vue"),
  "cell-renderer": () => import("./demos/cell-renderer/CellRendererDemo.vue"),
  "header-renderer": () => import("./demos/header-renderer/HeaderRendererDemo.vue"),
  "footer-renderer": () => import("./demos/footer-renderer/FooterRendererDemo.vue"),
  "cell-clicking": () => import("./demos/cell-clicking/CellClickingDemo.vue"),
  "tooltip": () => import("./demos/tooltip/TooltipDemo.vue"),
  "custom-theme": () => import("./demos/custom-theme/CustomThemeDemo.vue"),
  "custom-icons": () => import("./demos/custom-icons/CustomIconsDemo.vue"),
  "empty-state": () => import("./demos/empty-state/EmptyStateDemo.vue"),
  "column-visibility": () => import("./demos/column-visibility/ColumnVisibilityDemo.vue"),
  "column-editor-custom-renderer": () => import("./demos/column-editor-custom-renderer/ColumnEditorCustomRendererDemo.vue"),
  "single-row-children": () => import("./demos/single-row-children/SingleRowChildrenDemo.vue"),
  "nested-tables": () => import("./demos/nested-tables/NestedTablesDemo.vue"),
  "dynamic-nested-tables": () => import("./demos/dynamic-nested-tables/DynamicNestedTablesDemo.vue"),
  "dynamic-row-loading": () => import("./demos/dynamic-row-loading/DynamicRowLoadingDemo.vue"),
  "charts": () => import("./demos/charts/ChartsDemo.vue"),
  "live-update": () => import("./demos/live-update/LiveUpdateDemo.vue"),
  "crm": () => import("./demos/crm/CRMDemo.vue"),
  "infrastructure": () => import("./demos/infrastructure/InfrastructureDemo.vue"),
  "music": () => import("./demos/music/MusicDemo.vue"),
  "billing": () => import("./demos/billing/BillingDemo.vue"),
  "manufacturing": () => import("./demos/manufacturing/ManufacturingDemo.vue"),
  "hr": () => import("./demos/hr/HRDemo.vue"),
  "sales": () => import("./demos/sales/SalesDemo.vue"),
};

const params = new URLSearchParams(window.location.search);
const height = params.get("height") || undefined;
const theme = params.get("theme") || undefined;

const activeDemo = ref(params.get("demo") || "quick-start");
const DemoComponent = shallowRef<ReturnType<typeof defineAsyncComponent> | null>(null);

function loadDemo(id: string) {
  const loader = registry[id];
  DemoComponent.value = loader ? defineAsyncComponent(loader) : null;
}

function selectDemo(id: string) {
  activeDemo.value = id;
  const url = new URL(window.location.href);
  url.searchParams.set("demo", id);
  window.history.pushState({}, "", url);
  loadDemo(id);
}

function handlePopState() {
  activeDemo.value =
    new URLSearchParams(window.location.search).get("demo") || "quick-start";
  loadDemo(activeDemo.value);
}

loadDemo(activeDemo.value);

onMounted(() => window.addEventListener("popstate", handlePopState));
onUnmounted(() => window.removeEventListener("popstate", handlePopState));
</script>

<template>
  <div class="examples-shell">
    <aside class="examples-sidebar">
      <div class="examples-sidebar-header">Vue Examples</div>
      <nav>
        <ul class="examples-sidebar-nav">
          <li v-for="demo in DEMO_LIST" :key="demo.id">
            <button
              class="examples-sidebar-link"
              :class="{ active: activeDemo === demo.id }"
              @click="selectDemo(demo.id)"
            >
              {{ demo.label }}
            </button>
          </li>
        </ul>
      </nav>
    </aside>
    <main class="examples-content">
      <component
        v-if="DemoComponent"
        :is="DemoComponent"
        :height="height"
        :theme="theme"
      />
      <h2 v-else>Unknown demo: {{ activeDemo }}</h2>
    </main>
  </div>
</template>
