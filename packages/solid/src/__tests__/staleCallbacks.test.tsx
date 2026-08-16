import { createSignal } from "solid-js";
import { render } from "solid-js/web";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SimpleTable } from "../index";
import type { SolidColumnDef } from "../index";

/**
 * Callback props must not be frozen at mount time: when the parent re-renders
 * with a new callback closure, a subsequent sort must invoke the LATEST
 * callback. Mirrors packages/vue/src/__tests__/staleCallbacks.test.ts.
 */

const headers: SolidColumnDef[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: 120, type: "string", sortable: true },
];

const rows = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
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

describe("SimpleTable (Solid adapter) — callback props stay fresh across re-renders", () => {
  it("invokes the latest onSortChange closure after a re-render, not the mount-time one", async () => {
    const mountCallback = vi.fn();
    const latestCallback = vi.fn();
    const [onSortChange, setOnSortChange] = createSignal(mountCallback);

    const el = document.createElement("div");
    document.body.appendChild(el);
    host = el;

    dispose = render(
      () => (
        <SimpleTable
          columns={headers}
          rows={rows}
          getRowId={(p: { row: { id?: number } }) => String(p.row.id)}
          height="250px"
          theme="light"
          onSortChange={onSortChange()}
        />
      ),
      el,
    );

    await waitForElement(el, ".st-header-label");

    setOnSortChange(() => latestCallback);
    await wait(50);

    const headerLabel = findSortableHeaderLabel(el);
    headerLabel.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await wait(50);

    expect(mountCallback).not.toHaveBeenCalled();
    expect(latestCallback).toHaveBeenCalledTimes(1);
  });
});
