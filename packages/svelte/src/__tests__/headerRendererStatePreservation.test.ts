import { afterEach, describe, expect, it } from "vitest";
import { unmount } from "svelte";
import { mountSimpleTable } from "../index";
import type { SimpleTableSvelteProps, SvelteColumnDef } from "../index";
import { createReactiveProps } from "./fixtures/createReactiveProps.svelte";
import StatefulHeader from "./fixtures/StatefulHeader.svelte";
import UnstableScoreHeader from "./fixtures/UnstableScoreHeader.svelte";

/**
 * Regression: sort/filter icon refresh must not tear down a Svelte headerRenderer
 * subtree. Core re-invokes the renderer with new `components.*` icons; the
 * adapter must return the same host and sync props in place so local state
 * survives. Mirrors Vue/React headerRendererStatePreservation suites.
 */

const STATE_ATTR = "data-st-test-header-clicks";
const TOGGLE_ATTR = "data-st-test-header-toggle";

function getMountCount(): number {
  return (globalThis as any).__stHeaderMountCount ?? 0;
}

function resetMountCount(): void {
  (globalThis as any).__stHeaderMountCount = 0;
}

type Row = { id: number; name: string; score: number };

type TestProps = Omit<SimpleTableSvelteProps<Row>, "rows" | "columns"> & {
  rows: Row[];
  columns: SvelteColumnDef<Row>[];
};

const rows: Row[] = [
  { id: 1, name: "Alice", score: 10 },
  { id: 2, name: "Bob", score: 20 },
];

let host: HTMLDivElement | null = null;
let instance: ReturnType<typeof mountSimpleTable<Row>> | null = null;

afterEach(() => {
  if (instance) unmount(instance);
  instance = null;
  host?.remove();
  host = null;
  resetMountCount();
});

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitFor(predicate: () => boolean, timeoutMs = 3000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (predicate()) return;
    await wait(20);
  }
  throw new Error("Timed out waiting for condition");
}

function mountTable(columns: SvelteColumnDef<Row>[]): {
  el: HTMLDivElement;
  table: ReturnType<typeof mountSimpleTable<Row>>;
} {
  const el = document.createElement("div");
  document.body.appendChild(el);
  host = el;

  const props = createReactiveProps<TestProps>({
    columns,
    rows,
    getRowId: ({ row }) => String(row.id),
    height: "250px",
    theme: "light",
  });

  instance = mountSimpleTable({ target: el, props });
  return { el, table: instance };
}

function findHeaderLabel(scope: HTMLElement, labelText: string): HTMLElement {
  const labels = Array.from(scope.querySelectorAll<HTMLElement>(".st-header-label"));
  const label = labels.find((el) => el.textContent?.includes(labelText));
  if (!label) throw new Error(`${labelText} header label not found`);
  return label;
}

function readStatefulHeader(scope: HTMLElement): HTMLElement {
  const el = scope.querySelector<HTMLElement>(".stateful-custom-head");
  if (!el) throw new Error("Stateful header not found");
  return el;
}

async function setLocalHeaderState(scope: HTMLElement): Promise<void> {
  await waitFor(() => scope.querySelector(".stateful-custom-head") !== null);
  await waitFor(() => getMountCount() >= 1);
  expect(getMountCount()).toBe(1);

  const toggle = scope.querySelector<HTMLButtonElement>(`[${TOGGLE_ATTR}]`);
  expect(toggle).toBeTruthy();
  toggle!.click();
  await waitFor(() => readStatefulHeader(scope).getAttribute(STATE_ATTR) === "1");
}

describe("SimpleTable (Svelte adapter) — headerRenderer state across sort/filter", () => {
  it("preserves Svelte header state when the column sort toggles", async () => {
    const columns: SvelteColumnDef<Row>[] = [
      { accessor: "name", label: "Name", width: 120, type: "string" },
      {
        accessor: "score",
        label: "Score",
        width: 140,
        type: "number",
        sortable: true,
        headerRenderer: StatefulHeader,
      },
    ];

    const { el } = mountTable(columns);
    await setLocalHeaderState(el);

    const headerLabel = findHeaderLabel(el, "Score");
    headerLabel.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    await waitFor(
      () =>
        el.querySelector('.stateful-custom-head .st-icon-container[aria-label*="Sort"]') !== null,
    );
    await wait(50);

    expect(getMountCount()).toBe(1);
    expect(readStatefulHeader(el).getAttribute(STATE_ATTR)).toBe("1");

    headerLabel.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await waitFor(
      () =>
        el
          .querySelector('.stateful-custom-head .st-icon-container[aria-label*="Sort"]')
          ?.getAttribute("aria-label")
          ?.includes("ascending") === true,
    );
    await wait(50);

    expect(getMountCount()).toBe(1);
    expect(readStatefulHeader(el).getAttribute(STATE_ATTR)).toBe("1");
  });

  it("preserves Svelte header state when a filter is applied on the column", async () => {
    const columns: SvelteColumnDef<Row>[] = [
      { accessor: "name", label: "Name", width: 120, type: "string" },
      {
        accessor: "score",
        label: "Score",
        width: 160,
        type: "number",
        filterable: true,
        headerRenderer: StatefulHeader,
      },
    ];

    const { el, table } = mountTable(columns);
    await setLocalHeaderState(el);
    await waitFor(() => table.getAPI() != null);

    table.getAPI()!.applyFilter({
      accessor: "score",
      operator: "equals",
      value: 10,
    });
    await wait(50);

    expect(getMountCount()).toBe(1);
    expect(readStatefulHeader(el).getAttribute(STATE_ATTR)).toBe("1");
  });
});

describe("SimpleTable (Svelte adapter) — unstable columns / rows refs", () => {
  it("preserves Svelte header state when columns is rebuilt with the same structure", async () => {
    function buildColumns(): SvelteColumnDef<Row>[] {
      return [
        { accessor: "name", label: "Name", width: 120, type: "string" },
        {
          accessor: "score",
          label: "Score",
          width: 140,
          type: "number",
          sortable: true,
          // UnstableScoreHeader is a stable module export; we rebuild the
          // columns array identity while keeping the same pass-through component.
          headerRenderer: UnstableScoreHeader,
        },
      ];
    }

    const el = document.createElement("div");
    document.body.appendChild(el);
    host = el;

    const props = createReactiveProps<TestProps>({
      columns: buildColumns(),
      rows: [...rows],
      getRowId: ({ row }) => String(row.id),
      height: "250px",
      theme: "light",
    });

    instance = mountSimpleTable({ target: el, props });

    await setLocalHeaderState(el);

    // Churn columns + rows identities the way Vue's tick button does.
    props.columns = buildColumns();
    props.rows = props.rows.map((r) => ({ ...r }));
    props.columns = buildColumns();
    props.rows = props.rows.map((r) => ({ ...r }));
    props.columns = buildColumns();
    props.rows = props.rows.map((r) => ({ ...r }));
    await wait(80);

    expect(getMountCount()).toBe(1);
    expect(readStatefulHeader(el).getAttribute(STATE_ATTR)).toBe("1");
  });
});
