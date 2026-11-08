# Simple Table Svelte Starter

A minimal Svelte 5 starter template for [Simple Table](https://www.simple-table.com), a free and MIT-licensed data grid.

## Features

This starter demonstrates:

- **Column sorting** - Click column headers to sort
- **Column filtering** - Filter data in the Department column
- **Column editor** - Right-click headers or use the column menu
- **Selectable cells** - Click cells to select them
- **TypeScript support** - Full type safety
- **Svelte 5 Runes** - Modern Svelte 5 reactivity

## Quick Start

### Online

Try this starter in your browser:

- **StackBlitz**: [Open in StackBlitz](https://stackblitz.com/github/petera2c/simple-table/tree/main/starters/svelte)
- **CodeSandbox**: [Open in CodeSandbox](https://codesandbox.io/p/github/petera2c/simple-table/main?file=/starters/svelte/README.md)

### Local Development

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the dev server:**

   ```bash
   npm run dev
   ```

3. **Open your browser** to the URL shown in the terminal (typically `http://localhost:5173`)

## What's Inside

```
starters/svelte/
├── src/
│   ├── App.svelte        # Main component with Simple Table example
│   ├── main.ts           # Svelte app entry point
│   └── vite-env.d.ts     # Type definitions
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── svelte.config.js      # Svelte configuration
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
└── README.md             # This file
```

## Learn More

- **Documentation**: [simple-table.com/docs](https://www.simple-table.com/docs/quick-start)
- **Examples**: [simple-table.com/examples](https://www.simple-table.com/examples)
- **GitHub**: [github.com/petera2c/simple-table](https://github.com/petera2c/simple-table)
- **Discord**: [Join the community](https://discord.gg/RvKHCfg3PC)

## Next Steps

Explore more features:

- **[Row Selection](https://www.simple-table.com/docs/row-selection)** - Select rows with checkboxes
- **[Row Grouping](https://www.simple-table.com/docs/row-grouping)** - Group rows by any column
- **[Pagination](https://www.simple-table.com/docs/pagination)** - Add pagination controls
- **[Cell Editing](https://www.simple-table.com/docs/cell-editing)** - Edit cells inline
- **[Custom Themes](https://www.simple-table.com/docs/themes)** - Apply or create themes

## SvelteKit

This starter uses plain Svelte 5. For SvelteKit, install the same package and follow the [SvelteKit setup guide](https://www.simple-table.com/docs/quick-start#sveltekit).

## License

This starter is MIT licensed. Simple Table itself is also MIT licensed.
