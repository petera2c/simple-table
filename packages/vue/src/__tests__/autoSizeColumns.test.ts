import { createApp, defineComponent, h, markRaw, nextTick, ref, type App } from "vue";
import { afterEach, describe, expect, it } from "vitest";
import { SimpleTable } from "../index";
import type { VueColumnDef } from "../index";

/**
 * jsdom has no layout engine, so width assertions live in core browser stories.
 * This suite guards the Vue integration: `width: "auto"` + custom renderers must
 * mount through the post-mount / leave-loading re-fit path without throwing.
 * Mirrors packages/react/src/__tests__/autoSizeColumns.test.tsx.
 */

let host: HTMLDivElement | null = null;
let app: App | null = null;

afterEach(() => {
  app?.unmount();
  app = null;
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

const StatusBadge = markRaw(
  defineComponent({
    name: "StatusBadge",
    props: {
      value: { required: false },
    },
    setup(props) {
      return () => h("span", { class: "status-badge" }, `status:${String(props.value)}`);
    },
  }),
);

const headers: VueColumnDef[] = [
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

function mountTable(
  props: {
    columns?: VueColumnDef[];
    rows?: Array<Record<string, unknown>>;
    isLoading?: boolean;
  } = {},
): HTMLDivElement {
  const el = document.createElement("div");
  document.body.appendChild(el);
  host = el;

  const columnsRef = ref(props.columns ?? headers);
  const rowsRef = ref(props.rows ?? rows);
  const loadingRef = ref(props.isLoading ?? false);

  // Expose setters on the element for tests that re-render.
  (el as HTMLDivElement & { __setRows?: (next: typeof rows) => void }).__setRows = (next) => {
    rowsRef.value = next;
  };
  (el as HTMLDivElement & { __setLoading?: (next: boolean) => void }).__setLoading = (next) => {
    loadingRef.value = next;
  };

  app = createApp({
    setup() {
      return () =>
        h(SimpleTable as never, {
          columns: columnsRef.value,
          rows: rowsRef.value,
          isLoading: loadingRef.value,
          getRowId: (p: { row: { id?: number } }) => String(p.row.id),
          height: "250px",
          theme: "light",
        });
    },
  });
  app.mount(el);
  return el;
}

describe("SimpleTable (Vue adapter) — auto-size columns", () => {
  it("renders a width:'auto' column that uses a Vue cellRenderer", async () => {
    const el = mountTable();
    await waitForText(el, "status:active");
    expect(el.querySelectorAll(".status-badge").length).toBeGreaterThan(0);
  });

  it("re-fits without error when row data changes", async () => {
    const el = mountTable();
    await waitForText(el, "status:active");

    (el as HTMLDivElement & { __setRows: (next: typeof rows) => void }).__setRows([
      { id: 1, status: "archived" },
      { id: 2, status: "active" },
    ]);
    await nextTick();
    await waitForText(el, "status:archived");
    expect(el.querySelectorAll(".status-badge").length).toBeGreaterThan(0);
  });

  it("re-fits without error when leaving isLoading", async () => {
    const el = mountTable({ isLoading: true, rows: [] });
    await wait(60);

    (el as HTMLDivElement & { __setLoading: (next: boolean) => void }).__setLoading(false);
    (el as HTMLDivElement & { __setRows: (next: typeof rows) => void }).__setRows(rows);
    await nextTick();
    await waitForText(el, "status:active");
    expect(el.querySelectorAll(".status-badge").length).toBeGreaterThan(0);
  });

  it("renders a width:'auto' column that uses a Vue headerRenderer", async () => {
    const CustomHeader = markRaw(
      defineComponent({
        name: "CustomHeader",
        props: {
          header: { type: Object, required: true },
        },
        setup(props) {
          return () =>
            h(
              "span",
              { class: "custom-head" },
              `head:${String((props.header as { label?: string }).label)}`,
            );
        },
      }),
    );

    const customHeaders: VueColumnDef[] = [
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
