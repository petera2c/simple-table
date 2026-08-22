import { createElement, useState, type Dispatch, type SetStateAction } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { SimpleTable } from "../index";
import type { OnRowGroupExpandProps, ReactColumnDef } from "../index";

// Lazy expand: setLoading(true), write children onto the row, setLoading(false)
// without waiting. The flatten cache must not keep the loading skeleton after
// loading flips off on the same map size.

let container: HTMLDivElement | null = null;
let root: Root | null = null;

afterEach(() => {
  root?.unmount();
  root = null;
  container?.remove();
  container = null;
  setRowsRef.current = null;
});

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitFor(predicate: () => boolean, timeoutMs = 4000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (predicate()) return;
    await wait(20);
  }
  throw new Error("Timed out waiting for condition");
}

async function waitForElement(
  scope: HTMLElement,
  selector: string,
  timeoutMs = 4000,
): Promise<HTMLElement> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const el = scope.querySelector<HTMLElement>(selector);
    if (el) return el;
    await wait(20);
  }
  throw new Error(`Timed out waiting for element: ${selector}`);
}

const headers: ReactColumnDef[] = [
  { accessor: "name", label: "Name", width: 200, type: "string", expandable: true },
  { accessor: "count", label: "Count", width: 80, type: "number" },
];

interface ChildRow {
  id: string;
  name: string;
  count: number;
}

interface ParentRow {
  id: string;
  name: string;
  count: number;
  children?: ChildRow[];
}

const CHILD: ChildRow = { id: "child-1", name: "Backend", count: 3 };

const setRowsRef: { current: Dispatch<SetStateAction<ParentRow[]>> | null } = { current: null };

function findExpandIcon(host: HTMLElement, name: string): HTMLElement | null {
  const nameCell = Array.from(
    host.querySelectorAll<HTMLElement>('.st-cell[data-accessor="name"]'),
  ).find((cell) => cell.textContent?.includes(name));
  if (!nameCell) return null;
  const icon = nameCell.querySelector(".st-expand-icon-container");
  if (!icon || icon.getAttribute("aria-hidden") === "true") return null;
  return icon as HTMLElement;
}

describe("SimpleTable (React adapter) — lazy expand loading cache", () => {
  it("shows loaded children after setLoading(true) then rows then setLoading(false)", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    container = host;
    root = createRoot(host);

    const Harness = () => {
      const [rows, setRows] = useState<ParentRow[]>(() => [
        { id: "country-1", name: "Argentina", count: 10 },
      ]);
      setRowsRef.current = setRows;

      return createElement(SimpleTable, {
        columns: headers,
        rows,
        height: "280px",
        theme: "light",
        rowGrouping: ["children"],
        expandAll: false,
        getRowId: (p) => String((p.row as ParentRow).id),
        onRowGroupExpand: async ({ isExpanded, setLoading }: OnRowGroupExpandProps) => {
          if (!isExpanded) return;
          setLoading(true);
          await wait(40);
          setRowsRef.current?.((prev) => [{ ...prev[0], children: [CHILD] }]);
          setLoading(false);
        },
      });
    };

    root.render(createElement(Harness));
    await waitForElement(host, ".st-body-container .st-cell");

    const icon = findExpandIcon(host, "Argentina");
    expect(icon).toBeTruthy();
    icon!.click();

    await waitFor(() => host.textContent?.includes("Backend") ?? false);
    expect(host.querySelectorAll('.st-cell[data-row-id*="loading-skeleton"]').length).toBe(0);
  });
});
