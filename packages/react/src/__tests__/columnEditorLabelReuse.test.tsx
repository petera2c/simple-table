import { createElement, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { SimpleTable } from "../index";
import type { ReactColumnDef } from "../index";

/**
 * React column definition updates must reach column editor rows that are
 * already on the page, not only the table headers.
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
  { id: 1, artist: "Miles", song: "So What" },
  { id: 2, artist: "Bill", song: "Waltz" },
];

function headerLabelText(host: HTMLElement, accessor: string): string {
  const cell = host.querySelector<HTMLElement>(`.st-header-cell[data-accessor="${accessor}"]`);
  return (cell?.querySelector(".st-header-label")?.textContent ?? "").trim();
}

function editorLabelText(host: HTMLElement, accessor: string): string {
  const row = host.querySelector<HTMLElement>(
    `.st-header-checkbox-item[data-accessor="${accessor}"]`,
  );
  return (row?.querySelector(".st-column-label-container")?.textContent ?? "").trim();
}

function editorToggleText(host: HTMLElement): string {
  return (host.querySelector(".st-column-editor-text")?.textContent ?? "").trim();
}

function editorSearchPlaceholder(host: HTMLElement): string {
  return (
    host.querySelector<HTMLInputElement>(".st-column-editor-popout input")?.placeholder ?? ""
  );
}

describe("SimpleTable (React adapter) — column editor label reuse", () => {
  it("updates column editor labels when only the column label changes", async () => {
    function Harness() {
      const [artistLabel, setArtistLabel] = useState("Artist");
      const columns: ReactColumnDef[] = [
        { accessor: "artist", label: artistLabel, width: 140, type: "string" },
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
          enableColumnEditor: true,
          enableColumnEditorInitOpen: true,
        }),
      );
    }

    const host = mount(createElement(Harness));
    await waitFor(() => headerLabelText(host, "artist") === "Artist");
    await waitFor(() => editorLabelText(host, "artist") === "Artist");

    host.querySelector<HTMLButtonElement>("[data-st-translate]")!.click();

    await waitFor(() => headerLabelText(host, "artist") === "Translated");
    expect(editorLabelText(host, "artist")).toBe("Translated");
    expect(editorLabelText(host, "song")).toBe("Song");
  });

  it("updates editor chrome when locale labels and columnEditorConfig change", async () => {
    const labels = {
      en: {
        name: "Artist",
        followers: "Followers",
        allColumns: "All columns",
        search: "Search columns",
      },
      ko: {
        name: "아티스트",
        followers: "팔로워",
        allColumns: "전체 컬럼",
        search: "컬럼 검색",
      },
    } as const;

    function Harness() {
      const [locale, setLocale] = useState<"en" | "ko">("en");
      const copy = labels[locale];
      const columns: ReactColumnDef[] = [
        { accessor: "artist", label: copy.name, width: 140, type: "string" },
        { accessor: "song", label: copy.followers, width: 140, type: "string" },
      ];
      return createElement(
        "div",
        null,
        createElement(
          "button",
          {
            type: "button",
            "data-st-translate": "true",
            onClick: () => setLocale((current) => (current === "en" ? "ko" : "en")),
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
          enableColumnEditor: true,
          enableColumnEditorInitOpen: true,
          columnEditorConfig: {
            text: copy.allColumns,
            searchPlaceholder: copy.search,
          },
        }),
      );
    }

    const host = mount(createElement(Harness));
    await waitFor(() => headerLabelText(host, "artist") === "Artist");
    await waitFor(() => editorLabelText(host, "artist") === "Artist");
    expect(editorToggleText(host)).toBe("All columns");
    expect(editorSearchPlaceholder(host)).toBe("Search columns");

    const editorRoot = host.querySelector(".st-column-editor");
    expect(editorRoot).toBeTruthy();

    host.querySelector<HTMLButtonElement>("[data-st-translate]")!.click();

    await waitFor(() => headerLabelText(host, "artist") === "아티스트");
    expect(editorLabelText(host, "artist")).toBe("아티스트");
    expect(editorLabelText(host, "song")).toBe("팔로워");
    expect(editorToggleText(host)).toBe("전체 컬럼");
    expect(editorSearchPlaceholder(host)).toBe("컬럼 검색");
    expect(host.querySelector(".st-column-editor")).toBe(editorRoot);
  });
});
