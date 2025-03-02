import type { Meta, StoryObj } from "@storybook/react";

import ThemingExample from "./examples/Theming";
import PinnedColumnsExample from "./examples/PinnedColumns/PinnedColumns";
import PaginationExample from "./examples/Pagination";
import InfiniteScrollExample from "./examples/InfiniteScroll";
import EditableCellsExample from "./examples/EditableCells";
import FilterColumnsExample from "./examples/FilterColumns";
import SelectableCellsExample from "./examples/SelectableCells";

const meta = {
  title: "Simple Table",
  component: ThemingExample,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ThemingExample>;

type Story = StoryObj<typeof meta>;

export const EditableCells: Story = {
  render: EditableCellsExample,
};
export const FilterColumns: Story = {
  render: FilterColumnsExample,
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
export const SelectableCells: Story = {
  render: SelectableCellsExample,
};
export const Theming: Story = {
  render: ThemingExample,
};

// export const DragAndDrop: Story = {
//   render: DragAndDropExample,
// };
// export const EditColumns: Story = {
//   render: EditColumnsExample,
// };
// export const ColumnResizing: Story = {
//   render: ColumnResizingExample,
// };

export default meta;
