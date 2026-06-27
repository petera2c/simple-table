/**
 * MusicWindowScrollExample – vanilla port of the React `MusicDemo`.
 *
 * A wide (~60 column) artist-analytics grid rendered in window / external
 * scroll mode: the table has no `height` / `maxHeight`, so it grows to its
 * natural size and the enclosing scroll container drives row virtualization
 * (the header pins to the top of that viewport via CSS sticky). Every data
 * column uses a custom DOM `cellRenderer`, mirroring the React example used
 * for scroll-performance profiling.
 */
import { SimpleTableVanilla } from "../../../src/index";
import type { HeaderObject, Row } from "../../../src/index";
import type { CellRendererProps } from "../../../src/index";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../../vanillaStoryConfig";
import { generateMusicData, getMusicThemeColors, METRICS } from "./music-window.data";
import type { MusicArtist } from "./music-window.data";

const POSITIVE = { bg: "#ecfdf5", text: "#047857" };
const NEGATIVE = { bg: "#fef2f2", text: "#b91c1c" };

// ---------------------------------------------------------------------------
// Tiny DOM helper
// ---------------------------------------------------------------------------
type Style = Partial<CSSStyleDeclaration>;
type Child = string | number | Node | null | undefined;

function el(tag: string, style?: Style, children?: Child | Child[]): HTMLElement {
  const node = document.createElement(tag);
  if (style) Object.assign(node.style, style);
  const list = Array.isArray(children) ? children : [children];
  for (const child of list) {
    if (child === null || child === undefined) continue;
    node.appendChild(
      typeof child === "string" || typeof child === "number"
        ? document.createTextNode(String(child))
        : child,
    );
  }
  return node;
}

// ---------------------------------------------------------------------------
// Presentational building blocks
// ---------------------------------------------------------------------------
function growthBadge(changeFormatted: string, changePercent: number): HTMLElement {
  const isPositive = changePercent >= 0;
  const palette = isPositive ? POSITIVE : NEGATIVE;
  return el(
    "span",
    {
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      backgroundColor: palette.bg,
      color: palette.text,
      borderRadius: "6px",
      padding: "2px 6px",
      fontSize: "11px",
      fontWeight: "500",
      whiteSpace: "nowrap",
    },
    [
      el("span", { fontSize: "10px" }, isPositive ? "▲" : "▼"),
      ` ${changeFormatted} (${Math.abs(changePercent).toFixed(2)}%)`,
    ],
  );
}

function statStack(opts: {
  label: string;
  value: string;
  changeFormatted?: string;
  changePercent?: number;
  theme?: string;
}): HTMLElement {
  const colors = getMusicThemeColors(opts.theme);
  return el(
    "div",
    { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "3px" },
    [
      el("span", { fontSize: "11px", color: colors.muted }, opts.label),
      el("span", { fontSize: "14px", fontWeight: "600", color: colors.text }, opts.value),
      opts.changeFormatted !== undefined && opts.changePercent !== undefined
        ? growthBadge(opts.changeFormatted, opts.changePercent)
        : null,
    ],
  );
}

function segmentedBar(segments: { color: string; value: number }[]): HTMLElement {
  return el(
    "div",
    {
      display: "flex",
      width: "100%",
      height: "9px",
      borderRadius: "4px",
      overflow: "hidden",
      gap: "2px",
    },
    segments.map((s) =>
      el("div", { width: `${s.value}%`, backgroundColor: s.color, borderRadius: "3px" }),
    ),
  );
}

// ---------------------------------------------------------------------------
// Cell renderer factories (so the ~45 metric columns share one implementation)
// ---------------------------------------------------------------------------
type StatOptions = { label?: string };

const makeStatCell =
  (key: string, { label = "Total" }: StatOptions = {}) =>
  ({ row, theme }: CellRendererProps): Node => {
    const value = row[`${key}Formatted`] as string | undefined;
    if (value === undefined || value === null) {
      return statStack({ label, value: "—", theme });
    }
    return statStack({
      label,
      value,
      changeFormatted: row[`${key}ChangeFormatted`] as string | undefined,
      changePercent: row[`${key}ChangePercent`] as number | undefined,
      theme,
    });
  };

const makeRateCell =
  (key: string, { label = "Rate", changeKey }: StatOptions & { changeKey?: string } = {}) =>
  ({ row, theme }: CellRendererProps): Node => {
    const value = row[key] as number | undefined;
    if (value === undefined || value === null) {
      return statStack({ label, value: "—", theme });
    }
    const changePercent = changeKey ? (row[changeKey] as number | undefined) : undefined;
    return statStack({
      label,
      value: `${value.toFixed(2)}%`,
      changeFormatted: changePercent !== undefined ? `${changePercent.toFixed(2)}%` : undefined,
      changePercent,
      theme,
    });
  };

const makeRatioCell =
  (key: string, suffix = "x") =>
  ({ row, theme }: CellRendererProps): Node => {
    const colors = getMusicThemeColors(theme);
    const value = row[key] as number | undefined;
    return el(
      "span",
      { fontWeight: "600", color: colors.text },
      value === undefined || value === null ? "—" : `${value.toFixed(2)}${suffix}`,
    );
  };

const makeDateCell =
  (accessor: string) =>
  ({ row, theme }: CellRendererProps): Node => {
    const colors = getMusicThemeColors(theme);
    return el("span", { color: colors.text }, (row[accessor] as string) ?? "—");
  };

// ---------------------------------------------------------------------------
// Bespoke cell renderers
// ---------------------------------------------------------------------------
function colorFromName(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${hash % 360}, 62%, 52%)`;
}

const IdentityCell = ({ row, theme }: CellRendererProps): Node => {
  const colors = getMusicThemeColors(theme);
  const d = row as unknown as MusicArtist;
  const name = d.artistName ?? "";
  const avatar = el(
    "div",
    {
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      backgroundColor: colorFromName(name),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "15px",
      fontWeight: "600",
      flexShrink: "0",
    },
    name.charAt(0).toUpperCase() || "?",
  );
  const nameEl = el(
    "span",
    {
      fontWeight: "600",
      fontSize: "14px",
      color: colors.text,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    name,
  );
  nameEl.title = name;
  const sub = el("span", { fontSize: "12px", color: colors.muted }, `${d.artistType} · ${d.pronouns}`);
  const label = el(
    "span",
    { fontSize: "12px", color: colors.muted, whiteSpace: "nowrap" },
    d.recordLabel,
  );
  label.title = d.recordLabel;
  return el("div", { display: "flex", alignItems: "center", gap: "10px" }, [
    avatar,
    el("div", { display: "flex", flexDirection: "column", gap: "2px", minWidth: "0" }, [
      nameEl,
      sub,
      label,
    ]),
  ]);
};

const RankCell = ({ row, theme }: CellRendererProps): Node => {
  const colors = getMusicThemeColors(theme);
  const d = row as unknown as MusicArtist;
  const change = d.rankChange ?? 0;
  const isPositive = change >= 0;
  return el(
    "div",
    { display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" },
    [
      el("span", { fontWeight: "700", fontSize: "15px", color: colors.text }, d.rank),
      change !== 0
        ? el(
            "span",
            { fontSize: "10px", color: isPositive ? POSITIVE.text : NEGATIVE.text },
            `${isPositive ? "▲" : "▼"} ${Math.abs(change)}`,
          )
        : null,
    ],
  );
};

const RegionCell = ({ row, theme }: CellRendererProps): Node => {
  const colors = getMusicThemeColors(theme);
  const d = row as unknown as MusicArtist;
  return el("div", { display: "flex", flexDirection: "column", gap: "2px" }, [
    el("span", { display: "flex", alignItems: "center", gap: "6px", color: colors.text }, [
      el("span", { fontSize: "15px" }, d.countryFlag),
      d.country,
    ]),
    el("span", { fontSize: "12px", color: colors.muted }, d.continent),
  ]);
};

const ScoreCell = ({ row, theme }: CellRendererProps): Node => {
  const colors = getMusicThemeColors(theme);
  const d = row as unknown as MusicArtist;

  const metricRow = (label: string, value: number, change: number, decimals: number): HTMLElement => {
    const isPositive = change >= 0;
    return el("div", { display: "flex", alignItems: "center", gap: "8px" }, [
      el("span", { fontSize: "12px", color: colors.muted, minWidth: "42px" }, label),
      el(
        "span",
        { fontSize: "13px", fontWeight: "600", color: colors.text, minWidth: "44px" },
        value.toFixed(decimals),
      ),
      change !== 0
        ? el(
            "span",
            { fontSize: "11px", color: isPositive ? POSITIVE.text : NEGATIVE.text },
            `${isPositive ? "▲" : "▼"} ${Math.abs(change).toFixed(decimals)}`,
          )
        : null,
    ]);
  };

  return el("div", { display: "flex", flexDirection: "column", gap: "4px" }, [
    metricRow("Score", d.score, d.scoreChange ?? 0, 1),
    metricRow("Rank", d.rank, d.rankChange ?? 0, 0),
  ]);
};

const AGE_SEGMENTS: { key: string; color: string }[] = [
  { key: "13-17", color: "#a8e3d7" },
  { key: "18-24", color: "#6cc5c0" },
  { key: "25-34", color: "#44a2b1" },
  { key: "35-44", color: "#2980a0" },
  { key: "45-59", color: "#215d8b" },
  { key: "60+", color: "#1a3f73" },
];

const AudienceAgeCell = ({ row, theme }: CellRendererProps): Node => {
  const colors = getMusicThemeColors(theme);
  const d = row as unknown as MusicArtist;
  const age = d.audienceAge ?? {};
  const youngShare = (age["18-24"] ?? 0) + (age["25-34"] ?? 0) + (age["13-17"] ?? 0);
  return el("div", { display: "flex", flexDirection: "column", gap: "5px", width: "100%" }, [
    el("div", { fontSize: "12px", color: colors.muted }, [
      "Aged 13-34: ",
      el("span", { color: colors.text, fontWeight: "600" }, `${youngShare}%`),
    ]),
    segmentedBar(AGE_SEGMENTS.map((s) => ({ color: s.color, value: age[s.key] ?? 0 }))),
  ]);
};

const AudienceGenderCell = ({ row, theme }: CellRendererProps): Node => {
  const colors = getMusicThemeColors(theme);
  const d = row as unknown as MusicArtist;
  const gender = d.audienceGender ?? { f: 0, m: 0 };
  return el("div", { display: "flex", flexDirection: "column", gap: "5px", width: "100%" }, [
    el("div", { display: "flex", gap: "12px", fontSize: "12px", color: colors.muted }, [
      el("span", undefined, ["F: ", el("span", { color: colors.text, fontWeight: "600" }, `${gender.f}%`)]),
      el("span", undefined, ["M: ", el("span", { color: colors.text, fontWeight: "600" }, `${gender.m}%`)]),
    ]),
    segmentedBar([
      { color: "#7e84fa", value: gender.f },
      { color: "#0fb5ae", value: gender.m },
    ]),
  ]);
};

const PopularityCell = ({ row, theme }: CellRendererProps): Node => {
  const d = row as unknown as MusicArtist;
  const value = d.spotifyPopularity;
  const change = d.spotifyPopularityChangePercent;
  return statStack({
    label: "Score",
    value: value === undefined ? "—" : `${value}/100`,
    changeFormatted: change !== undefined ? `${Math.abs(change).toFixed(2)}` : undefined,
    changePercent: change,
    theme,
  });
};

// ---------------------------------------------------------------------------
// Header definitions (~60 columns, every data column has a custom renderer)
// ---------------------------------------------------------------------------
const stat = (
  accessor: string,
  label: string,
  options: StatOptions & { width?: number } = {},
): HeaderObject => ({
  accessor,
  label,
  width: options.width ?? 200,
  isSortable: true,
  isEditable: false,
  align: "right",
  type: "number",
  cellRenderer: makeStatCell(accessor, { label: options.label }),
});

function getMusicHeaders(): HeaderObject[] {
  return [
    {
      accessor: "rank",
      label: "#",
      width: 70,
      isSortable: true,
      isEditable: false,
      align: "center",
      type: "number",
      pinned: "left",
      cellRenderer: RankCell,
    },
    {
      accessor: "identity",
      label: "Identity",
      width: 240,
      isSortable: false,
      isEditable: false,
      align: "left",
      type: "string",
      pinned: "left",
      valueGetter: ({ row }) => (row as unknown as MusicArtist).artistName,
      cellRenderer: IdentityCell,
    },
    {
      accessor: "region",
      label: "Region",
      width: 180,
      isSortable: false,
      isEditable: false,
      align: "left",
      type: "string",
      valueGetter: ({ row }) => (row as unknown as MusicArtist).country,
      cellRenderer: RegionCell,
    },
    {
      accessor: "score",
      label: "Score",
      width: 240,
      isSortable: true,
      isEditable: false,
      align: "left",
      type: "number",
      cellRenderer: ScoreCell,
    },
    {
      accessor: "earliestAlbumReleaseDate",
      label: "Earliest Release",
      width: 160,
      isSortable: false,
      isEditable: false,
      align: "right",
      type: "string",
      cellRenderer: makeDateCell("earliestAlbumReleaseDate"),
    },
    {
      accessor: "latestAlbumReleaseDate",
      label: "Latest Release",
      width: 160,
      isSortable: false,
      isEditable: false,
      align: "right",
      type: "string",
      cellRenderer: makeDateCell("latestAlbumReleaseDate"),
    },
    {
      accessor: "audienceAge",
      label: "Audience Age",
      width: 240,
      isSortable: false,
      isEditable: false,
      align: "left",
      type: "string",
      cellRenderer: AudienceAgeCell,
    },
    {
      accessor: "audienceGender",
      label: "Audience Gender",
      width: 200,
      isSortable: false,
      isEditable: false,
      align: "left",
      type: "string",
      cellRenderer: AudienceGenderCell,
    },

    // Followers / fans
    stat("spotifyFollowers", "Spotify Followers", { width: 220 }),
    stat("youtubeSubscribers", "YouTube Subscribers", { width: 220 }),
    stat("instagramFollowers", "Instagram Followers", { width: 220 }),
    stat("tiktokFollowers", "TikTok Followers", { width: 200 }),
    stat("deezerFans", "Deezer Fans", { width: 190 }),
    stat("facebookFollowers", "Facebook Followers", { width: 220 }),
    stat("twitterFollowers", "Twitter/X Followers", { width: 220 }),
    stat("soundcloudFollowers", "SoundCloud Followers", { width: 220 }),
    stat("songkickFans", "Songkick Fans", { width: 190 }),
    stat("snapchatSubscribers", "Snapchat Subscribers", { width: 220 }),
    stat("blueskyFollowers", "Bluesky Followers", { width: 200 }),
    stat("twitchFollowers", "Twitch Followers", { width: 200 }),
    stat("lineMusicArtistLikes", "LINE Music Likes", { width: 200 }),
    stat("melonArtistFans", "Melon Fans", { width: 190 }),

    // Spotify performance
    {
      accessor: "spotifyPopularity",
      label: "Spotify Popularity",
      width: 200,
      isSortable: true,
      isEditable: false,
      align: "right",
      type: "number",
      cellRenderer: PopularityCell,
    },
    stat("spotifyMonthlyListeners", "Spotify Monthly Listeners", { width: 230 }),
    {
      accessor: "spotifyFollowersToListenersRatio",
      label: "Followers / Listeners",
      width: 190,
      isSortable: true,
      isEditable: false,
      align: "right",
      type: "number",
      cellRenderer: makeRatioCell("spotifyFollowersToListenersRatio", "%"),
    },
    {
      accessor: "spotifyReachFollowersRatio",
      label: "Reach / Followers",
      width: 180,
      isSortable: true,
      isEditable: false,
      align: "right",
      type: "number",
      cellRenderer: makeRatioCell("spotifyReachFollowersRatio", "x"),
    },

    // YouTube performance
    stat("youtubeChannelViews", "YouTube Views", { width: 220 }),
    {
      accessor: "youtubeEngagementRate",
      label: "YouTube Engagement",
      width: 190,
      isSortable: true,
      isEditable: false,
      align: "right",
      type: "number",
      cellRenderer: makeRateCell("youtubeEngagementRate"),
    },
    stat("youtubeDailyVideoViews", "YT Daily Video Views", { width: 220 }),
    stat("youtubeMonthlyListeners", "YT Monthly Listeners", { width: 220 }),

    // Engagement / plays
    stat("tiktokLikes", "TikTok Likes", { width: 200 }),
    stat("wikipediaViews", "Wikipedia Views", { width: 200 }),
    stat("pandoraLifetimeStreams", "Pandora Streams", { width: 220 }),
    stat("pandoraListeners28Day", "Pandora 28-Day", { width: 200 }),
    stat("pandoraLifetimeStationsAdded", "Pandora Stations", { width: 220 }),
    stat("facebookTalks", "Facebook Talks", { width: 200 }),
    {
      accessor: "instagramEngagementRate",
      label: "Instagram Engagement",
      width: 200,
      isSortable: true,
      isEditable: false,
      align: "right",
      type: "number",
      cellRenderer: makeRateCell("instagramEngagementRate"),
    },
    {
      accessor: "tiktokEngagementRate",
      label: "TikTok Engagement",
      width: 200,
      isSortable: true,
      isEditable: false,
      align: "right",
      type: "number",
      cellRenderer: makeRateCell("tiktokEngagementRate", { changeKey: "tiktokEngagementRateChange" }),
    },
    stat("lineMusicLikes", "LINE Music Likes (Songs)", { width: 220 }),
    stat("lineMusicMvPlays", "LINE MV Plays", { width: 200 }),
    stat("lineMusicPlays", "LINE Plays", { width: 200 }),
    stat("melonVideoLikes", "Melon Video Likes", { width: 200 }),
    stat("melonVideoViews", "Melon Video Views", { width: 200 }),
    stat("tiktokTopVideoViews", "TikTok Top Video Views", { width: 230 }),
    stat("soundcloudPlays", "SoundCloud Plays", { width: 210 }),
    stat("boomplayFavorites", "Boomplay Favorites", { width: 210 }),
    stat("boomplayPlays", "Boomplay Plays", { width: 200 }),

    // Playlists
    stat("spotifyPlaylistReach", "Spotify Playlist Reach", { width: 230 }),
    stat("spotifyPlaylistCount", "Spotify Playlist Count", { width: 220 }),
    stat("youtubePlaylistCount", "YouTube Playlist Count", { width: 220 }),
    stat("deezerPlaylistCount", "Deezer Playlist Count", { width: 210 }),
    stat("itunesPlaylistCount", "iTunes Playlist Count", { width: 210 }),
    stat("amazonPlaylistCount", "Amazon Playlist Count", { width: 220 }),
    stat("deezerPlaylistReach", "Deezer Playlist Reach", { width: 220 }),

    // Airwaves / discovery
    stat("tiktokTrackPosts", "TikTok Track Posts", { width: 210 }),
    stat("airplayStreams", "Airplay Streams", { width: 200 }),
    stat("siriusxmStreams", "SiriusXM Streams", { width: 200 }),
    stat("geniusPageviews", "Genius Pageviews", { width: 210 }),
    stat("shazamCount", "Shazam Count", { width: 200 }),
    stat("twitterTweetCount", "Tweet Count", { width: 180 }),
  ];
}

const musicWindowData = generateMusicData(2000) as unknown as Row[];

export const musicWindowScrollExampleDefaults: Partial<UniversalVanillaArgs> = {
  columnReordering: true,
  columnResizing: true,
  selectableCells: true,
  customTheme: { headerHeight: 40, rowHeight: 90 },
  // `height` / `maxHeight` are intentionally omitted: window / external scroll
  // mode grows the table to its natural size and the outer container scrolls.
};

export function renderMusicWindowScrollExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...musicWindowScrollExampleDefaults, ...args };

  const wrapper = document.createElement("div");

  // Outer page-like scroll container drives virtualization (in a real app you
  // would typically pass scrollParent: "window" instead). A fixed height keeps
  // the scroll viewport visible inside the Storybook iframe.
  const scrollContainer = document.createElement("div");
  Object.assign(scrollContainer.style, {
    height: "80dvh",
    overflow: "auto",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    background: "#fff",
  });
  wrapper.appendChild(scrollContainer);

  const tableContainer = document.createElement("div");
  tableContainer.style.fontFamily = "Inter, system-ui, sans-serif";
  scrollContainer.appendChild(tableContainer);

  const table = new SimpleTableVanilla(tableContainer, {
    defaultHeaders: getMusicHeaders(),
    rows: musicWindowData,
    theme: options.theme,
    customTheme: options.customTheme,
    columnReordering: options.columnReordering,
    columnResizing: options.columnResizing,
    selectableCells: options.selectableCells,
    getRowId: (p: { row?: { id?: unknown } }) => String(p.row?.id),
    scrollParent: scrollContainer,
  });
  table.mount();

  (wrapper as unknown as { _table?: SimpleTableVanilla })._table = table;

  return wrapper;
}

// Re-exported so the data generator's column list stays in sync if reused.
export { METRICS };
