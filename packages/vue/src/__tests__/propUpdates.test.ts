import { createApp, h, nextTick, ref, type App, type Ref } from "vue";
import { afterEach, describe, expect, it } from "vitest";
import { SimpleTable } from "../index";
import type { VueColumnDef } from "../index";

/**
 * Regression for https://github.com/petera2c/simple-table/issues/128
 *
 * The Vue adapter declares no props and syncs via `watch(attrs, …)`. In Vue 3,
 * `attrs` from setup is not a reactive watch source, so the watcher never runs
 * and post-mount row/column updates never reach the vanilla table.
 */

const columns: VueColumnDef[] = [
  { accessor: "name", label: "Name", width: 120, type: "string" },
];

type Row = { name: string };

let host: HTMLDivElement | null = null;
let app: App | null = null;

afterEach(() => {
  app?.unmount();
  app = null;
  host?.remove();
  host = null;
});

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitFor(
  predicate: () => boolean,
  timeoutMs = 3000,
  label = "condition",
): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (predicate()) return;
    await wait(20);
  }
  throw new Error(`Timed out waiting for ${label}`);
}

function cellTexts(scope: HTMLElement, accessor: string): string[] {
  return Array.from(
    scope.querySelectorAll<HTMLElement>(
      `.st-body-container .st-cell[data-accessor="${accessor}"]`,
    ),
  ).map((el) => el.textContent?.trim() ?? "");
}

function mountTable(rows: Ref<Row[]>): HTMLDivElement {
  const el = document.createElement("div");
  document.body.appendChild(el);
  host = el;

  app = createApp({
    setup() {
      return () =>
        h(SimpleTable as never, {
          columns,
          rows: rows.value,
          getRowId: (p: { row: Row }) => p.row.name,
          height: "250px",
          theme: "light",
        });
    },
  });
  app.mount(el);
  return el;
}

describe("SimpleTable (Vue adapter) — prop updates after mount", () => {
  it("re-renders when rows change after mount (issue #128)", async () => {
    const rows = ref<Row[]>([{ name: "A" }]);
    const el = mountTable(rows);

    await waitFor(
      () => cellTexts(el, "name").includes("A"),
      3000,
      "initial row A",
    );
    expect(cellTexts(el, "name")).toEqual(["A"]);

    rows.value = [{ name: "A" }, { name: "B" }, { name: "C" }];
    await nextTick();
    await waitFor(
      () => cellTexts(el, "name").length === 3,
      3000,
      "updated rows A, B, C",
    );

    expect(cellTexts(el, "name")).toEqual(["A", "B", "C"]);
  });
});
