import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { SimpleTable } from "../index";
import type { ReactColumnDef, SimpleTableReactProps } from "../index";

const headers: ReactColumnDef[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: 120, type: "string" },
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

/** Mount the React adapter and wait until the first body cell has rendered. */
async function mountTable(
  props: Partial<SimpleTableReactProps>,
): Promise<{ host: HTMLDivElement; firstCell: HTMLElement }> {
  const host = document.createElement("div");
  document.body.appendChild(host);
  container = host;

  root = createRoot(host);
  root.render(
    createElement(SimpleTable, {
      columns: headers,
      rows,
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
      theme: "light",
      ...props,
    }),
  );

  // The adapter mounts the vanilla table asynchronously (queueMicrotask + rAF),
  // so wait until a body cell has rendered.
  let firstCell: HTMLElement;
  try {
    firstCell = await waitForElement(host, ".st-body-container .st-cell");
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log("DEBUG innerHTML:\n", host.innerHTML.slice(0, 4000));
    throw e;
  }
  return { host, firstCell };
}

// "st-row-hovered" is the class the core toggles on every cell in a hovered
// row; the CSS rule `.st-cell.st-row-hovered { background-color:
// var(--st-hover-row-background-color) }` is what actually changes the color.
// Asserting on the class (rather than a computed color) keeps the test fast and
// independent of CSS loading, while still guarding the behaviour a user sees.
describe("SimpleTable (React adapter) — row hover styling", () => {
  it("applies the hover class to a row's cells on mouseenter when hoverRowBackground is enabled", async () => {
    const { host, firstCell } = await mountTable({ hoverRowBackground: true });

    firstCell.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    await wait(50);

    expect(host.querySelectorAll(".st-cell.st-row-hovered").length).toBeGreaterThan(0);
  });

  it("removes the hover class when the pointer leaves the row", async () => {
    const { host, firstCell } = await mountTable({ hoverRowBackground: true });

    firstCell.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    await wait(50);
    expect(host.querySelectorAll(".st-cell.st-row-hovered").length).toBeGreaterThan(0);

    firstCell.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
    await wait(50);
    expect(host.querySelectorAll(".st-cell.st-row-hovered").length).toBe(0);
  });

  it("does not apply the hover class when hoverRowBackground is disabled", async () => {
    const { host, firstCell } = await mountTable({ hoverRowBackground: false });

    firstCell.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    await wait(50);

    expect(host.querySelectorAll(".st-cell.st-row-hovered").length).toBe(0);
  });
});
