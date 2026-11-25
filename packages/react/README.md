# Simple Table for React

[![npm version](https://img.shields.io/npm/v/@simple-table/react.svg)](https://www.npmjs.com/package/@simple-table/react)
[![npm downloads](https://img.shields.io/npm/dm/@simple-table/react.svg)](https://www.npmjs.com/package/@simple-table/react)
[![GitHub stars](https://img.shields.io/github/stars/petera2c/simple-table.svg)](https://github.com/petera2c/simple-table)
[![License](https://img.shields.io/npm/l/@simple-table/react.svg)](LICENSE)

Simple Table is a lightweight React data grid. Free and MIT licensed, with optional paid support from the people who build it. Use React components for cells, headers, and footers.

**[Live demos](https://www.simple-table.com/examples?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react) · [Docs](https://www.simple-table.com/docs/quick-start?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react) · [Why it is MIT again](https://www.simple-table.com/blog/simple-table-is-mit-licensed?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)**

<div align="center">
  <img src="https://github.com/petera2c/simple-table-marketing/blob/main/src/assets/infrastructure-light.png?raw=true" alt="Simple Table Infrastructure Dashboard" width="800" />
</div>

## Framework Support

Simple Table is available for the most popular frameworks:

| Framework      | Package                                                                        | Version                                                                                                               |
| -------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| **Vanilla JS** | [`simple-table-core`](https://www.npmjs.com/package/simple-table-core)         | [![npm](https://img.shields.io/npm/v/simple-table-core.svg)](https://www.npmjs.com/package/simple-table-core)         |
| **React**      | [`@simple-table/react`](https://www.npmjs.com/package/@simple-table/react)     | [![npm](https://img.shields.io/npm/v/@simple-table/react.svg)](https://www.npmjs.com/package/@simple-table/react)     |
| **Vue 3**      | [`@simple-table/vue`](https://www.npmjs.com/package/@simple-table/vue)         | [![npm](https://img.shields.io/npm/v/@simple-table/vue.svg)](https://www.npmjs.com/package/@simple-table/vue)         |
| **Svelte**     | [`@simple-table/svelte`](https://www.npmjs.com/package/@simple-table/svelte)   | [![npm](https://img.shields.io/npm/v/@simple-table/svelte.svg)](https://www.npmjs.com/package/@simple-table/svelte)   |
| **Solid**      | [`@simple-table/solid`](https://www.npmjs.com/package/@simple-table/solid)     | [![npm](https://img.shields.io/npm/v/@simple-table/solid.svg)](https://www.npmjs.com/package/@simple-table/solid)     |
| **Angular**    | [`@simple-table/angular`](https://www.npmjs.com/package/@simple-table/angular) | [![npm](https://img.shields.io/npm/v/@simple-table/angular.svg)](https://www.npmjs.com/package/@simple-table/angular) |

## Quick Start

```bash
npm install @simple-table/react
```

**Peer dependencies:** `react >=18.0.0`, `react-dom >=18.0.0` (works with React 19, Next.js, Remix, and Vite)

**[Follow our Quick Start Guide](https://www.simple-table.com/docs/quick-start?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)** for step-by-step instructions and live examples.

## Building with React

- Use React components for cell renderers, header renderers, footer renderers, and more
- Works with React 18+, React 19, Next.js (Pages and App Router), Remix, and Vite
- Access the full imperative `TableAPI` via a ref for sorting, filtering, pagination, export, and more
- Types and APIs are exported from this package

## Features

### Column Features

- **[Column Sorting](https://www.simple-table.com/docs/column-sorting?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)** - Sort data by any column in ascending or descending order
- **[Column Filtering](https://www.simple-table.com/docs/column-filtering?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)** - Filter data with built-in text, number, and date filters
- **[Column Resizing](https://www.simple-table.com/docs/column-resizing?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)** - Drag column borders to resize on the fly
- **[Column Pinning](https://www.simple-table.com/docs/column-pinning?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)** - Pin important columns to the left or right
- **[Column Reordering](https://www.simple-table.com/docs/column-reordering?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)** - Drag and drop columns to rearrange
- **[Column Visibility](https://www.simple-table.com/docs/column-visibility?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)** - Show or hide columns dynamically
- **[Column Alignment](https://www.simple-table.com/docs/column-alignment?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)** - Align content left, center, or right
- **[Column Selection](https://www.simple-table.com/docs/column-selection?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)** - Select entire columns for bulk operations
- **[Nested Headers](https://www.simple-table.com/docs/nested-headers?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)** - Create multi-level header hierarchies
- **[Collapsible Columns](https://www.simple-table.com/docs/collapsible-columns?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)** - Expand and collapse column groups

### Row Features

- **[Row Selection](https://www.simple-table.com/docs/row-selection?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)** - Select single or multiple rows with checkboxes
- **[Row Grouping](https://www.simple-table.com/docs/row-grouping?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)** - Group and organize rows by any column
- **[Nested Tables](https://www.simple-table.com/docs/nested-tables?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)** - Hierarchical data with independent columns per nesting level
- **[Aggregate Functions](https://www.simple-table.com/docs/aggregate-functions?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)** - Calculate Sum, Average, Count, and more
- **[Pivot Tables](https://www.simple-table.com/docs/pivot?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)** - Matrix pivots with row/column dimensions, aggregations, and totals
- **[Row Height](https://www.simple-table.com/docs/row-height?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)** - Customize row height for optimal display

### Cell Features

- **[Cell Editing](https://www.simple-table.com/docs/cell-editing?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)** - Edit cells inline with custom editors
- **[Cell Highlighting](https://www.simple-table.com/docs/cell-highlighting?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)** - Highlight cells based on conditions
- **[Cell Renderer](https://www.simple-table.com/docs/cell-renderer?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)** - Custom cell rendering for any data type
- **[Value Formatter](https://www.simple-table.com/docs/value-formatter?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)** - Format cell values for display without changing the underlying data
- **[Chart Columns](https://www.simple-table.com/docs/chart-columns?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)** - Inline bar and line/area charts in cells
- **[Cell Clicking](https://www.simple-table.com/docs/cell-clicking?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)** - Handle cell click events with ease

### Advanced Features

- **[Quick Filter](https://www.simple-table.com/docs/quick-filter?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)** - Global search across all columns with simple or smart modes
- **[Pagination](https://www.simple-table.com/docs/pagination?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)** - Server-side and client-side pagination support
- **[Infinite Scroll](https://www.simple-table.com/docs/infinite-scroll?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)** - Fetch and display data as you scroll, with row and column virtualization
- **[Live Updates](https://www.simple-table.com/docs/live-updates?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)** - Real-time data updates and websocket integration
- **[CSV Export](https://www.simple-table.com/docs/csv-export?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)** - One-click CSV download of grid data
- **[Animations](https://www.simple-table.com/docs/animations?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)** - Smooth FLIP animations for sort, reorder, and visibility changes
- **[Header Renderer](https://www.simple-table.com/docs/header-renderer?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)** - Custom header rendering for advanced layouts
- **[Footer Renderer](https://www.simple-table.com/docs/footer-renderer?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)** - Custom footer rendering for summaries and controls
- **[Programmatic Control](https://www.simple-table.com/docs/programmatic-control?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)** - Control sorting, filtering, selection, and more via the TableAPI

### Customization

- **[Themes](https://www.simple-table.com/docs/themes?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)** - Apply built-in themes or create your own
- **[Custom Icons](https://www.simple-table.com/docs/custom-icons?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)** - Replace default icons with your own

## Examples

See Simple Table in action across different industries:

<div align="center">

**[CRM Leads](https://www.simple-table.com/examples/crm?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)**

<br />
<br />

[<img src="https://github.com/petera2c/simple-table-marketing/blob/main/src/assets/crm-light.png?raw=true" alt="CRM Leads" width="800">](https://www.simple-table.com/examples/crm?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)

**[Infrastructure](https://www.simple-table.com/examples/infrastructure?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)**

[<img src="https://github.com/petera2c/simple-table-marketing/blob/main/src/assets/infrastructure-light.png?raw=true" alt="Infrastructure Dashboard" width="800">](https://www.simple-table.com/examples/infrastructure?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)

<br />
<br />

**[HR Dashboard](https://www.simple-table.com/examples/hr?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)**

[<img src="https://github.com/petera2c/simple-table-marketing/blob/main/src/assets/HR-dark.png?raw=true" alt="HR Dashboard" width="800">](https://www.simple-table.com/examples/hr?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)

<br />
<br />

**[Manufacturing](https://www.simple-table.com/examples/manufacturing?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)**

[<img src="https://github.com/petera2c/simple-table-marketing/blob/main/src/assets/manufacturing-light.png?raw=true" alt="Manufacturing Dashboard" width="800">](https://www.simple-table.com/examples/manufacturing?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)

</div>

## Resources

- **Website**: [simple-table.com](https://www.simple-table.com/?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)
- **Documentation**: [Complete Documentation](https://www.simple-table.com/docs/installation?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)

## Pricing

The library is free under the MIT license. Anyone can use it. Pay only if you want support.

### FREE

**$0**

The full library, MIT licensed. Use it in any product.

### PRO

**$850/month**

Support and bug fixes. The license stays MIT. You are paying for help, not for permission to use the library.

### ENTERPRISE

**Contact us**

Custom help, depending on what you need.

**[View Detailed Pricing](https://www.simple-table.com/pricing?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)**

## Community & Support

Join our growing community to ask questions or share feedback:

- **Discord**: [Join us on Discord](https://discord.gg/RvKHCfg3PC)
- **GitHub**: [Report bugs or suggest features](https://github.com/petera2c/simple-table/issues)

## License

**MIT License**

Simple Table is MIT licensed. Anyone can use, modify, and distribute it. See [LICENSE](LICENSE).

Paid plans are for support, not a separate software license. Support terms are in [EULA.txt](../core/EULA.txt).

**[View Detailed Pricing & Licensing](https://www.simple-table.com/pricing?utm_source=npm&utm_medium=readme&utm_campaign=simple-table-react)**
