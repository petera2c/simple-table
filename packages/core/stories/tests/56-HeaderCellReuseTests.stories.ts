/**
 * HEADER CELL REUSE
 *
 * Two cases for header cells that stay mounted across updates:
 * 1. Switching column labels (e.g. language) must rewrite the visible header name.
 * 2. Unpinning the last pinned column, then pinning it again, must keep a custom
 *    header's content (the renderer returns the same DOM node each time).
 * 3. Shrinking the table's parent below the tablet breakpoint unpins; growing it
 *    again re-pins and must keep the custom header filled.
 *
 * Open the stories and use the buttons, or run play in the Interactions panel.
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import { ColumnDef, SimpleTableVanilla } from "../../src/index";
import type { HeaderRenderer } from "../../src/types/HeaderRendererProps";
import { MOBILE_BREAKPOINT_MEDIUM } from "../../src/consts/column-constraints";
import { waitForTable, waitUntil } from "./testUtils";
import { addControlPanel, addParagraph, renderVanillaTable } from "../utils";

const meta: Meta = {
  title: "Tests/56 - Header Cell Reuse",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Header cells keep their DOM across column updates. Switching labels and unpinning then pinning must still show the current header content.",
      },
    },
  },
};

export default meta;

type TrackRow = {
  id: number;
  artist: string;
  album: string;
  song: string;
};

type TableInstance = SimpleTableVanilla<TrackRow>;

const LABEL_TABLE_REF_KEY = "__storybook_header_label_reuse_table_ref";
const PIN_TABLE_REF_KEY = "__storybook_header_pin_reuse_table_ref";
const RESIZE_TABLE_REF_KEY = "__storybook_header_resize_reuse_table_ref";
const RESIZE_PARENT_KEY = "__storybook_header_resize_parent";

const getLabelTable = (): TableInstance => {
  const table = (globalThis as unknown as Record<string, TableInstance | undefined>)[
    LABEL_TABLE_REF_KEY
  ];
  if (!table) throw new Error("Table ref not set (run render first)");
  return table;
};

const getPinTable = (): TableInstance => {
  const table = (globalThis as unknown as Record<string, TableInstance | undefined>)[
    PIN_TABLE_REF_KEY
  ];
  if (!table) throw new Error("Table ref not set (run render first)");
  return table;
};

const getResizeTable = (): TableInstance => {
  const table = (globalThis as unknown as Record<string, TableInstance | undefined>)[
    RESIZE_TABLE_REF_KEY
  ];
  if (!table) throw new Error("Table ref not set (run render first)");
  return table;
};

const getResizeParent = (): HTMLElement => {
  const parent = (globalThis as unknown as Record<string, HTMLElement | undefined>)[RESIZE_PARENT_KEY];
  if (!parent) throw new Error("Resize parent not set (run render first)");
  return parent;
};

const rows = (): TrackRow[] => [
  { id: 1, artist: "Miles Davis", album: "Kind of Blue", song: "So What" },
  { id: 2, artist: "Bill Evans", album: "Waltz for Debby", song: "Waltz for Debby" },
  { id: 3, artist: "John Coltrane", album: "Giant Steps", song: "Giant Steps" },
];

const english = { artist: "Artist", album: "Album", song: "Song" };
const translated = { artist: "Artista", album: "Álbum", song: "Canción" };

const headerLabelText = (root: HTMLElement, accessor: string): string => {
  const cell = root.querySelector<HTMLElement>(`.st-header-cell[data-accessor="${accessor}"]`);
  return (cell?.querySelector(".st-header-label")?.textContent ?? "").trim();
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const createStableCustomHeaderHost = (): HTMLSpanElement => {
  const host = document.createElement("span");
  host.className = "st-test-custom-head";
  host.style.display = "inline-flex";
  host.style.alignItems = "center";
  host.style.padding = "2px 10px";
  host.style.borderRadius = "999px";
  host.style.background = "#e8f0fe";
  host.style.color = "#174ea6";
  host.style.fontWeight = "600";
  host.style.whiteSpace = "nowrap";
  return host;
};

const defaultColumns = (
  labels: typeof english,
  headerRenderer?: HeaderRenderer<TrackRow>,
): ColumnDef<TrackRow>[] => [
  {
    accessor: "artist",
    label: labels.artist,
    width: 180,
    type: "string",
    pinned: "left",
    ...(headerRenderer ? { headerRenderer } : {}),
  },
  { accessor: "album", label: labels.album, width: 180, type: "string" },
  { accessor: "song", label: labels.song, width: 180, type: "string" },
];

const setStatus = (status: HTMLElement, text: string) => {
  status.textContent = text;
};

const NARROW_PARENT_WIDTH = 400;
const WIDE_PARENT_WIDTH = 900;

const syncPinToParentWidth = (table: TableInstance, parent: HTMLElement): void => {
  const pinArtist = parent.clientWidth >= MOBILE_BREAKPOINT_MEDIUM;
  const left = table.getAPI().getPinnedState().left;
  const isPinned = left.includes("artist");
  if (pinArtist === isPinned) return;
  void table.getAPI().applyPinnedState(
    pinArtist
      ? { left: ["artist"], main: ["album", "song"], right: [] }
      : { left: [], main: ["artist", "album", "song"], right: [] },
  );
};

export const SwitchLanguageUpdatesHeaderLabels = {
  render: () => {
    const result = renderVanillaTable<TrackRow>(defaultColumns(english), rows(), {
      getRowId: (p) => String((p.row as TrackRow).id),
      height: "280px",
      animations: { enabled: false },
    });
    (globalThis as unknown as Record<string, TableInstance>)[LABEL_TABLE_REF_KEY] = result.table;
    result.h2.textContent = "Switch language — header labels must update";

    const status = addParagraph(
      result.wrapper,
      'Pinned "Artist" and "Album" should change to "Artista" and "Álbum". Body cells stay in English.',
      result.tableContainer,
    );

    let locale: "english" | "translated" = "english";
    addControlPanel(
      result.wrapper,
      [
        {
          heading: "Language",
          buttons: [
            {
              label: "Switch language",
              onClick: () => {
                locale = locale === "english" ? "translated" : "english";
                const labels = locale === "english" ? english : translated;
                result.table.update({ columns: defaultColumns(labels) });
                setStatus(
                  status,
                  `Headers should read: ${labels.artist}, ${labels.album}, ${labels.song}`,
                );
              },
            },
          ],
        },
      ],
      result.tableContainer,
    );

    return result.wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    await waitUntil(() => headerLabelText(canvasElement, "artist") === "Artist");
    expect(headerLabelText(canvasElement, "album")).toBe("Album");

    getLabelTable().update({ columns: defaultColumns(translated) });
    await waitUntil(() => headerLabelText(canvasElement, "artist") === "Artista");
    expect(headerLabelText(canvasElement, "album")).toBe("Álbum");
    expect(headerLabelText(canvasElement, "song")).toBe("Canción");
    expect(canvasElement.textContent).toContain("Miles Davis");
  },
};

export const UnpinThenPinKeepsCustomHeader = {
  render: () => {
    const headerHost = createStableCustomHeaderHost();
    const headerRenderer: HeaderRenderer<TrackRow> = ({ header }) => {
      headerHost.textContent = `Custom: ${header.label}`;
      return headerHost;
    };

    const result = renderVanillaTable<TrackRow>(defaultColumns(english, headerRenderer), rows(), {
      getRowId: (p) => String((p.row as TrackRow).id),
      height: "280px",
      animations: { enabled: false },
    });
    (globalThis as unknown as Record<string, TableInstance>)[PIN_TABLE_REF_KEY] = result.table;
    result.h2.textContent = "Unpin then pin — custom header must stay filled";

    const status = addParagraph(
      result.wrapper,
      'Artist is pinned left with a blue "Custom: Artist" pill. Unpin it (the left strip goes away), then pin it again. The pill must come back — an empty header is the bug.',
      result.tableContainer,
    );

    addControlPanel(
      result.wrapper,
      [
        {
          heading: "Pin",
          buttons: [
            {
              label: "Unpin Artist",
              onClick: () => {
                void result.table.getAPI().applyPinnedState({
                  left: [],
                  main: ["artist", "album", "song"],
                  right: [],
                });
                setStatus(status, "Artist is in the main section. Custom: Artist should still be visible.");
              },
            },
            {
              label: "Pin Artist left",
              onClick: () => {
                void result.table.getAPI().applyPinnedState({
                  left: ["artist"],
                  main: ["album", "song"],
                  right: [],
                });
                setStatus(
                  status,
                  "Artist is pinned left again. The blue Custom: Artist pill should still be in that strip.",
                );
              },
            },
          ],
        },
      ],
      result.tableContainer,
    );

    return result.wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    await waitUntil(
      () => canvasElement.querySelector(".st-header-pinned-left .st-test-custom-head") !== null,
    );
    expect(canvasElement.querySelector(".st-header-pinned-left .st-test-custom-head")?.textContent).toBe(
      "Custom: Artist",
    );

    await getPinTable().getAPI().applyPinnedState({
      left: [],
      main: ["artist", "album", "song"],
      right: [],
    });
    await waitUntil(() => canvasElement.querySelector(".st-header-pinned-left") === null);
    await waitUntil(() => headerLabelText(canvasElement, "artist").includes("Custom: Artist"));

    await sleep(400);

    await getPinTable().getAPI().applyPinnedState({
      left: ["artist"],
      main: ["album", "song"],
      right: [],
    });
    await waitUntil(() => canvasElement.querySelector(".st-header-pinned-left") !== null);
    await waitUntil(() =>
      Boolean(canvasElement.querySelector(".st-header-pinned-left .st-test-custom-head")?.textContent),
    );
    expect(canvasElement.querySelector(".st-header-pinned-left .st-test-custom-head")?.textContent).toBe(
      "Custom: Artist",
    );
  },
};

export const ParentResizeUnpinsThenRepinsCustomHeader = {
  render: () => {
    const headerHost = createStableCustomHeaderHost();
    const headerRenderer: HeaderRenderer<TrackRow> = ({ header }) => {
      headerHost.textContent = `Custom: ${header.label}`;
      return headerHost;
    };

    const result = renderVanillaTable<TrackRow>(defaultColumns(english, headerRenderer), rows(), {
      getRowId: (p) => String((p.row as TrackRow).id),
      height: "280px",
      animations: { enabled: false },
    });
    (globalThis as unknown as Record<string, TableInstance>)[RESIZE_TABLE_REF_KEY] = result.table;
    result.h2.textContent = "Parent width — unpin on narrow, keep custom header after growing";

    const parent = document.createElement("div");
    parent.className = "st-test-resize-parent";
    parent.style.width = "100%";
    parent.style.minWidth = "0";
    parent.style.border = "2px dashed #174ea6";
    parent.style.boxSizing = "border-box";
    parent.style.overflow = "auto";
    result.wrapper.insertBefore(parent, result.tableContainer);
    parent.appendChild(result.tableContainer);
    (globalThis as unknown as Record<string, HTMLElement>)[RESIZE_PARENT_KEY] = parent;

    const status = addParagraph(
      result.wrapper,
      `Artist pins when the dashed parent is at least ${MOBILE_BREAKPOINT_MEDIUM}px wide. Use the buttons, or shrink this Storybook pane. After it grows again, the blue Custom: Artist pill must still be in the left strip.`,
      parent,
    );

    const widthReadout = addParagraph(
      result.wrapper,
      `Parent width: ${WIDE_PARENT_WIDTH}px — pinning on`,
      parent,
    );

    const applyParentWidth = (widthPx: number) => {
      parent.style.width = `${widthPx}px`;
      const measured = parent.clientWidth;
      const pinningOn = measured >= MOBILE_BREAKPOINT_MEDIUM;
      widthReadout.textContent = `Parent width: ${measured}px — pinning ${pinningOn ? "on" : "off"}`;
      syncPinToParentWidth(result.table, parent);
      setStatus(
        status,
        pinningOn
          ? "Wide enough to pin. The left strip should show the blue Custom: Artist pill."
          : "Too narrow to pin. Artist should sit in the main section with Custom: Artist still visible.",
      );
    };

    addControlPanel(
      result.wrapper,
      [
        {
          heading: "Parent width",
          buttons: [
            {
              label: `Narrow parent (${NARROW_PARENT_WIDTH}px)`,
              onClick: () => applyParentWidth(NARROW_PARENT_WIDTH),
            },
            {
              label: `Wide parent (${WIDE_PARENT_WIDTH}px)`,
              onClick: () => applyParentWidth(WIDE_PARENT_WIDTH),
            },
          ],
        },
      ],
      parent,
    );

    const resizeObserver = new ResizeObserver(() => {
      const measured = parent.clientWidth;
      const pinningOn = measured >= MOBILE_BREAKPOINT_MEDIUM;
      widthReadout.textContent = `Parent width: ${measured}px — pinning ${pinningOn ? "on" : "off"}`;
      syncPinToParentWidth(result.table, parent);
    });
    resizeObserver.observe(parent);

    return result.wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const parent = getResizeParent();
    const table = getResizeTable();

    parent.style.width = `${WIDE_PARENT_WIDTH}px`;
    syncPinToParentWidth(table, parent);
    await waitUntil(
      () => canvasElement.querySelector(".st-header-pinned-left .st-test-custom-head") !== null,
    );
    expect(parent.clientWidth).toBeGreaterThanOrEqual(MOBILE_BREAKPOINT_MEDIUM);

    parent.style.width = `${NARROW_PARENT_WIDTH}px`;
    expect(parent.clientWidth).toBeLessThan(MOBILE_BREAKPOINT_MEDIUM);
    syncPinToParentWidth(table, parent);
    await waitUntil(() => canvasElement.querySelector(".st-header-pinned-left") === null);
    await waitUntil(() => headerLabelText(canvasElement, "artist").includes("Custom: Artist"));

    await sleep(400);

    parent.style.width = `${WIDE_PARENT_WIDTH}px`;
    expect(parent.clientWidth).toBeGreaterThanOrEqual(MOBILE_BREAKPOINT_MEDIUM);
    syncPinToParentWidth(table, parent);
    await waitUntil(() => canvasElement.querySelector(".st-header-pinned-left") !== null);
    await waitUntil(() =>
      Boolean(canvasElement.querySelector(".st-header-pinned-left .st-test-custom-head")?.textContent),
    );
    expect(canvasElement.querySelector(".st-header-pinned-left .st-test-custom-head")?.textContent).toBe(
      "Custom: Artist",
    );
  },
};

