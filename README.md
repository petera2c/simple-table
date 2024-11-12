# Simple Table

Any questions, support or features requests join me on Dicord <a href="https://discord.gg/RvKHCfg3PC" target="_blank" rel="noopener noreferrer">https://discord.gg/RvKHCfg3PC</a>. I am happy to help and make this table even better!

Simple Table is a React grid package designed to provide a flexible and easy-to-use table component for your React applications.

## Website

For more information, visit our website: [Simple Table](https://www.simple-table.com/)

## Live Demo

Check out the live demo on CodeSandbox: <a href="https://codesandbox.io/p/sandbox/simple-table-pagination-example-rdjm5d?file=%2Fsrc%2FApp.tsx%3A33%2C24" target="_blank" rel="noopener noreferrer">Simple Table Pagination Example</a>

<div align="center">
    <a href="https://github.com/petera2c/simple-table-marketing/blob/main/src/assets/simple-table-demo-fast.gif?raw=true" target="_blank" rel="noopener noreferrer">
        <img src="https://github.com/petera2c/simple-table-marketing/blob/main/src/assets/simple-table-demo-fast.gif?raw=true" alt="Simple Table Demo" />
    </a>
</div>

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
