import { createElement, createRef, useEffect, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { SimpleTable } from "../index";
import type { HeaderRendererProps, ReactHeaderObject, TableAPI } from "../index";

/**
 * Regression: sort/filter icon refresh must not tear down a React headerRenderer
 * subtree. Core currently re-runs the renderer by discarding the portal host and
 * clearing `.st-header-label` innerHTML, which remounts the component and wipes
 * local state (open popovers, toggled icons, media playback, etc.).
 */

const STATE_ATTR = "data-st-test-header-clicks";
const TOGGLE_ATTR = "data-st-test-header-toggle";

let mountCount = 0;

function StatefulHeader({ header, components }: HeaderRendererProps) {
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    mountCount += 1;
  }, []);

  return createElement(
    "span",
    {
      className: "stateful-custom-head",
      [STATE_ATTR]: String(clicks),
    },
    header.label,
    createElement(
      "button",
      {
        type: "button",
        [TOGGLE_ATTR]: "true",
        onClick: (event: { stopPropagation: () => void }) => {
          event.stopPropagation();
          setClicks((n) => n + 1);
        },
      },
      "toggle",
    ),
    components?.sortIcon,
    components?.filterIcon,
    components?.labelContent,
  );
}

const rows = [
  { id: 1, name: "Alice", score: 10 },
  { id: 2, name: "Bob", score: 20 },
];

let container: HTMLDivElement | null = null;
let root: Root | null = null;

afterEach(() => {
  root?.unmount();
  root = null;
  container?.remove();
  container = null;
  mountCount = 0;
});

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitFor(predicate: () => boolean, timeoutMs = 3000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (predicate()) return;
    await wait(20);
  }
  throw new Error("Timed out waiting for condition");
}

function mount(node: React.ReactElement): HTMLDivElement {
  const host = document.createElement("div");
  document.body.appendChild(host);
  container = host;
  root = createRoot(host);
  root.render(node);
  return host;
}

function findHeaderLabel(host: HTMLElement, labelText: string): HTMLElement {
  const labels = Array.from(host.querySelectorAll<HTMLElement>(".st-header-label"));
  const label = labels.find((el) => el.textContent?.includes(labelText));
  if (!label) throw new Error(`${labelText} header label not found`);
  return label;
}

function readStatefulHeader(host: HTMLElement): HTMLElement {
  const el = host.querySelector<HTMLElement>(".stateful-custom-head");
  if (!el) throw new Error("Stateful header not found");
  return el;
}

async function setLocalHeaderState(host: HTMLElement): Promise<void> {
  await waitFor(() => host.querySelector(".stateful-custom-head") !== null);
  expect(mountCount).toBe(1);

  const toggle = host.querySelector<HTMLButtonElement>(`[${TOGGLE_ATTR}]`);
  expect(toggle).toBeTruthy();
  toggle!.click();
  await waitFor(() => readStatefulHeader(host).getAttribute(STATE_ATTR) === "1");
}

describe("SimpleTable (React adapter) — headerRenderer state across sort/filter", () => {
  it("preserves React header state when the column sort toggles", async () => {
    const headers: ReactHeaderObject[] = [
      { accessor: "name", label: "Name", width: 120, type: "string" },
      {
        accessor: "score",
        label: "Score",
        width: 140,
        type: "number",
        sortable: true,
        headerRenderer: StatefulHeader,
      },
    ];

    const host = mount(
      createElement(SimpleTable, {
        defaultHeaders: headers,
        rows,
        getRowId: (p: { row: unknown }) => String((p.row as { id?: number })?.id),
        height: "250px",
        theme: "light",
      }),
    );

    await setLocalHeaderState(host);

    const headerLabel = findHeaderLabel(host, "Score");
    headerLabel.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    // Sort icon only exists for the active sort column; its appearance proves
    // the icon-refresh path ran (the path that currently remounts the header).
    await waitFor(
      () =>
        host.querySelector('.stateful-custom-head .st-icon-container[aria-label*="Sort"]') !== null,
    );
    await wait(50);

    // Sort icon refresh must update slots in place — not remount the React tree.
    expect(mountCount).toBe(1);
    expect(readStatefulHeader(host).getAttribute(STATE_ATTR)).toBe("1");

    headerLabel.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await waitFor(
      () =>
        host
          .querySelector('.stateful-custom-head .st-icon-container[aria-label*="Sort"]')
          ?.getAttribute("aria-label")
          ?.includes("ascending") === true,
    );
    await wait(50);

    expect(mountCount).toBe(1);
    expect(readStatefulHeader(host).getAttribute(STATE_ATTR)).toBe("1");
  });

  it("preserves React header state when a filter is applied on the column", async () => {
    const tableRef = createRef<TableAPI>();
    const headers: ReactHeaderObject[] = [
      { accessor: "name", label: "Name", width: 120, type: "string" },
      {
        accessor: "score",
        label: "Score",
        width: 160,
        type: "number",
        filterable: true,
        headerRenderer: StatefulHeader,
      },
    ];

    const host = mount(
      createElement(SimpleTable, {
        ref: tableRef,
        defaultHeaders: headers,
        rows,
        getRowId: (p: { row: unknown }) => String((p.row as { id?: number })?.id),
        height: "250px",
        theme: "light",
      }),
    );

    await setLocalHeaderState(host);
    await waitFor(() => tableRef.current != null);

    await tableRef.current!.applyFilter({
      accessor: "score",
      operator: "equals",
      value: 10,
    });
    await wait(50);

    // Applying a filter refreshes header icons; the React subtree must stay mounted
    // with its local state intact.
    expect(mountCount).toBe(1);
    expect(readStatefulHeader(host).getAttribute(STATE_ATTR)).toBe("1");
  });
});

describe("SimpleTable (React adapter) — unstable defaultHeaders / rows refs", () => {
  it("preserves React header state when defaultHeaders is rebuilt with the same structure", async () => {
    function buildHeaders(): ReactHeaderObject[] {
      return [
        { accessor: "name", label: "Name", width: 120, type: "string" },
        {
          accessor: "score",
          label: "Score",
          width: 140,
          type: "number",
          sortable: true,
          // New function identity every rebuild — classic unstable columns.
          headerRenderer: (props: HeaderRendererProps) => createElement(StatefulHeader, props),
        },
      ];
    }

    function Harness() {
      const [tick, setTick] = useState(0);
      const [rowData, setRowData] = useState(rows);
      return createElement(
        "div",
        null,
        createElement(
          "button",
          {
            type: "button",
            "data-st-churn": "true",
            onClick: () => {
              setTick((n) => n + 1);
              setRowData((prev) => prev.map((r) => ({ ...r })));
            },
          },
          `churn ${tick}`,
        ),
        createElement(SimpleTable, {
          defaultHeaders: buildHeaders(),
          rows: rowData,
          getRowId: (p: { row: unknown }) => String((p.row as { id?: number })?.id),
          height: "250px",
          theme: "light",
        }),
      );
    }

    const host = mount(createElement(Harness));
    await setLocalHeaderState(host);

    const churn = host.querySelector<HTMLButtonElement>("[data-st-churn]");
    expect(churn).toBeTruthy();
    churn!.click();
    churn!.click();
    churn!.click();
    await wait(80);

    // Unstable column/row refs must not remount the header portal.
    expect(mountCount).toBe(1);
    expect(readStatefulHeader(host).getAttribute(STATE_ATTR)).toBe("1");
  });

  it("applies a real structural header change after unstable rebuilds", async () => {
    function Harness() {
      const [extra, setExtra] = useState(false);
      const headers: ReactHeaderObject[] = [
        { accessor: "name", label: "Name", width: 120, type: "string" },
        {
          accessor: "score",
          label: "Score",
          width: 140,
          type: "number",
          headerRenderer: StatefulHeader,
        },
        ...(extra
          ? [{ accessor: "extra", label: "Extra Col", width: 100, type: "string" as const }]
          : []),
      ];
      return createElement(
        "div",
        null,
        createElement(
          "button",
          {
            type: "button",
            "data-st-add-col": "true",
            onClick: () => setExtra(true),
          },
          "add column",
        ),
        createElement(SimpleTable, {
          defaultHeaders: headers.map((h) => ({ ...h })),
          rows: rows.map((r) => ({ ...r, extra: "x" })),
          getRowId: (p: { row: unknown }) => String((p.row as { id?: number })?.id),
          height: "250px",
          theme: "light",
        }),
      );
    }

    const host = mount(createElement(Harness));
    await waitFor(() => host.querySelector(".stateful-custom-head") !== null);
    expect(host.querySelector('[data-accessor="extra"]')).toBeNull();

    host.querySelector<HTMLButtonElement>("[data-st-add-col]")!.click();
    await waitFor(() => host.querySelector('[data-accessor="extra"]') !== null);
  });
});
