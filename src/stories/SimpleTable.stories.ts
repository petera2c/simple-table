import type { Meta, StoryObj } from "@storybook/react";

import ThemingExample from "./examples/Theming";
import PinnedColumnsExample from "./examples/pinned-columns/PinnedColumns";
import PaginationExample from "./examples/Pagination";
import InfiniteScrollExample from "./examples/InfiniteScroll";
import EditableCellsExample from "./examples/EditableCells";
import FilterColumnsExample from "./examples/FilterColumns";
import SelectableCellsExample from "./examples/SelectableCells";
import RowGroupingExample from "./examples/row-grouping/RowGrouping";

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
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates how to create editable cells in Simple Table, allowing users to directly modify data within the table. Shows how to handle the onCellEdit callback to update application state when a cell value changes.",
      },
      source: {
        code: `
// Basic implementation of editable cells
const [rows, setRows] = useState(data);

const updateCell = ({
  accessor,
  newValue,
  originalRowIndex,
}) => {
  setRows((prevRows) => {
    prevRows[originalRowIndex].rowData[accessor] = newValue;
    return [...prevRows];
  });
};

<SimpleTable
  defaultHeaders={HEADERS}
  rows={rows}
  onCellEdit={updateCell}
  columnResizing
  selectableCells
/>`,
        language: "tsx",
        type: "auto",
      },
    },
  },
};
export const FilterColumns: Story = {
  render: FilterColumnsExample,
  parameters: {
    docs: {
      description: {
        story:
          "Shows how to implement column management in Simple Table, enabling users to show/hide columns and customize their view. The column management UI allows users to select which columns should be visible in the table.",
      },
      source: {
        code: `
// Column management implementation
<SimpleTable
  defaultHeaders={HEADERS}
  rows={rows}
  editColumns // Enable column management
  columnReordering // Enable column reordering
  columnResizing
/>`,
        language: "tsx",
        type: "auto",
      },
    },
  },
};
export const InfiniteScroll: Story = {
  render: InfiniteScrollExample,
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates infinite scrolling as an alternative to pagination for large datasets. As the user scrolls down, more data is loaded automatically without requiring explicit page navigation.",
      },
      source: {
        code: `
// Infinite scroll implementation
<SimpleTable
  defaultHeaders={HEADERS}
  rows={rows}
  shouldPaginate={false} // Disable pagination
  height="calc(100vh - 100px)" // Fixed height is required
/>`,
        language: "tsx",
        type: "auto",
      },
    },
  },
};
export const Pagination: Story = {
  render: PaginationExample,
  parameters: {
    docs: {
      description: {
        story:
          "Shows how to implement pagination in Simple Table. Pagination controls allow users to navigate through large datasets by dividing them into manageable pages.",
      },
      source: {
        code: `
// Pagination implementation
<SimpleTable
  defaultHeaders={HEADERS}
  rows={rows}
  shouldPaginate={true}
  rowsPerPage={10}
  height="80vh"
/>`,
        language: "tsx",
        type: "auto",
      },
    },
  },
};
export const PinnedColumns: Story = {
  render: PinnedColumnsExample,
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates column pinning functionality that allows certain columns to remain visible while scrolling horizontally. This is particularly useful for wide tables where key columns like identifiers or totals should stay in view.",
      },
      source: {
        code: `
// Define headers with pinned columns
const HEADERS = [
  {
    accessor: "name",
    label: "Name",
    width: 250,
    pinned: "left", // Pin to left
  },
  // ... other columns
  {
    accessor: "totalSales",
    label: "Total Sales",
    width: 200,
    pinned: "right", // Pin to right
  },
];

<SimpleTable
  defaultHeaders={HEADERS}
  rows={data}
  columnResizing
/>`,
        language: "tsx",
        type: "auto",
      },
    },
  },
};
export const RowGrouping: Story = {
  render: RowGroupingExample,
  parameters: {
    docs: {
      description: {
        story:
          "Shows how to display hierarchical data with parent-child relationships. Parent rows can be expanded or collapsed to show or hide their children, and typically display aggregated data like totals or counts.",
      },
      source: {
        code: `
// Row grouping data structure
const rows = [
  {
    rowMeta: { 
      rowId: 0, 
      isExpanded: true,
      children: [
        {
          rowMeta: { rowId: 1 },
          rowData: { name: "Child 1", value: 100 }
        },
        {
          rowMeta: { rowId: 2 },
          rowData: { name: "Child 2", value: 200 }
        }
      ]
    },
    rowData: { 
      name: "Parent", 
      value: 300 // Sum of children
    }
  }
];

<SimpleTable
  defaultHeaders={HEADERS}
  rows={rows}
/>`,
        language: "tsx",
        type: "auto",
      },
    },
  },
};
export const SelectableCells: Story = {
  render: SelectableCellsExample,
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates cell selection capabilities, allowing users to select individual cells or ranges of cells. This feature is useful for operations like copying data or applying formatting to specific cells.",
      },
      source: {
        code: `
// Selectable cells implementation
<SimpleTable
  defaultHeaders={HEADERS}
  rows={rows}
  selectableCells // Enable cell selection
/>`,
        language: "tsx",
        type: "auto",
      },
    },
  },
};
export const Theming: Story = {
  render: ThemingExample,
  parameters: {
    docs: {
      description: {
        story:
          "Showcases the extensive theming capabilities of Simple Table with 12 built-in themes. Each theme provides a unique visual style with customized colors, fonts, and other style attributes.",
      },
      source: {
        code: `
// Theme implementation
import { useState } from "react";
import SimpleTable from "simple-table-react";
import { Theme } from "simple-table-react/types";

const ThemeExample = () => {
  // Available themes
  const themes: Theme[] = [
    "light", "dark", "high-contrast", 
    "pastel", "vibrant", "solarized-light", 
    "solarized-dark", "ocean", "forest", 
    "desert", "bubblegum", "90s"
  ];
  
  const [theme, setTheme] = useState<Theme>("light");
  
  return (
    <>
      <SimpleTable
        defaultHeaders={HEADERS}
        rows={rows}
        theme={theme}
      />
      
      <div>
        {themes.map(t => (
          <button key={t} onClick={() => setTheme(t)}>
            {t}
          </button>
        ))}
      </div>
    </>
  );
};`,
        language: "tsx",
        type: "auto",
      },
    },
  },
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
