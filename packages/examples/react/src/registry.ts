import type { ComponentType } from "react";
import type { Theme } from "@simple-table/react";

export interface DemoProps {
  height?: string | number;
  theme?: Theme;
}

type DemoRegistry = Record<string, () => Promise<{ default: ComponentType<DemoProps> }>>;

export const registry: DemoRegistry = {
  "quick-start": () => import("./demos/quick-start/QuickStartDemo"),
  "column-filtering": () => import("./demos/column-filtering/ColumnFilteringDemo"),
  "column-sorting": () => import("./demos/column-sorting/ColumnSortingDemo"),
  "value-formatter": () => import("./demos/value-formatter/ValueFormatterDemo"),
  "pagination": () => import("./demos/pagination/PaginationDemo"),
  "column-pinning": () => import("./demos/column-pinning/ColumnPinningDemo"),
  "column-alignment": () => import("./demos/column-alignment/ColumnAlignmentDemo"),
  "column-width": () => import("./demos/column-width/ColumnWidthDemo"),
  "column-resizing": () => import("./demos/column-resizing/ColumnResizingDemo"),
  "column-reordering": () => import("./demos/column-reordering/ColumnReorderingDemo"),
  "column-selection": () => import("./demos/column-selection/ColumnSelectionDemo"),
  "column-editing": () => import("./demos/column-editing/ColumnEditingDemo"),
  "cell-editing": () => import("./demos/cell-editing/CellEditingDemo"),
  "cell-highlighting": () => import("./demos/cell-highlighting/CellHighlightingDemo"),
  "themes": () => import("./demos/themes/ThemesDemo"),
  "row-height": () => import("./demos/row-height/RowHeightDemo"),
  "table-height": () => import("./demos/table-height/TableHeightDemo"),
  "quick-filter": () => import("./demos/quick-filter/QuickFilterDemo"),
  "nested-headers": () => import("./demos/nested-headers/NestedHeadersDemo"),
  // Phase 2
  "external-sort": () => import("./demos/external-sort/ExternalSortDemo"),
  "external-filter": () => import("./demos/external-filter/ExternalFilterDemo"),
  "loading-state": () => import("./demos/loading-state/LoadingStateDemo"),
  "infinite-scroll": () => import("./demos/infinite-scroll/InfiniteScrollDemo"),
  "row-selection": () => import("./demos/row-selection/RowSelectionDemo"),
  "csv-export": () => import("./demos/csv-export/CsvExportDemo"),
  "programmatic-control": () => import("./demos/programmatic-control/ProgrammaticControlDemo"),
  "row-grouping": () => import("./demos/row-grouping/RowGroupingDemo"),
  "aggregate-functions": () => import("./demos/aggregate-functions/AggregateFunctionsDemo"),
  "collapsible-columns": () => import("./demos/collapsible-columns/CollapsibleColumnsDemo"),
  // Phase 3
  "cell-renderer": () => import("./demos/cell-renderer/CellRendererDemo"),
  "header-renderer": () => import("./demos/header-renderer/HeaderRendererDemo"),
  "footer-renderer": () => import("./demos/footer-renderer/FooterRendererDemo"),
  "cell-clicking": () => import("./demos/cell-clicking/CellClickingDemo"),
  "tooltip": () => import("./demos/tooltip/TooltipDemo"),
  "custom-theme": () => import("./demos/custom-theme/CustomThemeDemo"),
  "custom-icons": () => import("./demos/custom-icons/CustomIconsDemo"),
  "empty-state": () => import("./demos/empty-state/EmptyStateDemo"),
  "column-visibility": () => import("./demos/column-visibility/ColumnVisibilityDemo"),
  "column-editor-custom-renderer": () => import("./demos/column-editor-custom-renderer/ColumnEditorCustomRendererDemo"),
  // Phase 4
  "single-row-children": () => import("./demos/single-row-children/SingleRowChildrenDemo"),
  "nested-tables": () => import("./demos/nested-tables/NestedTablesDemo"),
  "dynamic-nested-tables": () => import("./demos/dynamic-nested-tables/DynamicNestedTablesDemo"),
  "dynamic-row-loading": () => import("./demos/dynamic-row-loading/DynamicRowLoadingDemo"),
  "charts": () => import("./demos/charts/ChartsDemo"),
  "live-update": () => import("./demos/live-update/LiveUpdateDemo"),
  "crm": () => import("./demos/crm/CRMDemo"),
  "infrastructure": () => import("./demos/infrastructure/InfrastructureDemo"),
  "music": () => import("./demos/music/MusicDemo"),
  "billing": () => import("./demos/billing/BillingDemo"),
  "manufacturing": () => import("./demos/manufacturing/ManufacturingDemo"),
  "hr": () => import("./demos/hr/HRDemo"),
  "sales": () => import("./demos/sales/SalesDemo"),
};
