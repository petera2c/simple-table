import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, CellRenderer, Row, Theme } from "@simple-table/angular";
import { musicData, getMusicThemeColors } from "@simple-table/examples-shared";
import type { MusicArtist } from "@simple-table/examples-shared";
import "@simple-table/angular/styles.css";
import "../../../../shared/src/styles/music-theme.css";

function el(tag: string, styles?: Partial<CSSStyleDeclaration>, children?: (Node | string)[]): HTMLElement {
  const e = document.createElement(tag);
  if (styles) Object.assign(e.style, styles);
  if (children) {
    for (const c of children) {
      e.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    }
  }
  return e;
}

function tag(text: string, color: "green" | "red" | "default", themeColors: Record<string, string>): HTMLElement {
  const colorMap: Record<string, { bg: string; text: string; border?: string }> = {
    green: { bg: themeColors.successBg, text: themeColors.success },
    red: { bg: themeColors.errorBg, text: themeColors.error },
    default: { bg: themeColors.tagBg, text: themeColors.tagText, border: `1px solid ${themeColors.tagBorder}` },
  };
  const s = colorMap[color] || colorMap.default;
  const span = el("span", {
    backgroundColor: s.bg, color: s.text, padding: "0 7px",
    fontSize: "11px", lineHeight: "20px", borderRadius: "4px", display: "inline-block",
  }, [text]);
  if (s.border) span.style.border = s.border;
  return span;
}

function growthMetric(
  value: string | number,
  growthPercent: number,
  themeColors: Record<string, string>,
  opts?: { isPositive?: boolean; align?: "left" | "right"; showSign?: boolean },
): HTMLElement {
  const isPositive = opts?.isPositive ?? true;
  const align = opts?.align ?? "left";
  const showSign = opts?.showSign ?? true;
  const display = typeof value === "number" ? value.toLocaleString() : value;
  const prefix = showSign ? (isPositive ? "+" : "") : "";
  const arrow = isPositive ? "↑" : "↓";

  return el("div", {
    display: "flex", flexDirection: "column", gap: "4px",
    alignItems: align === "right" ? "flex-end" : "flex-start",
  }, [
    el("span", { fontSize: "14px", color: themeColors.gray }, [`${prefix}${display}`]),
    tag(`${arrow} ${Math.abs(growthPercent).toFixed(2)}%`, isPositive ? "green" : "red", themeColors),
  ]);
}

function buildMusicHeaders(theme?: string): AngularHeaderObject[] {
  const c = getMusicThemeColors(theme);

  const artistRenderer: CellRenderer = ({ row }) => {
    const d = row as unknown as MusicArtist;
    let hash = 0;
    for (let i = 0; i < d.artistName.length; i++) hash = d.artistName.charCodeAt(i) + ((hash << 5) - hash);
    const avatar = el("div", {
      width: "40px", height: "40px", borderRadius: "50%",
      backgroundColor: `hsl(${hash % 360}, 65%, 55%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "white", fontSize: "16px", flexShrink: "0",
    }, [d.artistName.charAt(0).toUpperCase()]);

    const tags = el("div", { display: "flex", gap: "6px", flexWrap: "wrap" }, [
      tag(d.growthStatus, "default", c),
      tag(d.mood, "default", c),
      tag(d.genre, "default", c),
    ]);

    const info = el("div", { display: "flex", flexDirection: "column", gap: "6px", flex: "1" }, [
      el("span", { fontWeight: "500", fontSize: "14px", color: c.gray }, [d.artistName]),
      tags,
    ]);

    return el("div", { display: "flex", alignItems: "center", gap: "12px" }, [avatar, info]);
  };

  const artistTypeRenderer: CellRenderer = ({ row }) => {
    const d = row as unknown as MusicArtist;
    return el("div", { display: "flex", flexDirection: "column", gap: "4px" }, [
      el("div", { fontSize: "13px", color: c.gray }, [`${d.artistType}, ${d.pronouns}`]),
      el("div", { fontSize: "12px", color: c.gray }, [d.recordLabel]),
      el("div", { fontSize: "12px", color: c.gray }, [`Lyrics Language: ${d.lyricsLanguage}`]),
    ]);
  };

  const followersRenderer: CellRenderer = ({ row }) => {
    const d = row as unknown as MusicArtist;
    return el("div", { display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-start" }, [
      el("div", { fontSize: "14px", color: c.gray }, [d.followersFormatted]),
      tag(`↑ +${d.followersGrowthFormatted} (${d.followersGrowthPercent.toFixed(2)}%)`, "green", c),
    ]);
  };

  const playlistReachRenderer: CellRenderer = ({ row }) => {
    const d = row as unknown as MusicArtist;
    const growth = d.playlistReachChange;
    const isPos = growth >= 0;
    const pct = Math.abs(d.playlistReachChangePercent).toFixed(2);
    return el("div", { display: "flex", flexDirection: "column", gap: "4px" }, [
      el("div", { fontSize: "14px", color: c.gray }, [d.playlistReachFormatted]),
      tag(`${isPos ? "↑" : "↓"} ${isPos ? "+" : ""}${d.playlistReachChangeFormatted} (${pct}%)`, isPos ? "green" : "red", c),
    ]);
  };

  const playlistCountRenderer: CellRenderer = ({ row }) => {
    const d = row as unknown as MusicArtist;
    return el("div", { display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-start" }, [
      el("div", { fontSize: "14px", color: c.gray }, [d.playlistCount.toLocaleString()]),
      tag(`↑ +${d.playlistCountGrowth} (${d.playlistCountGrowthPercent.toFixed(2)}%)`, "green", c),
    ]);
  };

  const monthlyListenersRenderer: CellRenderer = ({ row }) => {
    const d = row as unknown as MusicArtist;
    const growth = d.monthlyListenersChange;
    const isPos = growth >= 0;
    const pct = Math.abs(d.monthlyListenersChangePercent).toFixed(2);
    return el("div", { display: "flex", flexDirection: "column", gap: "4px" }, [
      el("div", { fontSize: "14px", color: c.gray }, [d.monthlyListenersFormatted]),
      tag(`${isPos ? "↑" : "↓"} ${isPos ? "+" : ""}${d.monthlyListenersChangeFormatted} (${pct}%)`, isPos ? "green" : "red", c),
    ]);
  };

  const popularityRenderer: CellRenderer = ({ row }) => {
    const d = row as unknown as MusicArtist;
    const pct = d.popularityChangePercent;
    const isPos = pct >= 0;
    const wrapper = el("div", { display: "flex", justifyContent: "center" });
    wrapper.appendChild(growthMetric(`${d.popularity}/100`, pct, c, { isPositive: isPos, showSign: false }));
    return wrapper;
  };

  const conversionRateRenderer: CellRenderer = ({ row }) => {
    const d = row as unknown as MusicArtist;
    return el("span", { color: c.gray }, [`${d.conversionRate.toFixed(2)}%`]);
  };

  const ratioRenderer: CellRenderer = ({ row }) => {
    const d = row as unknown as MusicArtist;
    return el("span", { color: c.gray }, [`${d.reachFollowersRatio.toFixed(1)}x`]);
  };

  const growthCell = (valueKey: string, pctKey: string, signed: boolean): CellRenderer => ({ row }) => {
    const d = row as unknown as MusicArtist;
    const val = d[valueKey as keyof MusicArtist] as number;
    const pct = d[pctKey as keyof MusicArtist] as number;
    return growthMetric(val, pct, c, { isPositive: signed ? val >= 0 : true, align: "right" });
  };

  return [
    { accessor: "rank", label: "#", width: 60, isSortable: true, isEditable: false, align: "center", type: "number", pinned: "left" },
    { accessor: "artistName", label: "Artist", width: 330, isSortable: true, isEditable: false, align: "left", type: "string", pinned: "left", cellRenderer: artistRenderer },
    { accessor: "artistType", label: "Identity", width: 280, isSortable: false, isEditable: false, align: "left", type: "string", cellRenderer: artistTypeRenderer },
    {
      accessor: "followersGroup", label: "Followers", width: 700, collapsible: true,
      children: [
        { accessor: "followers", label: "Total Followers", width: 180, showWhen: "always", isSortable: true, isEditable: false, type: "number", cellRenderer: followersRenderer },
        { accessor: "followers7DayGrowth", label: "7-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded", cellRenderer: growthCell("followers7DayGrowth", "followers7DayGrowthPercent", false) },
        { accessor: "followers28DayGrowth", label: "28-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded", cellRenderer: growthCell("followers28DayGrowth", "followers28DayGrowthPercent", false) },
        { accessor: "followers60DayGrowth", label: "60-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded", cellRenderer: growthCell("followers60DayGrowth", "followers60DayGrowthPercent", false) },
      ],
    },
    { accessor: "popularity", label: "Popularity", width: 180, isSortable: true, isEditable: false, align: "center", type: "number", cellRenderer: popularityRenderer },
    {
      accessor: "playlistReachGroup", label: "Playlist Reach", width: 700, collapsible: true,
      children: [
        { accessor: "playlistReach", label: "Total Reach", width: 180, showWhen: "always", isSortable: true, isEditable: false, type: "number", cellRenderer: playlistReachRenderer },
        { accessor: "playlistReach7DayGrowth", label: "7-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded", cellRenderer: growthCell("playlistReach7DayGrowth", "playlistReach7DayGrowthPercent", true) },
        { accessor: "playlistReach28DayGrowth", label: "28-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded", cellRenderer: growthCell("playlistReach28DayGrowth", "playlistReach28DayGrowthPercent", true) },
        { accessor: "playlistReach60DayGrowth", label: "60-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded", cellRenderer: growthCell("playlistReach60DayGrowth", "playlistReach60DayGrowthPercent", true) },
      ],
    },
    {
      accessor: "playlistCountGroup", label: "Playlist Count", width: 700, collapsible: true,
      children: [
        { accessor: "playlistCount", label: "Total Count", width: 180, showWhen: "always", isSortable: true, isEditable: false, type: "number", cellRenderer: playlistCountRenderer },
        { accessor: "playlistCount7DayGrowth", label: "7-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded", cellRenderer: growthCell("playlistCount7DayGrowth", "playlistCount7DayGrowthPercent", false) },
        { accessor: "playlistCount28DayGrowth", label: "28-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded", cellRenderer: growthCell("playlistCount28DayGrowth", "playlistCount28DayGrowthPercent", false) },
        { accessor: "playlistCount60DayGrowth", label: "60-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded", cellRenderer: growthCell("playlistCount60DayGrowth", "playlistCount60DayGrowthPercent", false) },
      ],
    },
    {
      accessor: "monthlyListenersGroup", label: "Monthly Listeners", width: 700, collapsible: true,
      children: [
        { accessor: "monthlyListeners", label: "Total Listeners", width: 180, showWhen: "always", isSortable: true, isEditable: false, type: "number", cellRenderer: monthlyListenersRenderer },
        { accessor: "monthlyListeners7DayGrowth", label: "7-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded", cellRenderer: growthCell("monthlyListeners7DayGrowth", "monthlyListeners7DayGrowthPercent", true) },
        { accessor: "monthlyListeners28DayGrowth", label: "28-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded", cellRenderer: growthCell("monthlyListeners28DayGrowth", "monthlyListeners28DayGrowthPercent", true) },
        { accessor: "monthlyListeners60DayGrowth", label: "60-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded", cellRenderer: growthCell("monthlyListeners60DayGrowth", "monthlyListeners60DayGrowthPercent", true) },
      ],
    },
    { accessor: "conversionRate", label: "Conversion Rate", width: 150, isSortable: true, isEditable: false, align: "right", type: "number", cellRenderer: conversionRateRenderer },
    { accessor: "reachFollowersRatio", label: "Reach/Followers Ratio", width: 220, isSortable: true, isEditable: false, align: "right", type: "number", cellRenderer: ratioRenderer },
  ];
}

@Component({
  selector: "music-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <div class="music-theme-container" style="font-family: Inter">
      <simple-table
        [defaultHeaders]="headers"
        [rows]="rows"
        [height]="height"
        [theme]="theme"
        [selectableCells]="true"
        [columnReordering]="true"
        [columnResizing]="true"
        [customTheme]="{ headerHeight: 30, rowHeight: 85 }"
      ></simple-table>
    </div>
  `,
})
export class MusicDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = [...musicData];
  headers: AngularHeaderObject[] = buildMusicHeaders();

  ngOnInit(): void {
    this.headers = buildMusicHeaders(this.theme);
  }
}
