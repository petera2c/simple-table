# Simple Table for Angular

[![npm version](https://img.shields.io/npm/v/@simple-table/angular.svg)](https://www.npmjs.com/package/@simple-table/angular)
[![npm downloads](https://img.shields.io/npm/dm/@simple-table/angular.svg)](https://www.npmjs.com/package/@simple-table/angular)
[![GitHub stars](https://img.shields.io/github/stars/petera2c/simple-table.svg)](https://github.com/petera2c/simple-table)
[![License](https://img.shields.io/npm/l/@simple-table/angular.svg)](LICENSE)

**Simple Table** is the Angular data grid and Angular table component for modern apps: standalone components, templates, Ivy-friendly bundles, and full Angular component support for cell renderers, headers, and footers. It is a **lightweight**, **high-performance** data grid with a **simple API**, **completely free features** for qualifying use, and first-class TypeScript typings for Angular 17+ projects.

<div align="center">
  <img src="https://github.com/petera2c/simple-table-marketing/blob/main/src/assets/infrastructure-light.png?raw=true" alt="Simple Table Infrastructure Dashboard" width="800" />
</div>

## Framework Support

Simple Table is available for the most popular frameworks:

| Framework | Package | Version |
|-----------|---------|---------|
| **Vanilla JS** | [`simple-table-core`](https://www.npmjs.com/package/simple-table-core) | [![npm](https://img.shields.io/npm/v/simple-table-core.svg)](https://www.npmjs.com/package/simple-table-core) |
| **React** | [`@simple-table/react`](https://www.npmjs.com/package/@simple-table/react) | [![npm](https://img.shields.io/npm/v/@simple-table/react.svg)](https://www.npmjs.com/package/@simple-table/react) |
| **Vue 3** | [`@simple-table/vue`](https://www.npmjs.com/package/@simple-table/vue) | [![npm](https://img.shields.io/npm/v/@simple-table/vue.svg)](https://www.npmjs.com/package/@simple-table/vue) |
| **Svelte** | [`@simple-table/svelte`](https://www.npmjs.com/package/@simple-table/svelte) | [![npm](https://img.shields.io/npm/v/@simple-table/svelte.svg)](https://www.npmjs.com/package/@simple-table/svelte) |
| **Solid** | [`@simple-table/solid`](https://www.npmjs.com/package/@simple-table/solid) | [![npm](https://img.shields.io/npm/v/@simple-table/solid.svg)](https://www.npmjs.com/package/@simple-table/solid) |
| **Angular** | [`@simple-table/angular`](https://www.npmjs.com/package/@simple-table/angular) | [![npm](https://img.shields.io/npm/v/@simple-table/angular.svg)](https://www.npmjs.com/package/@simple-table/angular) |

## Quick Start

```bash
npm install @simple-table/angular
```

**Peer dependencies:** `@angular/core >=17.0.0 <22.0.0`, `@angular/common >=17.0.0 <22.0.0`

**[Follow our Quick Start Guide](https://www.simple-table.com/docs/quick-start)** for step-by-step instructions and live examples.

## Building with Angular

- Standalone `SimpleTableComponent` with the `<simple-table>` selector
- Use Angular components for cell renderers, header renderers, footer renderers, and more
- Access the imperative `TableAPI` via `(tableReady)` output or `@ViewChild` for sorting, filtering, pagination, export, and more
- Types and APIs are exported from this package

## Features

### Column Features

- **[Column Sorting](https://www.simple-table.com/docs/column-sorting)** - Sort data by any column with single or multi-column support
- **[Column Filtering](https://www.simple-table.com/docs/column-filtering)** - Filter data with built-in text, number, and date filters
- **[Column Resizing](https://www.simple-table.com/docs/column-resizing)** - Drag column borders to resize on the fly
- **[Column Pinning](https://www.simple-table.com/docs/column-pinning)** - Pin important columns to the left or right
- **[Column Reordering](https://www.simple-table.com/docs/column-reordering)** - Drag and drop columns to rearrange
- **[Column Visibility](https://www.simple-table.com/docs/column-visibility)** - Show or hide columns dynamically
- **[Column Alignment](https://www.simple-table.com/docs/column-alignment)** - Align content left, center, or right
- **[Column Selection](https://www.simple-table.com/docs/column-selection)** - Select entire columns for bulk operations
- **[Column Editing](https://www.simple-table.com/docs/column-editing)** - Edit entire columns with custom editors
- **[Nested Headers](https://www.simple-table.com/docs/nested-headers)** - Create multi-level header hierarchies
- **[Collapsible Columns](https://www.simple-table.com/docs/collapsible-columns)** - Expand and collapse column groups

### Row Features

- **[Row Selection](https://www.simple-table.com/docs/row-selection)** - Select single or multiple rows with checkboxes
- **[Row Grouping](https://www.simple-table.com/docs/row-grouping)** - Group and organize rows by any column
- **[Aggregate Functions](https://www.simple-table.com/docs/aggregate-functions)** - Calculate Sum, Average, Count, and more
- **[Row Height](https://www.simple-table.com/docs/row-height)** - Customize row height for optimal display

### Cell Features

- **[Cell Editing](https://www.simple-table.com/docs/cell-editing)** - Edit cells inline with custom editors
- **[Cell Highlighting](https://www.simple-table.com/docs/cell-highlighting)** - Highlight cells based on conditions
- **[Cell Renderer](https://www.simple-table.com/docs/cell-renderer)** - Custom cell rendering for any data type
- **[Cell Clicking](https://www.simple-table.com/docs/cell-clicking)** - Handle cell click events with ease

### Advanced Features

- **[Pagination](https://www.simple-table.com/docs/pagination)** - Server-side and client-side pagination support
- **[Infinite Scroll](https://www.simple-table.com/docs/infinite-scroll)** - Fetch and display data as you scroll
- **[Live Updates](https://www.simple-table.com/docs/live-updates)** - Real-time data updates and websocket integration
- **[Header Renderer](https://www.simple-table.com/docs/header-renderer)** - Custom header rendering for advanced layouts

### Customization

- **[Themes](https://www.simple-table.com/docs/themes)** - Apply built-in themes or create your own
- **[Custom Icons](https://www.simple-table.com/docs/custom-icons)** - Replace default icons with your own

## Examples

See Simple Table in action across different industries:

<div align="center">

**[CRM Leads](https://www.simple-table.com/examples/crm)**

<br />
<br />

[<img src="https://github.com/petera2c/simple-table-marketing/blob/main/src/assets/crm-light.png?raw=true" alt="CRM Leads" width="800">](https://www.simple-table.com/examples/crm)

**[Infrastructure](https://www.simple-table.com/examples/infrastructure)**

[<img src="https://github.com/petera2c/simple-table-marketing/blob/main/src/assets/infrastructure-light.png?raw=true" alt="Infrastructure Dashboard" width="800">](https://www.simple-table.com/examples/infrastructure)

<br />
<br />

**[HR Dashboard](https://www.simple-table.com/examples/hr)**

[<img src="https://github.com/petera2c/simple-table-marketing/blob/main/src/assets/HR-dark.png?raw=true" alt="HR Dashboard" width="800">](https://www.simple-table.com/examples/hr)

<br />
<br />

**[Manufacturing](https://www.simple-table.com/examples/manufacturing)**

[<img src="https://github.com/petera2c/simple-table-marketing/blob/main/src/assets/manufacturing-light.png?raw=true" alt="Manufacturing Dashboard" width="800">](https://www.simple-table.com/examples/manufacturing)

</div>

## Resources

- **Website**: [simple-table.com](https://www.simple-table.com/)
- **Documentation**: [Complete Documentation](https://www.simple-table.com/docs/installation)

## Pricing

Simple, transparent pricing that never changes based on your revenue or team size:

### FREE - For Individuals & Startups

**$0/forever**

For side projects and pre-revenue teams. Unlimited users per product license with full access to all core features, built-in themes, TypeScript support, and the MIT License for **zero-revenue** companies only. If your company generates revenue, use Pro or Enterprise.

### PRO - For Growing Businesses

**$85/month** or **$850/year** (about 17% less than twelve monthly payments)

For revenue-generating companies: priority email and Discord support, bug support for production issues, and the commercial EULA. Unlimited users per product license.

### ENTERPRISE - For teams that need hands-on support

**$350/month** or **$3,500/year** (about 17% less than twelve monthly payments)

Premium support with faster response times, direct access to core developers, feature request prioritization, and the commercial EULA. Unlimited users per product license.

**[View Detailed Pricing](https://www.simple-table.com/pricing)**

## Community & Support

Join our growing community to ask questions or share feedback:

- **Discord**: [Join us on Discord](https://discord.gg/RvKHCfg3PC)
- **GitHub**: [Report bugs or suggest features](https://github.com/petera2c/simple-table/issues)

## License

**Dual Licensed:**

- **Free Tier**: MIT License for zero-revenue individuals, startups, and organizations — see [LICENSE](LICENSE)
- **Pro and Enterprise**: Commercial EULA for revenue-generating companies — see [EULA.txt](../core/EULA.txt)

By using Simple Table, you agree to the terms in [EULA.txt](../core/EULA.txt) where applicable.

**[View Detailed Pricing & Licensing](https://www.simple-table.com/pricing)**
