import { afterEach, describe, expect, it } from "vitest";
import { unmount } from "svelte";
import { mountSimpleTable } from "../index";
import type { SimpleTableSvelteProps, SvelteColumnDef } from "../index";
import { createReactiveProps } from "./fixtures/createReactiveProps.svelte";
import StatusBadge from "./fixtures/StatusBadge.svelte";
import CustomHeader from "./fixtures/CustomHeader.svelte";

/**
 * jsdom has no layout engine, so width assertions live in core browser stories.
 * This suite guards the Svelte integration: `width: "auto"` + custom renderers must
 * mount through the post-mount / leave-loading re-fit path without throwing.
 * Mirrors packages/vue/src/__tests__/autoSizeColumns.test.ts.
 */

type Row = { id: number; status: string; name?: string };

type TestProps = Omit<SimpleTableSvelteProps<Row>, "rows" | "columns" | "isLoading"> & {
  rows: Row[];
  columns: SvelteColumnDef<Row>[];
  isLoading: boolean;
};

let host: HTMLDivElement | null = null;
let instance: ReturnType<typeof mountSimpleTable<Row>> | null = null;

afterEach(() => {
  if (instance) unmount(instance);
  instance = null;
  host?.remove();
  host = null;
});

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForText(scope: HTMLElement, text: string, timeoutMs = 3000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (scope.textContent?.includes(text)) return;
    await wait(20);
  }
  throw new Error(`Timed out waiting for text: ${text}`);
}

const headers: SvelteColumnDef<Row>[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  {
    accessor: "status",
    label: "Status",
    width: "auto",
    type: "string",
    cellRenderer: StatusBadge,
  },
];

const rows: Row[] = [
  { id: 1, status: "active" },
  { id: 2, status: "pending" },
];

function mountTable(
  props: {
    columns?: SvelteColumnDef<Row>[];
    rows?: Row[];
    isLoading?: boolean;
  } = {},
): {
  el: HTMLDivElement;
  reactive: TestProps;
} {
  const el = document.createElement("div");
  document.body.appendChild(el);
  host = el;

  const reactive = createReactiveProps<TestProps>({
    columns: props.columns ?? headers,
    rows: props.rows ?? rows,
    isLoading: props.isLoading ?? false,
    getRowId: ({ row }) => String(row.id),
    height: "250px",
    theme: "light",
  });

  instance = mountSimpleTable({ target: el, props: reactive });
  return { el, reactive };
}

describe("SimpleTable (Svelte adapter) — auto-size columns", () => {
  it("renders a width:'auto' column that uses a Svelte cellRenderer", async () => {
    const { el } = mountTable();
    await waitForText(el, "status:active");
    expect(el.querySelectorAll(".status-badge").length).toBeGreaterThan(0);
  });

  it("re-fits without error when row data changes", async () => {
    const { el, reactive } = mountTable();
    await waitForText(el, "status:active");

    reactive.rows = [
      { id: 1, status: "archived" },
      { id: 2, status: "active" },
    ];
    await waitForText(el, "status:archived");
    expect(el.querySelectorAll(".status-badge").length).toBeGreaterThan(0);
  });

  it("re-fits without error when leaving isLoading", async () => {
    const { el, reactive } = mountTable({ isLoading: true, rows: [] });
    await wait(60);

    reactive.isLoading = false;
    reactive.rows = rows;
    await waitForText(el, "status:active");
    expect(el.querySelectorAll(".status-badge").length).toBeGreaterThan(0);
  });

  it("renders a width:'auto' column that uses a Svelte headerRenderer", async () => {
    const customHeaders: SvelteColumnDef<Row>[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      {
        accessor: "status",
        label: "Status",
        width: "auto",
        type: "string",
        headerRenderer: CustomHeader,
      },
    ];

    const { el } = mountTable({ columns: customHeaders });
    await waitForText(el, "head:Status");
    expect(el.querySelectorAll(".custom-head").length).toBeGreaterThan(0);
  });
});
