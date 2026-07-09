import { createElement, useEffect } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { SimpleTable } from "../index";
import type { HeaderRendererProps, ReactHeaderObject } from "../index";

/**
 * Simulates a Radix-style floating UI: content is appended to document.body and
 * must be removed when the header React subtree unmounts. If core refreshes the
 * header renderer without disposing the previous portal host, this effect never
 * cleans up and the floating node stays visible under a detached anchor.
 */
const FLOATING_ATTR = "data-st-test-floating-header";

function FloatingHeader({ header, components }: HeaderRendererProps) {
  useEffect(() => {
    const el = document.createElement("div");
    el.setAttribute(FLOATING_ATTR, "true");
    el.textContent = `floating:${String(header.label)}`;
    document.body.appendChild(el);
    return () => {
      el.remove();
    };
  }, [header.label]);

  return createElement(
    "span",
    { className: "custom-head" },
    header.label,
    components?.sortIcon,
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
  document.querySelectorAll(`[${FLOATING_ATTR}]`).forEach((el) => el.remove());
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

function findScoreHeaderLabel(host: HTMLElement): HTMLElement {
  const labels = Array.from(host.querySelectorAll<HTMLElement>(".st-header-label"));
  const label = labels.find((el) => el.textContent?.includes("Score"));
  if (!label) throw new Error("Score header label not found");
  return label;
}

describe("SimpleTable (React adapter) — headerRenderer portal cleanup on sort", () => {
  it("disposes the previous header portal so body-portaled floating UI unmounts on sort", async () => {
    const headers: ReactHeaderObject[] = [
      { accessor: "name", label: "Name", width: 120, type: "string" },
      {
        accessor: "score",
        label: "Score",
        width: 120,
        type: "number",
        isSortable: true,
        headerRenderer: FloatingHeader,
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

    await waitFor(() => host.querySelector(".custom-head") !== null);
    await waitFor(() => document.querySelectorAll(`[${FLOATING_ATTR}]`).length === 1);

    const headerLabel = findScoreHeaderLabel(host);

    // Sort toggles re-run headerRenderer in place (icon refresh). Each pass must
    // dispose the previous portal host before replacing label content; otherwise
    // the old React subtree stays mounted into a detached container and its
    // document.body floating UI never cleans up.
    headerLabel.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await waitFor(() => document.querySelectorAll(`[${FLOATING_ATTR}]`).length === 1);
    await wait(50);
    expect(document.querySelectorAll(`[${FLOATING_ATTR}]`)).toHaveLength(1);

    headerLabel.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await waitFor(() => document.querySelectorAll(`[${FLOATING_ATTR}]`).length === 1);
    await wait(50);
    expect(document.querySelectorAll(`[${FLOATING_ATTR}]`)).toHaveLength(1);

    headerLabel.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await waitFor(() => document.querySelectorAll(`[${FLOATING_ATTR}]`).length === 1);
    await wait(50);
    expect(document.querySelectorAll(`[${FLOATING_ATTR}]`)).toHaveLength(1);

    // Connected portal hosts only — no orphaned [data-st-portal-id] under a
    // detached previous header renderer container.
    const portalHosts = Array.from(document.querySelectorAll("[data-st-portal-id]"));
    const detachedPortalHosts = portalHosts.filter((el) => !el.isConnected);
    expect(detachedPortalHosts).toHaveLength(0);
  });
});
