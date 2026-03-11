/**
 * MusicExample – vanilla port of React music/MusicExample.
 */
import { renderVanillaTable } from "../../utils";

const HEADERS: Record<string, unknown>[] = [
  { accessor: "id", label: "ID", width: 80 },
  { accessor: "title", label: "Title", width: 200 },
  { accessor: "artist", label: "Artist", width: 150 },
  { accessor: "duration", label: "Duration", width: 100 },
];

const ROWS: Record<string, unknown>[] = [
  { id: 1, title: "Track One", artist: "Artist A", duration: "3:45" },
  { id: 2, title: "Track Two", artist: "Artist B", duration: "4:12" },
  { id: 3, title: "Track Three", artist: "Artist A", duration: "3:20" },
];

export function renderMusicExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(HEADERS, ROWS, {
    height: "400px",
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Music Example";
  return wrapper;
}
