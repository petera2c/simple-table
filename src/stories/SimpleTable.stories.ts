import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import Theme from "../types/Theme";

import AlignmentExample from "./examples/AlignmentExample";
import BasicExampleComponent from "./examples/BasicExample";
import BillingExampleComponent from "./examples/billing-example/BillingExample";
import CellHighlightingDemo from "./examples/CellHighlighting";
import CellRendererExample from "./examples/CellRenderer";
import DynamicHeadersExample from "./examples/DynamicHeadersExample";
import EditableCellsExample from "./examples/EditableCells";
import HiddenColumnsExample from "./examples/HiddenColumnsExample";
import InfiniteScrollExample from "./examples/InfiniteScroll";
import PaginationExample from "./examples/Pagination";
import PinnedColumnsExample from "./examples/pinned-columns/PinnedColumns";
import RowGroupingExample from "./examples/row-grouping/RowGrouping";
import SelectableCellsExample from "./examples/SelectableCells";
import ThemingExample from "./examples/Theming";
import { FinancialExample } from "./examples/finance-example/FinancialExample";
import { SalesExampleComponent } from "./examples/sales-example/SalesExample";
import { FilterExampleComponent } from "./examples/filter-example/FilterExample";
import LiveUpdatesExample from "./examples/LiveUpdates";

const meta = {
  title: "Simple Table",
  component: ThemingExample,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ThemingExample>;

type Story = StoryObj<typeof meta>;

export const Alignment: Story = {
  render: AlignmentExample,
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates column alignment functionality with left, right, and center-aligned columns. This story is used as a base for comprehensive alignment testing.",
      },
    },
  },
};
export const BasicExample: Story = {
  render: BasicExampleComponent,
};
export const BillingExample: StoryObj<{ expandAll: boolean; theme: Theme }> = {
  args: {
    theme: "light",
    expandAll: true,
  },
  argTypes: {
    theme: {
      control: { type: "select" },
      options: ["sky", "funky", "neutral", "light", "dark"],
      description: "Select the theme for the table",
    },
    expandAll: {
      control: { type: "boolean" },
      description: "Toggle to expand or collapse all row groups",
    },
  },
  render: (args) => React.createElement(BillingExampleComponent, args),
};
export const CellHighlighting: Story = {
  render: CellHighlightingDemo,
};

export const CellRenderer: Story = {
  render: CellRendererExample,
};
export const DynamicHeaders: Story = {
  render: DynamicHeadersExample,
};
export const EditableCells: Story = {
  render: EditableCellsExample,
};
export const FilterExample: Story = {
  render: FilterExampleComponent,
};
export const FinanceExample: Story = {
  render: FinancialExample,
};
export const HiddenColumns: Story = {
  render: HiddenColumnsExample,
};
export const InfiniteScroll: Story = {
  render: InfiniteScrollExample,
};
export const LiveUpdates: Story = {
  render: LiveUpdatesExample,
};
export const Pagination: Story = {
  render: PaginationExample,
};
export const PinnedColumns: Story = {
  render: PinnedColumnsExample,
};
export const RowGrouping: Story = {
  render: RowGroupingExample,
};
export const SalesExample: Story = {
  render: SalesExampleComponent,
};
export const SelectableCells: Story = {
  render: SelectableCellsExample,
};
export const Theming: Story = {
  render: ThemingExample,
};

export default meta;
