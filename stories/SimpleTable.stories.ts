/**
 * Docs & Examples – vanilla ports of React Storybook examples.
 * Each story uses SimpleTableVanilla; example logic lives in stories/examples/.
 */
import type { Meta, StoryObj } from "@storybook/html";
import { defaultVanillaArgs, vanillaArgTypes, type UniversalVanillaArgs } from "./vanillaStoryConfig";
import { renderBasicExample, basicExampleDefaults } from "./examples/BasicExample";
import { renderAlignmentExample, alignmentExampleDefaults } from "./examples/AlignmentExample";
import { renderNestedAccessorExample, nestedAccessorExampleDefaults } from "./examples/NestedAccessorExample";
import { renderThemingExample, themingExampleDefaults } from "./examples/Theming";
import { renderSelectableCellsExample, selectableCellsExampleDefaults } from "./examples/SelectableCells";
import { renderHiddenColumnsExample, hiddenColumnsExampleDefaults } from "./examples/HiddenColumnsExample";
import { renderRowHeightExample, rowHeightExampleDefaults } from "./examples/RowHeightExample";
import { renderLoadingStateExample } from "./examples/LoadingStateExample";
import { renderPaginationExample, paginationExampleDefaults } from "./examples/Pagination";
import { renderServerSidePaginationExample } from "./examples/ServerSidePaginationExample";
import { renderRowSelectionExample, rowSelectionExampleDefaults } from "./examples/RowSelectionExample";
import { renderRowButtonsExample, rowButtonsExampleDefaults } from "./examples/RowButtonsExample";
import { renderCellRendererExample, cellRendererExampleDefaults } from "./examples/CellRenderer";
import { renderTooltipExample, tooltipExampleDefaults } from "./examples/TooltipExample";
import { renderBasicRowGroupingExample, basicRowGroupingExampleDefaults } from "./examples/BasicRowGrouping";
import { renderPinnedColumnsExample, pinnedColumnsExampleDefaults } from "./examples/pinned-columns/PinnedColumns";
import { renderRowGroupingExample, rowGroupingExampleDefaults } from "./examples/row-grouping/RowGrouping";
import { renderAdvancedSortingExample, advancedSortingExampleDefaults } from "./examples/AdvancedSortingExample";
import { renderAggregateExample, aggregateExampleDefaults } from "./examples/AggregateExample";
import { renderAutoExpandColumnsExample, autoExpandColumnsExampleDefaults } from "./examples/AutoExpandColumnsExample";
import { renderBillingExample, billingExampleDefaults } from "./examples/billing-example/BillingExample";
import { renderCellHighlightingExample, cellHighlightingExampleDefaults } from "./examples/CellHighlighting";
import { renderChartsExample, chartsExampleDefaults } from "./examples/ChartsExample";
import { renderClayExample, clayExampleDefaults } from "./examples/ClayExample";
import { renderClipboardFormattingExample, clipboardFormattingExampleDefaults } from "./examples/ClipboardFormattingExample";
import { renderCollapsibleColumnsExample, collapsibleColumnsExampleDefaults } from "./examples/CollapsibleColumnsExample";
import { renderColumnWidthChangeExample, columnWidthChangeExampleDefaults } from "./examples/ColumnWidthChangeExample";
import { renderColumnVisibilityAPIExample, columnVisibilityAPIExampleDefaults } from "./examples/ColumnVisibilityAPIExample";
import { renderCSVExportFormattingExample, csvExportFormattingExampleDefaults } from "./examples/CSVExportFormattingExample";
import { renderCSVExportSingleRowChildrenExample, csvExportSingleRowChildrenExampleDefaults } from "./examples/CSVExportSingleRowChildrenExample";
import { renderCustomHeaderRenderingExample } from "./examples/CustomHeaderRenderingExample";
import { renderCustomThemeExample } from "./examples/custom-theme/CustomThemeDemo";
import { renderDynamicHeadersExample, dynamicHeadersExampleDefaults } from "./examples/DynamicHeadersExample";
import { renderDynamicRowLoadingExample, dynamicRowLoadingExampleDefaults } from "./examples/DynamicRowLoadingExample";
import { renderDynamicRowLoadingWithExternalSortExample, dynamicRowLoadingWithExternalSortExampleDefaults } from "./examples/DynamicRowLoadingWithExternalSortExample";
import { renderDynamicNestedTableExample, dynamicNestedTableExampleDefaults } from "./examples/DynamicNestedTableExample";
import { renderEditableCellsExample, editableCellsExampleDefaults } from "./examples/EditableCells";
import { renderExpansionControlExample, expansionControlExampleDefaults } from "./examples/ExpansionControlExample";
import { renderExternalFilterExample, externalFilterExampleDefaults } from "./examples/ExternalFilterExample";
import { renderExternalSortExample, externalSortExampleDefaults } from "./examples/ExternalSortExample";
import { renderFilterExample, filterExampleDefaults } from "./examples/filter-example/FilterExample";
import { renderFinanceExample, financeExampleDefaults } from "./examples/finance-example/FinancialExample";
import { renderHeaderInclusionExample, headerInclusionExampleDefaults } from "./examples/HeaderInclusionExample";
import { renderInfiniteScrollExample, infiniteScrollExampleDefaults } from "./examples/InfiniteScroll";
import { renderInfrastructureExample, infrastructureExampleDefaults } from "./examples/infrastructure/InfrastructureExample";
import { renderLeadsExample, leadsExampleDefaults } from "./examples/leads/LeadsExample";
import { renderLiveUpdatesExample, liveUpdatesExampleDefaults } from "./examples/LiveUpdates";
import { renderManufacturingExample, manufacturingExampleDefaults } from "./examples/manufacturing/ManufacturingExample";
import { renderMusicExample, musicExampleDefaults } from "./examples/music/MusicExample";
import { renderNestedGridExample, nestedGridExampleDefaults } from "./examples/NestedGridExample";
import { renderPaginationAPIExample, paginationAPIExampleDefaults } from "./examples/PaginationAPIExample";
import { renderProgrammaticFilterExample, programmaticFilterExampleDefaults } from "./examples/ProgrammaticFilterExample";
import { renderProgrammaticSortExample, programmaticSortExampleDefaults } from "./examples/ProgrammaticSortExample";
import { renderQuickFilterExample, quickFilterExampleDefaults } from "./examples/QuickFilterExample";
import { renderSalesExample, salesExampleDefaults } from "./examples/sales-example/SalesExample";

const meta: Meta = {
  title: "Docs & Examples",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

const storyArgs = (exampleDefaults: Partial<UniversalVanillaArgs> = {}) => ({
  args: { ...defaultVanillaArgs, ...exampleDefaults },
  argTypes: vanillaArgTypes,
});

export const AdvancedSorting: StoryObj = {
  ...storyArgs(advancedSortingExampleDefaults),
  render: (args) => renderAdvancedSortingExample(args),
};
export const AggregateExample: StoryObj = {
  ...storyArgs(aggregateExampleDefaults),
  render: (args) => renderAggregateExample(args),
};
export const Alignment: StoryObj = {
  ...storyArgs(alignmentExampleDefaults),
  render: (args) => renderAlignmentExample(args),
  parameters: { docs: { description: { story: "Column alignment and row grouping with retail data. Export to CSV button." } } },
};
export const AutoExpandColumns: StoryObj = {
  ...storyArgs(autoExpandColumnsExampleDefaults),
  render: (args) => renderAutoExpandColumnsExample(args),
};
export const BasicExample: StoryObj = {
  ...storyArgs(basicExampleDefaults),
  render: (args) => renderBasicExample(args),
  parameters: { docs: { description: { story: "Quick start demo: sortable, filterable columns with column resizing, reordering, and cell selection." } } },
};
export const BasicRowGrouping: StoryObj = {
  ...storyArgs(basicRowGroupingExampleDefaults),
  render: (args) => renderBasicRowGroupingExample(args),
};
export const BillingExample: StoryObj = {
  ...storyArgs(billingExampleDefaults),
  render: (args) => renderBillingExample(args),
};
export const CSVExportFormatting: StoryObj = {
  ...storyArgs(csvExportFormattingExampleDefaults),
  render: (args) => renderCSVExportFormattingExample(args),
};
export const CSVExportSingleRowChildren: StoryObj = {
  ...storyArgs(csvExportSingleRowChildrenExampleDefaults),
  render: (args) => renderCSVExportSingleRowChildrenExample(args),
};
export const CellHighlighting: StoryObj = {
  ...storyArgs(cellHighlightingExampleDefaults),
  render: (args) => renderCellHighlightingExample(args),
};
export const CellRenderer: StoryObj = {
  ...storyArgs(cellRendererExampleDefaults),
  render: (args) => renderCellRendererExample(args),
};
export const Charts: StoryObj = {
  ...storyArgs(chartsExampleDefaults),
  render: (args) => renderChartsExample(args),
};
export const ClayExample: StoryObj = {
  ...storyArgs(clayExampleDefaults),
  render: (args) => renderClayExample(args),
};
export const ClipboardFormatting: StoryObj = {
  ...storyArgs(clipboardFormattingExampleDefaults),
  render: (args) => renderClipboardFormattingExample(args),
};
export const CollapsibleColumns: StoryObj = {
  ...storyArgs(collapsibleColumnsExampleDefaults),
  render: (args) => renderCollapsibleColumnsExample(args),
};
export const ColumnVisibilityAPI: StoryObj = {
  ...storyArgs(columnVisibilityAPIExampleDefaults),
  render: (args) => renderColumnVisibilityAPIExample(args),
};
export const ColumnWidthChange: StoryObj = {
  ...storyArgs(columnWidthChangeExampleDefaults),
  render: (args) => renderColumnWidthChangeExample(args),
};
export const CustomHeaderRendering: StoryObj = {
  ...storyArgs(),
  render: (args) => renderCustomHeaderRenderingExample(args),
};
export const CustomTheme: StoryObj = {
  ...storyArgs(),
  render: (args) => renderCustomThemeExample(args),
};
export const DynamicHeaders: StoryObj = {
  ...storyArgs(dynamicHeadersExampleDefaults),
  render: (args) => renderDynamicHeadersExample(args),
};
export const DynamicNestedTableLoading: StoryObj = {
  ...storyArgs(dynamicNestedTableExampleDefaults),
  render: (args) => renderDynamicNestedTableExample(args),
};
export const DynamicRowLoading: StoryObj = {
  ...storyArgs(dynamicRowLoadingExampleDefaults),
  render: (args) => renderDynamicRowLoadingExample(args),
};
export const DynamicRowLoadingWithExternalSort: StoryObj = {
  ...storyArgs(dynamicRowLoadingWithExternalSortExampleDefaults),
  render: (args) => renderDynamicRowLoadingWithExternalSortExample(args),
};
export const EditableCells: StoryObj = {
  ...storyArgs(editableCellsExampleDefaults),
  render: (args) => renderEditableCellsExample(args),
};
export const ExpansionControl: StoryObj = {
  ...storyArgs(expansionControlExampleDefaults),
  render: (args) => renderExpansionControlExample(args),
};
export const ExternalFilter: StoryObj = {
  ...storyArgs(externalFilterExampleDefaults),
  render: (args) => renderExternalFilterExample(args),
};
export const ExternalSort: StoryObj = {
  ...storyArgs(externalSortExampleDefaults),
  render: (args) => renderExternalSortExample(args),
};
export const FilterExample: StoryObj = {
  ...storyArgs(filterExampleDefaults),
  render: (args) => renderFilterExample(args),
};
export const FinanceExample: StoryObj = {
  ...storyArgs(financeExampleDefaults),
  render: (args) => renderFinanceExample(args),
};
export const HeaderInclusion: StoryObj = {
  ...storyArgs(headerInclusionExampleDefaults),
  render: (args) => renderHeaderInclusionExample(args),
};
export const HiddenColumns: StoryObj = {
  ...storyArgs(hiddenColumnsExampleDefaults),
  render: (args) => renderHiddenColumnsExample(args),
};
export const InfiniteScroll: StoryObj = {
  ...storyArgs(infiniteScrollExampleDefaults),
  render: (args) => renderInfiniteScrollExample(args),
};
export const InfrastructureExample: StoryObj = {
  ...storyArgs(infrastructureExampleDefaults),
  render: (args) => renderInfrastructureExample(args),
};
export const LeadsExample: StoryObj = {
  ...storyArgs(leadsExampleDefaults),
  render: (args) => renderLeadsExample(args),
};
export const LiveUpdates: StoryObj = {
  ...storyArgs(liveUpdatesExampleDefaults),
  render: (args) => renderLiveUpdatesExample(args),
};
export const LoadingState: StoryObj = {
  ...storyArgs(),
  render: (args) => renderLoadingStateExample(args),
};
export const ManufacturingExample: StoryObj = {
  ...storyArgs(manufacturingExampleDefaults),
  render: (args) => renderManufacturingExample(args),
};
export const MusicExample: StoryObj = {
  ...storyArgs(musicExampleDefaults),
  render: (args) => renderMusicExample(args),
};
export const NestedGrid: StoryObj = {
  ...storyArgs(nestedGridExampleDefaults),
  render: (args) => renderNestedGridExample(args),
};
export const NestedAccessor: StoryObj = {
  ...storyArgs(nestedAccessorExampleDefaults),
  render: (args) => renderNestedAccessorExample(args),
  parameters: { docs: { description: { story: "Nested property access, valueFormatter for currency and percentages, initial sort by nested column." } } },
};
export const Pagination: StoryObj = {
  ...storyArgs(paginationExampleDefaults),
  render: (args) => renderPaginationExample(args),
};
export const PaginationAPI: StoryObj = {
  ...storyArgs(paginationAPIExampleDefaults),
  render: (args) => renderPaginationAPIExample(args),
};
export const PinnedColumns: StoryObj = {
  ...storyArgs(pinnedColumnsExampleDefaults),
  render: (args) => renderPinnedColumnsExample(args),
};
export const ProgrammaticFilter: StoryObj = {
  ...storyArgs(programmaticFilterExampleDefaults),
  render: (args) => renderProgrammaticFilterExample(args),
};
export const ProgrammaticSort: StoryObj = {
  ...storyArgs(programmaticSortExampleDefaults),
  render: (args) => renderProgrammaticSortExample(args),
};
export const QuickFilter: StoryObj = {
  ...storyArgs(quickFilterExampleDefaults),
  render: (args) => renderQuickFilterExample(args),
};
export const RowButtons: StoryObj = {
  ...storyArgs(rowButtonsExampleDefaults),
  render: (args) => renderRowButtonsExample(args),
};
export const RowGrouping: StoryObj = {
  ...storyArgs(rowGroupingExampleDefaults),
  render: (args) => renderRowGroupingExample(args),
};
export const RowHeight: StoryObj = {
  ...storyArgs(rowHeightExampleDefaults),
  render: (args) => renderRowHeightExample(args),
};
export const RowSelection: StoryObj = {
  ...storyArgs(rowSelectionExampleDefaults),
  render: (args) => renderRowSelectionExample(args),
};
export const SalesExample: StoryObj = {
  ...storyArgs(salesExampleDefaults),
  render: (args) => renderSalesExample(args),
};
export const SelectableCells: StoryObj = {
  ...storyArgs(selectableCellsExampleDefaults),
  render: (args) => renderSelectableCellsExample(args),
};
export const ServerSidePagination: StoryObj = {
  ...storyArgs(),
  render: (args) => renderServerSidePaginationExample(args),
};
export const Theming: StoryObj = {
  ...storyArgs(themingExampleDefaults),
  render: (args) => renderThemingExample(args),
};
export const Tooltip: StoryObj = {
  ...storyArgs(tooltipExampleDefaults),
  render: (args) => renderTooltipExample(args),
};
