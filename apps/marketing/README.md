# simple-table-marketing

Next.js app for [simple-table.com](https://www.simple-table.com/) (docs, examples, pricing, and marketing pages).

## Develop

From the monorepo root:

```bash
pnpm run dev:marketing
```

This runs the `simple-table-marketing` package (default dev server is port **3000**; the `dev` script may open a browser).

Equivalent:

```bash
pnpm --filter simple-table-marketing run dev
```

See the [repository root README](../../README.md) for other workspaces, builds (`pnpm run build:marketing`), and examples.

## Related

- **Documentation** (live): [simple-table.com/docs/installation](https://www.simple-table.com/docs/installation)
- **Component library Storybook / tests**: implemented in [`packages/core`](../../packages/core). With Storybook already running on port 6006, from that package run `pnpm run test-storybook:ci` (see its `package.json` scripts), not via this app.
