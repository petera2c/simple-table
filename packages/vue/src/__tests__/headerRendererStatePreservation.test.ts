import {
  createApp,
  defineComponent,
  h,
  nextTick,
  onMounted,
  ref,
  type App,
  type PropType,
} from "vue";
import { afterEach, describe, expect, it } from "vitest";
import { SimpleTable } from "../index";
import type {
  HeaderRendererProps,
  SimpleTableExposed,
  VueColumnDef,
} from "../index";

/**
 * Regression: sort/filter icon refresh must not tear down a Vue headerRenderer
 * subtree. Core re-invokes the renderer with new `components.*` icons; the
 * adapter must return the same host and patch props in place so local state
 * (open popovers, toggles, etc.) survives. Mirrors React's
 * headerRendererStatePreservation.test.tsx.
 */

const STATE_ATTR = "data-st-test-header-clicks";
const TOGGLE_ATTR = "data-st-test-header-toggle";

let mountCount = 0;

type HeaderComponents = NonNullable<HeaderRendererProps["components"]>;

const StatefulHeader = defineComponent({
  name: "StatefulHeader",
  props: {
    header: { type: Object as PropType<HeaderRendererProps["header"]>, required: true },
    components: { type: Object as PropType<HeaderComponents | undefined>, required: false },
  },
  setup(props) {
    const clicks = ref(0);

    onMounted(() => {
      mountCount += 1;
    });

    return () => {
      const iconNodes: ReturnType<typeof h>[] = [];
      // Core passes live HTMLElements for sort/filter slots. Bridge them into
      // the Vue tree via a host vnode that adopts the node on mount/update.
      for (const node of [
        props.components?.sortIcon,
        props.components?.filterIcon,
        props.components?.labelContent,
      ]) {
        if (!(node instanceof HTMLElement)) continue;
        // Cast props: Vue's h() overloads intersect `ref` in a way that rejects
        // a normal callback ref under strict checking.
        iconNodes.push(
          h("span", {
            ref: (el: unknown) => {
              if (!(el instanceof HTMLElement)) return;
              if (node.parentElement !== el) {
                el.replaceChildren(node);
              }
            },
          } as Record<string, unknown>),
        );
      }

      return h(
        "span",
        {
          class: "stateful-custom-head",
          [STATE_ATTR]: String(clicks.value),
        },
        [
          String(props.header.label ?? ""),
          h(
            "button",
            {
              type: "button",
              [TOGGLE_ATTR]: "true",
              onClick: (event: Event) => {
                event.stopPropagation();
                clicks.value += 1;
              },
            },
            "toggle",
          ),
          ...iconNodes,
        ],
      );
    };
  },
});

const rows = [
  { id: 1, name: "Alice", score: 10 },
  { id: 2, name: "Bob", score: 20 },
];

let host: HTMLDivElement | null = null;
let app: App | null = null;

afterEach(() => {
  app?.unmount();
  app = null;
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

function mountTable(columns: VueColumnDef[], extraProps: Record<string, unknown> = {}): {
  el: HTMLDivElement;
  tableRef: { value: SimpleTableExposed | null };
} {
  const el = document.createElement("div");
  document.body.appendChild(el);
  host = el;

  const tableRef = ref<SimpleTableExposed | null>(null);

  app = createApp({
    setup() {
      return () =>
        h(SimpleTable as never, {
          ref: tableRef,
          columns,
          rows,
          getRowId: (p: { row: { id?: number } }) => String(p.row.id),
          height: "250px",
          theme: "light",
          ...extraProps,
        });
    },
  });
  app.mount(el);
  return { el, tableRef };
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

describe("SimpleTable (Vue adapter) — headerRenderer state across sort/filter", () => {
  it("preserves Vue header state when the column sort toggles", async () => {
    const columns: VueColumnDef[] = [
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

  it("preserves Vue header state when a filter is applied on the column", async () => {
    const columns: VueColumnDef[] = [
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

    const { el, tableRef } = mountTable(columns);
    await setLocalHeaderState(el);
    await waitFor(() => tableRef.value?.getAPI() != null);

    await tableRef.value!.getAPI()!.applyFilter({
      accessor: "score",
      operator: "equals",
      value: 10,
    });
    await wait(50);

    expect(mountCount).toBe(1);
    expect(readStatefulHeader(el).getAttribute(STATE_ATTR)).toBe("1");
  });
});

describe("SimpleTable (Vue adapter) — unstable columns / rows refs", () => {
  it("preserves Vue header state when columns is rebuilt with the same structure", async () => {
    function buildColumns(): VueColumnDef[] {
      return [
        { accessor: "name", label: "Name", width: 120, type: "string" },
        {
          accessor: "score",
          label: "Score",
          width: 140,
          type: "number",
          sortable: true,
          // New component identity every rebuild — classic unstable columns.
          headerRenderer: defineComponent({
            name: "UnstableScoreHeader",
            props: {
              header: { type: Object, required: true },
              components: { type: Object, required: false },
            },
            setup(props) {
              return () => h(StatefulHeader, props as any);
            },
          }),
        },
      ];
    }

    const el = document.createElement("div");
    document.body.appendChild(el);
    host = el;

    const tick = ref(0);
    const rowData = ref(rows);

    app = createApp({
      setup() {
        return () =>
          h("div", null, [
            h(
              "button",
              {
                type: "button",
                "data-st-churn": "true",
                onClick: () => {
                  tick.value += 1;
                  rowData.value = rowData.value.map((r) => ({ ...r }));
                },
              },
              `churn ${tick.value}`,
            ),
            h(SimpleTable as never, {
              columns: buildColumns(),
              rows: rowData.value,
              getRowId: (p: { row: { id?: number } }) => String(p.row.id),
              height: "250px",
              theme: "light",
            }),
          ]);
      },
    });
    app.mount(el);

    await setLocalHeaderState(el);

    const churn = el.querySelector<HTMLButtonElement>("[data-st-churn]");
    expect(churn).toBeTruthy();
    churn!.click();
    churn!.click();
    churn!.click();
    await nextTick();
    await wait(80);

    expect(mountCount).toBe(1);
    expect(readStatefulHeader(el).getAttribute(STATE_ATTR)).toBe("1");
  });
});
