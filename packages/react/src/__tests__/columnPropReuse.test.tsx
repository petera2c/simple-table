import { createElement, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { SimpleTable } from "../index";
import type { ReactColumnDef } from "../index";

/**
 * React column definition updates must reach reused headers and cells for
 * tooltips, formatters, renderers, and filter settings, not only labels.
 */

let container: HTMLDivElement | null = null;
let root: Root | null = null;

afterEach(() => {
  root?.unmount();
  root = null;
  container?.remove();
  container = null;
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

const rows = [
  { id: 1, artist: "Miles", song: "So What", score: 10, genre: "jazz" },
  { id: 2, artist: "Bill", song: "Waltz", score: 20, genre: "jazz" },
];

function bodyTexts(host: HTMLElement, accessor: string): string[] {
  return Array.from(host.querySelectorAll<HTMLElement>(`.st-cell[data-accessor="${accessor}"]`)).map(
    (el) => (el.textContent ?? "").trim(),
  );
}

function headerLabelText(host: HTMLElement, accessor: string): string {
  const cell = host.querySelector<HTMLElement>(`.st-header-cell[data-accessor="${accessor}"]`);
  return (cell?.querySelector(".st-header-label")?.textContent ?? "").trim();
}

function filterIcon(host: HTMLElement, accessor: string): HTMLElement | null {
  const cell = host.querySelector<HTMLElement>(`.st-header-cell[data-accessor="${accessor}"]`);
  return cell?.querySelector<HTMLElement>('.st-icon-container[aria-label^="Filter"]') ?? null;
}

function enumOptionLabels(): string[] {
  return Array.from(document.querySelectorAll(".st-enum-option-label"))
    .map((el) => (el.textContent ?? "").trim())
    .filter((text) => text.length > 0 && text.toLowerCase() !== "select all");
}

function giveLabelSize(el: HTMLElement): void {
  el.getBoundingClientRect = () =>
    ({
      width: 80,
      height: 20,
      top: 0,
      left: 0,
      bottom: 20,
      right: 80,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }) as DOMRect;
}

async function showHeaderTooltip(host: HTMLElement, accessor: string): Promise<string> {
  const cell = host.querySelector<HTMLElement>(`.st-header-cell[data-accessor="${accessor}"]`);
  const labelText = cell?.querySelector(".st-header-label-text") as HTMLElement | undefined;
  if (!labelText) return "";
  // jsdom reports empty boxes. The tooltip only appears when the label has size.
  giveLabelSize(labelText);
  labelText.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
  await wait(600);
  const tooltip = document.querySelector(".st-tooltip");
  const text = (tooltip?.textContent ?? "").trim();
  labelText.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
  await wait(50);
  return text;
}

describe("SimpleTable (React adapter) — column prop reuse", () => {
  it("updates header tooltips when the column tooltip changes", async () => {
    function Harness() {
      const [tip, setTip] = useState("Old tip");
      const columns: ReactColumnDef[] = [
        { accessor: "artist", label: "Artist", width: 140, type: "string", tooltip: tip },
        { accessor: "song", label: "Song", width: 140, type: "string" },
      ];
      return createElement(
        "div",
        null,
        createElement(
          "button",
          { type: "button", "data-st-change": "true", onClick: () => setTip("New tip") },
          "change",
        ),
        createElement(SimpleTable, {
          columns,
          rows,
          getRowId: (p: { row: unknown }) => String((p.row as { id?: number })?.id),
          height: "250px",
          theme: "light",
          animations: { enabled: false },
        }),
      );
    }

    const host = mount(createElement(Harness));
    await waitFor(() => headerLabelText(host, "artist") === "Artist");
    expect(await showHeaderTooltip(host, "artist")).toBe("Old tip");

    host.querySelector<HTMLButtonElement>("[data-st-change]")!.click();
    await waitFor(() => headerLabelText(host, "artist") === "Artist");
    expect(await showHeaderTooltip(host, "artist")).toBe("New tip");
  });

  it("adds a filter icon when filterable is turned on", async () => {
    function Harness() {
      const [filterable, setFilterable] = useState(false);
      const columns: ReactColumnDef[] = [
        { accessor: "artist", label: "Artist", width: 140, type: "string", filterable },
        { accessor: "song", label: "Song", width: 140, type: "string" },
      ];
      return createElement(
        "div",
        null,
        createElement(
          "button",
          { type: "button", "data-st-change": "true", onClick: () => setFilterable(true) },
          "change",
        ),
        createElement(SimpleTable, {
          columns,
          rows,
          getRowId: (p: { row: unknown }) => String((p.row as { id?: number })?.id),
          height: "250px",
          theme: "light",
          animations: { enabled: false },
        }),
      );
    }

    const host = mount(createElement(Harness));
    await waitFor(() => headerLabelText(host, "artist") === "Artist");
    expect(filterIcon(host, "artist")).toBeNull();

    host.querySelector<HTMLButtonElement>("[data-st-change]")!.click();
    await waitFor(() => headerLabelText(host, "artist") === "Artist");
    expect(filterIcon(host, "artist")).not.toBeNull();
  });

  it("shows new enum option labels after enumOptions change", async () => {
    function Harness() {
      const [korean, setKorean] = useState(false);
      const columns: ReactColumnDef[] = [
        {
          accessor: "genre",
          label: "Genre",
          width: 120,
          type: "enum",
          filterable: true,
          enumOptions: korean
            ? [
                { label: "재즈", value: "jazz" },
                { label: "록", value: "rock" },
              ]
            : [
                { label: "Jazz", value: "jazz" },
                { label: "Rock", value: "rock" },
              ],
        },
        { accessor: "artist", label: "Artist", width: 140, type: "string" },
      ];
      return createElement(
        "div",
        null,
        createElement(
          "button",
          { type: "button", "data-st-change": "true", onClick: () => setKorean(true) },
          "change",
        ),
        createElement(SimpleTable, {
          columns,
          rows,
          getRowId: (p: { row: unknown }) => String((p.row as { id?: number })?.id),
          height: "250px",
          theme: "light",
          animations: { enabled: false },
        }),
      );
    }

    const host = mount(createElement(Harness));
    await waitFor(() => filterIcon(host, "genre") !== null);
    filterIcon(host, "genre")!.click();
    await waitFor(() => enumOptionLabels().includes("Jazz"));
    filterIcon(host, "genre")!.click();

    host.querySelector<HTMLButtonElement>("[data-st-change]")!.click();
    await waitFor(() => headerLabelText(host, "genre") === "Genre");
    filterIcon(host, "genre")!.click();
    await wait(50);
    expect(enumOptionLabels()).toEqual(expect.arrayContaining(["재즈", "록"]));
  });

  it("repaints cells when valueFormatter changes", async () => {
    function Harness() {
      const [euro, setEuro] = useState(false);
      const columns: ReactColumnDef[] = [
        {
          accessor: "score",
          label: "Score",
          width: 80,
          type: "number",
          valueFormatter: ({ value }) => (euro ? `€${value}` : `$${value}`),
        },
        { accessor: "artist", label: "Artist", width: 140, type: "string" },
      ];
      return createElement(
        "div",
        null,
        createElement(
          "button",
          { type: "button", "data-st-change": "true", onClick: () => setEuro(true) },
          "change",
        ),
        createElement(SimpleTable, {
          columns,
          rows,
          getRowId: (p: { row: unknown }) => String((p.row as { id?: number })?.id),
          height: "250px",
          theme: "light",
          animations: { enabled: false },
        }),
      );
    }

    const host = mount(createElement(Harness));
    await waitFor(() => bodyTexts(host, "score").includes("$10"));

    host.querySelector<HTMLButtonElement>("[data-st-change]")!.click();
    await waitFor(() => headerLabelText(host, "score") === "Score");
    expect(bodyTexts(host, "score")).toContain("€10");
  });

  it("repaints cells when cellRenderer changes", async () => {
    function Harness() {
      const [variant, setVariant] = useState<"a" | "b">("a");
      const columns: ReactColumnDef[] = [
        {
          accessor: "artist",
          label: "Artist",
          width: 140,
          type: "string",
          cellRenderer: ({ value }) =>
            createElement("span", { className: `st-test-cell-${variant}` }, `${variant}:${value}`),
        },
        { accessor: "song", label: "Song", width: 140, type: "string" },
      ];
      return createElement(
        "div",
        null,
        createElement(
          "button",
          { type: "button", "data-st-change": "true", onClick: () => setVariant("b") },
          "change",
        ),
        createElement(SimpleTable, {
          columns,
          rows,
          getRowId: (p: { row: unknown }) => String((p.row as { id?: number })?.id),
          height: "250px",
          theme: "light",
          animations: { enabled: false },
        }),
      );
    }

    const host = mount(createElement(Harness));
    await waitFor(() => host.querySelector(".st-test-cell-a") !== null);

    host.querySelector<HTMLButtonElement>("[data-st-change]")!.click();
    await waitFor(() => host.querySelector(".st-test-cell-b") !== null);
    expect(host.querySelector(".st-test-cell-b")?.textContent).toBe("b:Miles");
  });

  it("renders a custom header after headerRenderer is added", async () => {
    function Harness() {
      const [custom, setCustom] = useState(false);
      const columns: ReactColumnDef[] = [
        {
          accessor: "artist",
          label: "Artist",
          width: 140,
          type: "string",
          headerRenderer: custom
            ? ({ header }) =>
                createElement("span", { className: "st-test-custom-head" }, String(header.label))
            : undefined,
        },
        { accessor: "song", label: "Song", width: 140, type: "string" },
      ];
      return createElement(
        "div",
        null,
        createElement(
          "button",
          { type: "button", "data-st-change": "true", onClick: () => setCustom(true) },
          "change",
        ),
        createElement(SimpleTable, {
          columns,
          rows,
          getRowId: (p: { row: unknown }) => String((p.row as { id?: number })?.id),
          height: "250px",
          theme: "light",
          animations: { enabled: false },
        }),
      );
    }

    const host = mount(createElement(Harness));
    await waitFor(() => headerLabelText(host, "artist") === "Artist");
    expect(host.querySelector(".st-test-custom-head")).toBeNull();

    host.querySelector<HTMLButtonElement>("[data-st-change]")!.click();
    await waitFor(() => host.querySelector(".st-test-custom-head") !== null);
    expect(host.querySelector(".st-test-custom-head")?.textContent).toBe("Artist");
  });
});
