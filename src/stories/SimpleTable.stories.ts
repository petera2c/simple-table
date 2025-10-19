import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import AggregateFunctionsDemo from "./examples/AggregateExample";
import AlignmentExample from "./examples/AlignmentExample";
import BasicExampleComponent from "./examples/BasicExample";
import BillingExampleComponent from "./examples/billing-example/BillingExample";
import CellHighlightingDemo from "./examples/CellHighlighting";
import CellRendererExample from "./examples/CellRenderer";
import CollapsibleColumnsExample, {
  collapsibleColumnsExampleDefaults,
} from "./examples/CollapsibleColumnsExample";
import DynamicHeadersExample from "./examples/DynamicHeadersExample";
import EditableCellsExample from "./examples/EditableCells";
import ExternalSortExample, { externalSortExampleDefaults } from "./examples/ExternalSortExample";
import ExternalFilterExample, {
  externalFilterExampleDefaults,
} from "./examples/ExternalFilterExample";
import HiddenColumnsExample from "./examples/HiddenColumnsExample";
import InfiniteScrollExample from "./examples/InfiniteScroll";
import LiveUpdatesExample from "./examples/LiveUpdates";
import PaginationExample from "./examples/Pagination";
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

const meta = {
  title: "Docs & Examples",
  component: ThemingExample,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ThemingExample>;

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

export const ClayExample: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...clayExampleDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: ClayExampleComponent, ...args }),
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

export const DynamicHeaders: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...dynamicHeadersDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: DynamicHeadersExample, ...args }),
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
export const LiveUpdates: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...liveUpdatesDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: LiveUpdatesExample, ...args }),
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
export const RowGrouping: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...rowGroupingDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: RowGroupingExample, ...args }),
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
