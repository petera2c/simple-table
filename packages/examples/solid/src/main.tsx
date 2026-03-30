import { render, Dynamic } from "solid-js/web";
import { lazy, Suspense, createSignal, Show, onMount, onCleanup } from "solid-js";
import { DEMO_LIST } from "@simple-table/examples-shared";
import type { Theme } from "@simple-table/solid";
import "../../shared/src/styles/shell.css";

const registry: Record<string, ReturnType<typeof lazy>> = {
  "quick-start": lazy(() => import("./demos/quick-start/QuickStartDemo")),
  "column-filtering": lazy(() => import("./demos/column-filtering/ColumnFilteringDemo")),
  "column-sorting": lazy(() => import("./demos/column-sorting/ColumnSortingDemo")),
  "value-formatter": lazy(() => import("./demos/value-formatter/ValueFormatterDemo")),
  pagination: lazy(() => import("./demos/pagination/PaginationDemo")),
  "column-pinning": lazy(() => import("./demos/column-pinning/ColumnPinningDemo")),
  "column-alignment": lazy(() => import("./demos/column-alignment/ColumnAlignmentDemo")),
  "column-width": lazy(() => import("./demos/column-width/ColumnWidthDemo")),
  "column-resizing": lazy(() => import("./demos/column-resizing/ColumnResizingDemo")),
  "column-reordering": lazy(() => import("./demos/column-reordering/ColumnReorderingDemo")),
  "column-selection": lazy(() => import("./demos/column-selection/ColumnSelectionDemo")),
  "column-editing": lazy(() => import("./demos/column-editing/ColumnEditingDemo")),
  "cell-editing": lazy(() => import("./demos/cell-editing/CellEditingDemo")),
  "cell-highlighting": lazy(() => import("./demos/cell-highlighting/CellHighlightingDemo")),
  themes: lazy(() => import("./demos/themes/ThemesDemo")),
  "row-height": lazy(() => import("./demos/row-height/RowHeightDemo")),
  "table-height": lazy(() => import("./demos/table-height/TableHeightDemo")),
  "quick-filter": lazy(() => import("./demos/quick-filter/QuickFilterDemo")),
  "nested-headers": lazy(() => import("./demos/nested-headers/NestedHeadersDemo")),
  "aggregate-functions": lazy(() => import("./demos/aggregate-functions/AggregateFunctionsDemo")),
  "collapsible-columns": lazy(() => import("./demos/collapsible-columns/CollapsibleColumnsDemo")),
  "external-sort": lazy(() => import("./demos/external-sort/ExternalSortDemo")),
  "external-filter": lazy(() => import("./demos/external-filter/ExternalFilterDemo")),
  "loading-state": lazy(() => import("./demos/loading-state/LoadingStateDemo")),
  "infinite-scroll": lazy(() => import("./demos/infinite-scroll/InfiniteScrollDemo")),
  "row-selection": lazy(() => import("./demos/row-selection/RowSelectionDemo")),
  "csv-export": lazy(() => import("./demos/csv-export/CsvExportDemo")),
  "programmatic-control": lazy(
    () => import("./demos/programmatic-control/ProgrammaticControlDemo"),
  ),
  "row-grouping": lazy(() => import("./demos/row-grouping/RowGroupingDemo")),
  "cell-renderer": lazy(() => import("./demos/cell-renderer/CellRendererDemo")),
  "header-renderer": lazy(() => import("./demos/header-renderer/HeaderRendererDemo")),
  "footer-renderer": lazy(() => import("./demos/footer-renderer/FooterRendererDemo")),
  "cell-clicking": lazy(() => import("./demos/cell-clicking/CellClickingDemo")),
  tooltip: lazy(() => import("./demos/tooltip/TooltipDemo")),
  "custom-theme": lazy(() => import("./demos/custom-theme/CustomThemeDemo")),
  "custom-icons": lazy(() => import("./demos/custom-icons/CustomIconsDemo")),
  "empty-state": lazy(() => import("./demos/empty-state/EmptyStateDemo")),
  "column-visibility": lazy(() => import("./demos/column-visibility/ColumnVisibilityDemo")),
  "column-editor-custom-renderer": lazy(
    () => import("./demos/column-editor-custom-renderer/ColumnEditorCustomRendererDemo"),
  ),
  "single-row-children": lazy(() => import("./demos/single-row-children/SingleRowChildrenDemo")),
  "nested-tables": lazy(() => import("./demos/nested-tables/NestedTablesDemo")),
  "dynamic-nested-tables": lazy(
    () => import("./demos/dynamic-nested-tables/DynamicNestedTablesDemo"),
  ),
  "dynamic-row-loading": lazy(() => import("./demos/dynamic-row-loading/DynamicRowLoadingDemo")),
  charts: lazy(() => import("./demos/charts/ChartsDemo")),
  "live-update": lazy(() => import("./demos/live-update/LiveUpdateDemo")),
  crm: lazy(() => import("./demos/crm/CRMDemo")),
  infrastructure: lazy(() => import("./demos/infrastructure/InfrastructureDemo")),
  music: lazy(() => import("./demos/music/MusicDemo")),
  billing: lazy(() => import("./demos/billing/BillingDemo")),
  manufacturing: lazy(() => import("./demos/manufacturing/ManufacturingDemo")),
  hr: lazy(() => import("./demos/hr/HRDemo")),
  sales: lazy(() => import("./demos/sales/SalesDemo")),
  spreadsheet: lazy(() => import("./demos/spreadsheet/SpreadsheetDemo")),
};

function App() {
  const params = new URLSearchParams(window.location.search);
  const height = params.get("height") || undefined;
  const theme = (params.get("theme") as Theme) || undefined;

  const [activeDemo, setActiveDemo] = createSignal(params.get("demo") || "quick-start");

  function selectDemo(id: string) {
    setActiveDemo(id);
    const url = new URL(window.location.href);
    url.searchParams.set("demo", id);
    window.history.pushState({}, "", url);
  }

  const handlePopState = () => {
    setActiveDemo(new URLSearchParams(window.location.search).get("demo") || "quick-start");
  };

  onMount(() => window.addEventListener("popstate", handlePopState));
  onCleanup(() => window.removeEventListener("popstate", handlePopState));

  return (
    <div class="examples-shell">
      <aside class="examples-sidebar">
        <div class="examples-sidebar-header">Solid Examples</div>
        <nav>
          <ul class="examples-sidebar-nav">
            {DEMO_LIST.map((demo) => (
              <li>
                <button
                  class="examples-sidebar-link"
                  classList={{ active: activeDemo() === demo.id }}
                  onClick={() => selectDemo(demo.id)}
                >
                  {demo.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main class="examples-content">
        <Show when={registry[activeDemo()]} keyed fallback={<h2>Unknown demo: {activeDemo()}</h2>}>
          {(DemoComp) => (
            <Suspense fallback={<div>Loading...</div>}>
              <DemoComp height={height} theme={theme} />
            </Suspense>
          )}
        </Show>
      </main>
    </div>
  );
}

render(App, document.getElementById("root")!);
