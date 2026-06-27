// Self-contained demo data for the Music example.
//
// This produces a wide, real-world-shaped artist analytics dataset (~60 columns)
// that mirrors the kind of multi-platform reporting grid consumers build on top
// of Simple Table. Data is generated at runtime via a deterministic PRNG so the
// rows (and any diffs) stay stable across reloads.

export interface MusicArtist {
  id: string;
  rank: number;
  rankChange: number;
  artistName: string;
  artistType: string;
  pronouns: string;
  recordLabel: string;
  genre: string;
  country: string;
  countryFlag: string;
  continent: string;
  score: number;
  scoreChange: number;
  earliestAlbumReleaseDate: string;
  latestAlbumReleaseDate: string;
  audienceAge: Record<string, number>;
  audienceGender: { f: number; m: number };
  // Single-value rates / ratios / scores
  spotifyPopularity: number;
  spotifyPopularityChangePercent: number;
  spotifyFollowersToListenersRatio: number;
  spotifyReachFollowersRatio: number;
  youtubeEngagementRate: number;
  instagramEngagementRate: number;
  tiktokEngagementRate: number;
  tiktokEngagementRateChange: number;
  // Each platform metric expands to `<key>`, `<key>Formatted`,
  // `<key>ChangeFormatted`, `<key>ChangePercent` (see METRICS below).
  [key: string]: string | number | Record<string, number> | undefined;
}

// Deterministic PRNG so regenerating produces stable data (and stable diffs).
function createRng(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function formatCompact(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${(n / 1e3).toFixed(2)}K`;
  return `${Math.round(n)}`;
}

const ARTISTS = [
  "Aurora Vale", "Neon Tigers", "Mika Sol", "The Velvet Echo", "Kairo",
  "Lumen", "Sasha Frost", "Midnight Cartel", "Indigo Wave", "Rico Mendez",
  "Halcyon", "Petra Lune", "The Drifters Club", "Yuki Mori", "Saint Cyprian",
  "Nova Rae", "Echo Park Kids", "Dante Cruz", "Marisol", "The Paper Lanterns",
  "Bly", "Cassius Gray", "Florae", "Tobias Wren", "Lola Sky",
  "Phantom Bloom", "Ren Akiyama", "The Saltwater Saints", "Vivienne Cole", "Ozma",
  "Calla Hart", "Brixton Row", "Sable", "The Northern Hum", "Adira",
  "Felix Stone", "Marigold", "The Glasshouse", "Nadia Volkov", "Sunset 88",
  "Caspian", "Wren & Wolf", "Lyric Monroe", "The Tidewater", "Esme",
  "Kingsley Ace", "Pale Horizon", "Octavia", "The Brass Hearts", "Zaire",
];

const ARTIST_TYPES = ["Solo Artist", "Band", "Duo", "Collective", "Producer"];
const PRONOUNS = ["She/Her", "He/Him", "They/Them"];
const LABELS = [
  "UMG (Republic Records)", "Sony Music", "Warner Records", "Atlantic", "Columbia",
  "Capitol", "Interscope", "Independent", "Def Jam", "RCA",
];
const GENRES = ["Pop", "Hip-Hop", "Indie", "R&B", "Electronic", "Rock", "Latin", "K-Pop"];
const REGIONS = [
  { country: "United States", flag: "🇺🇸", continent: "North America" },
  { country: "United Kingdom", flag: "🇬🇧", continent: "Europe" },
  { country: "South Korea", flag: "🇰🇷", continent: "Asia" },
  { country: "Brazil", flag: "🇧🇷", continent: "South America" },
  { country: "Canada", flag: "🇨🇦", continent: "North America" },
  { country: "Germany", flag: "🇩🇪", continent: "Europe" },
  { country: "Japan", flag: "🇯🇵", continent: "Asia" },
  { country: "France", flag: "🇫🇷", continent: "Europe" },
  { country: "Mexico", flag: "🇲🇽", continent: "North America" },
  { country: "Australia", flag: "🇦🇺", continent: "Oceania" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Each metric describes a "stat" column: a big total + period-over-period change.
// `base` controls magnitude.
const METRICS: [string, number][] = [
  // Followers / fans across platforms
  ["spotifyFollowers", 90e6],
  ["youtubeSubscribers", 45e6],
  ["instagramFollowers", 120e6],
  ["tiktokFollowers", 28e6],
  ["deezerFans", 9e6],
  ["facebookFollowers", 60e6],
  ["twitterFollowers", 55e6],
  ["soundcloudFollowers", 900e3],
  ["songkickFans", 4e6],
  ["snapchatSubscribers", 1.2e6],
  ["blueskyFollowers", 8e6],
  ["twitchFollowers", 600e3],
  ["lineMusicArtistLikes", 500e3],
  ["melonArtistFans", 80e3],
  // Spotify performance
  ["spotifyMonthlyListeners", 70e6],
  // YouTube performance
  ["youtubeChannelViews", 30e9],
  ["youtubeDailyVideoViews", 12e6],
  ["youtubeMonthlyListeners", 250e6],
  // Engagement / plays
  ["tiktokLikes", 200e6],
  ["wikipediaViews", 18e3],
  ["pandoraLifetimeStreams", 10e9],
  ["pandoraListeners28Day", 4e6],
  ["pandoraLifetimeStationsAdded", 40e6],
  ["facebookTalks", 40e3],
  ["lineMusicLikes", 900e3],
  ["lineMusicMvPlays", 28e3],
  ["lineMusicPlays", 120e6],
  ["melonVideoLikes", 7e3],
  ["melonVideoViews", 900e3],
  ["tiktokTopVideoViews", 200e9],
  ["soundcloudPlays", 70e6],
  ["boomplayFavorites", 300e3],
  ["boomplayPlays", 5e6],
  // Playlists
  ["spotifyPlaylistReach", 900e6],
  ["spotifyPlaylistCount", 1.5e6],
  ["youtubePlaylistCount", 1e3],
  ["deezerPlaylistCount", 1e3],
  ["itunesPlaylistCount", 2.5e3],
  ["amazonPlaylistCount", 1.5e3],
  ["deezerPlaylistReach", 55e6],
  // Airwaves / discovery
  ["tiktokTrackPosts", 100e6],
  ["airplayStreams", 8e6],
  ["siriusxmStreams", 140e3],
  ["geniusPageviews", 250e6],
  ["shazamCount", 240e6],
  ["twitterTweetCount", 800],
];

export function generateMusicData(count: number = 2000): MusicArtist[] {
  const rand = createRng(1337);
  const between = (min: number, max: number) => min + rand() * (max - min);
  const intBetween = (min: number, max: number) => Math.round(between(min, max));
  const pick = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
  const formatDate = (year: number) => `${pick(MONTHS)} ${intBetween(1, 28)}, ${year}`;

  const buildMetric = (key: string, base: number): Record<string, number | string> => {
    const value = Math.round(base * between(0.35, 1.4));
    const changePercent = +between(-12, 18).toFixed(2);
    const change = Math.round((value * changePercent) / 100);
    return {
      [key]: value,
      [`${key}Formatted`]: formatCompact(value),
      [`${key}ChangeFormatted`]: formatCompact(change),
      [`${key}ChangePercent`]: changePercent,
    };
  };

  const buildRates = () => ({
    spotifyPopularity: intBetween(60, 99),
    spotifyPopularityChangePercent: +between(-3, 3).toFixed(2),
    spotifyFollowersToListenersRatio: +between(40, 220).toFixed(1),
    spotifyReachFollowersRatio: +between(1.2, 9).toFixed(2),
    youtubeEngagementRate: +between(0.05, 0.6).toFixed(2),
    instagramEngagementRate: +between(0.4, 3.2).toFixed(2),
    tiktokEngagementRate: +between(1.5, 8).toFixed(2),
    tiktokEngagementRateChange: +between(-0.6, 0.6).toFixed(2),
  });

  const buildAudienceAge = (): Record<string, number> => {
    // weighted toward 18-34, like a typical pop audience
    const raw: Record<string, number> = {
      "13-17": between(4, 14),
      "18-24": between(25, 45),
      "25-34": between(20, 40),
      "35-44": between(6, 18),
      "45-59": between(3, 12),
      "60+": between(1, 6),
    };
    const total = Object.values(raw).reduce((a, b) => a + b, 0);
    const age: Record<string, number> = {};
    for (const k of Object.keys(raw)) age[k] = Math.round((raw[k] / total) * 100);
    return age;
  };

  const buildAudienceGender = () => {
    const f = intBetween(35, 70);
    return { f, m: 100 - f };
  };

  const rows: MusicArtist[] = Array.from({ length: count }, (_, i) => {
    // Cycle through the base name pool, adding a suffix once we wrap around so
    // every row stays unique even past the 50 seed names.
    const baseName = ARTISTS[i % ARTISTS.length];
    const cycle = Math.floor(i / ARTISTS.length);
    const artistName = cycle === 0 ? baseName : `${baseName} ${cycle + 1}`;

    const region = pick(REGIONS);
    const earliestYear = intBetween(2003, 2018);
    const row = {
      id: `artist-${i + 1}`,
      rank: i + 1,
      rankChange: intBetween(-6, 6),
      artistName,
      artistType: pick(ARTIST_TYPES),
      pronouns: pick(PRONOUNS),
      recordLabel: pick(LABELS),
      genre: pick(GENRES),
      country: region.country,
      countryFlag: region.flag,
      continent: region.continent,
      score: +between(45, 99.9).toFixed(1),
      scoreChange: +between(-2.5, 2.5).toFixed(1),
      earliestAlbumReleaseDate: formatDate(earliestYear),
      latestAlbumReleaseDate: formatDate(intBetween(earliestYear + 1, 2026)),
      audienceAge: buildAudienceAge(),
      audienceGender: buildAudienceGender(),
      ...buildRates(),
    } as MusicArtist;

    for (const [key, base] of METRICS) {
      Object.assign(row, buildMetric(key, base));
    }

    return row;
  });

  // Sort by score desc and re-rank so #1 is the top performer.
  rows.sort((a, b) => b.score - a.score);
  rows.forEach((row, idx) => {
    row.rank = idx + 1;
  });

  return rows;
}

export const musicData = generateMusicData(2000);

// ---------------------------------------------------------------------------
// Theme helpers (text / muted palette used by the cell renderers)
// ---------------------------------------------------------------------------
const THEME_COLORS: Record<string, { text: string; muted: string }> = {
  light: { text: "#1f2937", muted: "#6b7280" },
  "modern-light": { text: "#1f2937", muted: "#6b7280" },
  neutral: { text: "#1f2937", muted: "#6b7280" },
  sky: { text: "#0f172a", muted: "#64748b" },
  frost: { text: "#1e293b", muted: "#64748b" },
  violet: { text: "#2e1065", muted: "#7c6f9b" },
  dark: { text: "#f3f4f6", muted: "#9ca3af" },
  "modern-dark": { text: "#f3f4f6", muted: "#9ca3af" },
};

export function getMusicThemeColors(theme?: string): { text: string; muted: string } {
  return THEME_COLORS[theme ?? "light"] ?? THEME_COLORS.light;
}
