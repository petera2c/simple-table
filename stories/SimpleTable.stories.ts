/**
 * Docs & Examples – vanilla ports of React Storybook examples.
 * Each story uses SimpleTableVanilla; example logic lives in stories/examples/.
 */
import type { Meta, StoryObj } from "@storybook/html";
import { renderBasicExample } from "./examples/BasicExample";
import { renderAlignmentExample } from "./examples/AlignmentExample";
import { renderNestedAccessorExample } from "./examples/NestedAccessorExample";
import { renderThemingExample } from "./examples/Theming";
import { renderSelectableCellsExample } from "./examples/SelectableCells";
import { renderHiddenColumnsExample } from "./examples/HiddenColumnsExample";
import { renderRowHeightExample } from "./examples/RowHeightExample";
import { renderLoadingStateExample } from "./examples/LoadingStateExample";
import { renderPaginationExample } from "./examples/Pagination";
import { renderServerSidePaginationExample } from "./examples/ServerSidePaginationExample";
import { renderRowSelectionExample } from "./examples/RowSelectionExample";
import { renderRowButtonsExample } from "./examples/RowButtonsExample";
import { renderCellRendererExample } from "./examples/CellRenderer";
import { renderTooltipExample } from "./examples/TooltipExample";
import { renderBasicRowGroupingExample } from "./examples/BasicRowGrouping";
import { renderPinnedColumnsExample } from "./examples/pinned-columns/PinnedColumns";
import { renderRowGroupingExample } from "./examples/row-grouping/RowGrouping";
import { renderAdvancedSortingExample } from "./examples/AdvancedSortingExample";
import { renderAggregateExample } from "./examples/AggregateExample";
import { renderAutoExpandColumnsExample } from "./examples/AutoExpandColumnsExample";
import { renderBillingExample } from "./examples/billing-example/BillingExample";
import { renderCellHighlightingExample } from "./examples/CellHighlighting";
import { renderChartsExample } from "./examples/ChartsExample";
import { renderClayExample } from "./examples/ClayExample";
import { renderClipboardFormattingExample } from "./examples/ClipboardFormattingExample";
import { renderCollapsibleColumnsExample } from "./examples/CollapsibleColumnsExample";
import { renderColumnWidthChangeExample } from "./examples/ColumnWidthChangeExample";
import { renderColumnVisibilityAPIExample } from "./examples/ColumnVisibilityAPIExample";
import { renderCSVExportFormattingExample } from "./examples/CSVExportFormattingExample";
import { renderCSVExportSingleRowChildrenExample } from "./examples/CSVExportSingleRowChildrenExample";
import { renderCustomHeaderRenderingExample } from "./examples/CustomHeaderRenderingExample";
import { renderCustomThemeExample } from "./examples/custom-theme/CustomThemeDemo";
import { renderDynamicHeadersExample } from "./examples/DynamicHeadersExample";
import { renderDynamicRowLoadingExample } from "./examples/DynamicRowLoadingExample";
import { renderDynamicRowLoadingWithExternalSortExample } from "./examples/DynamicRowLoadingWithExternalSortExample";
import { renderDynamicNestedTableExample } from "./examples/DynamicNestedTableExample";
import { renderEditableCellsExample } from "./examples/EditableCells";
import { renderExpansionControlExample } from "./examples/ExpansionControlExample";
import { renderExternalFilterExample } from "./examples/ExternalFilterExample";
import { renderExternalSortExample } from "./examples/ExternalSortExample";
import { renderFilterExample } from "./examples/filter-example/FilterExample";
import { renderFinanceExample } from "./examples/finance-example/FinancialExample";
import { renderHeaderInclusionExample } from "./examples/HeaderInclusionExample";
import { renderInfiniteScrollExample } from "./examples/InfiniteScroll";
import { renderInfrastructureExample } from "./examples/infrastructure/InfrastructureExample";
import { renderLeadsExample } from "./examples/leads/LeadsExample";
import { renderLiveUpdatesExample } from "./examples/LiveUpdates";
import { renderManufacturingExample } from "./examples/manufacturing/ManufacturingExample";
import { renderMusicExample } from "./examples/music/MusicExample";
import { renderNestedGridExample } from "./examples/NestedGridExample";
import { renderPaginationAPIExample } from "./examples/PaginationAPIExample";
import { renderProgrammaticFilterExample } from "./examples/ProgrammaticFilterExample";
import { renderProgrammaticSortExample } from "./examples/ProgrammaticSortExample";
import { renderQuickFilterExample } from "./examples/QuickFilterExample";
import { renderSalesExample } from "./examples/sales-example/SalesExample";

const meta: Meta = {
  title: "Docs & Examples",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

export const BasicExample: StoryObj = {
  render: () => renderBasicExample(),
  parameters: { docs: { description: { story: "Quick start demo: sortable, filterable columns with column resizing, reordering, and cell selection." } } },
};

export const Alignment: StoryObj = {
  render: () => renderAlignmentExample(),
  parameters: { docs: { description: { story: "Column alignment and row grouping with retail data. Export to CSV button." } } },
};

export const NestedAccessor: StoryObj = {
  render: () => renderNestedAccessorExample(),
  parameters: { docs: { description: { story: "Nested property access, valueFormatter for currency and percentages, initial sort by nested column." } } },
};

export const Theming: StoryObj = { render: () => renderThemingExample() };
export const SelectableCells: StoryObj = { render: () => renderSelectableCellsExample() };
export const HiddenColumns: StoryObj = { render: () => renderHiddenColumnsExample() };
export const RowHeight: StoryObj = { render: () => renderRowHeightExample() };
export const LoadingState: StoryObj = { render: () => renderLoadingStateExample() };
export const Pagination: StoryObj = { render: () => renderPaginationExample() };
export const ServerSidePagination: StoryObj = { render: () => renderServerSidePaginationExample() };
export const RowSelection: StoryObj = { render: () => renderRowSelectionExample() };
export const RowButtons: StoryObj = { render: () => renderRowButtonsExample() };
export const CellRenderer: StoryObj = { render: () => renderCellRendererExample() };
export const Tooltip: StoryObj = { render: () => renderTooltipExample() };
export const BasicRowGrouping: StoryObj = { render: () => renderBasicRowGroupingExample() };
export const PinnedColumns: StoryObj = { render: () => renderPinnedColumnsExample() };
export const RowGrouping: StoryObj = { render: () => renderRowGroupingExample() };
export const AdvancedSorting: StoryObj = { render: () => renderAdvancedSortingExample() };
export const AggregateExample: StoryObj = { render: () => renderAggregateExample() };
export const AutoExpandColumns: StoryObj = { render: () => renderAutoExpandColumnsExample() };
export const BillingExample: StoryObj = { render: () => renderBillingExample() };
export const CellHighlighting: StoryObj = { render: () => renderCellHighlightingExample() };
export const Charts: StoryObj = { render: () => renderChartsExample() };
export const ClayExample: StoryObj = { render: () => renderClayExample() };
export const ClipboardFormatting: StoryObj = { render: () => renderClipboardFormattingExample() };
export const CollapsibleColumns: StoryObj = { render: () => renderCollapsibleColumnsExample() };
export const ColumnWidthChange: StoryObj = { render: () => renderColumnWidthChangeExample() };
export const ColumnVisibilityAPI: StoryObj = { render: () => renderColumnVisibilityAPIExample() };
export const CSVExportFormatting: StoryObj = { render: () => renderCSVExportFormattingExample() };
export const CSVExportSingleRowChildren: StoryObj = { render: () => renderCSVExportSingleRowChildrenExample() };
export const CustomHeaderRendering: StoryObj = { render: () => renderCustomHeaderRenderingExample() };
export const CustomTheme: StoryObj = { render: () => renderCustomThemeExample() };
export const DynamicHeaders: StoryObj = { render: () => renderDynamicHeadersExample() };
export const DynamicRowLoading: StoryObj = { render: () => renderDynamicRowLoadingExample() };
export const DynamicRowLoadingWithExternalSort: StoryObj = { render: () => renderDynamicRowLoadingWithExternalSortExample() };
export const DynamicNestedTableLoading: StoryObj = { render: () => renderDynamicNestedTableExample() };
export const EditableCells: StoryObj = { render: () => renderEditableCellsExample() };
export const ExpansionControl: StoryObj = { render: () => renderExpansionControlExample() };
export const ExternalFilter: StoryObj = { render: () => renderExternalFilterExample() };
export const ExternalSort: StoryObj = { render: () => renderExternalSortExample() };
export const FilterExample: StoryObj = { render: () => renderFilterExample() };
export const FinanceExample: StoryObj = { render: () => renderFinanceExample() };
export const HeaderInclusion: StoryObj = { render: () => renderHeaderInclusionExample() };
export const InfiniteScroll: StoryObj = { render: () => renderInfiniteScrollExample() };
export const InfrastructureExample: StoryObj = { render: () => renderInfrastructureExample() };
export const LeadsExample: StoryObj = { render: () => renderLeadsExample() };
export const LiveUpdates: StoryObj = { render: () => renderLiveUpdatesExample() };
export const ManufacturingExample: StoryObj = { render: () => renderManufacturingExample() };
export const MusicExample: StoryObj = { render: () => renderMusicExample() };
export const NestedGrid: StoryObj = { render: () => renderNestedGridExample() };
export const PaginationAPI: StoryObj = { render: () => renderPaginationAPIExample() };
export const ProgrammaticFilter: StoryObj = { render: () => renderProgrammaticFilterExample() };
export const ProgrammaticSort: StoryObj = { render: () => renderProgrammaticSortExample() };
export const QuickFilter: StoryObj = { render: () => renderQuickFilterExample() };
export const SalesExample: StoryObj = { render: () => renderSalesExample() };
