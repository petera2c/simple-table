import { createElement, createRef, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { SimpleTable } from "../index";
import type { HeaderRendererProps, ReactColumnDef, TableAPI } from "../index";

/**
 * Custom React headers keep one portal host per column. Unpinning the last
 * pinned column removes that strip; pinning it again must still show the
 * header. Label-only column updates must also reach a header that is already
 * on the page.
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

function CustomArtistHeader({ header }: HeaderRendererProps) {
  return createElement("span", { className: "custom-head" }, header.label);
}

const rows = [
  { id: 1, artist: "Miles", song: "So What" },
  { id: 2, artist: "Bill", song: "Waltz" },
];

function headerLabelText(host: HTMLElement, accessor: string): string {
  const cell = host.querySelector<HTMLElement>(`.st-header-cell[data-accessor="${accessor}"]`);
  return (cell?.querySelector(".st-header-label")?.textContent ?? "").trim();
}

describe("SimpleTable (React adapter) — header reuse", () => {
  it("updates a custom header when only the column label changes", async () => {
    function Harness() {
      const [artistLabel, setArtistLabel] = useState("Artist");
      const columns: ReactColumnDef[] = [
        {
          accessor: "artist",
          label: artistLabel,
          width: 140,
          type: "string",
          headerRenderer: CustomArtistHeader,
        },
        { accessor: "song", label: "Song", width: 140, type: "string" },
      ];
      return createElement(
        "div",
        null,
        createElement(
          "button",
          {
            type: "button",
            "data-st-translate": "true",
            onClick: () => setArtistLabel("Translated"),
          },
          "translate",
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

    host.querySelector<HTMLButtonElement>("[data-st-translate]")!.click();
    await waitFor(() => headerLabelText(host, "artist") === "Translated");
  });

  it("keeps a custom header after unpinning the last pinned column and pinning it again", async () => {
    const tableRef = createRef<TableAPI>();
    const columns: ReactColumnDef[] = [
      {
        accessor: "artist",
        label: "Artist",
        width: 140,
        type: "string",
        pinned: "left",
        headerRenderer: CustomArtistHeader,
      },
      { accessor: "song", label: "Song", width: 140, type: "string" },
    ];

    const host = mount(
      createElement(SimpleTable, {
        ref: tableRef,
        columns,
        rows,
        getRowId: (p: { row: unknown }) => String((p.row as { id?: number })?.id),
        height: "250px",
        theme: "light",
        animations: { enabled: false },
      }),
    );

    await waitFor(() => tableRef.current != null);
    await waitFor(() => host.querySelector(".st-header-pinned-left .custom-head") !== null);
    expect(host.querySelector(".st-header-pinned-left .custom-head")?.textContent).toBe("Artist");

    await tableRef.current!.applyPinnedState({
      left: [],
      main: ["artist", "song"],
      right: [],
    });
    await waitFor(() => host.querySelector(".st-header-pinned-left") === null);
    await waitFor(() => headerLabelText(host, "artist").includes("Artist"));

    await tableRef.current!.applyPinnedState({
      left: ["artist"],
      main: ["song"],
      right: [],
    });
    await waitFor(() => host.querySelector(".st-header-pinned-left") !== null);
    await waitFor(() => Boolean(host.querySelector(".st-header-pinned-left .custom-head")?.textContent));

    expect(host.querySelector(".st-header-pinned-left .custom-head")?.textContent).toBe("Artist");
  });
});
