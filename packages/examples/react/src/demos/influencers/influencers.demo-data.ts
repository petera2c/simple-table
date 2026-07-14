export type InfluencerTheme = string | undefined;

export type AudienceGender = { f: number; m: number };

export type BreakdownItem = { label: string; flag?: string; percent: number };

export type FeaturedEntity = { name: string; subtitle?: string; color: string };

export type TopVideo = {
  platform: "tiktok" | "instagram" | "youtube";
  metric: string;
  metricLabel: "views" | "likes";
  color: string;
};

/**
 * Chartmetric-faithful row shape: nested accessors match their production table
 * (profiles.*, audienceStats.*, ranks.score_100, etc.).
 */
export type Influencer = {
  id: string;
  __index__: number;
  name: string;
  avatarColor: string;
  category: string;
  niche: string;
  country: string;
  countryFlag: string;
  role: string;
  gender: string;
  ageRange: string;
  ranks: { score_100: number };
  profiles: {
    tiktok_followers: number;
    youtube_followers: number;
    instagram_followers: number;
    tiktok_posts_count: number;
    instagram_posts_count: number;
    youtube_posts_count: number;
  };
  audienceStats: {
    /** Location column accessor in Chartmetric */
    code2: string;
    language: string;
    gender: AudienceGender;
    tiktok_engagement_rate: number | null;
    tiktok_avg_views: number | null;
    tiktok_avg_likes: number | null;
    tiktok_avg_comments: number | null;
    instagram_engagement_rate: number | null;
    instagram_avg_reels_plays: number | null;
    instagram_avg_likes: number | null;
    instagram_avg_comments: number | null;
    youtube_engagement_rate: number | null;
    youtube_avg_views: number | null;
    youtube_avg_likes: number | null;
    youtube_avg_comments: number | null;
  };
  /** Rich display payloads used by custom cell renderers (not column accessors). */
  audienceLocation: BreakdownItem;
  audienceLanguage: BreakdownItem;
  topContents: TopVideo[];
  tracksFeatured: FeaturedEntity | null;
  artistsFeatured: FeaturedEntity | null;
};

const NAMES = [
  "Music Extreme",
  "Angie García",
  "vanetsuki",
  "Deidra R",
  "Kati",
  "Nurnisa Omar",
  "rosaria.rodrigues",
  "elakristela",
  "Arthur Lima",
  "Luna Park",
  "Kai Nakamura",
  "Sofia Reyes",
  "Marcus Cole",
  "Priya Sharma",
  "Noah Berg",
  "Amara Okonkwo",
  "Felix Moreau",
  "Yuki Tanaka",
  "Camila Duarte",
  "Jordan Blake",
  "Elena Popov",
  "Diego Santos",
  "Aisha Rahman",
  "Leo Andersson",
  "Mei Chen",
  "Omar Hassan",
];

const CATEGORIES = [
  "Music",
  "Art & Design",
  "Activities & Sports",
  "Restaurants, Food & Drink",
  "Travel, Tourism & Adventure",
  "Friends, Family & Relationships",
  "Beauty & Fashion",
  "Gaming",
];

const NICHES = [
  "extreme metal",
  "dance",
  "Gym Content",
  "80s music",
  "cooking",
  "malaysian food",
  "family life",
  "albanian culture",
  "Dance Content",
  "street fashion",
  "indie pop",
  "travel vlogs",
];

const ROLES = [
  "Playlist Curator",
  "Social Media Creator",
  "Content Creator",
  "Musician",
  "Influencer",
  "Lifestyle Creator",
];

const REGIONS = [
  { country: "United States", flag: "🇺🇸", code2: "US" },
  { country: "Mexico", flag: "🇲🇽", code2: "MX" },
  { country: "El Salvador", flag: "🇸🇻", code2: "SV" },
  { country: "Germany", flag: "🇩🇪", code2: "DE" },
  { country: "Malaysia", flag: "🇲🇾", code2: "MY" },
  { country: "Brazil", flag: "🇧🇷", code2: "BR" },
  { country: "Italy", flag: "🇮🇹", code2: "IT" },
  { country: "Japan", flag: "🇯🇵", code2: "JP" },
  { country: "France", flag: "🇫🇷", code2: "FR" },
  { country: "India", flag: "🇮🇳", code2: "IN" },
  { country: "Spain", flag: "🇪🇸", code2: "ES" },
  { country: "Canada", flag: "🇨🇦", code2: "CA" },
];

const LANGUAGES = [
  "English",
  "Spanish",
  "Portuguese",
  "German",
  "Malay",
  "Japanese",
  "French",
  "Italian",
];

const TRACKS = [
  { name: "The Outspoken", subtitle: "Bloodhunter" },
  { name: "Contra Gigantes", subtitle: "Country Cristiano YT" },
  { name: "Deep pressure", subtitle: "yasuhiro soda" },
  { name: "Rintihan Malam", subtitle: "THE PHOENIX" },
  { name: "Stilla Chjara", subtitle: "Maurizio Bucalo" },
  { name: "No Tomorrow", subtitle: "MEET KARIM" },
  { name: "Um Certo Galileu", subtitle: "Rayne Almeida" },
  { name: "Midnight Drive", subtitle: "Neon Atlas" },
];

const ARTISTS = [
  "Obituary",
  "Juan Gabriel",
  "Elita 5",
  "Mc Gw",
  "John Martin",
  "JENNIE",
  "Continental",
  "Rosalía",
  "Bad Bunny",
  "Billie Eilish",
];

const AVATAR_COLORS = [
  "#0d9488",
  "#7c3aed",
  "#db2777",
  "#ea580c",
  "#2563eb",
  "#059669",
  "#dc2626",
  "#ca8a04",
  "#4f46e5",
  "#0891b2",
];

const VIDEO_COLORS = ["#14b8a6", "#f43f5e", "#8b5cf6", "#f59e0b", "#3b82f6", "#10b981"];

function createRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

export function formatCompact(n: number | null | undefined): string {
  if (n == null) return "";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`.replace(".0M", "M");
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}K`.replace(".0K", "K");
  return String(Math.round(n));
}

export function formatRate(n: number | null | undefined): string {
  if (n == null) return "";
  return `${n.toFixed(2)}%`;
}

const THEME_COLORS: Record<string, { text: string; muted: string; border: string; chipBg: string }> = {
  light: { text: "#1f2937", muted: "#6b7280", border: "#e5e7eb", chipBg: "#f3f4f6" },
  "modern-light": { text: "#1f2937", muted: "#6b7280", border: "#e5e7eb", chipBg: "#f3f4f6" },
  neutral: { text: "#1f2937", muted: "#6b7280", border: "#e5e7eb", chipBg: "#f3f4f6" },
  dark: { text: "#f3f4f6", muted: "#9ca3af", border: "#374151", chipBg: "#1f2937" },
  "modern-dark": { text: "#f3f4f6", muted: "#9ca3af", border: "#374151", chipBg: "#1f2937" },
};

export function getInfluencerThemeColors(theme?: InfluencerTheme) {
  return THEME_COLORS[theme ?? "light"] ?? THEME_COLORS.light;
}

function maybeNull(rand: () => number, value: number, chanceEmpty: number): number | null {
  return rand() < chanceEmpty ? null : value;
}

/**
 * Generate a batch of influencers for infinite scroll.
 * `startIndex` is the absolute row offset; each index is seeded so batches are
 * stable and non-overlapping across loads (Chartmetric-style page fetches).
 */
export function generateInfluencerData(startIndex = 0, count = 26): Influencer[] {
  return Array.from({ length: count }, (_, offset) => {
    const i = startIndex + offset;
    const rand = createRng(2026 + i * 9973);
    const between = (min: number, max: number) => min + rand() * (max - min);
    const intBetween = (min: number, max: number) => Math.round(between(min, max));
    const pick = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];

    const name = NAMES[i % NAMES.length];
    const region = pick(REGIONS);
    const genderRoll = rand();
    const genderLabel = genderRoll < 0.48 ? "Female" : genderRoll < 0.92 ? "Male" : "";
    const ageRange = pick(["18-24", "25-34", "35-44", "45-64", "65+"]);
    const f = intBetween(7, 90);
    const track = rand() > 0.15 ? pick(TRACKS) : null;
    const artist = rand() > 0.15 ? pick(ARTISTS) : null;
    const locationPct = intBetween(22, 95);
    const languagePct = intBetween(30, 95);
    const language = pick(LANGUAGES);
    const platforms: Array<TopVideo["platform"]> = [
      "tiktok",
      "instagram",
      "youtube",
      "tiktok",
      "instagram",
    ];

    const topContents: TopVideo[] = [0, 1, 2, 3, 4].map((idx) => {
      const platform = platforms[idx % platforms.length];
      const metricValue =
        platform === "instagram" ? intBetween(20_000, 3_000_000) : intBetween(12_000, 6_000_000);
      return {
        platform,
        metric: formatCompact(metricValue),
        metricLabel: platform === "instagram" ? "likes" : "views",
        color: VIDEO_COLORS[(i + idx) % VIDEO_COLORS.length],
      };
    });

    return {
      id: `inf-${i + 1}`,
      __index__: i + 1,
      name,
      avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
      category: pick(CATEGORIES),
      niche: pick(NICHES),
      country: region.country,
      countryFlag: region.flag,
      role: pick(ROLES),
      gender: genderLabel,
      ageRange,
      ranks: { score_100: intBetween(35, 99) },
      profiles: {
        tiktok_followers: intBetween(50_000, 4_500_000),
        youtube_followers: intBetween(10_000, 2_800_000),
        instagram_followers: intBetween(20_000, 3_200_000),
        tiktok_posts_count: intBetween(200, 4500),
        instagram_posts_count: intBetween(40, 1800),
        youtube_posts_count: intBetween(20, 1500),
      },
      audienceStats: {
        code2: region.code2,
        language,
        gender: { f, m: 100 - f },
        tiktok_engagement_rate: maybeNull(rand, +between(0.8, 12).toFixed(2), 0.1),
        tiktok_avg_views: maybeNull(rand, intBetween(8_000, 2_500_000), 0.1),
        tiktok_avg_likes: maybeNull(rand, intBetween(500, 900_000), 0.1),
        tiktok_avg_comments: maybeNull(rand, intBetween(2, 12_000), 0.1),
        instagram_engagement_rate: maybeNull(rand, +between(0.8, 12).toFixed(2), 0.4),
        instagram_avg_reels_plays: maybeNull(rand, intBetween(5_000, 8_000_000), 0.4),
        instagram_avg_likes: maybeNull(rand, intBetween(200, 400_000), 0.4),
        instagram_avg_comments: maybeNull(rand, intBetween(5, 4_000), 0.4),
        youtube_engagement_rate: maybeNull(rand, +between(0.8, 12).toFixed(2), 0.55),
        youtube_avg_views: maybeNull(rand, intBetween(10_000, 4_000_000), 0.55),
        youtube_avg_likes: maybeNull(rand, intBetween(300, 200_000), 0.55),
        youtube_avg_comments: maybeNull(rand, intBetween(10, 5_000), 0.55),
      },
      audienceLocation: {
        label: region.country,
        flag: region.flag,
        percent: locationPct,
      },
      audienceLanguage: {
        label: language,
        percent: languagePct,
      },
      topContents,
      tracksFeatured: track
        ? {
            name: track.name,
            subtitle: track.subtitle,
            color: AVATAR_COLORS[(i + 2) % AVATAR_COLORS.length],
          }
        : null,
      artistsFeatured: artist
        ? { name: artist, color: AVATAR_COLORS[(i + 5) % AVATAR_COLORS.length] }
        : null,
    };
  });
}

export const influencerData = generateInfluencerData(0, 26);
