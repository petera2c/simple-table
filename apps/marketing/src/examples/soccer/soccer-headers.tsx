import type {
  ReactColumnDef,
  CellRendererProps,
  ValueGetterProps,
} from "@simple-table/react";
import { Avatar, Pill, ProgressBar, getThemeColors } from "../_shared";
import type { SoccerPlayer } from "./useSoccerData";

/** Centered numeric stat; emphasizes non-zero values. */
const StatCell = (accessor: keyof SoccerPlayer, digits?: number) => {
  function StatCellRenderer({ row, theme }: CellRendererProps) {
    const c = getThemeColors(theme);
    const raw = row[accessor] as number;
    const value = digits !== undefined ? raw.toFixed(digits) : raw;
    return (
      <span
        style={{
          fontSize: "13px",
          fontWeight: raw > 0 ? 600 : 400,
          color: raw > 0 ? c.text : c.muted,
        }}
      >
        {value}
      </span>
    );
  }
  StatCellRenderer.displayName = `StatCell(${String(accessor)})`;
  return StatCellRenderer;
};

function ratingColor(rating: number, theme?: string) {
  const c = getThemeColors(theme);
  if (rating >= 7.5) return { bg: c.successBg, text: c.success };
  if (rating >= 7) return { bg: c.primaryBg, text: c.primary };
  if (rating >= 6.5) return { bg: c.warningBg, text: c.warning };
  return { bg: c.errorBg, text: c.error };
}

export const HEADERS: ReactColumnDef[] = [
  {
    accessor: "rank",
    label: "#",
    width: "auto",
    align: "center",
    type: "number",
    pinned: "left",
    sortable: true,
    editable: false,
    cellRenderer: ({ row, theme }: CellRendererProps) => {
      const c = getThemeColors(theme);
      const rank = row.rank as number;
      const change = row.rankChange as number;
      const up = change > 0;
      const flat = change === 0;
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
          <span style={{ fontWeight: 600, color: c.text }}>{rank}</span>
          {!flat && (
            <span style={{ fontSize: "10px", color: up ? c.up : c.down }}>
              {up ? "\u25B2" : "\u25BC"} {Math.abs(change)}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessor: "player",
    label: "Player",
    width: "auto",
    align: "left",
    type: "string",
    pinned: "left",
    sortable: true,
    editable: false,
    valueGetter: ({ row }: ValueGetterProps) => row.name as string,
    cellRenderer: ({ row, theme }: CellRendererProps) => {
      const c = getThemeColors(theme);
      const name = row.name as string;
      const club = row.club as string;
      const clubShort = row.clubShort as string;
      const flag = row.nationFlag as string;
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Avatar seed={name} label={name} size={34} />
          <div style={{ display: "flex", flexDirection: "column", gap: "3px", minWidth: 0 }}>
            <span
              style={{
                fontWeight: 600,
                fontSize: "14px",
                color: c.text,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              <span style={{ marginRight: "6px" }}>{flag}</span>
              {name}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Pill color="blue" theme={theme}>
                {clubShort}
              </Pill>
              <span
                style={{
                  fontSize: "12px",
                  color: c.muted,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {club}
              </span>
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessor: "position",
    label: "Pos",
    width: "auto",
    align: "center",
    type: "enum",
    sortable: true,
    editable: false,
    filterable: true,
    enumOptions: [
      { label: "Goalkeeper", value: "GK" },
      { label: "Defender", value: "DEF" },
      { label: "Midfielder", value: "MID" },
      { label: "Forward", value: "FWD" },
    ],
    cellRenderer: ({ row, theme }: CellRendererProps) => (
      <Pill color="neutral" theme={theme}>
        {row.position as string}
      </Pill>
    ),
  },
  {
    accessor: "rating",
    label: "Rating",
    width: "auto",
    align: "center",
    type: "number",
    sortable: true,
    editable: false,
    cellRenderer: ({ row, theme }: CellRendererProps) => {
      const rating = row.rating as number;
      const styles = ratingColor(rating, theme);
      return (
        <span
          style={{
            display: "inline-block",
            minWidth: "40px",
            padding: "3px 8px",
            borderRadius: "6px",
            fontWeight: 700,
            fontSize: "13px",
            textAlign: "center",
            backgroundColor: styles.bg,
            color: styles.text,
          }}
        >
          {rating.toFixed(2)}
        </span>
      );
    },
  },
  {
    accessor: "formHistory",
    label: "Form",
    width: "auto",
    align: "center",
    type: "lineAreaChart",
    sortable: false,
    editable: false,
    filterable: false,
    tooltip: "Match ratings over the last 8 games",
    chartOptions: {
      height: 34,
      min: 4,
      max: 10,
      strokeWidth: 2,
      fillOpacity: 0.18,
    },
  },
  {
    accessor: "appearances",
    label: "Apps",
    width: "auto",
    align: "center",
    type: "number",
    sortable: true,
    editable: false,
    tooltip: "Appearances this season",
    cellRenderer: StatCell("appearances"),
  },
  {
    accessor: "attack",
    label: "Attack",
    width: "auto",
    sortable: false,
    collapsible: true,
    children: [
      {
        accessor: "goals",
        label: "Goals",
        width: "auto",
        align: "center",
        type: "number",
        sortable: true,
        editable: false,
        showWhen: "always",
        cellRenderer: ({ row, theme }: CellRendererProps) => {
          const c = getThemeColors(theme);
          return (
            <span style={{ fontWeight: 700, fontSize: "14px", color: c.text }}>
              {row.goals as number}
            </span>
          );
        },
      },
      {
        accessor: "assists",
        label: "Assists",
        width: "auto",
        align: "center",
        type: "number",
        sortable: true,
        editable: false,
        showWhen: "parentExpanded",
        cellRenderer: StatCell("assists"),
      },
      {
        accessor: "xG",
        label: "xG",
        width: "auto",
        align: "center",
        type: "number",
        sortable: true,
        editable: false,
        showWhen: "parentExpanded",
        tooltip: "Expected goals",
        cellRenderer: StatCell("xG", 1),
      },
      {
        accessor: "xA",
        label: "xA",
        width: "auto",
        align: "center",
        type: "number",
        sortable: true,
        editable: false,
        showWhen: "parentExpanded",
        tooltip: "Expected assists",
        cellRenderer: StatCell("xA", 1),
      },
      {
        accessor: "shots",
        label: "Shots",
        width: "auto",
        align: "center",
        type: "number",
        sortable: true,
        editable: false,
        showWhen: "parentExpanded",
        cellRenderer: StatCell("shots"),
      },
    ],
  },
  {
    accessor: "passing",
    label: "Passing",
    width: "auto",
    sortable: false,
    collapsible: true,
    children: [
      {
        accessor: "passAccuracy",
        label: "Pass %",
        width: "auto",
        align: "left",
        type: "number",
        sortable: true,
        editable: false,
        showWhen: "always",
        cellRenderer: ({ row, theme }: CellRendererProps) => {
          const pct = row.passAccuracy as number;
          const c = getThemeColors(theme);
          const color = pct >= 88 ? c.success : pct >= 80 ? c.primary : c.warning;
          return <ProgressBar percent={pct} theme={theme} color={color} caption={`${pct}%`} />;
        },
      },
      {
        accessor: "passes",
        label: "Passes",
        width: "auto",
        align: "center",
        type: "number",
        sortable: true,
        editable: false,
        showWhen: "parentExpanded",
        cellRenderer: StatCell("passes"),
      },
      {
        accessor: "keyPasses",
        label: "Key Passes",
        width: "auto",
        align: "center",
        type: "number",
        sortable: true,
        editable: false,
        showWhen: "parentExpanded",
        tooltip: "Passes leading to a shot",
        cellRenderer: StatCell("keyPasses"),
      },
    ],
  },
  {
    accessor: "defense",
    label: "Defense",
    width: "auto",
    sortable: false,
    collapsible: true,
    collapseDefault: true,
    children: [
      {
        accessor: "tackles",
        label: "Tackles",
        width: "auto",
        align: "center",
        type: "number",
        sortable: true,
        editable: false,
        showWhen: "always",
        cellRenderer: StatCell("tackles"),
      },
      {
        accessor: "interceptions",
        label: "Interceptions",
        width: "auto",
        align: "center",
        type: "number",
        sortable: true,
        editable: false,
        showWhen: "parentExpanded",
        cellRenderer: StatCell("interceptions"),
      },
      {
        accessor: "clearances",
        label: "Clearances",
        width: "auto",
        align: "center",
        type: "number",
        sortable: true,
        editable: false,
        showWhen: "parentExpanded",
        cellRenderer: StatCell("clearances"),
      },
    ],
  },
];
