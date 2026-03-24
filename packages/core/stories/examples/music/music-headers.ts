/**
 * Music example headers – ported from React music-headers (vanilla-compatible).
 */
import type { HeaderObject } from "../../../src/index";

export const MUSIC_HEADERS: HeaderObject[] = [
  {
    accessor: "rank",
    label: "#",
    width: 60,
    isSortable: true,
    isEditable: false,
    align: "center",
    type: "number",
    pinned: "left",
  },
  {
    accessor: "artistName",
    label: "Artist",
    width: 320,
    isSortable: true,
    isEditable: false,
    align: "left",
    type: "string",
    pinned: "left",
    cellRenderer: ({ row }: { row: Record<string, unknown> }) =>
      `${row.artistName ?? ""} | ${row.growthStatus ?? ""} | ${row.mood ?? ""} | ${row.genre ?? ""}`.trim(),
  },
  {
    accessor: "artistType",
    label: "Identity",
    width: 280,
    isSortable: false,
    isEditable: false,
    align: "left",
    type: "string",
    cellRenderer: ({ row }: { row: Record<string, unknown> }) =>
      `${row.artistType ?? ""}, ${row.pronouns ?? ""} | ${row.recordLabel ?? ""}`.trim(),
  },
  {
    accessor: "followersGroup",
    label: "Followers",
    width: 700,
    collapsible: true,
    children: [
      {
        accessor: "followers",
        label: "Total Followers",
        width: 180,
        showWhen: "always",
        isSortable: true,
        isEditable: false,
        type: "number",
        cellRenderer: ({ row }: { row: Record<string, unknown> }) =>
          `${row.followersFormatted ?? ""} (↑ ${row.followersGrowthFormatted ?? ""} ${row.followersGrowthPercent ?? 0}%)`.trim(),
      },
      {
        accessor: "followers7DayGrowth",
        label: "7-Day Growth",
        width: 160,
        isSortable: true,
        isEditable: false,
        align: "right",
        type: "number",
        showWhen: "parentExpanded",
        valueFormatter: ({ value }: { value?: unknown }) =>
          value != null ? `${Number(value).toLocaleString()}` : "—",
      },
      {
        accessor: "followers28DayGrowth",
        label: "28-Day Growth",
        width: 160,
        isSortable: true,
        isEditable: false,
        align: "right",
        type: "number",
        showWhen: "parentExpanded",
        valueFormatter: ({ value }: { value?: unknown }) =>
          value != null ? `${Number(value).toLocaleString()}` : "—",
      },
      {
        accessor: "followers60DayGrowth",
        label: "60-Day Growth",
        width: 160,
        isSortable: true,
        isEditable: false,
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
    width: 180,
    isSortable: true,
    isEditable: false,
    align: "center",
    type: "number",
    cellRenderer: ({ row }: { row: Record<string, unknown> }) =>
      `${row.popularity ?? "—"} (${row.popularityChangePercent != null ? `${row.popularityChangePercent}%` : "—"})`,
  },
  {
    accessor: "playlistReachGroup",
    label: "Playlist Reach",
    width: 400,
    collapsible: true,
    children: [
      {
        accessor: "playlistReach",
        label: "Reach",
        width: 180,
        isSortable: true,
        type: "number",
        valueFormatter: ({ value }: { value?: unknown }) =>
          value != null ? Number(value).toLocaleString() : "—",
      },
    ],
  },
  {
    accessor: "monthlyListenersGroup",
    label: "Monthly Listeners",
    width: 400,
    collapsible: true,
    children: [
      {
        accessor: "monthlyListeners",
        label: "Listeners",
        width: 180,
        isSortable: true,
        type: "number",
        valueFormatter: ({ value }: { value?: unknown }) =>
          value != null ? Number(value).toLocaleString() : "—",
      },
    ],
  },
];
