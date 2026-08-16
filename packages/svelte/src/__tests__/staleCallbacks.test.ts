import { afterEach, describe, expect, it, vi } from "vitest";
import { unmount } from "svelte";
import { mountSimpleTable } from "../index";
import type { SimpleTableSvelteProps, SvelteColumnDef } from "../index";
import { createReactiveProps } from "./fixtures/createReactiveProps.svelte";

/**
 * Callback props must not be frozen at mount time: when the parent updates
 * with a new callback closure, a subsequent sort must invoke the LATEST
 * callback. Mirrors Vue/React staleCallbacks suites.
 */

type Row = { id: number; name: string };

type TestProps = Omit<SimpleTableSvelteProps<Row>, "onSortChange" | "rows"> & {
  rows: Row[];
  onSortChange: (...args: unknown[]) => void;
};

const headers: SvelteColumnDef<Row>[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: 120, type: "string", sortable: true },
];

const rows: Row[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
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

async function waitForElement(
  scope: HTMLElement,
  selector: string,
  timeoutMs = 3000,
): Promise<HTMLElement> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const el = scope.querySelector<HTMLElement>(selector);
    if (el) return el;
    await wait(20);
  }
  throw new Error(`Timed out waiting for element: ${selector}`);
}

function findSortableHeaderLabel(scope: HTMLElement): HTMLElement {
  const labels = Array.from(scope.querySelectorAll<HTMLElement>(".st-header-label"));
  const label = labels.find((el) => el.textContent?.includes("Name"));
  if (!label) throw new Error("Sortable header label not found");
  return label;
}

function mountTable(onSortChange: (...args: unknown[]) => void): {
  el: HTMLDivElement;
  props: TestProps;
} {
  const el = document.createElement("div");
  document.body.appendChild(el);
  host = el;

  const props = createReactiveProps<TestProps>({
    columns: headers,
    rows,
    getRowId: ({ row }) => String(row.id),
    height: "250px",
    theme: "light",
    onSortChange,
  });

  instance = mountSimpleTable({ target: el, props });
  return { el, props };
}

describe("SimpleTable (Svelte adapter) — callback props stay fresh across re-renders", () => {
  it("invokes the latest onSortChange closure after a prop update, not the mount-time one", async () => {
    const mountCallback = vi.fn();
    const latestCallback = vi.fn();

    const { el, props } = mountTable(mountCallback);
    await waitForElement(el, ".st-header-label");

    props.onSortChange = latestCallback;
    await wait(50);

    const headerLabel = findSortableHeaderLabel(el);
    headerLabel.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await wait(50);

    expect(mountCallback).not.toHaveBeenCalled();
    expect(latestCallback).toHaveBeenCalledTimes(1);
  });
});
