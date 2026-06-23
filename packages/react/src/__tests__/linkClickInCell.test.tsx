import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SimpleTable } from "../index";
import type { CellRendererProps, ReactHeaderObject } from "../index";

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

function mount(node: React.ReactElement): HTMLDivElement {
  const host = document.createElement("div");
  document.body.appendChild(host);
  container = host;
  root = createRoot(host);
  root.render(node);
  return host;
}

// Regression: with `selectableCells` enabled, the cell's mousedown handler used
// to `preventDefault()` and start a cell selection unconditionally — even when
// the press originated on an interactive element (an <a> link) rendered inside
// the cell. That intercepts the link: it cancels the native default (the href
// navigation) and forces a body re-render that swallows the click before it can
// reach the anchor. A link inside a cell should remain clickable.
describe("SimpleTable (React adapter) — links inside selectable cells", () => {
  it("does not intercept a click on an <a> rendered inside a selectable cell", async () => {
    const onLinkClick = vi.fn();

    function LinkCell(_props: CellRendererProps) {
      return createElement(
        "a",
        {
          className: "cell-link",
          href: "https://example.com/details",
          onClick: () => onLinkClick(),
        },
        "Open",
      );
    }

    const headers: ReactHeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200, type: "string", cellRenderer: LinkCell },
    ];

    const host = mount(
      createElement(SimpleTable, {
        defaultHeaders: headers,
        rows,
        getRowId: (p: { row: unknown }) => String((p.row as { id?: number })?.id),
        height: "250px",
        theme: "light",
        selectableCells: true,
      }),
    );

    const link = await waitForElement(host, "a.cell-link");

    // Simulate the press half of a click on the link. The selection handler is
    // attached to the containing cell, so the event bubbles up to it.
    const mousedown = new MouseEvent("mousedown", { bubbles: true, cancelable: true });
    link.dispatchEvent(mousedown);

    // The cell-selection handler must not cancel the link's native default
    // action (which is what carries the href navigation).
    expect(mousedown.defaultPrevented).toBe(false);

    // Pressing a link must not start a cell selection (which would re-render the
    // body and swallow the pending click).
    await wait(50);
    expect(host.querySelectorAll(".st-cell-selected, .st-cell-selected-first").length).toBe(0);

    // The link's own onClick (client-side routing) must still fire.
    link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    expect(onLinkClick).toHaveBeenCalledTimes(1);
  });
});
