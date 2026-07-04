import { useRef } from "react";
import type { ReactNode } from "react";
import { SimpleTable } from "@simple-table/react";
import type {
  Theme,
  TableAPI,
  ReactHeaderObject,
  CellRendererProps,
  Row,
} from "@simple-table/react";
import { musicData, getMusicThemeColors } from "./music.demo-data";
import type { MusicArtist } from "./music.demo-data";
import "@simple-table/react/styles.css";
import "./music-theme.css";

const POSITIVE = { bg: "#ecfdf5", text: "#047857" };
const NEGATIVE = { bg: "#fef2f2", text: "#b91c1c" };

// ---------------------------------------------------------------------------
// Small presentational building blocks
// ---------------------------------------------------------------------------
const GrowthBadge = ({
  changeFormatted,
  changePercent,
}: {
  changeFormatted: string;
  changePercent: number;
}) => {
  const isPositive = changePercent >= 0;
  const palette = isPositive ? POSITIVE : NEGATIVE;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        backgroundColor: palette.bg,
        color: palette.text,
        borderRadius: "6px",
        padding: "2px 6px",
        fontSize: "11px",
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontSize: "10px" }}>{isPositive ? "▲" : "▼"}</span>
      {changeFormatted} ({Math.abs(changePercent).toFixed(2)}%)
    </span>
  );
};

/** Vertical "label / value / change" stack used by most platform metric columns. */
const StatStack = ({
  label,
  value,
  changeFormatted,
  changePercent,
  theme,
}: {
  label: string;
  value: string;
  changeFormatted?: string;
  changePercent?: number;
  theme?: Theme;
}) => {
  const colors = getMusicThemeColors(theme);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "3px",
      }}
    >
      <span style={{ fontSize: "11px", color: colors.muted }}>{label}</span>
      <span style={{ fontSize: "14px", fontWeight: 600, color: colors.text }}>{value}</span>
      {changeFormatted !== undefined && changePercent !== undefined && (
        <GrowthBadge changeFormatted={changeFormatted} changePercent={changePercent} />
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Cell renderer factories (so 45+ metric columns share one implementation)
// ---------------------------------------------------------------------------
type StatOptions = { label?: string };

/** A formatted "total + growth" metric: reads `<key>Formatted`, `<key>ChangeFormatted`, `<key>ChangePercent`. */
const makeStatCell =
  (key: string, { label = "Total" }: StatOptions = {}) =>
  ({ row, theme }: CellRendererProps): ReactNode => {
    const value = row[`${key}Formatted`] as string | undefined;
    if (value === undefined || value === null) {
      return <StatStack label={label} value="—" theme={theme} />;
    }
    const changeFormatted = row[`${key}ChangeFormatted`] as string | undefined;
    const changePercent = row[`${key}ChangePercent`] as number | undefined;
    return (
      <StatStack
        label={label}
        value={value}
        changeFormatted={changeFormatted}
        changePercent={changePercent}
        theme={theme}
      />
    );
  };

/** A single percentage value (e.g. engagement rate), optionally with a change badge. */
const makeRateCell =
  (key: string, { label = "Rate", changeKey }: StatOptions & { changeKey?: string } = {}) =>
  ({ row, theme }: CellRendererProps): ReactNode => {
    const value = row[key] as number | undefined;
    if (value === undefined || value === null) {
      return <StatStack label={label} value="—" theme={theme} />;
    }
    const changePercent = changeKey ? (row[changeKey] as number | undefined) : undefined;
    return (
      <StatStack
        label={label}
        value={`${value.toFixed(2)}%`}
        changeFormatted={changePercent !== undefined ? `${changePercent.toFixed(2)}%` : undefined}
        changePercent={changePercent}
        theme={theme}
      />
    );
  };

/** A "x" ratio value such as reach / followers. */
const makeRatioCell =
  (key: string, suffix = "x") =>
  ({ row, theme }: CellRendererProps): ReactNode => {
    const colors = getMusicThemeColors(theme);
    const value = row[key] as number | undefined;
    return (
      <span style={{ fontWeight: 600, color: colors.text }}>
        {value === undefined || value === null ? "—" : `${value.toFixed(2)}${suffix}`}
      </span>
    );
  };

// ---------------------------------------------------------------------------
// Bespoke cell renderers
// ---------------------------------------------------------------------------
const colorFromName = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${hash % 360}, 62%, 52%)`;
};

const IdentityCell = ({ row, theme }: CellRendererProps): ReactNode => {
  const colors = getMusicThemeColors(theme);
  const d = row as unknown as MusicArtist;
  const name = d.artistName ?? "";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          backgroundColor: colorFromName(name),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "15px",
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        {name.charAt(0).toUpperCase() || "?"}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: 0 }}>
        <span
          style={{
            fontWeight: 600,
            fontSize: "14px",
            color: colors.text,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={name}
        >
          {name}
        </span>
        <span style={{ fontSize: "12px", color: colors.muted }}>
          {d.artistType} · {d.pronouns}
        </span>
        <span
          style={{ fontSize: "12px", color: colors.muted, whiteSpace: "nowrap" }}
          title={d.recordLabel}
        >
          {d.recordLabel}
        </span>
      </div>
    </div>
  );
};

const RankCell = ({ row, theme }: CellRendererProps): ReactNode => {
  const colors = getMusicThemeColors(theme);
  const d = row as unknown as MusicArtist;
  const rank = d.rank;
  const change = d.rankChange ?? 0;
  const isPositive = change >= 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
      <span style={{ fontWeight: 700, fontSize: "15px", color: colors.text }}>{rank}</span>
      {change !== 0 && (
        <span style={{ fontSize: "10px", color: isPositive ? POSITIVE.text : NEGATIVE.text }}>
          {isPositive ? "▲" : "▼"} {Math.abs(change)}
        </span>
      )}
    </div>
  );
};

const RegionCell = ({ row, theme }: CellRendererProps): ReactNode => {
  const colors = getMusicThemeColors(theme);
  const d = row as unknown as MusicArtist;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      <span style={{ display: "flex", alignItems: "center", gap: "6px", color: colors.text }}>
        <span style={{ fontSize: "15px" }}>{d.countryFlag}</span>
        {d.country}
      </span>
      <span style={{ fontSize: "12px", color: colors.muted }}>{d.continent}</span>
    </div>
  );
};

const ScoreCell = ({ row, theme }: CellRendererProps): ReactNode => {
  const colors = getMusicThemeColors(theme);
  const d = row as unknown as MusicArtist;
  const score = d.score;
  const scoreChange = d.scoreChange ?? 0;
  const rank = d.rank;
  const rankChange = d.rankChange ?? 0;

  const MetricRow = ({
    label,
    value,
    change,
    decimals,
  }: {
    label: string;
    value: number;
    change: number;
    decimals: number;
  }) => {
    const isPositive = change >= 0;
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "12px", color: colors.muted, minWidth: "42px" }}>{label}</span>
        <span style={{ fontSize: "13px", fontWeight: 600, color: colors.text, minWidth: "44px" }}>
          {value.toFixed(decimals)}
        </span>
        {change !== 0 && (
          <span style={{ fontSize: "11px", color: isPositive ? POSITIVE.text : NEGATIVE.text }}>
            {isPositive ? "▲" : "▼"} {Math.abs(change).toFixed(decimals)}
          </span>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <MetricRow label="Score" value={score} change={scoreChange} decimals={1} />
      <MetricRow label="Rank" value={rank} change={rankChange} decimals={0} />
    </div>
  );
};

const makeDateCell =
  (accessor: string) =>
  ({ row, theme }: CellRendererProps): ReactNode => {
    const colors = getMusicThemeColors(theme);
    return <span style={{ color: colors.text }}>{(row[accessor] as string) ?? "—"}</span>;
  };

const AGE_SEGMENTS: { key: string; color: string }[] = [
  { key: "13-17", color: "#a8e3d7" },
  { key: "18-24", color: "#6cc5c0" },
  { key: "25-34", color: "#44a2b1" },
  { key: "35-44", color: "#2980a0" },
  { key: "45-59", color: "#215d8b" },
  { key: "60+", color: "#1a3f73" },
];

const SegmentedBar = ({ segments }: { segments: { color: string; value: number }[] }) => (
  <div
    style={{
      display: "flex",
      width: "100%",
      height: "9px",
      borderRadius: "4px",
      overflow: "hidden",
      gap: "2px",
    }}
  >
    {segments.map((s, i) => (
      <div
        key={i}
        style={{ width: `${s.value}%`, backgroundColor: s.color, borderRadius: "3px" }}
      />
    ))}
  </div>
);

const AudienceAgeCell = ({ row, theme }: CellRendererProps): ReactNode => {
  const colors = getMusicThemeColors(theme);
  const d = row as unknown as MusicArtist;
  const age = d.audienceAge ?? {};
  const youngShare = (age["18-24"] ?? 0) + (age["25-34"] ?? 0) + (age["13-17"] ?? 0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
      <div style={{ fontSize: "12px", color: colors.muted }}>
        Aged 13-34: <span style={{ color: colors.text, fontWeight: 600 }}>{youngShare}%</span>
      </div>
      <SegmentedBar
        segments={AGE_SEGMENTS.map((s) => ({ color: s.color, value: age[s.key] ?? 0 }))}
      />
    </div>
  );
};

const AudienceGenderCell = ({ row, theme }: CellRendererProps): ReactNode => {
  const colors = getMusicThemeColors(theme);
  const d = row as unknown as MusicArtist;
  const gender = d.audienceGender ?? { f: 0, m: 0 };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
      <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: colors.muted }}>
        <span>
          F: <span style={{ color: colors.text, fontWeight: 600 }}>{gender.f}%</span>
        </span>
        <span>
          M: <span style={{ color: colors.text, fontWeight: 600 }}>{gender.m}%</span>
        </span>
      </div>
      <SegmentedBar
        segments={[
          { color: "#7e84fa", value: gender.f },
          { color: "#0fb5ae", value: gender.m },
        ]}
      />
    </div>
  );
};

const PopularityCell = ({ row, theme }: CellRendererProps): ReactNode => {
  const d = row as unknown as MusicArtist;
  const value = d.spotifyPopularity;
  const change = d.spotifyPopularityChangePercent;
  return (
    <StatStack
      label="Score"
      value={value === undefined ? "—" : `${value}/100`}
      changeFormatted={change !== undefined ? `${Math.abs(change).toFixed(2)}` : undefined}
      changePercent={change}
      theme={theme}
    />
  );
};

// ---------------------------------------------------------------------------
// Header definitions (~60 columns, every data column has a custom renderer)
// ---------------------------------------------------------------------------
const stat = (
  accessor: string,
  label: string,
  options: StatOptions & { width?: number } = {},
): ReactHeaderObject => ({
  accessor,
  label,
  width: options.width ?? 200,
  isSortable: true,
  isEditable: false,
  align: "right",
  type: "number",
  cellRenderer: makeStatCell(accessor, { label: options.label }),
});

function getMusicHeaders(): ReactHeaderObject[] {
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
      cellRenderer: makeRateCell("tiktokEngagementRate", {
        changeKey: "tiktokEngagementRateChange",
      }),
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

const MusicDemo = ({
  theme,
}: {
  // `height` is intentionally unused: window/external scroll mode requires no
  // `height`/`maxHeight`, so the table grows to its natural size inside the page.
  height?: string | number;
  theme?: Theme;
}) => {
  const tableRef = useRef<TableAPI>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={wrapperRef} className="music-theme-container" style={{ fontFamily: "Inter" }}>
      <SimpleTable
        columnReordering
        columnResizing
        customTheme={{ headerHeight: 40, rowHeight: 90 }}
        defaultHeaders={getMusicHeaders()}
        ref={tableRef}
        rows={musicData as Row[]}
        selectableCells
        theme={theme}
        // Window / external scroll mode: no height/maxHeight. The nearest
        // scrollable ancestor drives row virtualization, and the header
        // auto-pins (CSS sticky) to the top of that scroll viewport — no extra
        // work needed. Getter form resolves the parent after the ref attaches;
        // in a real app you'd typically pass scrollParent="window".
        scrollParent={() => wrapperRef.current?.parentElement ?? null}
      />
    </div>
  );
};

export default MusicDemo;
