/**
 * MusicExample – vanilla port of React music/MusicExample.
 * Uses same music headers and data, with theme "frost" and customTheme.
 */
import type { Row } from "../../../src/index";
import { renderVanillaTable } from "../../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../../vanillaStoryConfig";
import { MUSIC_HEADERS } from "./music-headers";
import musicData from "./music-data.json";

export const musicExampleDefaults = {
  columnReordering: true,
  columnResizing: true,
  selectableCells: true,
  theme: "frost" as const,
  customTheme: { rowHeight: 85, headerHeight: 40 },
  height: "70dvh",
};

export function renderMusicExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...musicExampleDefaults, ...args };
  const { wrapper, h2 } = renderVanillaTable(MUSIC_HEADERS, musicData as Row[], {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Music Example";
  return wrapper;
}
