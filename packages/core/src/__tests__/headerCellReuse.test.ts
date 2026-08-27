import { afterEach, describe, expect, it } from "vitest";
import { SimpleTableVanilla } from "../index";
import type { ColumnDef } from "../types/ColumnDef";
import type HeaderRendererProps from "../types/HeaderRendererProps";
import { MOBILE_BREAKPOINT_MEDIUM } from "../consts/column-constraints";

/**
 * Header cells are reused by accessor instead of being rebuilt on every
 * columns update. These cases check that reused cells still show new labels
 * and that a pinned header is not left empty after the pinned strip is
 * removed and created again.
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

function bodyArtistTexts(root: HTMLElement): string[] {
  return Array.from(root.querySelectorAll<HTMLElement>('.st-cell[data-accessor="artist"]')).map(
    (el) => (el.textContent ?? "").trim(),
  );
}

function mountTable(columns: ColumnDef[]) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const table = new SimpleTableVanilla(container, {
    columns,
    rows,
    getRowId,
    height: "250px",
    theme: "light",
    animations: { enabled: false },
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

describe("header cells reuse — column label updates", () => {
  it("repaints a default header when the column label changes", async () => {
    const columns: ColumnDef[] = [
      { accessor: "artist", label: "Artist", width: 140, type: "string" },
      { accessor: "song", label: "Song", width: 140, type: "string" },
    ];
    const { table, container } = mountTable(columns);
    mounted.push({ table, container });

    await waitFor(() => headerLabelText(container, "artist") === "Artist");
    await waitFor(() => bodyArtistTexts(container).includes("Miles"));

    table.update({
      columns: [
        { accessor: "artist", label: "Translated", width: 140, type: "string" },
        { accessor: "song", label: "Song", width: 140, type: "string" },
      ],
    });

    await waitFor(() => headerLabelText(container, "artist") === "Translated");
    expect(headerLabelText(container, "song")).toBe("Song");
    expect(bodyArtistTexts(container)).toContain("Miles");
  });

  it("repaints a reused header when the accessor is not a valid CSS id", async () => {
    const accessor = "__pivot:Q1\u00012024\u0001sales";
    const labelOf = (root: HTMLElement) => {
      const cell = Array.from(root.querySelectorAll<HTMLElement>(".st-header-cell[data-accessor]")).find(
        (el) => el.getAttribute("data-accessor") === accessor,
      );
      return (cell?.querySelector(".st-header-label")?.textContent ?? "").trim();
    };
    const columns: ColumnDef[] = [
      { accessor, label: "Q1 2024", width: 140, type: "number", sortable: true },
    ];
    const { table, container } = mountTable(columns);
    mounted.push({ table, container });

    await waitFor(() => labelOf(container) === "Q1 2024");

    table.update({
      columns: [{ accessor, label: "Sales", width: 140, type: "number", sortable: true }],
    });

    await waitFor(() => labelOf(container) === "Sales");
  });

  it("repaints a pinned default header when the column label changes", async () => {
    const columns: ColumnDef[] = [
      { accessor: "artist", label: "Artist", width: 140, type: "string", pinned: "left" },
      { accessor: "song", label: "Song", width: 140, type: "string" },
    ];
    const { table, container } = mountTable(columns);
    mounted.push({ table, container });

    await waitFor(() => headerLabelText(container, "artist") === "Artist");
    expect(container.querySelector(".st-header-pinned-left")).not.toBeNull();

    table.update({
      columns: [
        { accessor: "artist", label: "Translated", width: 140, type: "string", pinned: "left" },
        { accessor: "song", label: "Song", width: 140, type: "string" },
      ],
    });

    await waitFor(() => headerLabelText(container, "artist") === "Translated");
    const pinned = container.querySelector(".st-header-pinned-left");
    expect(pinned?.querySelector('[data-accessor="artist"] .st-header-label')?.textContent).toBe(
      "Translated",
    );
  });

  it("repaints a custom headerRenderer when the column label changes", async () => {
    const headerRenderer = ({ header }: HeaderRendererProps) => {
      const el = document.createElement("span");
      el.className = "custom-head";
      el.textContent = String(header.label);
      return el;
    };
    const columns: ColumnDef[] = [
      {
        accessor: "artist",
        label: "Artist",
        width: 140,
        type: "string",
        headerRenderer,
      },
      { accessor: "song", label: "Song", width: 140, type: "string" },
    ];
    const { table, container } = mountTable(columns);
    mounted.push({ table, container });

    await waitFor(() => headerLabelText(container, "artist") === "Artist");

    table.update({
      columns: [
        {
          accessor: "artist",
          label: "Translated",
          width: 140,
          type: "string",
          headerRenderer,
        },
        { accessor: "song", label: "Song", width: 140, type: "string" },
      ],
    });

    await waitFor(() => headerLabelText(container, "artist") === "Translated");
  });
});

describe("header cells reuse — unpin then pin with a custom header", () => {
  it("keeps custom header content after the pinned strip is removed and created again", async () => {
    // Same host returned on every call, matching framework adapters that reuse
    // one portal node per column.
    const headerHost = document.createElement("span");
    headerHost.className = "custom-head";
    headerHost.textContent = "Custom Artist";
    const headerRenderer = () => headerHost;

    const columns: ColumnDef[] = [
      {
        accessor: "artist",
        label: "Artist",
        width: 140,
        type: "string",
        pinned: "left",
        headerRenderer,
      },
      { accessor: "song", label: "Song", width: 140, type: "string" },
    ];
    const { table, container } = mountTable(columns);
    mounted.push({ table, container });

    await waitFor(() => headerLabelText(container, "artist").includes("Custom Artist"));
    expect(container.querySelector(".st-header-pinned-left .custom-head")?.textContent).toBe(
      "Custom Artist",
    );

    await table.getAPI().applyPinnedState({
      left: [],
      main: ["artist", "song"],
      right: [],
    });
    await waitFor(() => container.querySelector(".st-header-pinned-left") === null);
    await waitFor(() => headerLabelText(container, "artist").includes("Custom Artist"));

    await table.getAPI().applyPinnedState({
      left: ["artist"],
      main: ["song"],
      right: [],
    });
    await waitFor(() => container.querySelector(".st-header-pinned-left") !== null);
    await waitFor(() =>
      Boolean(container.querySelector(".st-header-pinned-left .custom-head")?.textContent),
    );

    expect(container.querySelector(".st-header-pinned-left .custom-head")?.textContent).toBe(
      "Custom Artist",
    );
    expect(headerLabelText(container, "artist")).toContain("Custom Artist");
  });

  it("keeps custom header content after the parent shrinks below the pin breakpoint and grows again", async () => {
    const headerHost = document.createElement("span");
    headerHost.className = "custom-head";
    headerHost.textContent = "Custom Artist";
    const headerRenderer = () => headerHost;

    const columns: ColumnDef[] = [
      {
        accessor: "artist",
        label: "Artist",
        width: 140,
        type: "string",
        pinned: "left",
        headerRenderer,
      },
      { accessor: "song", label: "Song", width: 140, type: "string" },
    ];

    let parentWidth = 900;
    const parent = document.createElement("div");
    Object.defineProperty(parent, "clientWidth", {
      configurable: true,
      get: () => parentWidth,
    });
    document.body.appendChild(parent);

    const table = new SimpleTableVanilla(parent, {
      columns,
      rows,
      getRowId,
      height: "250px",
      theme: "light",
      animations: { enabled: false },
    });
    table.mount();
    mounted.push({ table, container: parent });

    const syncPinToParentWidth = async () => {
      const pinArtist = parent.clientWidth >= MOBILE_BREAKPOINT_MEDIUM;
      await table.getAPI().applyPinnedState(
        pinArtist
          ? { left: ["artist"], main: ["song"], right: [] }
          : { left: [], main: ["artist", "song"], right: [] },
      );
    };

    await waitFor(() => headerLabelText(parent, "artist").includes("Custom Artist"));
    expect(parent.clientWidth).toBeGreaterThanOrEqual(MOBILE_BREAKPOINT_MEDIUM);
    expect(parent.querySelector(".st-header-pinned-left .custom-head")?.textContent).toBe(
      "Custom Artist",
    );

    parentWidth = 400;
    expect(parent.clientWidth).toBeLessThan(MOBILE_BREAKPOINT_MEDIUM);
    await syncPinToParentWidth();
    await waitFor(() => parent.querySelector(".st-header-pinned-left") === null);
    await waitFor(() => headerLabelText(parent, "artist").includes("Custom Artist"));

    parentWidth = 900;
    expect(parent.clientWidth).toBeGreaterThanOrEqual(MOBILE_BREAKPOINT_MEDIUM);
    await syncPinToParentWidth();
    await waitFor(() => parent.querySelector(".st-header-pinned-left") !== null);
    await waitFor(() => Boolean(parent.querySelector(".st-header-pinned-left .custom-head")?.textContent));

    expect(parent.querySelector(".st-header-pinned-left .custom-head")?.textContent).toBe(
      "Custom Artist",
    );
  });
});
