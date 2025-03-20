# Simple Table

Any questions, support or features requests join me on Discord <a href="https://discord.gg/RvKHCfg3PC" target="_blank" rel="noopener noreferrer">https://discord.gg/RvKHCfg3PC</a>. I am happy to help and make this table even better!

Simple Table is a powerful yet lightweight React grid component that provides a flexible, customizable, and high-performance solution for displaying and manipulating tabular data in your applications.

## Key Features

- **Highly Customizable**: Fully customizable appearance with CSS variables and themes
- **Cell Editing**: Built-in support for editable cells with controlled state
- **Column Management**: Resize, reorder, pin, and hide columns with intuitive UI
- **Pagination**: Built-in pagination with customizable controls
- **Infinite Scroll**: Alternative to pagination for large datasets
- **Row Grouping**: Hierarchical data presentation with expandable rows
- **Theming**: Multiple built-in themes with ability to create custom themes
- **Performance Optimized**: Efficiently renders thousands of rows and columns

## Documentation

For detailed documentation, visit: [Simple Table Documentation](https://docs.simple-table.com/)

## Website

For more information, visit our website: [Simple Table](https://www.simple-table.com/)

## Live Demo

Check out the live demo on CodeSandbox: <a href="https://codesandbox.io/p/sandbox/simple-table-pagination-example-rdjm5d?file=%2Fsrc%2FApp.tsx%3A33%2C24" target="_blank" rel="noopener noreferrer">Simple Table Pagination Example</a>

<div align="center">
    <a href="https://github.com/petera2c/simple-table-marketing/blob/main/src/assets/simple-table-demo-fast.gif?raw=true" target="_blank" rel="noopener noreferrer">
        <img src="https://github.com/petera2c/simple-table-marketing/blob/main/src/assets/simple-table-demo-fast.gif?raw=true" alt="Simple Table Demo" />
    </a>
</div>

## Installation

```bash
# npm
npm install simple-table-core

# yarn
yarn add simple-table-core

# pnpm
pnpm add simple-table-core
```

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
  - **align**: Text alignment within cells - "left", "center", or "right"

- **rows**: An array of data rows to be displayed in the table. Each row object should have:

  - **rowMeta**: Object containing metadata for the row
    - **rowId**: Unique identifier for the row
    - **isExpanded**: Optional boolean for row grouping expansion state
    - **children**: Optional array of child rows for row grouping
  - **rowData**: Object containing the actual data to display (keys should match header accessors)

- **theme**: Theme name to apply to the table. Options include "light", "dark", "high-contrast", etc.
- **height**: The height of the table. Can be a string (e.g., "500px", "calc(100vh - 100px)") or "auto".
- **shouldPaginate**: A boolean to enable or disable pagination. Default is `true`.
- **rowsPerPage**: The number of rows to display per page. Default is `10`.
- **columnResizing**: A boolean to enable or disable column resizing. Default is `true`.
- **draggable**: A boolean to enable or disable column dragging.
- **pinned**: A boolean to enable or disable column pinning.
- **editColumns**: A boolean to enable or disable column management.
- **hideFooter**: A boolean to hide or show the footer. Default is `false`.
- **selectableCells**: A boolean to enable or disable cell selection.
- **selectableColumns**: A boolean to enable selection of entire columns by clicking headers.
- **onCellChange**: A function called when a cell value changes.
- **nextIcon**: A React element to display as the next page icon.
- **prevIcon**: A React element to display as the previous page icon.
- **sortDownIcon**: A React element to display as the sort down icon.
- **sortUpIcon**: A React element to display as the sort up icon.

## Customizable Styles

All styles for the Simple Table are customizable through CSS variables. You can override these variables in your own CSS to match your application's design system.

### CSS Variables

You can override the following CSS variables to customize the appearance of the table:

```css
/* light theme */
:root {
  --st-border-radius: 4px;
  --st-border-width: 1px;
  --st-cell-padding: 8px;
  --st-font-size: 0.875rem;
  --st-font-weight-normal: 400;
  --st-font-weight-bold: 600;
  --st-transition-duration: 0.2s;
  --st-transition-ease: ease;
  --st-opacity-disabled: 0.5;
  --st-spacing-small: 4px;
  --st-spacing-medium: 8px;
  --st-spacing-large: 16px;
  --st-scrollbar-bg-color: transparent;
  --st-scrollbar-thumb-color: var(--slate-200);

  --st-border-color: var(--gray-300);
  --st-odd-row-background-color: var(--white);
  --st-even-row-background-color: var(--white);
  --st-header-background-color: var(--white);
  --st-dragging-background-color: var(--gray-200);
  --st-selected-cell-background-color: var(--blue-200);
  --st-selected-first-cell-background-color: var(--blue-200);
  --st-footer-background-color: var(--white);
  --st-cell-color: var(--gray-800);
  --st-cell-odd-row-color: var(--gray-700);
  --st-edit-cell-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05), 0 1px 1px -1px rgba(0, 0, 0, 0.05);
  --st-selected-cell-color: var(--gray-900);
  --st-selected-first-cell-color: var(--gray-900);
  --st-resize-handle-color: var(--blue-300);
  --st-separator-border-color: var(--slate-100);
  --st-last-group-row-separator-border-color: var(--slate-300);
  --st-selected-border-top-color: var(--blue-600);
  --st-selected-border-bottom-color: var(--blue-600);
  --st-selected-border-left-color: var(--blue-600);
  --st-selected-border-right-color: var(--blue-600);
  --st-checkbox-checked-background-color: var(--blue-600);
  --st-checkbox-checked-border-color: var(--blue-600);
  --st-column-editor-background-color: var(--white);
  --st-column-editor-popout-background-color: var(--white);
  --st-button-hover-background-color: var(--gray-200);
  --st-button-active-background-color: var(--blue-800);
  --st-font-family: "Roboto", sans-serif;
  --st-editable-cell-focus-border-color: var(--blue-600);
}
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
