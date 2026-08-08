import { createSignal } from "solid-js";
import { render } from "solid-js/web";
import { afterEach, describe, expect, it } from "vitest";
import { SimpleTable } from "../index";
import type { SolidColumnDef } from "../index";

/**
 * jsdom has no layout engine, so width assertions live in core browser stories.
 * This suite guards the Solid integration: `width: "auto"` + custom renderers must
 * mount through the post-mount / leave-loading re-fit path without throwing.
 * Mirrors packages/vue/src/__tests__/autoSizeColumns.test.ts.
 */

let host: HTMLDivElement | null = null;
let dispose: (() => void) | null = null;

afterEach(() => {
  dispose?.();
  dispose = null;
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

function StatusBadge(props: { value?: unknown }) {
  return <span class="status-badge">status:{String(props.value)}</span>;
}

const headers: SolidColumnDef[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  {
    accessor: "status",
    label: "Status",
    width: "auto",
    type: "string",
    cellRenderer: StatusBadge,
  },
];

const rows = [
  { id: 1, status: "active" },
  { id: 2, status: "pending" },
];

type HarnessEl = HTMLDivElement & {
  __setRows?: (next: typeof rows) => void;
  __setLoading?: (next: boolean) => void;
};

function mountTable(
  props: {
    columns?: SolidColumnDef[];
    rows?: Array<Record<string, unknown>>;
    isLoading?: boolean;
  } = {},
): HTMLDivElement {
  const el = document.createElement("div") as HarnessEl;
  document.body.appendChild(el);
  host = el;

  const [columns] = createSignal(props.columns ?? headers);
  const [rowData, setRowData] = createSignal(props.rows ?? rows);
  const [isLoading, setIsLoading] = createSignal(props.isLoading ?? false);

  el.__setRows = (next) => setRowData(next);
  el.__setLoading = (next) => setIsLoading(next);

  dispose = render(
    () => (
      <SimpleTable
        columns={columns()}
        rows={rowData() as typeof rows}
        isLoading={isLoading()}
        getRowId={(p: { row: { id?: number } }) => String(p.row.id)}
        height="250px"
        theme="light"
      />
    ),
    el,
  );
  return el;
}

describe("SimpleTable (Solid adapter) — auto-size columns", () => {
  it("renders a width:'auto' column that uses a Solid cellRenderer", async () => {
    const el = mountTable();
    await waitForText(el, "status:active");
    expect(el.querySelectorAll(".status-badge").length).toBeGreaterThan(0);
  });

  it("re-fits without error when row data changes", async () => {
    const el = mountTable();
    await waitForText(el, "status:active");

    (el as HarnessEl).__setRows!([
      { id: 1, status: "archived" },
      { id: 2, status: "active" },
    ]);
    await waitForText(el, "status:archived");
    expect(el.querySelectorAll(".status-badge").length).toBeGreaterThan(0);
  });

  it("re-fits without error when leaving isLoading", async () => {
    const el = mountTable({ isLoading: true, rows: [] });
    await wait(60);

    (el as HarnessEl).__setLoading!(false);
    (el as HarnessEl).__setRows!(rows);
    await waitForText(el, "status:active");
    expect(el.querySelectorAll(".status-badge").length).toBeGreaterThan(0);
  });

  it("renders a width:'auto' column that uses a Solid headerRenderer", async () => {
    function CustomHeader(props: { header: { label?: string } }) {
      return <span class="custom-head">head:{String(props.header.label)}</span>;
    }

    const customHeaders: SolidColumnDef[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      {
        accessor: "status",
        label: "Status",
        width: "auto",
        type: "string",
        headerRenderer: CustomHeader,
      },
    ];

    const el = mountTable({ columns: customHeaders });
    await waitForText(el, "head:Status");
    expect(el.querySelectorAll(".custom-head").length).toBeGreaterThan(0);
  });
});
