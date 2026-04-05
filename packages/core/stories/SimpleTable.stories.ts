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
import { renderSpreadsheetExample, spreadsheetExampleDefaults } from "./examples/spreadsheet/SpreadsheetExample";

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
  parameters: { docs: { description: { story: "Multi-column sorting with custom comparators, value formatters, and value getters." } } },
};
export const AggregateExample: StoryObj = {
  ...storyArgs(aggregateExampleDefaults),
  render: (args) => renderAggregateExample(args),
  parameters: { docs: { description: { story: "Aggregate rows with group-level summaries and expandable sections." } } },
};
export const Alignment: StoryObj = {
  ...storyArgs(alignmentExampleDefaults),
  render: (args) => renderAlignmentExample(args),
  parameters: { docs: { description: { story: "Column alignment and row grouping with retail data. Export to CSV button." } } },
};
export const AutoExpandColumns: StoryObj = {
  ...storyArgs(autoExpandColumnsExampleDefaults),
  render: (args) => renderAutoExpandColumnsExample(args),
  parameters: { docs: { description: { story: "Columns auto-expand to fill available width." } } },
};
export const BasicExample: StoryObj = {
  ...storyArgs(basicExampleDefaults),
  render: (args) => renderBasicExample(args),
  parameters: { docs: { description: { story: "Quick start demo: sortable, filterable columns with column resizing, reordering, and cell selection." } } },
};
export const BasicRowGrouping: StoryObj = {
  ...storyArgs(basicRowGroupingExampleDefaults),
  render: (args) => renderBasicRowGroupingExample(args),
  parameters: { docs: { description: { story: "Basic row grouping with expandable group rows." } } },
};
export const BillingExample: StoryObj = {
  ...storyArgs(billingExampleDefaults),
  render: (args) => renderBillingExample(args),
  parameters: { docs: { description: { story: "Billing/invoice table with formatted amounts and status." } } },
};
export const CSVExportFormatting: StoryObj = {
  ...storyArgs(csvExportFormattingExampleDefaults),
  render: (args) => renderCSVExportFormattingExample(args),
  parameters: { docs: { description: { story: "CSV export with value formatters and custom export formatting." } } },
};
export const CSVExportSingleRowChildren: StoryObj = {
  ...storyArgs(csvExportSingleRowChildrenExampleDefaults),
  render: (args) => renderCSVExportSingleRowChildrenExample(args),
  parameters: { docs: { description: { story: "CSV export with single row children and nested data." } } },
};
export const CellHighlighting: StoryObj = {
  ...storyArgs(cellHighlightingExampleDefaults),
  render: (args) => renderCellHighlightingExample(args),
  parameters: { docs: { description: { story: "Highlight cells by value or condition (e.g. thresholds)." } } },
};
export const CellRenderer: StoryObj = {
  ...storyArgs(cellRendererExampleDefaults),
  render: (args) => renderCellRendererExample(args),
  parameters: { docs: { description: { story: "Custom cell renderers for rich cell content." } } },
};
export const Charts: StoryObj = {
  ...storyArgs(chartsExampleDefaults),
  render: (args) => renderChartsExample(args),
  parameters: { docs: { description: { story: "Table with chart or sparkline content in cells." } } },
};
export const ClayExample: StoryObj = {
  ...storyArgs(clayExampleDefaults),
  render: (args) => renderClayExample(args),
  parameters: { docs: { description: { story: "Clay design system styling example for the table." } } },
};
export const ClipboardFormatting: StoryObj = {
  ...storyArgs(clipboardFormattingExampleDefaults),
  render: (args) => renderClipboardFormattingExample(args),
  parameters: { docs: { description: { story: "Copy to clipboard with custom formatting and column handling." } } },
};
export const CollapsibleColumns: StoryObj = {
  ...storyArgs(collapsibleColumnsExampleDefaults),
  render: (args) => renderCollapsibleColumnsExample(args),
  parameters: { docs: { description: { story: "Collapsible column groups with expand/collapse." } } },
};
export const ColumnVisibilityAPI: StoryObj = {
  ...storyArgs(columnVisibilityAPIExampleDefaults),
  render: (args) => renderColumnVisibilityAPIExample(args),
  parameters: { docs: { description: { story: "Show/hide columns via API and column visibility controls." } } },
};
export const ColumnWidthChange: StoryObj = {
  ...storyArgs(columnWidthChangeExampleDefaults),
  render: (args) => renderColumnWidthChangeExample(args),
  parameters: { docs: { description: { story: "Programmatic column width changes and resize behavior." } } },
};
export const CustomHeaderRendering: StoryObj = {
  ...storyArgs(),
  render: (args) => renderCustomHeaderRenderingExample(args),
  parameters: { docs: { description: { story: "Custom header cell rendering and layout." } } },
};
export const CustomTheme: StoryObj = {
  ...storyArgs(),
  render: (args) => renderCustomThemeExample(args),
  parameters: { docs: { description: { story: "Custom theme colors and styling via customTheme prop." } } },
};
export const DynamicHeaders: StoryObj = {
  ...storyArgs(dynamicHeadersExampleDefaults),
  render: (args) => renderDynamicHeadersExample(args),
  parameters: { docs: { description: { story: "Headers that change dynamically (add/remove columns)." } } },
};
export const DynamicNestedTableLoading: StoryObj = {
  ...storyArgs(dynamicNestedTableExampleDefaults),
  render: (args) => renderDynamicNestedTableExample(args),
  parameters: { docs: { description: { story: "Nested tables with dynamically loaded child data." } } },
};
export const DynamicRowLoading: StoryObj = {
  ...storyArgs(dynamicRowLoadingExampleDefaults),
  render: (args) => renderDynamicRowLoadingExample(args),
  parameters: { docs: { description: { story: "Rows loaded dynamically (e.g. on expand or scroll)." } } },
};
export const DynamicRowLoadingWithExternalSort: StoryObj = {
  ...storyArgs(dynamicRowLoadingWithExternalSortExampleDefaults),
  render: (args) => renderDynamicRowLoadingWithExternalSortExample(args),
  parameters: { docs: { description: { story: "Dynamic row loading combined with external sort handling." } } },
};
export const EditableCells: StoryObj = {
  ...storyArgs(editableCellsExampleDefaults),
  render: (args) => renderEditableCellsExample(args),
  parameters: { docs: { description: { story: "Inline cell editing with validation and save." } } },
};
export const ExpansionControl: StoryObj = {
  ...storyArgs(expansionControlExampleDefaults),
  render: (args) => renderExpansionControlExample(args),
  parameters: { docs: { description: { story: "Control row/group expansion programmatically (expand all, collapse all)." } } },
};
export const ExternalFilter: StoryObj = {
  ...storyArgs(externalFilterExampleDefaults),
  render: (args) => renderExternalFilterExample(args),
  parameters: { docs: { description: { story: "Filtering handled externally (e.g. server-side or custom logic)." } } },
};
export const ExternalSort: StoryObj = {
  ...storyArgs(externalSortExampleDefaults),
  render: (args) => renderExternalSortExample(args),
  parameters: { docs: { description: { story: "Sorting handled externally (e.g. server-side or custom logic)." } } },
};
export const FilterExample: StoryObj = {
  ...storyArgs(filterExampleDefaults),
  render: (args) => renderFilterExample(args),
  parameters: { docs: { description: { story: "Column filters and filter UI with multiple filter types." } } },
};
export const FinanceExample: StoryObj = {
  ...storyArgs(financeExampleDefaults),
  render: (args) => renderFinanceExample(args),
  parameters: { docs: { description: { story: "Financial data table with currency and number formatting." } } },
};
export const HeaderInclusion: StoryObj = {
  ...storyArgs(headerInclusionExampleDefaults),
  render: (args) => renderHeaderInclusionExample(args),
  parameters: { docs: { description: { story: "Include or exclude headers in export and display (e.g. CSV)." } } },
};
export const HiddenColumns: StoryObj = {
  ...storyArgs(hiddenColumnsExampleDefaults),
  render: (args) => renderHiddenColumnsExample(args),
  parameters: { docs: { description: { story: "Columns hidden by default with option to show (e.g. column picker)." } } },
};
export const InfiniteScroll: StoryObj = {
  ...storyArgs(infiniteScrollExampleDefaults),
  render: (args) => renderInfiniteScrollExample(args),
  parameters: { docs: { description: { story: "Infinite scroll or load-more for large datasets." } } },
};
export const InfrastructureExample: StoryObj = {
  ...storyArgs(infrastructureExampleDefaults),
  render: (args) => renderInfrastructureExample(args),
  parameters: { docs: { description: { story: "Infrastructure/assets table with status and metrics." } } },
};
export const LeadsExample: StoryObj = {
  ...storyArgs(leadsExampleDefaults),
  render: (args) => renderLeadsExample(args),
  parameters: { docs: { description: { story: "Leads/CRM table with contact and pipeline data." } } },
};
export const LiveUpdates: StoryObj = {
  ...storyArgs(liveUpdatesExampleDefaults),
  render: (args) => renderLiveUpdatesExample(args),
  parameters: { docs: { description: { story: "Live data updates (add/remove/update rows or cells)." } } },
};
export const LoadingState: StoryObj = {
  ...storyArgs(),
  render: (args) => renderLoadingStateExample(args),
  parameters: { docs: { description: { story: "Loading state and skeleton while data is fetched." } } },
};
export const ManufacturingExample: StoryObj = {
  ...storyArgs(manufacturingExampleDefaults),
  render: (args) => renderManufacturingExample(args),
  parameters: { docs: { description: { story: "Manufacturing/inventory table with production metrics." } } },
};
export const MusicExample: StoryObj = {
  ...storyArgs(musicExampleDefaults),
  render: (args) => renderMusicExample(args),
  parameters: { docs: { description: { story: "Music/catalog table with albums and artists." } } },
};
export const NestedGrid: StoryObj = {
  ...storyArgs(nestedGridExampleDefaults),
  render: (args) => renderNestedGridExample(args),
  parameters: { docs: { description: { story: "Nested grid or table-in-table layout." } } },
};
export const NestedAccessor: StoryObj = {
  ...storyArgs(nestedAccessorExampleDefaults),
  render: (args) => renderNestedAccessorExample(args),
  parameters: { docs: { description: { story: "Nested property access, valueFormatter for currency and percentages, initial sort by nested column." } } },
};
export const Pagination: StoryObj = {
  ...storyArgs(paginationExampleDefaults),
  render: (args) => renderPaginationExample(args),
  parameters: { docs: { description: { story: "Client-side pagination with page size and navigation." } } },
};
export const PaginationAPI: StoryObj = {
  ...storyArgs(paginationAPIExampleDefaults),
  render: (args) => renderPaginationAPIExample(args),
  parameters: { docs: { description: { story: "Pagination controlled via API (programmatic page change, page size)." } } },
};
export const PinnedColumns: StoryObj = {
  ...storyArgs(pinnedColumnsExampleDefaults),
  render: (args) => renderPinnedColumnsExample(args),
  parameters: { docs: { description: { story: "Left- or right-pinned columns that stay visible on scroll." } } },
};
export const ProgrammaticFilter: StoryObj = {
  ...storyArgs(programmaticFilterExampleDefaults),
  render: (args) => renderProgrammaticFilterExample(args),
  parameters: { docs: { description: { story: "Set or clear filters programmatically via API." } } },
};
export const ProgrammaticSort: StoryObj = {
  ...storyArgs(programmaticSortExampleDefaults),
  render: (args) => renderProgrammaticSortExample(args),
  parameters: { docs: { description: { story: "Set sort state programmatically via API." } } },
};
export const QuickFilter: StoryObj = {
  ...storyArgs(quickFilterExampleDefaults),
  render: (args) => renderQuickFilterExample(args),
  parameters: { docs: { description: { story: "Global quick filter (search across columns)." } } },
};
export const RowButtons: StoryObj = {
  ...storyArgs(rowButtonsExampleDefaults),
  render: (args) => renderRowButtonsExample(args),
  parameters: { docs: { description: { story: "Action buttons per row (e.g. edit, delete)." } } },
};
export const RowGrouping: StoryObj = {
  ...storyArgs(rowGroupingExampleDefaults),
  render: (args) => renderRowGroupingExample(args),
  parameters: { docs: { description: { story: "Row grouping with hierarchical data and expand/collapse." } } },
};
export const RowHeight: StoryObj = {
  ...storyArgs(rowHeightExampleDefaults),
  render: (args) => renderRowHeightExample(args),
  parameters: { docs: { description: { story: "Custom row height and dense/comfortable variants." } } },
};
export const RowSelection: StoryObj = {
  ...storyArgs(rowSelectionExampleDefaults),
  render: (args) => renderRowSelectionExample(args),
  parameters: { docs: { description: { story: "Row selection (single or multi) with select-all and selection state." } } },
};
export const SalesExample: StoryObj = {
  ...storyArgs(salesExampleDefaults),
  render: (args) => renderSalesExample(args),
  parameters: { docs: { description: { story: "Sales/orders table with revenue and product data." } } },
};
export const SelectableCells: StoryObj = {
  ...storyArgs(selectableCellsExampleDefaults),
  render: (args) => renderSelectableCellsExample(args),
  parameters: { docs: { description: { story: "Selectable cells for copy or range selection." } } },
};
export const ServerSidePagination: StoryObj = {
  ...storyArgs(),
  render: (args) => renderServerSidePaginationExample(args),
  parameters: { docs: { description: { story: "Server-side pagination with page/fetch from API." } } },
};
export const Spreadsheet: StoryObj = {
  ...storyArgs(spreadsheetExampleDefaults),
  render: (args) => renderSpreadsheetExample(args),
  parameters: {
    docs: {
      description: {
        story:
          "Loan-style spreadsheet: editable numeric cells, amortization recalculation when principal, rate, or payment changes, and “Add column” from the header.",
      },
    },
  },
};
export const Theming: StoryObj = {
  ...storyArgs(themingExampleDefaults),
  render: (args) => renderThemingExample(args),
  parameters: { docs: { description: { story: "Theme switching (e.g. light/dark) and built-in themes." } } },
};
export const Tooltip: StoryObj = {
  ...storyArgs(tooltipExampleDefaults),
  render: (args) => renderTooltipExample(args),
  parameters: { docs: { description: { story: "Cell tooltips on hover or focus." } } },
};
