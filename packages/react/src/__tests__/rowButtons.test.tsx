import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SimpleTable } from "../index";
import type { ReactHeaderObject } from "../index";
import type { RowButtonProps } from "simple-table-core";

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

// Regression: passing `rowButtons` whose entries return React elements (the
// natural React usage, e.g. `({ row }) => <button onClick={...}>Edit</button>`)
// renders nothing. The React adapter forwards `rowButtons` straight to the
// vanilla core without wrapping the renderers into DOM nodes, so the core's
// `buttonWrapper.appendChild(buttonElement)` receives a React element (a plain
// object, not a Node) and throws — an error that is swallowed by core's
// try/catch, leaving the row-button container empty.
describe("SimpleTable (React adapter) — rowButtons", () => {
  it("renders React-element rowButtons and fires their click handlers", async () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    const headers: ReactHeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200, type: "string" },
    ];

    const host = mount(
      createElement(SimpleTable, {
        defaultHeaders: headers,
        rows,
        getRowId: (p: { row: unknown }) => String((p.row as { id?: number })?.id),
        height: "250px",
        theme: "light",
        enableRowSelection: true,
        // Real-world React usage: render-prop functions returning JSX.
        rowButtons: [
          ({ row }: RowButtonProps) =>
            createElement(
              "button",
              { className: "edit-btn", onClick: () => onEdit(row) },
              "Edit",
            ),
          ({ row }: RowButtonProps) =>
            createElement(
              "button",
              { className: "delete-btn", onClick: () => onDelete(row) },
              "Delete",
            ),
        ],
      }),
    );

    // The buttons should be rendered inside the selection column.
    const editButton = await waitForElement(host, "button.edit-btn");
    const deleteButton = await waitForElement(host, "button.delete-btn");

    expect(editButton).toBeTruthy();
    expect(deleteButton).toBeTruthy();

    // And their React click handlers must fire.
    editButton.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    deleteButton.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
