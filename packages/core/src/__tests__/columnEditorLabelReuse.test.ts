import { afterEach, describe, expect, it } from "vitest";
import { SimpleTableVanilla } from "../index";
import type { ColumnDef } from "../types/ColumnDef";
import type { ColumnEditorConfig } from "../types/ColumnEditorConfig";
import type { ColumnEditorRowRenderer } from "../types/ColumnEditorRowRendererProps";

/**
 * Column editor rows stay mounted across column updates. These cases check
 * that reused rows still show new labels after a columns change.
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
  { id: 1, artist: "Miles", song: "So What" },
  { id: 2, artist: "Bill", song: "Waltz" },
];

const getRowId = (p: { row: unknown }) => String((p.row as { id?: number })?.id);

function headerLabelText(root: HTMLElement, accessor: string): string {
  const cell = root.querySelector<HTMLElement>(`.st-header-cell[data-accessor="${accessor}"]`);
  return (cell?.querySelector(".st-header-label")?.textContent ?? "").trim();
}

function editorLabelText(root: HTMLElement, accessor: string): string {
  const row = root.querySelector<HTMLElement>(
    `.st-header-checkbox-item[data-accessor="${accessor}"]`,
  );
  return (row?.querySelector(".st-column-label-container")?.textContent ?? "").trim();
}

function editorCustomLabelText(root: HTMLElement, accessor: string): string {
  const row = root.querySelector<HTMLElement>(
    `.st-header-checkbox-item[data-accessor="${accessor}"]`,
  );
  return (row?.querySelector(".st-test-editor-custom-label")?.textContent ?? "").trim();
}

function mountTable(
  columns: ColumnDef[],
  extras?: {
    enableColumnEditorInitOpen?: boolean;
    columnEditorConfig?: ColumnEditorConfig;
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
    enableColumnEditor: true,
    enableColumnEditorInitOpen: extras?.enableColumnEditorInitOpen ?? true,
    columnEditorConfig: extras?.columnEditorConfig,
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

describe("column editor reuse — column label updates", () => {
  it("repaints a default editor label when the column label changes", async () => {
    const columns: ColumnDef[] = [
      { accessor: "artist", label: "Artist", width: 140, type: "string" },
      { accessor: "song", label: "Song", width: 140, type: "string" },
    ];
    const { table, container } = mountTable(columns);
    mounted.push({ table, container });

    await waitFor(() => headerLabelText(container, "artist") === "Artist");
    await waitFor(() => editorLabelText(container, "artist") === "Artist");
    expect(editorLabelText(container, "song")).toBe("Song");

    table.update({
      columns: [
        { accessor: "artist", label: "Translated", width: 140, type: "string" },
        { accessor: "song", label: "Song", width: 140, type: "string" },
      ],
    });

    await waitFor(() => headerLabelText(container, "artist") === "Translated");
    expect(editorLabelText(container, "artist")).toBe("Translated");
    expect(editorLabelText(container, "song")).toBe("Song");
  });

  it("repaints a pinned column's editor label when the column label changes", async () => {
    const columns: ColumnDef[] = [
      { accessor: "artist", label: "Artist", width: 140, type: "string", pinned: "left" },
      { accessor: "song", label: "Song", width: 140, type: "string" },
    ];
    const { table, container } = mountTable(columns);
    mounted.push({ table, container });

    await waitFor(() => editorLabelText(container, "artist") === "Artist");
    const artistRow = container.querySelector<HTMLElement>(
      '.st-header-checkbox-item[data-accessor="artist"]',
    );
    expect(artistRow?.closest<HTMLElement>(".st-column-editor-list")?.dataset.panelSection).toBe(
      "left",
    );

    table.update({
      columns: [
        { accessor: "artist", label: "Translated", width: 140, type: "string", pinned: "left" },
        { accessor: "song", label: "Song", width: 140, type: "string" },
      ],
    });

    await waitFor(() => headerLabelText(container, "artist") === "Translated");
    expect(editorLabelText(container, "artist")).toBe("Translated");
    expect(
      container
        .querySelector<HTMLElement>('.st-header-checkbox-item[data-accessor="artist"]')
        ?.closest<HTMLElement>(".st-column-editor-list")?.dataset.panelSection,
    ).toBe("left");
  });

  it("repaints nested group and child editor labels when those labels change", async () => {
    const columns: ColumnDef[] = [
      {
        accessor: "info",
        label: "Info",
        width: 280,
        children: [
          { accessor: "artist", label: "Artist", width: 140, type: "string" },
          { accessor: "song", label: "Song", width: 140, type: "string" },
        ],
      },
    ];
    const { table, container } = mountTable(columns);
    mounted.push({ table, container });

    await waitFor(() => editorLabelText(container, "info") === "Info");
    await waitFor(() => editorLabelText(container, "artist") === "Artist");

    table.update({
      columns: [
        {
          accessor: "info",
          label: "Details",
          width: 280,
          children: [
            { accessor: "artist", label: "Translated", width: 140, type: "string" },
            { accessor: "song", label: "Song", width: 140, type: "string" },
          ],
        },
      ],
    });

    await waitFor(() => headerLabelText(container, "artist") === "Translated");
    expect(editorLabelText(container, "info")).toBe("Details");
    expect(editorLabelText(container, "artist")).toBe("Translated");
    expect(editorLabelText(container, "song")).toBe("Song");
  });

  it("repaints a custom rowRenderer label when the column label changes", async () => {
    const rowRenderer: ColumnEditorRowRenderer = ({ header, components }) => {
      const wrap = document.createElement("div");
      const customLabel = document.createElement("span");
      customLabel.className = "st-test-editor-custom-label";
      customLabel.textContent = String(header.label);
      wrap.appendChild(customLabel);
      if (components.checkbox instanceof HTMLElement) {
        wrap.appendChild(components.checkbox);
      }
      return wrap;
    };

    const columns: ColumnDef[] = [
      { accessor: "artist", label: "Artist", width: 140, type: "string" },
      { accessor: "song", label: "Song", width: 140, type: "string" },
    ];
    const { table, container } = mountTable(columns, {
      columnEditorConfig: { rowRenderer },
    });
    mounted.push({ table, container });

    await waitFor(() => editorCustomLabelText(container, "artist") === "Artist");

    table.update({
      columns: [
        { accessor: "artist", label: "Translated", width: 140, type: "string" },
        { accessor: "song", label: "Song", width: 140, type: "string" },
      ],
      columnEditorConfig: { rowRenderer },
    });

    await waitFor(() => headerLabelText(container, "artist") === "Translated");
    expect(editorCustomLabelText(container, "artist")).toBe("Translated");
    expect(editorCustomLabelText(container, "song")).toBe("Song");
  });

  it("shows updated editor labels after the panel is opened following a columns change", async () => {
    const columns: ColumnDef[] = [
      { accessor: "artist", label: "Artist", width: 140, type: "string" },
      { accessor: "song", label: "Song", width: 140, type: "string" },
    ];
    const { table, container } = mountTable(columns, { enableColumnEditorInitOpen: false });
    mounted.push({ table, container });

    await waitFor(() => editorLabelText(container, "artist") === "Artist");
    expect(container.querySelector(".st-column-editor-popout.open")).toBeNull();

    table.update({
      columns: [
        { accessor: "artist", label: "Translated", width: 140, type: "string" },
        { accessor: "song", label: "Song", width: 140, type: "string" },
      ],
    });

    await waitFor(() => headerLabelText(container, "artist") === "Translated");
    table.getAPI().toggleColumnEditor(true);
    await waitFor(() => container.querySelector(".st-column-editor-popout.open") !== null);
    expect(editorLabelText(container, "artist")).toBe("Translated");
  });
});
