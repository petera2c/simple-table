import type { Meta, StoryObj } from "@storybook/react";

import ThemingExample from "./examples/Theming";
import PinnedColumnsExample from "./examples/pinned-columns/PinnedColumns";
import PaginationExample from "./examples/Pagination";
import InfiniteScrollExample from "./examples/InfiniteScroll";
import EditableCellsExample from "./examples/EditableCells";
import FilterColumnsExample from "./examples/FilterColumns";
import SelectableCellsExample from "./examples/SelectableCells";
import RowGroupingExample from "./examples/row-grouping/RowGrouping";
import { FinancialExample } from "./examples/finance-example/FinancialExample";
import BillingExampleComponent from "./examples/billing-example/BillingExample";
import BasicExampleComponent from "./examples/BasicExample";
import CellHighlightingDemo from "./examples/CellHighlighting";
import { SalesExampleComponent } from "./examples/sales-example/SalesExample";
import CellRendererExample from "./examples/CellRenderer";

const meta = {
  title: "Simple Table",
  component: ThemingExample,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ThemingExample>;

type Story = StoryObj<typeof meta>;

export const BasicExample: Story = {
  render: BasicExampleComponent,
};
export const BillingExample: Story = {
  render: BillingExampleComponent,
};
export const CellHighlighting: Story = {
  render: CellHighlightingDemo,
};

export const CellRenderer: Story = {
  render: CellRendererExample,
};
export const EditableCells: Story = {
  render: EditableCellsExample,
};
export const FilterColumns: Story = {
  render: FilterColumnsExample,
};
export const FinanceExample: Story = {
  render: FinancialExample,
};
export const InfiniteScroll: Story = {
  render: InfiniteScrollExample,
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
// export const EditColumns: Story = {
//   render: EditColumnsExample,
// };
// export const ColumnResizing: Story = {
//   render: ColumnResizingExample,
// };

export default meta;
