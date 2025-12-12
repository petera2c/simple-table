import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import AggregateFunctionsDemo from "./examples/AggregateExample";
import AlignmentExample from "./examples/AlignmentExample";
import BasicExampleComponent from "./examples/BasicExample";
import BillingExampleComponent from "./examples/billing-example/BillingExample";
import CellHighlightingDemo from "./examples/CellHighlighting";
import CellRendererExample from "./examples/CellRenderer";
import ChartsExample, { chartsExampleDefaults } from "./examples/ChartsExample";
import CollapsibleColumnsExample, {
  collapsibleColumnsExampleDefaults,
} from "./examples/CollapsibleColumnsExample";
import DynamicHeadersExample from "./examples/DynamicHeadersExample";
import DynamicRowLoadingExample, {
  dynamicRowLoadingDefaults,
} from "./examples/DynamicRowLoadingExample";
import EditableCellsExample from "./examples/EditableCells";
import ExternalSortExample, { externalSortExampleDefaults } from "./examples/ExternalSortExample";
import ExternalFilterExample, {
  externalFilterExampleDefaults,
} from "./examples/ExternalFilterExample";
import HiddenColumnsExample from "./examples/HiddenColumnsExample";
import InfiniteScrollExample from "./examples/InfiniteScroll";
import LiveUpdatesExample from "./examples/LiveUpdates";
import PaginationExample from "./examples/Pagination";
import ServerSidePaginationExample from "./examples/ServerSidePaginationExample";
import PinnedColumnsExample from "./examples/pinned-columns/PinnedColumns";
import RowGroupingExample from "./examples/row-grouping/RowGrouping";
import RowHeightExample from "./examples/RowHeightExample";
import SelectableCellsExample from "./examples/SelectableCells";
import ThemingExample from "./examples/Theming";
import { FinancialExample } from "./examples/finance-example/FinancialExample";
import { SalesExampleComponent } from "./examples/sales-example/SalesExample";
import {
  FilterExampleComponent,
  filterExampleDefaults,
} from "./examples/filter-example/FilterExample";
import StoryWrapper, {
  defaultUniversalArgs,
  universalArgTypes,
  UniversalTableProps,
} from "./examples/StoryWrapper";
import { alignmentExampleDefaults } from "./examples/AlignmentExample";
import { aggregateExampleDefaults } from "./examples/AggregateExample";
import { basicExampleDefaults } from "./examples/BasicExample";
import { billingExampleDefaults } from "./examples/billing-example/BillingExample";
import { cellHighlightingDefaults } from "./examples/CellHighlighting";
import { editableCellsDefaults } from "./examples/EditableCells";
import { hiddenColumnsDefaults } from "./examples/HiddenColumnsExample";
import { infiniteScrollDefaults } from "./examples/InfiniteScroll";
import { liveUpdatesDefaults } from "./examples/LiveUpdates";
import { paginationDefaults } from "./examples/Pagination";
import { pinnedColumnsDefaults } from "./examples/pinned-columns/PinnedColumns";
import { rowGroupingDefaults } from "./examples/row-grouping/RowGrouping";
import { rowHeightDefaults } from "./examples/RowHeightExample";
import { selectableCellsDefaults } from "./examples/SelectableCells";
import { themingDefaults } from "./examples/Theming";
import { cellRendererDefaults } from "./examples/CellRenderer";
import { dynamicHeadersDefaults } from "./examples/DynamicHeadersExample";
import { financeExampleDefaults } from "./examples/finance-example/FinancialExample";
import { salesExampleDefaults } from "./examples/sales-example/SalesExample";
import ManufacturingExampleComponent, {
  manufacturingExampleDefaults,
} from "./examples/manufacturing/ManufacturingExample";
import RowSelectionExample, { rowSelectionExampleDefaults } from "./examples/RowSelectionExample";
import RowButtonsExample, { rowButtonsExampleDefaults } from "./examples/RowButtonsExample";
import ClayExampleComponent, { clayExampleDefaults } from "./examples/ClayExample";
import MusicExampleComponent, { musicExampleDefaults } from "./examples/music/MusicExample";
import TooltipExample, { tooltipExampleDefaults } from "./examples/TooltipExample";
import InfrastructureExampleComponent, {
  infrastructureExampleDefaults,
} from "./examples/infrastructure/InfrastructureExample";
import LeadsExampleComponent, { leadsExampleDefaults } from "./examples/leads/LeadsExample";
import LoadingStateExample from "./examples/LoadingStateExample";
import NestedAccessorExample from "./examples/NestedAccessorExample";
import AdvancedSortingExample, {
  advancedSortingExampleDefaults,
} from "./examples/AdvancedSortingExample";
import ClipboardFormattingExample, {
  clipboardFormattingExampleDefaults,
} from "./examples/ClipboardFormattingExample";
import CSVExportFormattingExample, {
  csvExportFormattingExampleDefaults,
} from "./examples/CSVExportFormattingExample";
import CSVExportSingleRowChildrenExample, {
  csvExportSingleRowChildrenExampleDefaults,
} from "./examples/CSVExportSingleRowChildrenExample";
import HeaderInclusionExample, {
  headerInclusionExampleDefaults,
} from "./examples/HeaderInclusionExample";
import CustomThemeDemo from "./examples/custom-theme/CustomThemeDemo";

const meta = {
  title: "Docs & Examples",
  component: ThemingExample,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ThemingExample>;

export const AdvancedSorting: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...advancedSortingExampleDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: AdvancedSortingExample, ...args }),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates advanced sorting features including custom comparators for row-level metadata sorting and valueGetter for extracting nested values. The Priority column uses a custom comparator to sort by priority first, then by performance score. The Seniority Level column uses valueGetter to extract nested metadata for sorting while displaying formatted text.",
      },
    },
  },
};

export const AggregateExample: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...aggregateExampleDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: AggregateFunctionsDemo, ...args }),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates aggregation functionality with sum, average, count, min, max, and custom aggregation functions. Shows how data rolls up through hierarchical row grouping with streaming platform data.",
      },
    },
  },
};

export const Alignment: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...alignmentExampleDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: AlignmentExample, ...args }),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates column alignment functionality with left, right, and center-aligned columns. This story is used as a base for comprehensive alignment testing.",
      },
    },
  },
};

export const BasicExample: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...basicExampleDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: BasicExampleComponent, ...args }),
};

export const BillingExample: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...billingExampleDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: BillingExampleComponent, ...args }),
};

export const CellHighlighting: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...cellHighlightingDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: CellHighlightingDemo, ...args }),
};

export const CellRenderer: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...cellRendererDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: CellRendererExample, ...args }),
};

export const Charts: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...chartsExampleDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) => React.createElement(StoryWrapper, { ExampleComponent: ChartsExample, ...args }),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates inline chart visualization with LineAreaChart and BarChart components. Shows how to display data trends directly within table cells without axes or labels, perfect for sparkline-style visualizations.",
      },
    },
  },
};

export const ClayExample: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...clayExampleDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: ClayExampleComponent, ...args }),
};

export const ClipboardFormatting: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...clipboardFormattingExampleDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: ClipboardFormattingExample, ...args }),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates clipboard copy behavior with useFormattedValueForClipboard option. When enabled, cells copy their formatted values (with currency symbols, percentages, etc.) instead of raw data. Select cells and press Ctrl+C (Cmd+C on Mac) to test. Compare the Unit Price column (formatted copy) with the Quantity column (raw copy).",
      },
    },
  },
};

export const CollapsibleColumns: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...collapsibleColumnsExampleDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: CollapsibleColumnsExample, ...args }),
};

export const CSVExportFormatting: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...csvExportFormattingExampleDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: CSVExportFormattingExample, ...args }),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates CSV export customization with useFormattedValueForCSV and exportValueGetter options. Columns can export formatted values (e.g., '$85K'), raw values, or completely custom values. The exportValueGetter function provides full control over export output, useful for adding codes, custom formatting, or transforming data specifically for CSV export.",
      },
    },
  },
};

export const CSVExportSingleRowChildren: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...csvExportSingleRowChildrenExampleDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, {
      ExampleComponent: CSVExportSingleRowChildrenExample,
      ...args,
    }),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates CSV export behavior with singleRowChildren columns. When a parent column has singleRowChildren=true, both the parent and child columns are rendered on the same row (not in a tree hierarchy) and both are included in CSV exports. This is useful for columns where the parent represents aggregate data and children show breakdowns (e.g., Total Score with 7-day and 30-day growth).",
      },
    },
  },
};
export const CustomTheme: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: CustomThemeDemo, ...args }),
};

export const HeaderInclusion: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...headerInclusionExampleDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: HeaderInclusionExample, ...args }),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates control over including column headers in clipboard copy and CSV export. The copyHeadersToClipboard prop (default: false) determines whether headers are included when copying selected cells. The includeHeadersInCSVExport prop (default: true) controls whether headers appear in CSV exports. This is similar to AG Grid's copyGroupHeadersToClipboard option and provides flexibility for different data sharing workflows.",
      },
    },
  },
};

export const DynamicHeaders: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...dynamicHeadersDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: DynamicHeadersExample, ...args }),
};

export const DynamicRowLoading: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...dynamicRowLoadingDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: DynamicRowLoadingExample, ...args }),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates the onRowGroupExpand callback for lazy-loading hierarchical data on demand. Departments load immediately without children. When you expand a department, teams are fetched from a simulated API. When you expand a team, employees are fetched. This pattern is perfect for large datasets where loading all nested data upfront would be too expensive. Open the browser console to see the simulated API calls!",
      },
    },
  },
};

export const EditableCells: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...editableCellsDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: EditableCellsExample, ...args }),
};

export const ExternalFilter: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...externalFilterExampleDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, {
      ExampleComponent: ExternalFilterExample,
      ...args,
    }),
};

export const ExternalSort: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...externalSortExampleDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, {
      ExampleComponent: ExternalSortExample,
      ...args,
    }),
};

export const FilterExample: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...filterExampleDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: FilterExampleComponent, ...args }),
};

export const FinanceExample: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...financeExampleDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: FinancialExample, ...args }),
};

export const HiddenColumns: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...hiddenColumnsDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: HiddenColumnsExample, ...args }),
};

export const InfiniteScroll: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...infiniteScrollDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: InfiniteScrollExample, ...args }),
};

export const InfrastructureExample: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...infrastructureExampleDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, {
      ExampleComponent: InfrastructureExampleComponent,
      ...args,
    }),
};

export const LeadsExample: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...leadsExampleDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: LeadsExampleComponent, ...args }),
};

export const LiveUpdates: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...liveUpdatesDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: LiveUpdatesExample, ...args }),
};

export const LoadingState: StoryObj = {
  render: () => React.createElement(LoadingStateExample),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates the loading state functionality. Toggle between loading and loaded states to see skeleton loaders displayed in place of actual cell content. Perfect for showing feedback while data is being fetched.",
      },
    },
  },
};

export const ManufacturingExample: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...manufacturingExampleDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: ManufacturingExampleComponent, ...args }),
};

export const MusicExample: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...musicExampleDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: MusicExampleComponent, ...args }),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates music example functionality. This story is used as a base for comprehensive music testing.",
      },
    },
  },
};

export const NestedAccessor: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: NestedAccessorExample, ...args }),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates nested accessor functionality using dot notation to access deeply nested object properties. Examples include stats.points, latest.rank, and latest.performance.rating. Supports sorting, filtering, and editing of nested data.",
      },
    },
  },
};

export const Pagination: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...paginationDefaults,
    theme: "dark",
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: PaginationExample, ...args }),
};

export const PinnedColumns: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...pinnedColumnsDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: PinnedColumnsExample, ...args }),
};

export const RowButtons: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...rowButtonsExampleDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: RowButtonsExample, ...args }),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates row action buttons functionality. Hover over rows or select them to reveal action buttons with icons. Includes View, Edit, Email, Duplicate, and Delete actions that only appear when needed for a clean interface.",
      },
    },
  },
};

export const RowGrouping: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...rowGroupingDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: RowGroupingExample, ...args }),
};

export const RowHeight: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...rowHeightDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: RowHeightExample, ...args }),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates dynamic row height functionality. Use the rowHeight control to see how different row heights affect the table appearance and spacing.",
      },
    },
  },
};

export const RowSelection: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...rowSelectionExampleDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: RowSelectionExample, ...args }),
};

export const SalesExample: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...salesExampleDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: SalesExampleComponent, ...args }),
};

export const SelectableCells: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...selectableCellsDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: SelectableCellsExample, ...args }),
};

export const ServerSidePagination: StoryObj = {
  render: () => React.createElement(ServerSidePaginationExample),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates true server-side pagination where the API returns only the rows for the requested page (using offset/limit pattern). The table uses serverSidePagination flag to disable internal slicing, totalRowCount to show correct totals, and onPageChange callback to fetch new data. Perfect for working with paginated REST APIs.",
      },
    },
  },
};

export const Theming: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...themingDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: ThemingExample, ...args }),
};

export const Tooltip: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...tooltipExampleDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: TooltipExample, ...args }),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates header tooltip functionality. Hover over any column header to see helpful tooltip text explaining what the column contains. Tooltips appear after a short delay and are positioned automatically to stay within the viewport.",
      },
    },
  },
};

export default meta;
