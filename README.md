# Simple Table

Any questions, support or features requests join me on Dicord [https://discord.gg/RvKHCfg3PC](https://discord.gg/RvKHCfg3PC). I am happy to help and make this table even better!

Simple Table is a React grid package designed to provide a flexible and easy-to-use table component for your React applications.

![Simple Table Demo](https://iili.io/2IfrFhx.md.png)

## Example Usage

```tsx
import { useState } from "react";
import { SimpleTable } from "simple-table-core";
import CellChangeProps from "simple-table-core/dist/types/CellChangeProps";

export const SAMPLE_HEADERS: any[] = [
  { label: "Product ID", accessor: "id", width: 150 },
  { label: "Product Name", accessor: "productName", width: 200 },
  { label: "Category", accessor: "category", width: 150 },
  { label: "Quantity", accessor: "quantity", width: 100 },
  { label: "Price", accessor: "price", width: 100 },
  { label: "Supplier", accessor: "supplier", width: 150 },
  { label: "Location", accessor: "location", width: 150 },
  { label: "Reorder Level", accessor: "reorderLevel", width: 100 },
  { label: "SKU", accessor: "sku", width: 100 },
  { label: "Description", accessor: "description", width: 250 },
  { label: "Weight", accessor: "weight", width: 100 },
  { label: "Dimensions", accessor: "dimensions", width: 150 },
  { label: "Barcode", accessor: "barcode", width: 100 },
];

export const inventoryData: any[] = Array.from({ length: 50 }, (_, index) => ({
  id: `P-${index + 1001}`,
  productName: [
    "Wireless Mouse",
    "Bluetooth Speaker",
    "LED Monitor",
    "Gaming Keyboard",
    "Smartphone",
    "Laptop",
    "Tablet",
    "Headphones",
    "Smartwatch",
    "External Hard Drive",
  ][index % 10],
  category: ["Electronics", "Furniture", "Clothing", "Food", "Books"][
    Math.floor(Math.random() * 5)
  ],
  quantity: Math.floor(Math.random() * 100) + 1,
  price: (Math.random() * 100).toFixed(2),
  supplier: [
    "Tech Supplies Co.",
    "Gadget World",
    "Office Essentials",
    "Home Comforts",
    "Fashion Hub",
  ][Math.floor(Math.random() * 5)],
  location: [
    "Warehouse A - New York",
    "Warehouse B - Los Angeles",
    "Warehouse C - Chicago",
    "Warehouse D - Houston",
    "Warehouse E - Miami",
  ][Math.floor(Math.random() * 5)],
  reorderLevel: Math.floor(Math.random() * 20) + 5,
  sku: `SKU-${index + 1001}`,
  description: `High-quality ${
    [
      "wireless mouse",
      "bluetooth speaker",
      "LED monitor",
      "gaming keyboard",
      "smartphone",
      "laptop",
      "tablet",
      "headphones",
      "smartwatch",
      "external hard drive",
    ][index % 10]
  } for everyday use.`,
  weight: `${(Math.random() * 10).toFixed(2)} kg`,
  dimensions: `${(Math.random() * 100).toFixed(2)}x${(
    Math.random() * 100
  ).toFixed(2)}x${(Math.random() * 100).toFixed(2)} cm`,
  barcode: `1234567890${index}`,
  expirationDate: `2024-${Math.floor(Math.random() * 12) + 1}-${
    Math.floor(Math.random() * 28) + 1
  }`,
  manufacturer: [
    "Tech Innovators Inc.",
    "Gadget Makers Ltd.",
    "Office Producers",
    "Home Creators",
    "Fashion Designers",
  ][Math.floor(Math.random() * 5)],
}));

const SimpleTableExample = () => {
  const [rows, setRows] = useState(inventoryData);

  const updateCell = ({
    accessor,
    newRowIndex,
    newValue,
    originalRowIndex,
    row,
  }: CellChangeProps) => {
    setRows((prevRows) => {
      prevRows[originalRowIndex][accessor] = newValue;
      return prevRows;
    });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <SimpleTable
        // Enable column resizing
        columnResizing
        // Enable draggable columns
        draggable
        // Enable editing columns
        editColumns
        // Set the headers
        defaultHeaders={SAMPLE_HEADERS}
        // Set the rows
        rows={inventoryData}
        // Handle cell changes
        onCellChange={updateCell}
        // Enable selectable cells
        selectableCells
        // Use pagination
        shouldPaginate
        height="auto"
        rowsPerPage={8}

        // If you aren't using pagination a height is required
        // height="calc(100dvh - 4rem)"`
      />
    </div>
  );
};

export default SimpleTableExample;
```

Import the CSS file to apply the styles to your table.

## Props

The Simple Table component accepts the following props:

- **defaultHeaders**: An array of `HeaderObject` defining the table headers. Each `HeaderObject` includes:

  - **label**: A string representing the display name of the column header.
  - **accessor**: A string used to access the corresponding data in each row.
  - **width**: A number specifying the width of the column.
  - **isEditable**: An optional boolean indicating if the column is editable.
  - **isSortable**: An optional boolean indicating if the column is sortable.
  - **type**: An optional string specifying the data type of the column. Can be "string", "number", "boolean", "date", or "enum".
  - **cellRenderer**: An optional function that takes a row object and returns a `ReactNode` for custom cell rendering.

- **columnResizing**: A boolean to enable or disable column resizing. Default is `true`.
- **draggable**: A boolean to enable or disable column dragging.
- **editColumns**: A boolean to enable or disable column editing.
- **height**: The height of the table.
- **hideFooter**: A boolean to hide or show the footer. Default is `false`.
- **nextIcon**: A React element to display as the next page icon. Default is `<AngleRightIcon />`.
- **prevIcon**: A React element to display as the previous page icon. Default is `<AngleLeftIcon />`.
- **rows**: An array of data rows to be displayed in the table.
- **rowsPerPage**: The number of rows to display per page. Default is `10`.
- **selectableCells**: A boolean to enable or disable cell selection.
- **shouldPaginate**: A boolean to enable or disable pagination. Default is `true`.
- **sortDownIcon**: A React element to display as the sort down icon.
- **sortUpIcon**: A React element to display as the sort up icon.
- **onCellChange**: A function that is called when a cell value changes. It receives an object with the following properties:
  - **accessor**: The accessor of the column whose cell value changed.
  - **newValue**: The new value of the cell.
  - **newRowIndex**: The index of the row in the current page.
  - **originalRowIndex**: The original index of the row in the entire dataset.
  - **row**: The entire row object.

## Customizable Styles

All styles for the Simple Table are customizable and can be found in the `table.css` file. You can modify these styles to fit the design needs of your application.

### CSS Variables

You can override the following CSS variables to customize the appearance of the table:

- `--st-border-radius`
- `--st-border-color`
- `--st-border-width`
- `--st-resize-handle-color`
- `--st-separator-border-color`
- `--st-odd-row-background-color`
- `--st-dragging-background-color`
- `--st-selected-cell-background-color`
- `--st-selected-first-cell-background-color`
- `--st-border-top-color`
- `--st-border-bottom-color`
- `--st-border-left-color`
- `--st-border-right-color`
- `--st-border-top-white-color`
- `--st-footer-background-color`

### CSS Class Names

The following CSS class names are used in the table and can be customized:

- `.st-wrapper`
- `.st-table`
- `.st-header-cell`
- `.st-cell`
- `.st-header-label`
- `.st-header-resize-handle`
- `.st-row-separator`
- `.st-cell-odd-row`
- `.st-dragging`
- `.st-cell-selected`
- `.st-cell-selected-first`
- `.st-selected-top-border`
- `.st-selected-bottom-border`
- `.st-selected-left-border`
- `.st-selected-right-border`
- `.st-footer`
- `.st-next-prev-btn`
- `.st-page-btn`
- `.st-page-btn.active`
- `.editable-cell-input`
- `.st-column-editor`
- `.st-column-editor.open`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
