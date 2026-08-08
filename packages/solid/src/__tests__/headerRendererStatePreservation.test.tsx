import { createEffect, createSignal, onMount, type JSX } from "solid-js";
import { render } from "solid-js/web";
import { afterEach, describe, expect, it } from "vitest";
import { SimpleTable } from "../index";
import type { HeaderRendererProps, SolidColumnDef, TableAPI } from "../index";

/**
 * Regression: sort/filter icon refresh must not tear down a Solid headerRenderer
 * subtree. Core re-invokes the renderer with new `components.*` icons; the
 * adapter must return the same host and update props in place so local state
 * (open popovers, toggles, etc.) survives. Mirrors Vue's
 * headerRendererStatePreservation.test.ts.
 */

const STATE_ATTR = "data-st-test-header-clicks";
const TOGGLE_ATTR = "data-st-test-header-toggle";

let mountCount = 0;

/** Bridge a core HTMLElement icon slot into the Solid tree. */
function DomSlot(props: { node: HTMLElement }) {
  let el: HTMLSpanElement | undefined;
  createEffect(() => {
    const node = props.node;
    if (el && node.parentElement !== el) {
      el.replaceChildren(node);
    }
  });
  return (
    <span
      ref={(r) => {
        el = r;
        if (r && props.node.parentElement !== r) {
          r.replaceChildren(props.node);
        }
      }}
    />
  );
}

function StatefulHeader(props: HeaderRendererProps) {
  const [clicks, setClicks] = createSignal(0);

  onMount(() => {
    mountCount += 1;
  });

  const iconSlots = () => {
    const nodes: JSX.Element[] = [];
    for (const node of [
      props.components?.sortIcon,
      props.components?.filterIcon,
      props.components?.labelContent,
    ]) {
      if (node instanceof HTMLElement) {
        nodes.push(<DomSlot node={node} />);
      }
    }
    return nodes;
  };

  return (
    <span class="stateful-custom-head" data-st-test-header-clicks={String(clicks())}>
      {String(props.header.label ?? "")}
      <button
        type="button"
        data-st-test-header-toggle="true"
        // Native listener so stopPropagation reaches core's label handler
        // (Solid's delegated onClick cannot block that bubble).
        on:click={(event) => {
          event.stopPropagation();
          setClicks((n) => n + 1);
        }}
      >
        toggle
      </button>
      {iconSlots()}
    </span>
  );
}

const rows = [
  { id: 1, name: "Alice", score: 10 },
  { id: 2, name: "Bob", score: 20 },
];

let host: HTMLDivElement | null = null;
let dispose: (() => void) | null = null;

afterEach(() => {
  dispose?.();
  dispose = null;
  host?.remove();
  host = null;
  mountCount = 0;
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

function mountTable(
  columns: SolidColumnDef[],
  extraProps: Record<string, unknown> = {},
): {
  el: HTMLDivElement;
  getApi: () => TableAPI | null;
} {
  const el = document.createElement("div");
  document.body.appendChild(el);
  host = el;

  let api: TableAPI | null = null;

  dispose = render(
    () => (
      <SimpleTable
        columns={columns}
        rows={rows}
        getRowId={(p: { row: { id?: number } }) => String(p.row.id)}
        height="250px"
        theme="light"
        ref={(tableApi) => {
          api = tableApi as TableAPI;
        }}
        {...extraProps}
      />
    ),
    el,
  );
  return { el, getApi: () => api };
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
  expect(mountCount).toBe(1);

  const toggle = scope.querySelector<HTMLButtonElement>(`[${TOGGLE_ATTR}]`);
  expect(toggle).toBeTruthy();
  toggle!.click();
  await waitFor(() => readStatefulHeader(scope).getAttribute(STATE_ATTR) === "1");
}

describe("SimpleTable (Solid adapter) — headerRenderer state across sort/filter", () => {
  it("preserves Solid header state when the column sort toggles", async () => {
    const columns: SolidColumnDef[] = [
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

    expect(mountCount).toBe(1);
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

    expect(mountCount).toBe(1);
    expect(readStatefulHeader(el).getAttribute(STATE_ATTR)).toBe("1");
  });

  it("preserves Solid header state when a filter is applied on the column", async () => {
    const columns: SolidColumnDef[] = [
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

    const { el, getApi } = mountTable(columns);
    await setLocalHeaderState(el);
    await waitFor(() => getApi() != null);

    await getApi()!.applyFilter({
      accessor: "score",
      operator: "equals",
      value: 10,
    });
    await wait(50);

    expect(mountCount).toBe(1);
    expect(readStatefulHeader(el).getAttribute(STATE_ATTR)).toBe("1");
  });
});

describe("SimpleTable (Solid adapter) — unstable columns / rows refs", () => {
  it("preserves Solid header state when columns is rebuilt with the same structure", async () => {
    function buildColumns(): SolidColumnDef[] {
      return [
        { accessor: "name", label: "Name", width: 120, type: "string" },
        {
          accessor: "score",
          label: "Score",
          width: 140,
          type: "number",
          sortable: true,
          // New component identity every rebuild — classic unstable columns.
          headerRenderer: (props: HeaderRendererProps) => <StatefulHeader {...props} />,
        },
      ];
    }

    const el = document.createElement("div");
    document.body.appendChild(el);
    host = el;

    const [tick, setTick] = createSignal(0);
    const [rowData, setRowData] = createSignal(rows);

    dispose = render(
      () => (
        <div>
          <button
            type="button"
            data-st-churn="true"
            onClick={() => {
              setTick((n) => n + 1);
              setRowData((prev) => prev.map((r) => ({ ...r })));
            }}
          >
            churn {tick()}
          </button>
          <SimpleTable
            columns={buildColumns()}
            rows={rowData()}
            getRowId={(p: { row: { id?: number } }) => String(p.row.id)}
            height="250px"
            theme="light"
          />
        </div>
      ),
      el,
    );

    await setLocalHeaderState(el);

    const churn = el.querySelector<HTMLButtonElement>("[data-st-churn]");
    expect(churn).toBeTruthy();
    churn!.click();
    churn!.click();
    churn!.click();
    await wait(80);

    expect(mountCount).toBe(1);
    expect(readStatefulHeader(el).getAttribute(STATE_ATTR)).toBe("1");
  });
});
