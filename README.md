# Simple Table

[![npm version](https://img.shields.io/npm/v/simple-table-core.svg)](https://www.npmjs.com/package/simple-table-core)
[![npm downloads](https://img.shields.io/npm/dm/simple-table-core.svg)](https://www.npmjs.com/package/simple-table-core)
[![GitHub stars](https://img.shields.io/github/stars/petera2c/simple-table.svg)](https://github.com/petera2c/simple-table)
[![License](https://img.shields.io/npm/l/simple-table-core.svg)](LICENSE)

Simple Table is a **lightweight**, **high-performance** React data grid component for building modern, scalable applications. With a **simple API**, **completely free features**, and a focus on developer experience, Simple Table makes it easy to create powerful, responsive tables.

## Why Simple Table?

- **100% Free**: All features included at no cost - no premium versions or paid add-ons
- **Lightweight**: Only 16 kB (minified + gzipped) for fast loading
- **Intuitive**: Minimal boilerplate with a clean, React-first API
- **TypeScript-ready**: Full TypeScript support for type-safe development

## Quick Start

Get started with Simple Table in just a few lines of code!

### Installation

```bash
npm install simple-table-core
```

### Example

```tsx
import { SimpleTable, HeaderObject } from "simple-table-core";
import "simple-table-core/styles.css";

const QuickStartDemo = () => {
  // Sample data for a quick start demo
  const data = [
    { id: 1, name: "John Doe", age: 28, role: "Developer" },
    { id: 2, name: "Jane Smith", age: 32, role: "Designer" },
    { id: 3, name: "Bob Johnson", age: 45, role: "Manager" },
  ];

  // Define headers
  const headers: HeaderObject[] = [
    { accessor: "id", label: "ID", width: 80, isSortable: true, type: "number" },
    { accessor: "name", label: "Name", minWidth: 80, width: "1fr", type: "string" },
    { accessor: "age", label: "Age", width: 100, isSortable: true, type: "number" },
    { accessor: "role", label: "Role", width: 150, isSortable: true, type: "string" },
  ];

  // Map data to rows format expected by SimpleTable
  const rows = data.map((item) => ({
    rowMeta: { rowId: item.id },
    rowData: item,
  }));

  return <SimpleTable defaultHeaders={headers} rows={rows} selectableCells />;
};

export default QuickStartDemo;
```

## Features

- **Data Management**

  - Sorting, filtering, and grouping
  - Pagination and infinite scrolling
  - Row and column virtualization for large datasets
  - Export to CSV/Excel

- **Customization**
  - Custom cell rendering and editors
  - Responsive design
  - Flexible styling options
  - TypeScript support

## Live Demo

<div align="center">
    <img src="https://github.com/petera2c/simple-table-marketing/blob/main/src/assets/simple-table-demo-fast.gif?raw=true" alt="Simple Table Demo" width="600" />
</div>

## Examples

Check out our live examples with complete source code:

- [Finance Dashboard](https://www.simple-table.com/examples/finance?theme=light)
- [Sales Dashboard](https://www.simple-table.com/examples/sales?theme=light)

## Links

- **Website**: [Simple Table](https://www.simple-table.com/)
- **Documentation**: [Simple Table Documentation](https://www.simple-table.com/docs/installation)
- **Quick Start**: [Quick Start Guide](https://www.simple-table.com/docs/quick-start)

## Community & Support

Join our growing community to ask questions or share feedback:

- **Discord**: [Join us on Discord](https://discord.gg/RvKHCfg3PC)
- **GitHub**: [Report bugs or suggest features](https://github.com/petera2c/simple-table/issues)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
