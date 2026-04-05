// Self-contained demo table setup for this example.
import type { HeaderObject } from "@simple-table/solid";

export interface MusicArtist {
  id: number;
  rank: number;
  artistName: string;
  artistType: string;
  pronouns: string;
  recordLabel: string;
  lyricsLanguage: string;
  genre: string;
  mood: string;
  growthStatus: string;
  followers: number;
  followersFormatted: string;
  followersGrowthFormatted: string;
  followersGrowthPercent: number;
  followers7DayGrowth: number;
  followers7DayGrowthPercent: number;
  followers28DayGrowth: number;
  followers28DayGrowthPercent: number;
  followers60DayGrowth: number;
  followers60DayGrowthPercent: number;
  popularity: number;
  popularityChangePercent: number;
  playlistReach: number;
  playlistReachFormatted: string;
  playlistReachChange: number;
  playlistReachChangeFormatted: string;
  playlistReachChangePercent: number;
  playlistReach7DayGrowth: number;
  playlistReach7DayGrowthPercent: number;
  playlistReach28DayGrowth: number;
  playlistReach28DayGrowthPercent: number;
  playlistReach60DayGrowth: number;
  playlistReach60DayGrowthPercent: number;
  playlistCount: number;
  playlistCountGrowth: number;
  playlistCountGrowthPercent: number;
  playlistCount7DayGrowth: number;
  playlistCount7DayGrowthPercent: number;
  playlistCount28DayGrowth: number;
  playlistCount28DayGrowthPercent: number;
  playlistCount60DayGrowth: number;
  playlistCount60DayGrowthPercent: number;
  monthlyListeners: number;
  monthlyListenersFormatted: string;
  monthlyListenersChange: number;
  monthlyListenersChangeFormatted: string;
  monthlyListenersChangePercent: number;
  monthlyListeners7DayGrowth: number;
  monthlyListeners7DayGrowthPercent: number;
  monthlyListeners28DayGrowth: number;
  monthlyListeners28DayGrowthPercent: number;
  monthlyListeners60DayGrowth: number;
  monthlyListeners60DayGrowthPercent: number;
  conversionRate: number;
  reachFollowersRatio: number;
}


const ARTIST_NAMES = ["Luna Nova", "The Midnight Echo", "Astral Frequency", "Crimson Tide", "Echo Chamber", "Neon Pulse", "Celestial Drift", "Violet Storm", "Arctic Monkeys", "Glass Animals", "Tame Impala", "Beach House", "Radiohead", "Portishead", "Massive Attack", "Bonobo", "Four Tet", "Caribou", "Jamie xx", "Burial"];
const ARTIST_TYPES = ["Solo Artist", "Band", "Duo", "Collective", "DJ/Producer"];
const PRONOUNS = ["she/her", "he/him", "they/them", "she/they", "he/they"];
const RECORD_LABELS = ["Universal", "Sony Music", "Warner", "Independent", "Sub Pop", "XL Recordings", "4AD", "Warp Records", "Ninja Tune", "Domino"];
const LANGUAGES = ["English", "Spanish", "French", "Portuguese", "Korean", "Japanese", "Multilingual"];
const GENRES = ["Pop", "Rock", "Electronic", "Hip Hop", "R&B", "Indie", "Alternative", "Jazz", "Folk", "Metal"];
const MOODS = ["Energetic", "Chill", "Dark", "Uplifting", "Melancholic", "Dreamy", "Aggressive", "Romantic"];
const GROWTH_STATUSES = ["Rising", "Established", "Viral", "Steady", "Declining", "Breakthrough"];

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export function generateMusicData(count: number = 50): MusicArtist[] {
  return Array.from({ length: count }, (_, i) => {
    const followers = Math.floor(10000 + Math.random() * 5000000);
    const followersGrowth = Math.floor(followers * (0.01 + Math.random() * 0.05));
    const playlistReach = Math.floor(followers * (0.5 + Math.random() * 3));
    const playlistReachChange = Math.floor(playlistReach * ((Math.random() - 0.3) * 0.1));
    const playlistCount = Math.floor(50 + Math.random() * 5000);
    const playlistCountGrowth = Math.floor(playlistCount * (0.01 + Math.random() * 0.05));
    const monthlyListeners = Math.floor(followers * (1 + Math.random() * 5));
    const monthlyListenersChange = Math.floor(monthlyListeners * ((Math.random() - 0.3) * 0.08));
    const growthMultiplier = () => 0.01 + Math.random() * 0.03;
    const randomGrowth = (base: number) => Math.floor(base * growthMultiplier());
    const randomGrowthPercent = () => Math.round((0.5 + Math.random() * 5) * 100) / 100;
    const randomGrowthSigned = (base: number) => { const v = Math.floor(base * ((Math.random() - 0.3) * 0.05)); return v; };
    const randomGrowthSignedPercent = () => { const v = Math.round(((Math.random() - 0.3) * 5) * 100) / 100; return v; };

    return {
      id: i + 1,
      rank: i + 1,
      artistName: ARTIST_NAMES[i % ARTIST_NAMES.length],
      artistType: ARTIST_TYPES[i % ARTIST_TYPES.length],
      pronouns: PRONOUNS[i % PRONOUNS.length],
      recordLabel: RECORD_LABELS[i % RECORD_LABELS.length],
      lyricsLanguage: LANGUAGES[i % LANGUAGES.length],
      genre: GENRES[i % GENRES.length],
      mood: MOODS[i % MOODS.length],
      growthStatus: GROWTH_STATUSES[i % GROWTH_STATUSES.length],
      followers,
      followersFormatted: formatNumber(followers),
      followersGrowthFormatted: formatNumber(followersGrowth),
      followersGrowthPercent: Math.round((followersGrowth / followers) * 10000) / 100,
      followers7DayGrowth: randomGrowth(followers),
      followers7DayGrowthPercent: randomGrowthPercent(),
      followers28DayGrowth: randomGrowth(followers) * 3,
      followers28DayGrowthPercent: randomGrowthPercent() * 2,
      followers60DayGrowth: randomGrowth(followers) * 6,
      followers60DayGrowthPercent: randomGrowthPercent() * 3,
      popularity: Math.floor(30 + Math.random() * 70),
      popularityChangePercent: Math.round(((Math.random() - 0.4) * 10) * 100) / 100,
      playlistReach,
      playlistReachFormatted: formatNumber(playlistReach),
      playlistReachChange,
      playlistReachChangeFormatted: formatNumber(Math.abs(playlistReachChange)),
      playlistReachChangePercent: Math.round((playlistReachChange / playlistReach) * 10000) / 100,
      playlistReach7DayGrowth: randomGrowthSigned(playlistReach),
      playlistReach7DayGrowthPercent: randomGrowthSignedPercent(),
      playlistReach28DayGrowth: randomGrowthSigned(playlistReach) * 3,
      playlistReach28DayGrowthPercent: randomGrowthSignedPercent() * 2,
      playlistReach60DayGrowth: randomGrowthSigned(playlistReach) * 5,
      playlistReach60DayGrowthPercent: randomGrowthSignedPercent() * 3,
      playlistCount,
      playlistCountGrowth,
      playlistCountGrowthPercent: Math.round((playlistCountGrowth / playlistCount) * 10000) / 100,
      playlistCount7DayGrowth: randomGrowth(playlistCount),
      playlistCount7DayGrowthPercent: randomGrowthPercent(),
      playlistCount28DayGrowth: randomGrowth(playlistCount) * 3,
      playlistCount28DayGrowthPercent: randomGrowthPercent() * 2,
      playlistCount60DayGrowth: randomGrowth(playlistCount) * 5,
      playlistCount60DayGrowthPercent: randomGrowthPercent() * 3,
      monthlyListeners,
      monthlyListenersFormatted: formatNumber(monthlyListeners),
      monthlyListenersChange,
      monthlyListenersChangeFormatted: formatNumber(Math.abs(monthlyListenersChange)),
      monthlyListenersChangePercent: Math.round((monthlyListenersChange / monthlyListeners) * 10000) / 100,
      monthlyListeners7DayGrowth: randomGrowthSigned(monthlyListeners),
      monthlyListeners7DayGrowthPercent: randomGrowthSignedPercent(),
      monthlyListeners28DayGrowth: randomGrowthSigned(monthlyListeners) * 3,
      monthlyListeners28DayGrowthPercent: randomGrowthSignedPercent() * 2,
      monthlyListeners60DayGrowth: randomGrowthSigned(monthlyListeners) * 5,
      monthlyListeners60DayGrowthPercent: randomGrowthSignedPercent() * 3,
      conversionRate: Math.round((1 + Math.random() * 15) * 100) / 100,
      reachFollowersRatio: Math.round((playlistReach / followers) * 10) / 10,
    };
  });
}

export const musicData = generateMusicData(50);

export const musicHeaders: HeaderObject[] = [
  { accessor: "rank", label: "#", width: 60, isSortable: true, isEditable: false, align: "center", type: "number", pinned: "left" },
  { accessor: "artistName", label: "Artist", width: 330, isSortable: true, isEditable: false, align: "left", type: "string", pinned: "left" },
  { accessor: "artistType", label: "Identity", width: 280, isSortable: false, isEditable: false, align: "left", type: "string" },
  {
    accessor: "followersGroup", label: "Followers", width: 700, collapsible: true,
    children: [
      { accessor: "followers", label: "Total Followers", width: 180, showWhen: "always", isSortable: true, isEditable: false, type: "number" },
      { accessor: "followers7DayGrowth", label: "7-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded" },
      { accessor: "followers28DayGrowth", label: "28-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded" },
      { accessor: "followers60DayGrowth", label: "60-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded" },
    ],
  },
  { accessor: "popularity", label: "Popularity", width: 180, isSortable: true, isEditable: false, align: "center", type: "number" },
  {
    accessor: "playlistReachGroup", label: "Playlist Reach", width: 700, collapsible: true,
    children: [
      { accessor: "playlistReach", label: "Total Reach", width: 180, showWhen: "always", isSortable: true, isEditable: false, type: "number" },
      { accessor: "playlistReach7DayGrowth", label: "7-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded" },
      { accessor: "playlistReach28DayGrowth", label: "28-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded" },
      { accessor: "playlistReach60DayGrowth", label: "60-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded" },
    ],
  },
  {
    accessor: "playlistCountGroup", label: "Playlist Count", width: 700, collapsible: true,
    children: [
      { accessor: "playlistCount", label: "Total Count", width: 180, showWhen: "always", isSortable: true, isEditable: false, type: "number" },
      { accessor: "playlistCount7DayGrowth", label: "7-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded" },
      { accessor: "playlistCount28DayGrowth", label: "28-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded" },
      { accessor: "playlistCount60DayGrowth", label: "60-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded" },
    ],
  },
  {
    accessor: "monthlyListenersGroup", label: "Monthly Listeners", width: 700, collapsible: true,
    children: [
      { accessor: "monthlyListeners", label: "Total Listeners", width: 180, showWhen: "always", isSortable: true, isEditable: false, type: "number" },
      { accessor: "monthlyListeners7DayGrowth", label: "7-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded" },
      { accessor: "monthlyListeners28DayGrowth", label: "28-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded" },
      { accessor: "monthlyListeners60DayGrowth", label: "60-Day Growth", width: 160, isSortable: true, isEditable: false, align: "right", type: "number", showWhen: "parentExpanded" },
    ],
  },
  { accessor: "conversionRate", label: "Conversion Rate", width: 150, isSortable: true, isEditable: false, align: "right", type: "number" },
  { accessor: "reachFollowersRatio", label: "Reach/Followers Ratio", width: 220, isSortable: true, isEditable: false, align: "right", type: "number" },
];

export const MUSIC_THEME_COLORS: Record<string, Record<string, string>> = {
  "modern-light": { gray: "#374151", grayMuted: "#9ca3af", success: "#16a34a", successBg: "#f0fdf4", error: "#dc2626", errorBg: "#fef2f2", primary: "#2563eb", primaryBg: "#eff6ff", warning: "#d97706", warningBg: "#fffbeb", tagBorder: "#e5e7eb", tagBg: "#ffffff", tagText: "#000000", highScore: "#16a34a", mediumScore: "#2563eb", lowScore: "#f59e0b", veryLowScore: "#ef4444" },
  light: { gray: "#374151", grayMuted: "#9ca3af", success: "#16a34a", successBg: "#f0fdf4", error: "#dc2626", errorBg: "#fef2f2", primary: "#2563eb", primaryBg: "#eff6ff", warning: "#d97706", warningBg: "#fffbeb", tagBorder: "#e5e7eb", tagBg: "#ffffff", tagText: "#000000", highScore: "#16a34a", mediumScore: "#2563eb", lowScore: "#f59e0b", veryLowScore: "#ef4444" },
  "modern-dark": { gray: "#e5e7eb", grayMuted: "#9ca3af", success: "#22c55e", successBg: "#052e16", error: "#ef4444", errorBg: "#450a0a", primary: "#60a5fa", primaryBg: "#1e3a8a", warning: "#f59e0b", warningBg: "#451a03", tagBorder: "#4b5563", tagBg: "#111827", tagText: "#f9fafb", highScore: "#22c55e", mediumScore: "#60a5fa", lowScore: "#fbbf24", veryLowScore: "#f87171" },
  dark: { gray: "#e5e7eb", grayMuted: "#9ca3af", success: "#22c55e", successBg: "#052e16", error: "#ef4444", errorBg: "#450a0a", primary: "#60a5fa", primaryBg: "#1e3a8a", warning: "#f59e0b", warningBg: "#451a03", tagBorder: "#4b5563", tagBg: "#111827", tagText: "#f9fafb", highScore: "#22c55e", mediumScore: "#60a5fa", lowScore: "#fbbf24", veryLowScore: "#f87171" },
};

export function getMusicThemeColors(theme?: string): Record<string, string> {
  return MUSIC_THEME_COLORS[theme || "modern-light"] || MUSIC_THEME_COLORS["modern-light"];
}

export const musicConfig = {
  headers: musicHeaders,
  rows: musicData,
} as const;
