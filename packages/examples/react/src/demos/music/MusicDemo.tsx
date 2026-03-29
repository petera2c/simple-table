import { useRef } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme, TableAPI, ReactHeaderObject } from "@simple-table/react";
import { musicData, getMusicThemeColors } from "@simple-table/examples-shared";
import type { MusicArtist } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";
import "@simple-table/examples-shared/styles/music-theme.css";

const Tag = ({ children, color, theme }: { children: React.ReactNode; color?: string; theme?: string }) => {
  const c = getMusicThemeColors(theme);
  const colorMap: Record<string, { bg: string; text: string; border?: string }> = {
    green: { bg: c.successBg, text: c.success },
    red: { bg: c.errorBg, text: c.error },
    default: { bg: c.tagBg, text: c.tagText, border: `1px solid ${c.tagBorder}` },
  };
  const s = colorMap[color || "default"] || colorMap.default;
  return <span style={{ backgroundColor: s.bg, color: s.text, padding: "0 7px", fontSize: "11px", lineHeight: "20px", borderRadius: "4px", display: "inline-block", ...(s.border ? { border: s.border } : {}) }}>{children}</span>;
};

const GrowthMetric = ({ value, growthPercent, isPositive = true, theme, align = "left", showSign = true }: { value: string | number; growthPercent: number; isPositive?: boolean; theme?: string; align?: "left" | "right"; showSign?: boolean }) => {
  const c = getMusicThemeColors(theme);
  const display = typeof value === "number" ? value.toLocaleString() : value;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: align === "right" ? "flex-end" : "flex-start" }}>
      <div style={{ fontSize: "14px", color: c.gray }}>{showSign && (isPositive ? "+" : "")}{display}</div>
      <Tag color={isPositive ? "green" : "red"} theme={theme}>{isPositive ? "↑" : "↓"} {Math.abs(growthPercent).toFixed(2)}%</Tag>
    </div>
  );
};

function getMusicHeaders(): ReactHeaderObject[] {
  return [
    { accessor: "rank", label: "#", width: 60, isSortable: true, isEditable: false, align: "center", type: "number", pinned: "left" },
    {
      accessor: "artistName", label: "Artist", width: 330, isSortable: true, isEditable: false, align: "left", type: "string", pinned: "left",
      cellRenderer: ({ row: r, theme }) => {
        const d = r as unknown as MusicArtist;
        const c = getMusicThemeColors(theme);
        let hash = 0; for (let i = 0; i < d.artistName.length; i++) hash = d.artistName.charCodeAt(i) + ((hash << 5) - hash);
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: `hsl(${hash % 360}, 65%, 55%)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "16px", flexShrink: 0 }}>{d.artistName.charAt(0).toUpperCase()}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
              <span style={{ fontWeight: "500", fontSize: "14px", color: c.gray }}>{d.artistName}</span>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <Tag color="default" theme={theme}>{d.growthStatus}</Tag>
                <Tag color="default" theme={theme}>{d.mood}</Tag>
                <Tag color="default" theme={theme}>{d.genre}</Tag>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessor: "artistType", label: "Identity", width: 280, isSortable: false, isEditable: false, align: "left", type: "string",
      cellRenderer: ({ row: r, theme }) => { const d = r as unknown as MusicArtist; const c = getMusicThemeColors(theme); return <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}><div style={{ fontSize: "13px", color: c.gray }}>{d.artistType}, {d.pronouns}</div><div style={{ fontSize: "12px", color: c.gray }}>{d.recordLabel}</div><div style={{ fontSize: "12px", color: c.gray }}>Lyrics Language: {d.lyricsLanguage}</div></div>; },
    },
    {
      accessor: "followersGroup", label: "Followers", width: 700, collapsible: true,
      children: [
        { accessor: "followers", label: "Total Followers", width: 180, showWhen: "always", isSortable: true, isEditable: false, type: "number", cellRenderer: ({ row: r, theme }) => { const d = r as unknown as MusicArtist; const c = getMusicThemeColors(theme); return <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-start" }}><div style={{ fontSize: "14px", color: c.gray }}>{d.followersFormatted}</div><Tag color="green" theme={theme}>↑ +{d.followersGrowthFormatted} ({d.followersGrowthPercent.toFixed(2)}%)</Tag></div>; } },
        { accessor: "followers7DayGrowth", label: "7-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded", cellRenderer: ({ row: r, theme }) => { const d = r as unknown as MusicArtist; return <GrowthMetric value={d.followers7DayGrowth} growthPercent={d.followers7DayGrowthPercent} theme={theme} align="right" />; } },
        { accessor: "followers28DayGrowth", label: "28-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded", cellRenderer: ({ row: r, theme }) => { const d = r as unknown as MusicArtist; return <GrowthMetric value={d.followers28DayGrowth} growthPercent={d.followers28DayGrowthPercent} theme={theme} align="right" />; } },
        { accessor: "followers60DayGrowth", label: "60-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded", cellRenderer: ({ row: r, theme }) => { const d = r as unknown as MusicArtist; return <GrowthMetric value={d.followers60DayGrowth} growthPercent={d.followers60DayGrowthPercent} theme={theme} align="right" />; } },
      ],
    },
    { accessor: "popularity", label: "Popularity", width: 180, isSortable: true, isEditable: false, align: "center", type: "number", cellRenderer: ({ row: r, theme }) => { const d = r as unknown as MusicArtist; return <div style={{ display: "flex", justifyContent: "center" }}><GrowthMetric value={`${d.popularity}/100`} growthPercent={d.popularityChangePercent} isPositive={d.popularityChangePercent >= 0} theme={theme} showSign={false} /></div>; } },
    {
      accessor: "playlistReachGroup", label: "Playlist Reach", width: 700, collapsible: true,
      children: [
        { accessor: "playlistReach", label: "Total Reach", width: 180, showWhen: "always", isSortable: true, isEditable: false, type: "number", cellRenderer: ({ row: r, theme }) => { const d = r as unknown as MusicArtist; const c = getMusicThemeColors(theme); const isPos = d.playlistReachChange >= 0; return <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}><div style={{ fontSize: "14px", color: c.gray }}>{d.playlistReachFormatted}</div><Tag color={isPos ? "green" : "red"} theme={theme}>{isPos ? "↑" : "↓"} {isPos ? "+" : ""}{d.playlistReachChangeFormatted} ({Math.abs(d.playlistReachChangePercent).toFixed(2)}%)</Tag></div>; } },
        { accessor: "playlistReach7DayGrowth", label: "7-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded", cellRenderer: ({ row: r, theme }) => { const d = r as unknown as MusicArtist; return <GrowthMetric value={d.playlistReach7DayGrowth} growthPercent={d.playlistReach7DayGrowthPercent} isPositive={d.playlistReach7DayGrowth >= 0} theme={theme} align="right" />; } },
        { accessor: "playlistReach28DayGrowth", label: "28-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded", cellRenderer: ({ row: r, theme }) => { const d = r as unknown as MusicArtist; return <GrowthMetric value={d.playlistReach28DayGrowth} growthPercent={d.playlistReach28DayGrowthPercent} isPositive={d.playlistReach28DayGrowth >= 0} theme={theme} align="right" />; } },
        { accessor: "playlistReach60DayGrowth", label: "60-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded", cellRenderer: ({ row: r, theme }) => { const d = r as unknown as MusicArtist; return <GrowthMetric value={d.playlistReach60DayGrowth} growthPercent={d.playlistReach60DayGrowthPercent} isPositive={d.playlistReach60DayGrowth >= 0} theme={theme} align="right" />; } },
      ],
    },
    {
      accessor: "playlistCountGroup", label: "Playlist Count", width: 700, collapsible: true,
      children: [
        { accessor: "playlistCount", label: "Total Count", width: 180, showWhen: "always", isSortable: true, isEditable: false, type: "number", cellRenderer: ({ row: r, theme }) => { const d = r as unknown as MusicArtist; const c = getMusicThemeColors(theme); return <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-start" }}><div style={{ fontSize: "14px", color: c.gray }}>{d.playlistCount.toLocaleString()}</div><Tag color="green" theme={theme}>↑ +{d.playlistCountGrowth} ({d.playlistCountGrowthPercent.toFixed(2)}%)</Tag></div>; } },
        { accessor: "playlistCount7DayGrowth", label: "7-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded", cellRenderer: ({ row: r, theme }) => { const d = r as unknown as MusicArtist; return <GrowthMetric value={d.playlistCount7DayGrowth} growthPercent={d.playlistCount7DayGrowthPercent} theme={theme} align="right" />; } },
        { accessor: "playlistCount28DayGrowth", label: "28-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded", cellRenderer: ({ row: r, theme }) => { const d = r as unknown as MusicArtist; return <GrowthMetric value={d.playlistCount28DayGrowth} growthPercent={d.playlistCount28DayGrowthPercent} theme={theme} align="right" />; } },
        { accessor: "playlistCount60DayGrowth", label: "60-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded", cellRenderer: ({ row: r, theme }) => { const d = r as unknown as MusicArtist; return <GrowthMetric value={d.playlistCount60DayGrowth} growthPercent={d.playlistCount60DayGrowthPercent} theme={theme} align="right" />; } },
      ],
    },
    {
      accessor: "monthlyListenersGroup", label: "Monthly Listeners", width: 700, collapsible: true,
      children: [
        { accessor: "monthlyListeners", label: "Total Listeners", width: 180, showWhen: "always", isSortable: true, isEditable: false, type: "number", cellRenderer: ({ row: r, theme }) => { const d = r as unknown as MusicArtist; const c = getMusicThemeColors(theme); const isPos = d.monthlyListenersChange >= 0; return <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}><div style={{ fontSize: "14px", color: c.gray }}>{d.monthlyListenersFormatted}</div><Tag color={isPos ? "green" : "red"} theme={theme}>{isPos ? "↑" : "↓"} {isPos ? "+" : ""}{d.monthlyListenersChangeFormatted} ({Math.abs(d.monthlyListenersChangePercent).toFixed(2)}%)</Tag></div>; } },
        { accessor: "monthlyListeners7DayGrowth", label: "7-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded", cellRenderer: ({ row: r, theme }) => { const d = r as unknown as MusicArtist; return <GrowthMetric value={d.monthlyListeners7DayGrowth} growthPercent={d.monthlyListeners7DayGrowthPercent} isPositive={d.monthlyListeners7DayGrowth >= 0} theme={theme} align="right" />; } },
        { accessor: "monthlyListeners28DayGrowth", label: "28-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded", cellRenderer: ({ row: r, theme }) => { const d = r as unknown as MusicArtist; return <GrowthMetric value={d.monthlyListeners28DayGrowth} growthPercent={d.monthlyListeners28DayGrowthPercent} isPositive={d.monthlyListeners28DayGrowth >= 0} theme={theme} align="right" />; } },
        { accessor: "monthlyListeners60DayGrowth", label: "60-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded", cellRenderer: ({ row: r, theme }) => { const d = r as unknown as MusicArtist; return <GrowthMetric value={d.monthlyListeners60DayGrowth} growthPercent={d.monthlyListeners60DayGrowthPercent} isPositive={d.monthlyListeners60DayGrowth >= 0} theme={theme} align="right" />; } },
      ],
    },
    { accessor: "conversionRate", label: "Conversion Rate", width: 150, isSortable: true, isEditable: false, align: "right", type: "number", cellRenderer: ({ row: r, theme }) => { const d = r as unknown as MusicArtist; const c = getMusicThemeColors(theme); return <span style={{ color: c.gray }}>{d.conversionRate.toFixed(2)}%</span>; } },
    { accessor: "reachFollowersRatio", label: "Reach/Followers Ratio", width: 220, isSortable: true, isEditable: false, align: "right", type: "number", cellRenderer: ({ row: r, theme }) => { const d = r as unknown as MusicArtist; const c = getMusicThemeColors(theme); return <span style={{ color: c.gray }}>{d.reachFollowersRatio.toFixed(1)}x</span>; } },
  ];
}

const MusicDemo = ({ height = "400px", theme }: { height?: string | number; theme?: Theme }) => {
  const tableRef = useRef<TableAPI>(null);
  return (
    <div className="music-theme-container" style={{ fontFamily: "Inter" }}>
      <SimpleTable columnReordering columnResizing customTheme={{ headerHeight: 30, rowHeight: 85 }} defaultHeaders={getMusicHeaders()} height={height} ref={tableRef} rows={musicData} selectableCells theme={theme} />
    </div>
  );
};

export default MusicDemo;
