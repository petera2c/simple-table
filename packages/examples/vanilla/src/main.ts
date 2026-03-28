import { DEMO_LIST } from "@simple-table/examples-shared";
import type { Theme } from "simple-table-core";
import "../../shared/src/styles/shell.css";

type DemoRenderer = (
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
) => any;

const registry: Record<
  string,
  () => Promise<{ [key: string]: DemoRenderer }>
> = {
  "quick-start": () =>
    import("./demos/quick-start/QuickStartDemo").then((m) => ({
      render: m.renderQuickStartDemo,
    })),
  "column-filtering": () =>
    import("./demos/column-filtering/ColumnFilteringDemo").then((m) => ({
      render: m.renderColumnFilteringDemo,
    })),
  "column-sorting": () =>
    import("./demos/column-sorting/ColumnSortingDemo").then((m) => ({
      render: m.renderColumnSortingDemo,
    })),
  "value-formatter": () =>
    import("./demos/value-formatter/ValueFormatterDemo").then((m) => ({
      render: m.renderValueFormatterDemo,
    })),
  "pagination": () =>
    import("./demos/pagination/PaginationDemo").then((m) => ({
      render: m.renderPaginationDemo,
    })),
  "column-pinning": () =>
    import("./demos/column-pinning/ColumnPinningDemo").then((m) => ({
      render: m.renderColumnPinningDemo,
    })),
  "column-alignment": () =>
    import("./demos/column-alignment/ColumnAlignmentDemo").then((m) => ({
      render: m.renderColumnAlignmentDemo,
    })),
  "column-width": () =>
    import("./demos/column-width/ColumnWidthDemo").then((m) => ({
      render: m.renderColumnWidthDemo,
    })),
  "column-resizing": () =>
    import("./demos/column-resizing/ColumnResizingDemo").then((m) => ({
      render: m.renderColumnResizingDemo,
    })),
  "column-reordering": () =>
    import("./demos/column-reordering/ColumnReorderingDemo").then((m) => ({
      render: m.renderColumnReorderingDemo,
    })),
  "column-selection": () =>
    import("./demos/column-selection/ColumnSelectionDemo").then((m) => ({
      render: m.renderColumnSelectionDemo,
    })),
  "column-editing": () =>
    import("./demos/column-editing/ColumnEditingDemo").then((m) => ({
      render: m.renderColumnEditingDemo,
    })),
  "cell-editing": () =>
    import("./demos/cell-editing/CellEditingDemo").then((m) => ({
      render: m.renderCellEditingDemo,
    })),
  "cell-highlighting": () =>
    import("./demos/cell-highlighting/CellHighlightingDemo").then((m) => ({
      render: m.renderCellHighlightingDemo,
    })),
  "themes": () =>
    import("./demos/themes/ThemesDemo").then((m) => ({
      render: m.renderThemesDemo,
    })),
  "row-height": () =>
    import("./demos/row-height/RowHeightDemo").then((m) => ({
      render: m.renderRowHeightDemo,
    })),
  "table-height": () =>
    import("./demos/table-height/TableHeightDemo").then((m) => ({
      render: m.renderTableHeightDemo,
    })),
  "quick-filter": () =>
    import("./demos/quick-filter/QuickFilterDemo").then((m) => ({
      render: m.renderQuickFilterDemo,
    })),
  "nested-headers": () =>
    import("./demos/nested-headers/NestedHeadersDemo").then((m) => ({
      render: m.renderNestedHeadersDemo,
    })),
  "aggregate-functions": () =>
    import("./demos/aggregate-functions/AggregateFunctionsDemo").then((m) => ({
      render: m.renderAggregateFunctionsDemo,
    })),
  "collapsible-columns": () =>
    import("./demos/collapsible-columns/CollapsibleColumnsDemo").then((m) => ({
      render: m.renderCollapsibleColumnsDemo,
    })),
  "external-sort": () =>
    import("./demos/external-sort/ExternalSortDemo").then((m) => ({
      render: m.renderExternalSortDemo,
    })),
  "external-filter": () =>
    import("./demos/external-filter/ExternalFilterDemo").then((m) => ({
      render: m.renderExternalFilterDemo,
    })),
  "loading-state": () =>
    import("./demos/loading-state/LoadingStateDemo").then((m) => ({
      render: m.renderLoadingStateDemo,
    })),
  "infinite-scroll": () =>
    import("./demos/infinite-scroll/InfiniteScrollDemo").then((m) => ({
      render: m.renderInfiniteScrollDemo,
    })),
  "row-selection": () =>
    import("./demos/row-selection/RowSelectionDemo").then((m) => ({
      render: m.renderRowSelectionDemo,
    })),
  "csv-export": () =>
    import("./demos/csv-export/CsvExportDemo").then((m) => ({
      render: m.renderCsvExportDemo,
    })),
  "programmatic-control": () =>
    import("./demos/programmatic-control/ProgrammaticControlDemo").then((m) => ({
      render: m.renderProgrammaticControlDemo,
    })),
  "row-grouping": () =>
    import("./demos/row-grouping/RowGroupingDemo").then((m) => ({
      render: m.renderRowGroupingDemo,
    })),
  "cell-renderer": () =>
    import("./demos/cell-renderer/CellRendererDemo").then((m) => ({
      render: m.renderCellRendererDemo,
    })),
  "header-renderer": () =>
    import("./demos/header-renderer/HeaderRendererDemo").then((m) => ({
      render: m.renderHeaderRendererDemo,
    })),
  "footer-renderer": () =>
    import("./demos/footer-renderer/FooterRendererDemo").then((m) => ({
      render: m.renderFooterRendererDemo,
    })),
  "cell-clicking": () =>
    import("./demos/cell-clicking/CellClickingDemo").then((m) => ({
      render: m.renderCellClickingDemo,
    })),
  "tooltip": () =>
    import("./demos/tooltip/TooltipDemo").then((m) => ({
      render: m.renderTooltipDemo,
    })),
  "custom-theme": () =>
    import("./demos/custom-theme/CustomThemeDemo").then((m) => ({
      render: m.renderCustomThemeDemo,
    })),
  "custom-icons": () =>
    import("./demos/custom-icons/CustomIconsDemo").then((m) => ({
      render: m.renderCustomIconsDemo,
    })),
  "empty-state": () =>
    import("./demos/empty-state/EmptyStateDemo").then((m) => ({
      render: m.renderEmptyStateDemo,
    })),
  "column-visibility": () =>
    import("./demos/column-visibility/ColumnVisibilityDemo").then((m) => ({
      render: m.renderColumnVisibilityDemo,
    })),
  "column-editor-custom-renderer": () =>
    import("./demos/column-editor-custom-renderer/ColumnEditorCustomRendererDemo").then((m) => ({
      render: m.renderColumnEditorCustomRendererDemo,
    })),
  "single-row-children": () =>
    import("./demos/single-row-children/SingleRowChildrenDemo").then((m) => ({
      render: m.renderSingleRowChildrenDemo,
    })),
  "nested-tables": () =>
    import("./demos/nested-tables/NestedTablesDemo").then((m) => ({
      render: m.renderNestedTablesDemo,
    })),
  "dynamic-nested-tables": () =>
    import("./demos/dynamic-nested-tables/DynamicNestedTablesDemo").then((m) => ({
      render: m.renderDynamicNestedTablesDemo,
    })),
  "dynamic-row-loading": () =>
    import("./demos/dynamic-row-loading/DynamicRowLoadingDemo").then((m) => ({
      render: m.renderDynamicRowLoadingDemo,
    })),
  charts: () =>
    import("./demos/charts/ChartsDemo").then((m) => ({
      render: m.renderChartsDemo,
    })),
  "live-update": () =>
    import("./demos/live-update/LiveUpdateDemo").then((m) => ({
      render: m.renderLiveUpdateDemo,
    })),
  crm: () =>
    import("./demos/crm/CRMDemo").then((m) => ({
      render: m.renderCRMDemo,
    })),
  infrastructure: () =>
    import("./demos/infrastructure/InfrastructureDemo").then((m) => ({
      render: m.renderInfrastructureDemo,
    })),
  music: () =>
    import("./demos/music/MusicDemo").then((m) => ({
      render: m.renderMusicDemo,
    })),
  billing: () =>
    import("./demos/billing/BillingDemo").then((m) => ({
      render: m.renderBillingDemo,
    })),
  manufacturing: () =>
    import("./demos/manufacturing/ManufacturingDemo").then((m) => ({
      render: m.renderManufacturingDemo,
    })),
  hr: () =>
    import("./demos/hr/HRDemo").then((m) => ({
      render: m.renderHRDemo,
    })),
  sales: () =>
    import("./demos/sales/SalesDemo").then((m) => ({
      render: m.renderSalesDemo,
    })),
  spreadsheet: () =>
    import("./demos/spreadsheet/SpreadsheetDemo").then((m) => ({
      render: m.renderSpreadsheetDemo,
    })),
};

const params = new URLSearchParams(window.location.search);
let activeDemo = params.get("demo") || "quick-start";
let currentInstance: any = null;
const height = params.get("height") || undefined;
const theme = (params.get("theme") as Theme) || undefined;

const root = document.getElementById("root")!;
root.innerHTML = "";

const shell = document.createElement("div");
shell.className = "examples-shell";

const sidebar = document.createElement("aside");
sidebar.className = "examples-sidebar";

const header = document.createElement("div");
header.className = "examples-sidebar-header";
header.textContent = "Vanilla TS Examples";
sidebar.appendChild(header);

const nav = document.createElement("nav");
const ul = document.createElement("ul");
ul.className = "examples-sidebar-nav";

const links = new Map<string, HTMLButtonElement>();

for (const demo of DEMO_LIST) {
  const li = document.createElement("li");
  const btn = document.createElement("button");
  btn.className = "examples-sidebar-link";
  btn.textContent = demo.label;
  btn.addEventListener("click", () => selectDemo(demo.id));
  links.set(demo.id, btn);
  li.appendChild(btn);
  ul.appendChild(li);
}

nav.appendChild(ul);
sidebar.appendChild(nav);

const content = document.createElement("main");
content.className = "examples-content";

shell.appendChild(sidebar);
shell.appendChild(content);
root.appendChild(shell);

function updateActive(id: string) {
  links.forEach((btn, demoId) => {
    btn.classList.toggle("active", demoId === id);
  });
}

async function loadDemo(id: string) {
  if (currentInstance?.destroy) {
    currentInstance.destroy();
  }
  currentInstance = null;
  content.innerHTML = "";
  const loader = registry[id];
  if (!loader) {
    content.innerHTML = `<h2>Unknown demo: ${id}</h2>`;
    return;
  }
  const mod = await loader();
  const result = mod.render(content, { height, theme });
  if (result?.mount) result.mount();
  currentInstance = result;
}

function selectDemo(id: string) {
  activeDemo = id;
  const url = new URL(window.location.href);
  url.searchParams.set("demo", id);
  window.history.pushState({}, "", url);
  updateActive(id);
  loadDemo(id);
}

updateActive(activeDemo);
loadDemo(activeDemo);

window.addEventListener("popstate", () => {
  activeDemo =
    new URLSearchParams(window.location.search).get("demo") || "quick-start";
  updateActive(activeDemo);
  loadDemo(activeDemo);
});
