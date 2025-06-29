import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import AggregateFunctionsDemo from "./examples/AggregateExample";
import AlignmentExample from "./examples/AlignmentExample";
import BasicExampleComponent from "./examples/BasicExample";
import BillingExampleComponent from "./examples/billing-example/BillingExample";
import CellHighlightingDemo from "./examples/CellHighlighting";
import CellRendererExample from "./examples/CellRenderer";
import DynamicHeadersExample from "./examples/DynamicHeadersExample";
import EditableCellsExample from "./examples/EditableCells";
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
import { FilterExampleComponent } from "./examples/filter-example/FilterExample";
import StoryWrapper, {
  defaultUniversalArgs,
  universalArgTypes,
  UniversalTableProps,
} from "./examples/StoryWrapper";

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
    columnResizing: true,
    columnReordering: true,
    selectableCells: true,
    selectableColumns: true,
    editColumns: true,
    height: "calc(100dvh - 112px)",
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
    columnResizing: true,
    height: "400px",
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
    columnResizing: true,
    editColumns: true,
    selectableCells: true,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: BasicExampleComponent, ...args }),
};
export const BillingExample: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    // Override defaults for this specific example
    useOddColumnBackground: true,
    useHoverRowBackground: false,
    height: "90dvh",
    editColumns: true,
    columnResizing: true,
    columnReordering: true,
    selectableCells: true,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: BillingExampleComponent, ...args }),
};
export const CellHighlighting: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    selectableCells: true,
    selectableColumns: true,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: CellHighlightingDemo, ...args }),
};

export const CellRenderer: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    columnReordering: true,
    columnResizing: true,
    selectableCells: true,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: CellRendererExample, ...args }),
};
export const DynamicHeaders: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    columnResizing: true,
    editColumns: true,
    selectableCells: true,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: DynamicHeadersExample, ...args }),
};
export const EditableCells: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    columnResizing: true,
    columnReordering: true,
    selectableCells: true,
    height: "80vh",
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: EditableCellsExample, ...args }),
};
export const FilterExample: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    columnResizing: true,
    columnReordering: true,
    selectableCells: true,
    height: "75dvh",
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: FilterExampleComponent, ...args }),
};
export const FinanceExample: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    columnResizing: true,
    columnReordering: true,
    selectableCells: true,
    height: "90dvh",
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: FinancialExample, ...args }),
};
export const HiddenColumns: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    columnResizing: true,
    columnReordering: true,
    editColumns: true,
    editColumnsInitOpen: true,
    height: "80vh",
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: HiddenColumnsExample, ...args }),
};
export const InfiniteScroll: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    columnResizing: true,
    columnReordering: true,
    selectableCells: true,
    height: "calc(100dvh - 112px)",
    shouldPaginate: false,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: InfiniteScrollExample, ...args }),
};
export const LiveUpdates: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    cellUpdateFlash: true,
    height: "400px",
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: LiveUpdatesExample, ...args }),
};
export const Pagination: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    shouldPaginate: true,
    rowsPerPage: 10,
    columnReordering: true,
    columnResizing: true,
    selectableCells: true,
    selectableColumns: true,
    theme: "dark",
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: PaginationExample, ...args }),
};
export const PinnedColumns: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    columnReordering: true,
    selectableCells: true,
    selectableColumns: true,
    editColumns: true,
    height: "calc(100dvh - 112px)",
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: PinnedColumnsExample, ...args }),
};
export const RowGrouping: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    columnResizing: true,
    height: "calc(100dvh - 112px)",
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: RowGroupingExample, ...args }),
};

export const RowHeight: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    rowHeight: 24,
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
    columnResizing: true,
    columnReordering: true,
    selectableCells: true,
    theme: "dark",
    height: "70dvh",
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: SalesExampleComponent, ...args }),
};
export const SelectableCells: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    selectableCells: true,
    selectableColumns: true,
    columnResizing: true,
    columnReordering: true,
    rowHeight: 20,
    height: "80vh",
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: SelectableCellsExample, ...args }),
};
export const Theming: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    columnResizing: true,
    columnReordering: true,
    editColumns: true,
    selectableCells: true,
    selectableColumns: true,
    shouldPaginate: true,
    rowsPerPage: 10,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: ThemingExample, ...args }),
};

export default meta;
