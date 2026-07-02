import { SimpleTable } from "@simple-table/solid";
import type { Theme, SolidHeaderObject, TableAPI } from "@simple-table/solid";
import { musicData, getMusicThemeColors } from "./music.demo-data";
import type { MusicArtist } from "./music.demo-data";
import "@simple-table/solid/styles.css";
import "./music-theme.css";

const Tag = (props: { children: any; color?: string; theme?: string }) => {
  const c = () => getMusicThemeColors(props.theme);
  const colorMap = () => {
    const cv = c();
    return {
      green: { bg: cv.successBg, text: cv.success },
      red: { bg: cv.errorBg, text: cv.error },
      default: { bg: cv.tagBg, text: cv.tagText, border: `1px solid ${cv.tagBorder}` },
    } as Record<string, Record<string, string>>;
  };
  const s = () => colorMap()[props.color || "default"] || colorMap().default;
  return (
    <span style={{ "background-color": s().bg, color: s().text, padding: "0 7px", "font-size": "11px", "line-height": "20px", "border-radius": "4px", display: "inline-block", ...(s().border ? { border: s().border } : {}) }}>
      {props.children}
    </span>
  );
};

const GrowthMetric = (props: { value: string | number; growthPercent: number; isPositive?: boolean; theme?: string; align?: "left" | "right"; showSign?: boolean }) => {
  const c = () => getMusicThemeColors(props.theme);
  const isPositive = () => props.isPositive ?? true;
  const display = () => typeof props.value === "number" ? props.value.toLocaleString() : props.value;
  const showSign = () => props.showSign ?? true;
  return (
    <div style={{ display: "flex", "flex-direction": "column", gap: "4px", "align-items": (props.align ?? "left") === "right" ? "flex-end" : "flex-start" }}>
      <div style={{ "font-size": "14px", color: c().gray }}>{showSign() && (isPositive() ? "+" : "")}{display()}</div>
      <Tag color={isPositive() ? "green" : "red"} theme={props.theme}>{isPositive() ? "↑" : "↓"} {Math.abs(props.growthPercent).toFixed(2)}%</Tag>
    </div>
  );
};

function getMusicHeaders(): SolidHeaderObject[] {
  return [
    { accessor: "rank", label: "#", width: 60, isSortable: true, isEditable: false, align: "center", type: "number", pinned: "left" },
    {
      accessor: "artistName", label: "Artist", width: 330, isSortable: true, isEditable: false, align: "left", type: "string", pinned: "left",
      cellRenderer: ({ row, theme }) => {
        const d = row as unknown as MusicArtist;
        const c = getMusicThemeColors(theme);
        let hash = 0; for (let i = 0; i < d.artistName.length; i++) hash = d.artistName.charCodeAt(i) + ((hash << 5) - hash);
        return (
          <div style={{ display: "flex", "align-items": "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", "border-radius": "50%", "background-color": `hsl(${hash % 360}, 65%, 55%)`, display: "flex", "align-items": "center", "justify-content": "center", color: "white", "font-size": "16px", "flex-shrink": "0" }}>{d.artistName.charAt(0).toUpperCase()}</div>
            <div style={{ display: "flex", "flex-direction": "column", gap: "6px", flex: "1" }}>
              <span style={{ "font-weight": "500", "font-size": "14px", color: c.gray }}>{d.artistName}</span>
              <div style={{ display: "flex", gap: "6px", "flex-wrap": "wrap" }}>
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
      cellRenderer: ({ row, theme }) => { const d = row as unknown as MusicArtist; const c = getMusicThemeColors(theme); return <div style={{ display: "flex", "flex-direction": "column", gap: "4px" }}><div style={{ "font-size": "13px", color: c.gray }}>{d.artistType}, {d.pronouns}</div><div style={{ "font-size": "12px", color: c.gray }}>{d.recordLabel}</div><div style={{ "font-size": "12px", color: c.gray }}>Lyrics Language: {d.lyricsLanguage}</div></div>; },
    },
    {
      accessor: "followersGroup", label: "Followers", width: 700, collapsible: true,
      children: [
        { accessor: "followers", label: "Total Followers", width: 180, showWhen: "always", isSortable: true, isEditable: false, type: "number", cellRenderer: ({ row, theme }) => { const d = row as unknown as MusicArtist; const c = getMusicThemeColors(theme); return <div style={{ display: "flex", "flex-direction": "column", gap: "4px", "align-items": "flex-start" }}><div style={{ "font-size": "14px", color: c.gray }}>{d.followersFormatted}</div><Tag color="green" theme={theme}>↑ +{d.followersGrowthFormatted} ({d.followersGrowthPercent.toFixed(2)}%)</Tag></div>; } },
        { accessor: "followers7DayGrowth", label: "7-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded", cellRenderer: ({ row, theme }) => { const d = row as unknown as MusicArtist; return <GrowthMetric value={d.followers7DayGrowth} growthPercent={d.followers7DayGrowthPercent} theme={theme} align="right" />; } },
        { accessor: "followers28DayGrowth", label: "28-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded", cellRenderer: ({ row, theme }) => { const d = row as unknown as MusicArtist; return <GrowthMetric value={d.followers28DayGrowth} growthPercent={d.followers28DayGrowthPercent} theme={theme} align="right" />; } },
        { accessor: "followers60DayGrowth", label: "60-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded", cellRenderer: ({ row, theme }) => { const d = row as unknown as MusicArtist; return <GrowthMetric value={d.followers60DayGrowth} growthPercent={d.followers60DayGrowthPercent} theme={theme} align="right" />; } },
      ],
    },
    { accessor: "popularity", label: "Popularity", width: 180, isSortable: true, isEditable: false, align: "center", type: "number", cellRenderer: ({ row, theme }) => { const d = row as unknown as MusicArtist; return <div style={{ display: "flex", "justify-content": "center" }}><GrowthMetric value={`${d.popularity}/100`} growthPercent={d.popularityChangePercent} isPositive={d.popularityChangePercent >= 0} theme={theme} showSign={false} /></div>; } },
    {
      accessor: "playlistReachGroup", label: "Playlist Reach", width: 700, collapsible: true,
      children: [
        { accessor: "playlistReach", label: "Total Reach", width: 180, showWhen: "always", isSortable: true, isEditable: false, type: "number", cellRenderer: ({ row, theme }) => { const d = row as unknown as MusicArtist; const c = getMusicThemeColors(theme); const isPos = d.playlistReachChange >= 0; return <div style={{ display: "flex", "flex-direction": "column", gap: "4px" }}><div style={{ "font-size": "14px", color: c.gray }}>{d.playlistReachFormatted}</div><Tag color={isPos ? "green" : "red"} theme={theme}>{isPos ? "↑" : "↓"} {isPos ? "+" : ""}{d.playlistReachChangeFormatted} ({Math.abs(d.playlistReachChangePercent).toFixed(2)}%)</Tag></div>; } },
        { accessor: "playlistReach7DayGrowth", label: "7-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded", cellRenderer: ({ row, theme }) => { const d = row as unknown as MusicArtist; return <GrowthMetric value={d.playlistReach7DayGrowth} growthPercent={d.playlistReach7DayGrowthPercent} isPositive={d.playlistReach7DayGrowth >= 0} theme={theme} align="right" />; } },
        { accessor: "playlistReach28DayGrowth", label: "28-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded", cellRenderer: ({ row, theme }) => { const d = row as unknown as MusicArtist; return <GrowthMetric value={d.playlistReach28DayGrowth} growthPercent={d.playlistReach28DayGrowthPercent} isPositive={d.playlistReach28DayGrowth >= 0} theme={theme} align="right" />; } },
        { accessor: "playlistReach60DayGrowth", label: "60-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded", cellRenderer: ({ row, theme }) => { const d = row as unknown as MusicArtist; return <GrowthMetric value={d.playlistReach60DayGrowth} growthPercent={d.playlistReach60DayGrowthPercent} isPositive={d.playlistReach60DayGrowth >= 0} theme={theme} align="right" />; } },
      ],
    },
    {
      accessor: "playlistCountGroup", label: "Playlist Count", width: 700, collapsible: true,
      children: [
        { accessor: "playlistCount", label: "Total Count", width: 180, showWhen: "always", isSortable: true, isEditable: false, type: "number", cellRenderer: ({ row, theme }) => { const d = row as unknown as MusicArtist; const c = getMusicThemeColors(theme); return <div style={{ display: "flex", "flex-direction": "column", gap: "4px", "align-items": "flex-start" }}><div style={{ "font-size": "14px", color: c.gray }}>{d.playlistCount.toLocaleString()}</div><Tag color="green" theme={theme}>↑ +{d.playlistCountGrowth} ({d.playlistCountGrowthPercent.toFixed(2)}%)</Tag></div>; } },
        { accessor: "playlistCount7DayGrowth", label: "7-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded", cellRenderer: ({ row, theme }) => { const d = row as unknown as MusicArtist; return <GrowthMetric value={d.playlistCount7DayGrowth} growthPercent={d.playlistCount7DayGrowthPercent} theme={theme} align="right" />; } },
        { accessor: "playlistCount28DayGrowth", label: "28-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded", cellRenderer: ({ row, theme }) => { const d = row as unknown as MusicArtist; return <GrowthMetric value={d.playlistCount28DayGrowth} growthPercent={d.playlistCount28DayGrowthPercent} theme={theme} align="right" />; } },
        { accessor: "playlistCount60DayGrowth", label: "60-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded", cellRenderer: ({ row, theme }) => { const d = row as unknown as MusicArtist; return <GrowthMetric value={d.playlistCount60DayGrowth} growthPercent={d.playlistCount60DayGrowthPercent} theme={theme} align="right" />; } },
      ],
    },
    {
      accessor: "monthlyListenersGroup", label: "Monthly Listeners", width: 700, collapsible: true,
      children: [
        { accessor: "monthlyListeners", label: "Total Listeners", width: 180, showWhen: "always", isSortable: true, isEditable: false, type: "number", cellRenderer: ({ row, theme }) => { const d = row as unknown as MusicArtist; const c = getMusicThemeColors(theme); const isPos = d.monthlyListenersChange >= 0; return <div style={{ display: "flex", "flex-direction": "column", gap: "4px" }}><div style={{ "font-size": "14px", color: c.gray }}>{d.monthlyListenersFormatted}</div><Tag color={isPos ? "green" : "red"} theme={theme}>{isPos ? "↑" : "↓"} {isPos ? "+" : ""}{d.monthlyListenersChangeFormatted} ({Math.abs(d.monthlyListenersChangePercent).toFixed(2)}%)</Tag></div>; } },
        { accessor: "monthlyListeners7DayGrowth", label: "7-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded", cellRenderer: ({ row, theme }) => { const d = row as unknown as MusicArtist; return <GrowthMetric value={d.monthlyListeners7DayGrowth} growthPercent={d.monthlyListeners7DayGrowthPercent} isPositive={d.monthlyListeners7DayGrowth >= 0} theme={theme} align="right" />; } },
        { accessor: "monthlyListeners28DayGrowth", label: "28-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded", cellRenderer: ({ row, theme }) => { const d = row as unknown as MusicArtist; return <GrowthMetric value={d.monthlyListeners28DayGrowth} growthPercent={d.monthlyListeners28DayGrowthPercent} isPositive={d.monthlyListeners28DayGrowth >= 0} theme={theme} align="right" />; } },
        { accessor: "monthlyListeners60DayGrowth", label: "60-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded", cellRenderer: ({ row, theme }) => { const d = row as unknown as MusicArtist; return <GrowthMetric value={d.monthlyListeners60DayGrowth} growthPercent={d.monthlyListeners60DayGrowthPercent} isPositive={d.monthlyListeners60DayGrowth >= 0} theme={theme} align="right" />; } },
      ],
    },
    { accessor: "conversionRate", label: "Conversion Rate", width: 150, isSortable: true, isEditable: false, align: "right", type: "number", cellRenderer: ({ row, theme }) => { const d = row as unknown as MusicArtist; const c = getMusicThemeColors(theme); return <span style={{ color: c.gray }}>{d.conversionRate.toFixed(2)}%</span>; } },
    { accessor: "reachFollowersRatio", label: "Reach/Followers Ratio", width: 220, isSortable: true, isEditable: false, align: "right", type: "number", cellRenderer: ({ row, theme }) => { const d = row as unknown as MusicArtist; const c = getMusicThemeColors(theme); return <span style={{ color: c.gray }}>{d.reachFollowersRatio.toFixed(1)}x</span>; } },
  ];
}

export default function MusicDemo(props: { height?: string | number; theme?: Theme }) {
  let tableRef: TableAPI | undefined;
  return (
    <div class="music-theme-container" style={{ "font-family": "Inter" }}>
      <SimpleTable columnReordering columnResizing customTheme={{ headerHeight: 30, rowHeight: 85 }} defaultHeaders={getMusicHeaders()} height={props.height ?? "400px"} ref={(api) => (tableRef = api)} rows={musicData} selectableCells theme={props.theme} />
    </div>
  );
}
