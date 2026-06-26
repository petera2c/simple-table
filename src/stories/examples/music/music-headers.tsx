import React from "react";

import HeaderObject from "../../../types/HeaderObject";
import Row from "../../../types/Row";

// ---------------------------------------------------------------------------
// Theme helpers
// ---------------------------------------------------------------------------
const getThemeColors = (theme?: string) => {
  const themes: Record<string, { text: string; muted: string }> = {
    light: { text: "#1f2937", muted: "#6b7280" },
    dark: { text: "#f3f4f6", muted: "#9ca3af" },
    sky: { text: "#0f172a", muted: "#64748b" },
    funky: { text: "#1f2937", muted: "#6b7280" },
    neutral: { text: "#1f2937", muted: "#6b7280" },
    frost: { text: "#1e293b", muted: "#64748b" },
  };
  return themes[theme as keyof typeof themes] || themes.light;
};

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

/** Vertical "Total / value / change" stack used by most platform metric columns. */
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
  theme?: string;
}) => {
  const colors = getThemeColors(theme);
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
  ({ row, theme }: { row: Row; theme?: string }) => {
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
  ({ row, theme }: { row: Row; theme?: string }) => {
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
  ({ row, theme }: { row: Row; theme?: string }) => {
    const colors = getThemeColors(theme);
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

const IdentityCell = ({ row, theme }: { row: Row; theme?: string }) => {
  const colors = getThemeColors(theme);
  const name = (row.artistName as string) ?? "";
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
          {row.artistType as string} · {row.pronouns as string}
        </span>
        <span
          style={{ fontSize: "12px", color: colors.muted, whiteSpace: "nowrap" }}
          title={row.recordLabel as string}
        >
          {row.recordLabel as string}
        </span>
      </div>
    </div>
  );
};

const RankCell = ({ row, theme }: { row: Row; theme?: string }) => {
  const colors = getThemeColors(theme);
  const rank = row.rank as number;
  const change = (row.rankChange as number) ?? 0;
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

const RegionCell = ({ row, theme }: { row: Row; theme?: string }) => {
  const colors = getThemeColors(theme);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      <span style={{ display: "flex", alignItems: "center", gap: "6px", color: colors.text }}>
        <span style={{ fontSize: "15px" }}>{row.countryFlag as string}</span>
        {row.country as string}
      </span>
      <span style={{ fontSize: "12px", color: colors.muted }}>{row.continent as string}</span>
    </div>
  );
};

const ScoreCell = ({ row, theme }: { row: Row; theme?: string }) => {
  const colors = getThemeColors(theme);
  const score = row.score as number;
  const scoreChange = (row.scoreChange as number) ?? 0;
  const rank = row.rank as number;
  const rankChange = (row.rankChange as number) ?? 0;

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

const DateCell = ({ row, accessor, theme }: { row: Row; accessor: string; theme?: string }) => {
  const colors = getThemeColors(theme);
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
      <div key={i} style={{ width: `${s.value}%`, backgroundColor: s.color, borderRadius: "3px" }} />
    ))}
  </div>
);

const AudienceAgeCell = ({ row, theme }: { row: Row; theme?: string }) => {
  const colors = getThemeColors(theme);
  const age = (row.audienceAge as Record<string, number>) ?? {};
  const youngShare = (age["18-24"] ?? 0) + (age["25-34"] ?? 0) + (age["13-17"] ?? 0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
      <div style={{ fontSize: "12px", color: colors.muted }}>
        Aged 13-34: <span style={{ color: colors.text, fontWeight: 600 }}>{youngShare}%</span>
      </div>
      <SegmentedBar segments={AGE_SEGMENTS.map((s) => ({ color: s.color, value: age[s.key] ?? 0 }))} />
    </div>
  );
};

const AudienceGenderCell = ({ row, theme }: { row: Row; theme?: string }) => {
  const colors = getThemeColors(theme);
  const gender = (row.audienceGender as { f: number; m: number }) ?? { f: 0, m: 0 };
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

const PopularityCell = ({ row, theme }: { row: Row; theme?: string }) => {
  const value = row.spotifyPopularity as number | undefined;
  const change = row.spotifyPopularityChangePercent as number | undefined;
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
  options: StatOptions & { width?: number } = {}
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

export const HEADERS: HeaderObject[] = [
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
    valueGetter: ({ row }) => row.artistName as string,
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
    valueGetter: ({ row }) => row.country as string,
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
    cellRenderer: ({ row, theme }) => (
      <DateCell row={row} accessor="earliestAlbumReleaseDate" theme={theme} />
    ),
  },
  {
    accessor: "latestAlbumReleaseDate",
    label: "Latest Release",
    width: 160,
    isSortable: false,
    isEditable: false,
    align: "right",
    type: "string",
    cellRenderer: ({ row, theme }) => (
      <DateCell row={row} accessor="latestAlbumReleaseDate" theme={theme} />
    ),
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
