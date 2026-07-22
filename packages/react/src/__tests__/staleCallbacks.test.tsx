import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SimpleTable } from "../index";
import type { ReactHeaderObject, SimpleTableReactProps } from "../index";

const headers: ReactHeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: 120, type: "string", sortable: true },
];

const rows = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

let container: HTMLDivElement | null = null;
let root: Root | null = null;

afterEach(() => {
  root?.unmount();
  root = null;
  container?.remove();
  container = null;
});

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Poll the DOM until `selector` matches, or fail after `timeoutMs`. */
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

function renderTable(host: HTMLDivElement, props: Partial<SimpleTableReactProps>): void {
  root!.render(
    createElement(SimpleTable, {
      defaultHeaders: headers,
      rows,
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
      theme: "light",
      ...props,
    }),
  );
}

/** Find the header label element for the sortable "Name" column. */
function findSortableHeaderLabel(host: HTMLElement): HTMLElement {
  const labels = Array.from(host.querySelectorAll<HTMLElement>(".st-header-label"));
  const label = labels.find((el) => el.textContent?.includes("Name"));
  if (!label) throw new Error("Sortable header label not found");
  return label;
}

// Callback props must not be frozen at mount time: when the parent re-renders
// with a new callback closure (e.g. one capturing fresh state), a subsequent
// sort must invoke the LATEST callback, not the one captured when the vanilla
// table instance was constructed.
describe("SimpleTable (React adapter) — callback props stay fresh across re-renders", () => {
  it("invokes the latest onSortChange closure after a re-render, not the mount-time one", async () => {
    const mountCallback = vi.fn();
    const latestCallback = vi.fn();

    const host = document.createElement("div");
    document.body.appendChild(host);
    container = host;
    root = createRoot(host);

    renderTable(host, { onSortChange: mountCallback });
    await waitForElement(host, ".st-header-label");

    // Re-render with a new callback reference, as a parent component does on
    // every render when state captured by the closure changes.
    renderTable(host, { onSortChange: latestCallback });
    await wait(50);

    const headerLabel = findSortableHeaderLabel(host);
    headerLabel.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await wait(50);

    expect(mountCallback).not.toHaveBeenCalled();
    expect(latestCallback).toHaveBeenCalledTimes(1);
  });
});
