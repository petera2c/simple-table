import { createSignal } from "solid-js";
import { render } from "solid-js/web";
import { afterEach, describe, expect, it } from "vitest";
import { SimpleTable } from "../index";
import type { SolidColumnDef } from "../index";

/**
 * Post-mount row updates must reach the vanilla table via the Solid adapter's
 * reactive createEffect sync (mirrors Vue issue #128 / propUpdates.test.ts).
 */

type Row = { name: string };

const columns: SolidColumnDef<Row>[] = [
  { accessor: "name", label: "Name", width: 120, type: "string" },
];

let host: HTMLDivElement | null = null;
let dispose: (() => void) | null = null;

afterEach(() => {
  dispose?.();
  dispose = null;
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

function mountTable(rows: () => Row[], setRows: (next: Row[]) => void): HTMLDivElement {
  const el = document.createElement("div");
  document.body.appendChild(el);
  host = el;
  (el as HTMLDivElement & { __setRows?: (next: Row[]) => void }).__setRows = setRows;

  dispose = render(
    () => (
      <SimpleTable
        columns={columns}
        rows={rows()}
        getRowId={(p: { row: Row }) => p.row.name}
        height="250px"
        theme="light"
      />
    ),
    el,
  );
  return el;
}

describe("SimpleTable (Solid adapter) — prop updates after mount", () => {
  it("re-renders when rows change after mount", async () => {
    const [rows, setRows] = createSignal<Row[]>([{ name: "A" }]);
    const el = mountTable(rows, setRows);

    await waitFor(
      () => cellTexts(el, "name").includes("A"),
      3000,
      "initial row A",
    );
    expect(cellTexts(el, "name")).toEqual(["A"]);

    setRows([{ name: "A" }, { name: "B" }, { name: "C" }]);
    await waitFor(
      () => cellTexts(el, "name").length === 3,
      3000,
      "updated rows A, B, C",
    );

    expect(cellTexts(el, "name")).toEqual(["A", "B", "C"]);
  });
});
