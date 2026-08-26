import { afterEach, describe, expect, it } from "vitest";
import { SimpleTableVanilla } from "../index";
import type { ColumnDef } from "../types/ColumnDef";
import type CellRendererProps from "../types/CellRendererProps";
import type HeaderRendererProps from "../types/HeaderRendererProps";

/**
 * Header and body cells stay mounted across column updates. These cases check
 * that reused nodes still follow tooltip, formatters, filter, sort, align,
 * type, and other column fields after a columns change.
 */

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitFor(predicate: () => boolean, timeoutMs = 3000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (predicate()) return;
    await wait(20);
  }
  throw new Error("Timed out waiting for condition");
}

const rows = [
  { id: 1, artist: "Miles", song: "So What", score: 10, genre: "jazz", closed: "2024-01-15" },
  { id: 2, artist: "Bill", song: "Waltz", score: 20, genre: "jazz", closed: "2023-06-01" },
];

const getRowId = (p: { row: unknown }) => String((p.row as { id?: number })?.id);

function headerCell(root: HTMLElement, accessor: string): HTMLElement | null {
  return root.querySelector<HTMLElement>(`.st-header-cell[data-accessor="${accessor}"]`);
}

function headerLabelText(root: HTMLElement, accessor: string): string {
  return (headerCell(root, accessor)?.querySelector(".st-header-label")?.textContent ?? "").trim();
}

function bodyTexts(root: HTMLElement, accessor: string): string[] {
  return Array.from(root.querySelectorAll<HTMLElement>(`.st-cell[data-accessor="${accessor}"]`)).map(
    (el) => (el.textContent ?? "").trim(),
  );
}

function bodyTextsVisual(root: HTMLElement, accessor: string): string[] {
  return Array.from(root.querySelectorAll<HTMLElement>(`.st-cell[data-accessor="${accessor}"]`))
    .sort((a, b) => {
      const topA = parseFloat(a.style.top || "0");
      const topB = parseFloat(b.style.top || "0");
      if (topA !== topB) return topA - topB;
      return Number(a.getAttribute("data-row-index") ?? 0) - Number(b.getAttribute("data-row-index") ?? 0);
    })
    .map((el) => (el.textContent ?? "").trim());
}

function filterIcon(root: HTMLElement, accessor: string): HTMLElement | null {
  return (
    headerCell(root, accessor)?.querySelector<HTMLElement>('.st-icon-container[aria-label^="Filter"]') ??
    null
  );
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

async function showHeaderTooltip(root: HTMLElement, accessor: string): Promise<string> {
  const labelText = headerCell(root, accessor)?.querySelector(".st-header-label-text") as
    | HTMLElement
    | undefined;
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

function editorRow(root: HTMLElement, accessor: string): HTMLElement | null {
  return root.querySelector<HTMLElement>(`.st-header-checkbox-item[data-accessor="${accessor}"]`);
}

function mountTable(
  columns: ColumnDef[],
  extras?: {
    columnReordering?: boolean;
    enableColumnEditor?: boolean;
    enableColumnEditorInitOpen?: boolean;
  },
) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const table = new SimpleTableVanilla(container, {
    columns,
    rows,
    getRowId,
    height: "250px",
    theme: "light",
    animations: { enabled: false },
    columnReordering: extras?.columnReordering,
    enableColumnEditor: extras?.enableColumnEditor,
    enableColumnEditorInitOpen: extras?.enableColumnEditorInitOpen,
  });
  table.mount();
  return { table, container };
}

const mounted: ReturnType<typeof mountTable>[] = [];

afterEach(() => {
  for (const entry of mounted.splice(0)) {
    entry.table.destroy();
    entry.container.remove();
  }
});

describe("column prop reuse — tooltip", () => {
  it("shows a new header tooltip after the column tooltip changes", async () => {
    const columns: ColumnDef[] = [
      { accessor: "artist", label: "Artist", width: 140, type: "string", tooltip: "Old tip" },
      { accessor: "song", label: "Song", width: 140, type: "string" },
    ];
    const { table, container } = mountTable(columns);
    mounted.push({ table, container });

    await waitFor(() => headerLabelText(container, "artist") === "Artist");
    expect(await showHeaderTooltip(container, "artist")).toBe("Old tip");

    table.update({
      columns: [
        { accessor: "artist", label: "Artist", width: 140, type: "string", tooltip: "New tip" },
        { accessor: "song", label: "Song", width: 140, type: "string" },
      ],
    });

    await waitFor(() => headerLabelText(container, "artist") === "Artist");
    expect(await showHeaderTooltip(container, "artist")).toBe("New tip");
  });

  it("shows a tooltip after tooltip is added to an existing column", async () => {
    const columns: ColumnDef[] = [
      { accessor: "artist", label: "Artist", width: 140, type: "string" },
      { accessor: "song", label: "Song", width: 140, type: "string" },
    ];
    const { table, container } = mountTable(columns);
    mounted.push({ table, container });

    await waitFor(() => headerLabelText(container, "artist") === "Artist");
    expect(await showHeaderTooltip(container, "artist")).toBe("");

    table.update({
      columns: [
        { accessor: "artist", label: "Artist", width: 140, type: "string", tooltip: "Added tip" },
        { accessor: "song", label: "Song", width: 140, type: "string" },
      ],
    });

    await waitFor(() => headerLabelText(container, "artist") === "Artist");
    expect(await showHeaderTooltip(container, "artist")).toBe("Added tip");
  });
});

describe("column prop reuse — valueFormatter and cellRenderer", () => {
  it("repaints cells when valueFormatter changes", async () => {
    const columns: ColumnDef[] = [
      {
        accessor: "score",
        label: "Score",
        width: 80,
        type: "number",
        valueFormatter: ({ value }) => `$${value}`,
      },
      { accessor: "artist", label: "Artist", width: 140, type: "string" },
    ];
    const { table, container } = mountTable(columns);
    mounted.push({ table, container });

    await waitFor(() => bodyTexts(container, "score").includes("$10"));

    table.update({
      columns: [
        {
          accessor: "score",
          label: "Score",
          width: 80,
          type: "number",
          valueFormatter: ({ value }) => `€${value}`,
        },
        { accessor: "artist", label: "Artist", width: 140, type: "string" },
      ],
    });

    await waitFor(() => headerLabelText(container, "score") === "Score");
    expect(bodyTexts(container, "score")).toContain("€10");
    expect(bodyTexts(container, "score")).not.toContain("$10");
  });

  it("repaints cells when cellRenderer changes", async () => {
    const firstRenderer = ({ value }: CellRendererProps) => {
      const el = document.createElement("span");
      el.className = "st-test-cell-a";
      el.textContent = `A:${value}`;
      return el;
    };
    const secondRenderer = ({ value }: CellRendererProps) => {
      const el = document.createElement("span");
      el.className = "st-test-cell-b";
      el.textContent = `B:${value}`;
      return el;
    };

    const columns: ColumnDef[] = [
      {
        accessor: "artist",
        label: "Artist",
        width: 140,
        type: "string",
        cellRenderer: firstRenderer,
      },
      { accessor: "song", label: "Song", width: 140, type: "string" },
    ];
    const { table, container } = mountTable(columns);
    mounted.push({ table, container });

    await waitFor(() => container.querySelector(".st-test-cell-a") !== null);
    expect(container.querySelector(".st-test-cell-b")).toBeNull();

    table.update({
      columns: [
        {
          accessor: "artist",
          label: "Artist",
          width: 140,
          type: "string",
          cellRenderer: secondRenderer,
        },
        { accessor: "song", label: "Song", width: 140, type: "string" },
      ],
    });

    await waitFor(() => headerLabelText(container, "artist") === "Artist");
    expect(container.querySelector(".st-test-cell-b")?.textContent).toBe("B:Miles");
    expect(container.querySelector(".st-test-cell-a")).toBeNull();
  });
});

describe("column prop reuse — filterable and enumOptions", () => {
  it("adds a filter icon when filterable is turned on", async () => {
    const columns: ColumnDef[] = [
      { accessor: "artist", label: "Artist", width: 140, type: "string" },
      { accessor: "song", label: "Song", width: 140, type: "string" },
    ];
    const { table, container } = mountTable(columns);
    mounted.push({ table, container });

    await waitFor(() => headerLabelText(container, "artist") === "Artist");
    expect(filterIcon(container, "artist")).toBeNull();

    table.update({
      columns: [
        { accessor: "artist", label: "Artist", width: 140, type: "string", filterable: true },
        { accessor: "song", label: "Song", width: 140, type: "string" },
      ],
    });

    await waitFor(() => headerLabelText(container, "artist") === "Artist");
    expect(filterIcon(container, "artist")).not.toBeNull();
  });

  it("removes the filter icon when filterable is turned off", async () => {
    const columns: ColumnDef[] = [
      { accessor: "artist", label: "Artist", width: 140, type: "string", filterable: true },
      { accessor: "song", label: "Song", width: 140, type: "string" },
    ];
    const { table, container } = mountTable(columns);
    mounted.push({ table, container });

    await waitFor(() => filterIcon(container, "artist") !== null);

    table.update({
      columns: [
        { accessor: "artist", label: "Artist", width: 140, type: "string" },
        { accessor: "song", label: "Song", width: 140, type: "string" },
      ],
    });

    await waitFor(() => headerLabelText(container, "artist") === "Artist");
    expect(filterIcon(container, "artist")).toBeNull();
  });

  it("shows new enum option labels in the filter menu after enumOptions change", async () => {
    const columns: ColumnDef[] = [
      {
        accessor: "genre",
        label: "Genre",
        width: 120,
        type: "enum",
        filterable: true,
        enumOptions: [
          { label: "Jazz", value: "jazz" },
          { label: "Rock", value: "rock" },
        ],
      },
      { accessor: "artist", label: "Artist", width: 140, type: "string" },
    ];
    const { table, container } = mountTable(columns);
    mounted.push({ table, container });

    await waitFor(() => filterIcon(container, "genre") !== null);
    filterIcon(container, "genre")!.click();
    await waitFor(() => enumOptionLabels().includes("Jazz"));
    expect(enumOptionLabels()).toEqual(expect.arrayContaining(["Jazz", "Rock"]));
    filterIcon(container, "genre")!.click();

    table.update({
      columns: [
        {
          accessor: "genre",
          label: "Genre",
          width: 120,
          type: "enum",
          filterable: true,
          enumOptions: [
            { label: "재즈", value: "jazz" },
            { label: "록", value: "rock" },
          ],
        },
        { accessor: "artist", label: "Artist", width: 140, type: "string" },
      ],
    });

    await waitFor(() => headerLabelText(container, "genre") === "Genre");
    filterIcon(container, "genre")!.click();
    await wait(50);
    expect(enumOptionLabels()).toEqual(expect.arrayContaining(["재즈", "록"]));
    expect(enumOptionLabels()).not.toEqual(expect.arrayContaining(["Jazz"]));
  });

  it("limits filter operators after filterOperators change", async () => {
    const columns: ColumnDef[] = [
      { accessor: "artist", label: "Artist", width: 140, type: "string", filterable: true },
      { accessor: "song", label: "Song", width: 140, type: "string" },
    ];
    const { table, container } = mountTable(columns);
    mounted.push({ table, container });

    await waitFor(() => filterIcon(container, "artist") !== null);
    filterIcon(container, "artist")!.click();
    await waitFor(() => document.querySelector(".st-custom-select-trigger") !== null);
    (document.querySelector(".st-custom-select-trigger") as HTMLElement).click();
    await wait(50);
    const before = Array.from(document.querySelectorAll(".st-custom-select-option")).map(
      (el) => el.textContent ?? "",
    );
    expect(before.some((text) => text.toLowerCase().includes("contains"))).toBe(true);
    filterIcon(container, "artist")!.click();

    table.update({
      columns: [
        {
          accessor: "artist",
          label: "Artist",
          width: 140,
          type: "string",
          filterable: true,
          filterOperators: ["equals"],
        },
        { accessor: "song", label: "Song", width: 140, type: "string" },
      ],
    });

    await waitFor(() => headerLabelText(container, "artist") === "Artist");
    filterIcon(container, "artist")!.click();
    await waitFor(() => document.querySelector(".st-custom-select-trigger") !== null);
    (document.querySelector(".st-custom-select-trigger") as HTMLElement).click();
    await wait(50);
    const after = Array.from(document.querySelectorAll(".st-custom-select-option")).map(
      (el) => el.textContent ?? "",
    );
    expect(after.some((text) => text.toLowerCase().includes("equals"))).toBe(true);
    expect(after.some((text) => text.toLowerCase().includes("contains"))).toBe(false);
  });
});

describe("column prop reuse — sortable, align, type, headerRenderer", () => {
  it("sorts after sortable is turned on", async () => {
    const columns: ColumnDef[] = [
      { accessor: "artist", label: "Artist", width: 140, type: "string" },
      { accessor: "song", label: "Song", width: 140, type: "string" },
    ];
    const { table, container } = mountTable(columns);
    mounted.push({ table, container });

    await waitFor(() => bodyTextsVisual(container, "artist")[0] === "Miles");
    expect(headerCell(container, "artist")?.classList.contains("clickable")).toBe(false);

    table.update({
      columns: [
        { accessor: "artist", label: "Artist", width: 140, type: "string", sortable: true },
        { accessor: "song", label: "Song", width: 140, type: "string" },
      ],
    });

    await waitFor(() => headerLabelText(container, "artist") === "Artist");
    expect(headerCell(container, "artist")?.classList.contains("clickable")).toBe(true);
    (headerCell(container, "artist")?.querySelector(".st-header-label") as HTMLElement | null)?.click();
    await waitFor(() => bodyTextsVisual(container, "artist")[0] === "Bill");
  });

  it("realigns the header label when align changes", async () => {
    const columns: ColumnDef[] = [
      { accessor: "artist", label: "Artist", width: 140, type: "string", align: "left" },
      { accessor: "song", label: "Song", width: 140, type: "string" },
    ];
    const { table, container } = mountTable(columns);
    mounted.push({ table, container });

    await waitFor(() => headerLabelText(container, "artist") === "Artist");
    expect(
      headerCell(container, "artist")?.querySelector(".st-header-label-text")?.classList.contains(
        "right-aligned",
      ),
    ).toBe(false);

    table.update({
      columns: [
        { accessor: "artist", label: "Artist", width: 140, type: "string", align: "right" },
        { accessor: "song", label: "Song", width: 140, type: "string" },
      ],
    });

    await waitFor(() => headerLabelText(container, "artist") === "Artist");
    expect(
      headerCell(container, "artist")?.querySelector(".st-header-label-text")?.classList.contains(
        "right-aligned",
      ),
    ).toBe(true);
  });

  it("formats cells when type changes to date", async () => {
    const columns: ColumnDef[] = [
      { accessor: "closed", label: "Closed", width: 140, type: "string" },
      { accessor: "artist", label: "Artist", width: 140, type: "string" },
    ];
    const { table, container } = mountTable(columns);
    mounted.push({ table, container });

    await waitFor(() => bodyTexts(container, "closed").includes("2024-01-15"));

    table.update({
      columns: [
        { accessor: "closed", label: "Closed", width: 140, type: "date" },
        { accessor: "artist", label: "Artist", width: 140, type: "string" },
      ],
    });

    await waitFor(() => headerLabelText(container, "closed") === "Closed");
    expect(bodyTexts(container, "closed")).not.toContain("2024-01-15");
  });

  it("renders a custom header after headerRenderer is added", async () => {
    const headerRenderer = ({ header }: HeaderRendererProps) => {
      const el = document.createElement("span");
      el.className = "st-test-custom-head";
      el.textContent = String(header.label);
      return el;
    };
    const columns: ColumnDef[] = [
      { accessor: "artist", label: "Artist", width: 140, type: "string" },
      { accessor: "song", label: "Song", width: 140, type: "string" },
    ];
    const { table, container } = mountTable(columns);
    mounted.push({ table, container });

    await waitFor(() => headerLabelText(container, "artist") === "Artist");
    expect(container.querySelector(".st-test-custom-head")).toBeNull();

    table.update({
      columns: [
        { accessor: "artist", label: "Artist", width: 140, type: "string", headerRenderer },
        { accessor: "song", label: "Song", width: 140, type: "string" },
      ],
    });

    await waitFor(() => headerLabelText(container, "artist") === "Artist");
    expect(container.querySelector(".st-test-custom-head")?.textContent).toBe("Artist");
  });
});

describe("column prop reuse — editor essential, reorder, cellClass", () => {
  it("disables the editor checkbox when essential is turned on", async () => {
    const columns: ColumnDef[] = [
      { accessor: "artist", label: "Artist", width: 140, type: "string" },
      { accessor: "song", label: "Song", width: 140, type: "string" },
    ];
    const { table, container } = mountTable(columns, {
      enableColumnEditor: true,
      enableColumnEditorInitOpen: true,
    });
    mounted.push({ table, container });

    await waitFor(() => editorRow(container, "artist") !== null);
    expect(editorRow(container, "artist")?.querySelector(".st-checkbox-disabled")).toBeNull();

    table.update({
      columns: [
        { accessor: "artist", label: "Artist", width: 140, type: "string", essential: true },
        { accessor: "song", label: "Song", width: 140, type: "string" },
      ],
    });

    await waitFor(() => headerLabelText(container, "artist") === "Artist");
    expect(editorRow(container, "artist")?.querySelector(".st-checkbox-disabled")).not.toBeNull();
  });

  it("stops the header from being draggable after disableReorder is turned on", async () => {
    const columns: ColumnDef[] = [
      { accessor: "artist", label: "Artist", width: 140, type: "string" },
      { accessor: "song", label: "Song", width: 140, type: "string" },
    ];
    const { table, container } = mountTable(columns, { columnReordering: true });
    mounted.push({ table, container });

    await waitFor(() => headerLabelText(container, "artist") === "Artist");
    expect(
      headerCell(container, "artist")?.querySelector(".st-header-label")?.getAttribute("draggable"),
    ).toBe("true");

    table.update({
      columns: [
        { accessor: "artist", label: "Artist", width: 140, type: "string", disableReorder: true },
        { accessor: "song", label: "Song", width: 140, type: "string" },
      ],
    });

    await waitFor(() => headerLabelText(container, "artist") === "Artist");
    expect(
      headerCell(container, "artist")?.querySelector(".st-header-label")?.getAttribute("draggable"),
    ).not.toBe("true");
  });

  it("applies a new cellClass to body cells", async () => {
    const columns: ColumnDef[] = [
      { accessor: "artist", label: "Artist", width: 140, type: "string", cellClass: "st-test-class-a" },
      { accessor: "song", label: "Song", width: 140, type: "string" },
    ];
    const { table, container } = mountTable(columns);
    mounted.push({ table, container });

    await waitFor(() => container.querySelector(".st-test-class-a") !== null);

    table.update({
      columns: [
        { accessor: "artist", label: "Artist", width: 140, type: "string", cellClass: "st-test-class-b" },
        { accessor: "song", label: "Song", width: 140, type: "string" },
      ],
    });

    await waitFor(() => headerLabelText(container, "artist") === "Artist");
    expect(container.querySelector(".st-test-class-b")).not.toBeNull();
    expect(container.querySelector(".st-test-class-a")).toBeNull();
  });
});
