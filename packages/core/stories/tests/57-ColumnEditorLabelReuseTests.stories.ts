/**
 * COLUMN EDITOR LABEL REUSE
 *
 * Column editor rows stay mounted across column updates. Switching column
 * labels (for example a language change) must rewrite the names in the editor,
 * not only in the table headers.
 *
 * Open the stories and use the buttons, or run play in the Interactions panel.
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import { ColumnDef, SimpleTableVanilla } from "../../src/index";
import { waitForTable, waitUntil } from "./testUtils";
import { addControlPanel, addParagraph, renderVanillaTable } from "../utils";

const meta: Meta = {
  title: "Tests/57 - Column Editor Label Reuse",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Column editor rows keep their DOM across column updates. Switching labels must still show the current column names in the editor.",
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

const LABEL_TABLE_REF_KEY = "__storybook_column_editor_label_reuse_table_ref";

const getLabelTable = (): TableInstance => {
  const table = (globalThis as unknown as Record<string, TableInstance | undefined>)[
    LABEL_TABLE_REF_KEY
  ];
  if (!table) throw new Error("Table ref not set (run render first)");
  return table;
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

const editorLabelText = (root: HTMLElement, accessor: string): string => {
  const row = root.querySelector<HTMLElement>(
    `.st-header-checkbox-item[data-accessor="${accessor}"]`,
  );
  return (row?.querySelector(".st-column-label-container")?.textContent ?? "").trim();
};

const defaultColumns = (labels: typeof english): ColumnDef<TrackRow>[] => [
  {
    accessor: "artist",
    label: labels.artist,
    width: 180,
    type: "string",
    pinned: "left",
  },
  { accessor: "album", label: labels.album, width: 180, type: "string" },
  { accessor: "song", label: labels.song, width: 180, type: "string" },
];

const setStatus = (status: HTMLElement, text: string) => {
  status.textContent = text;
};

export const SwitchLanguageUpdatesColumnEditorLabels = {
  render: () => {
    const result = renderVanillaTable<TrackRow>(defaultColumns(english), rows(), {
      getRowId: (p) => String((p.row as TrackRow).id),
      height: "280px",
      animations: { enabled: false },
      enableColumnEditor: true,
      enableColumnEditorInitOpen: true,
    });
    (globalThis as unknown as Record<string, TableInstance>)[LABEL_TABLE_REF_KEY] = result.table;
    result.h2.textContent = "Switch language — column editor labels must update";

    const status = addParagraph(
      result.wrapper,
      'Pinned "Artist" and "Album" should change to "Artista" and "Álbum" in both the headers and the column editor.',
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
                  `Headers and editor should read: ${labels.artist}, ${labels.album}, ${labels.song}`,
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
    await waitUntil(() => editorLabelText(canvasElement, "artist") === "Artist");
    expect(editorLabelText(canvasElement, "album")).toBe("Album");

    getLabelTable().update({ columns: defaultColumns(translated) });
    await waitUntil(() => headerLabelText(canvasElement, "artist") === "Artista");
    expect(editorLabelText(canvasElement, "artist")).toBe("Artista");
    expect(editorLabelText(canvasElement, "album")).toBe("Álbum");
    expect(editorLabelText(canvasElement, "song")).toBe("Canción");
  },
};
