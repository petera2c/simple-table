/**
 * Music example headers – ported from React music-headers (vanilla-compatible).
 */
import type { CellRendererProps, ColumnDef } from "../../../src/index";

export interface MusicRow {
  id: string;
  rank: number;
  artistName: string;
  artistType: string;
  pronouns: string;
  recordLabel: string;
  lyricsLanguage?: string;
  growthStatus?: string;
  mood?: string;
  genre?: string;
  followers?: number;
  followersFormatted?: string;
  followersGrowth?: number;
  followersGrowthFormatted?: string;
  followersGrowthPercent?: number;
  popularity?: number;
  popularityChange?: number;
  popularityChangePercent?: number;
  [key: string]: string | number | undefined;
}

export const MUSIC_HEADERS: ColumnDef<MusicRow>[] = [
  {
    accessor: "rank",
    label: "#",
    width: "auto",
    sortable: true,
    editable: false,
    align: "center",
    type: "number",
    pinned: "left",
  },
  {
    accessor: "artistName",
    label: "Artist",
    width: "auto",
    sortable: true,
    editable: false,
    align: "left",
    type: "string",
    pinned: "left",
    cellRenderer: ({ row }: CellRendererProps<MusicRow>) =>
      `${row.artistName ?? ""} | ${row.growthStatus ?? ""} | ${row.mood ?? ""} | ${row.genre ?? ""}`.trim(),
  },
  {
    accessor: "artistType",
    label: "Identity",
    width: "auto",
    sortable: false,
    editable: false,
    align: "left",
    type: "string",
    cellRenderer: ({ row }: CellRendererProps<MusicRow>) =>
      `${row.artistType ?? ""}, ${row.pronouns ?? ""} | ${row.recordLabel ?? ""}`.trim(),
  },
  {
    accessor: "followersGroup",
    label: "Followers",
    width: "auto",
    collapsible: true,
    children: [
      {
        accessor: "followers",
        label: "Total Followers",
        width: "auto",
        showWhen: "always",
        sortable: true,
        editable: false,
        type: "number",
        cellRenderer: ({ row }: CellRendererProps<MusicRow>) =>
          `${row.followersFormatted ?? ""} (↑ ${row.followersGrowthFormatted ?? ""} ${row.followersGrowthPercent ?? 0}%)`.trim(),
      },
      {
        accessor: "followers7DayGrowth",
        label: "7-Day Growth",
        width: "auto",
        sortable: true,
        editable: false,
        align: "right",
        type: "number",
        showWhen: "parentExpanded",
        valueFormatter: ({ value }: { value?: unknown }) =>
          value != null ? `${Number(value).toLocaleString()}` : "—",
      },
      {
        accessor: "followers28DayGrowth",
        label: "28-Day Growth",
        width: "auto",
        sortable: true,
        editable: false,
        align: "right",
        type: "number",
        showWhen: "parentExpanded",
        valueFormatter: ({ value }: { value?: unknown }) =>
          value != null ? `${Number(value).toLocaleString()}` : "—",
      },
      {
        accessor: "followers60DayGrowth",
        label: "60-Day Growth",
        width: "auto",
        sortable: true,
        editable: false,
        align: "right",
        type: "number",
        showWhen: "parentExpanded",
        valueFormatter: ({ value }: { value?: unknown }) =>
          value != null ? `${Number(value).toLocaleString()}` : "—",
      },
    ],
  },
  {
    accessor: "popularity",
    label: "Popularity",
    width: "auto",
    sortable: true,
    editable: false,
    align: "center",
    type: "number",
    cellRenderer: ({ row }: CellRendererProps<MusicRow>) =>
      `${row.popularity ?? "—"} (${row.popularityChangePercent != null ? `${row.popularityChangePercent}%` : "—"})`,
  },
  {
    accessor: "playlistReachGroup",
    label: "Playlist Reach",
    width: "auto",
    collapsible: true,
    children: [
      {
        accessor: "playlistReach",
        label: "Reach",
        width: "auto",
        sortable: true,
        type: "number",
        valueFormatter: ({ value }: { value?: unknown }) =>
          value != null ? Number(value).toLocaleString() : "—",
      },
    ],
  },
  {
    accessor: "monthlyListenersGroup",
    label: "Monthly Listeners",
    width: "auto",
    collapsible: true,
    children: [
      {
        accessor: "monthlyListeners",
        label: "Listeners",
        width: "auto",
        sortable: true,
        type: "number",
        valueFormatter: ({ value }: { value?: unknown }) =>
          value != null ? Number(value).toLocaleString() : "—",
      },
    ],
  },
];
