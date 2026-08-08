import { afterEach, describe, expect, it } from "vitest";
import { unmount } from "svelte";
import { mountSimpleTable } from "../index";
import type { SimpleTableSvelteProps, SvelteColumnDef } from "../index";
import { createReactiveProps } from "./fixtures/createReactiveProps.svelte";

/**
 * Post-mount row updates must reach the vanilla table via the adapter's
 * reactive `$:` sync (mirrors Vue issue #128 / propUpdates suite).
 */

type Row = { name: string };

/** Mutable rows for the test harness; still assignable to SimpleTableSvelteProps. */
type TestProps = Omit<SimpleTableSvelteProps<Row>, "rows"> & { rows: Row[] };

const columns: SvelteColumnDef<Row>[] = [
  { accessor: "name", label: "Name", width: 120, type: "string" },
];

let host: HTMLDivElement | null = null;
let instance: ReturnType<typeof mountSimpleTable<Row>> | null = null;

afterEach(() => {
  if (instance) unmount(instance);
  instance = null;
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

function mountTable(rows: Row[]): {
  el: HTMLDivElement;
  props: TestProps;
} {
  const el = document.createElement("div");
  document.body.appendChild(el);
  host = el;

  const props = createReactiveProps<TestProps>({
    columns,
    rows,
    getRowId: ({ row }) => row.name,
    height: "250px",
    theme: "light",
  });

  instance = mountSimpleTable({ target: el, props });
  return { el, props };
}

describe("SimpleTable (Svelte adapter) — prop updates after mount", () => {
  it("re-renders when rows change after mount", async () => {
    const { el, props } = mountTable([{ name: "A" }]);

    await waitFor(
      () => cellTexts(el, "name").includes("A"),
      3000,
      "initial row A",
    );
    expect(cellTexts(el, "name")).toEqual(["A"]);

    props.rows = [{ name: "A" }, { name: "B" }, { name: "C" }];
    await waitFor(
      () => cellTexts(el, "name").length === 3,
      3000,
      "updated rows A, B, C",
    );

    expect(cellTexts(el, "name")).toEqual(["A", "B", "C"]);
  });
});
