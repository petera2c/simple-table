export type InfluencerTheme = string | undefined;

export type AudienceAge = {
  "13-17": number;
  "18-24": number;
  "25-34": number;
  "35-44": number;
  "45-64": number;
  "65+": number;
};

export type AudienceGender = { f: number; m: number };

export type BreakdownItem = { label: string; flag?: string; percent: number };

export type FeaturedEntity = { name: string; subtitle?: string; color: string };

export type TopVideo = {
  platform: "tiktok" | "instagram" | "youtube";
  metric: string;
  metricLabel: "views" | "likes";
  color: string;
};

export type PlatformStats = {
  postsCount: number;
  postsCountFormatted: string;
  engagementRate: number | null;
  engagementRateFormatted: string;
  avgViews: number | null;
  avgViewsFormatted: string;
  avgLikes: number | null;
  avgLikesFormatted: string;
  avgComments: number | null;
  avgCommentsFormatted: string;
  /** Instagram-only */
  avgReelsPlays?: number | null;
  avgReelsPlaysFormatted?: string;
};

export type Influencer = {
  id: string;
  rank: number;
  name: string;
  avatarColor: string;
  category: string;
  niche: string;
  country: string;
  countryFlag: string;
  role: string;
  gender: string;
  ageRange: string;
  score: number;
  scoreFormatted: string;
  tiktokFollowers: number;
  tiktokFollowersFormatted: string;
  youtubeFollowers: number;
  youtubeFollowersFormatted: string;
  instagramFollowers: number;
  instagramFollowersFormatted: string;
  topVideos: TopVideo[];
  trackFeatured: FeaturedEntity | null;
  artistFeatured: FeaturedEntity | null;
  audienceLocation: BreakdownItem;
  audienceLanguage: BreakdownItem;
  audienceGender: AudienceGender;
  audienceAge: AudienceAge;
  tiktokStats: PlatformStats;
  instagramStats: PlatformStats;
  youtubeStats: PlatformStats;
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
  "Isla MacLeod",
  "Ravi Patel",
  "Nina Volkov",
  "Theo Martins",
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
  { country: "United States", flag: "🇺🇸" },
  { country: "Mexico", flag: "🇲🇽" },
  { country: "El Salvador", flag: "🇸🇻" },
  { country: "Germany", flag: "🇩🇪" },
  { country: "Malaysia", flag: "🇲🇾" },
  { country: "Brazil", flag: "🇧🇷" },
  { country: "Italy", flag: "🇮🇹" },
  { country: "Japan", flag: "🇯🇵" },
  { country: "France", flag: "🇫🇷" },
  { country: "India", flag: "🇮🇳" },
  { country: "Spain", flag: "🇪🇸" },
  { country: "Canada", flag: "🇨🇦" },
];

const LANGUAGES = ["English", "Spanish", "Portuguese", "German", "Malay", "Japanese", "French", "Italian"];

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

export function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`.replace(".0M", "M");
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}K`.replace(".0K", "K");
  return String(Math.round(n));
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

function buildAudienceAge(rand: () => number): AudienceAge {
  const between = (min: number, max: number) => min + rand() * (max - min);
  const raw = {
    "13-17": between(1, 12),
    "18-24": between(15, 45),
    "25-34": between(18, 40),
    "35-44": between(8, 25),
    "45-64": between(3, 20),
    "65+": between(0.2, 8),
  };
  const total = Object.values(raw).reduce((a, b) => a + b, 0);
  const age = {} as AudienceAge;
  for (const key of Object.keys(raw) as (keyof AudienceAge)[]) {
    age[key] = Math.round((raw[key] / total) * 100);
  }
  return age;
}

function maybeNull<T>(rand: () => number, value: T, chanceEmpty = 0.35): T | null {
  return rand() < chanceEmpty ? null : value;
}

function buildPlatformStats(
  rand: () => number,
  opts: {
    postsMin: number;
    postsMax: number;
    viewsMin: number;
    viewsMax: number;
    likesMin: number;
    likesMax: number;
    commentsMin: number;
    commentsMax: number;
    withReels?: boolean;
    emptyChance?: number;
  }
): PlatformStats {
  const between = (min: number, max: number) => min + rand() * (max - min);
  const intBetween = (min: number, max: number) => Math.round(between(min, max));
  const emptyChance = opts.emptyChance ?? 0.35;
  const postsCount = intBetween(opts.postsMin, opts.postsMax);
  const engagement = maybeNull(rand, +between(0.8, 12).toFixed(2), emptyChance);
  const avgViews = maybeNull(rand, intBetween(opts.viewsMin, opts.viewsMax), emptyChance);
  const avgLikes = maybeNull(rand, intBetween(opts.likesMin, opts.likesMax), emptyChance);
  const avgComments = maybeNull(rand, intBetween(opts.commentsMin, opts.commentsMax), emptyChance);
  const avgReelsPlays = opts.withReels
    ? maybeNull(rand, intBetween(5_000, 8_000_000), emptyChance)
    : undefined;

  return {
    postsCount,
    postsCountFormatted: formatCompact(postsCount),
    engagementRate: engagement,
    engagementRateFormatted: engagement == null ? "" : `${engagement.toFixed(2)}%`,
    avgViews,
    avgViewsFormatted: avgViews == null ? "" : formatCompact(avgViews),
    avgLikes,
    avgLikesFormatted: avgLikes == null ? "" : formatCompact(avgLikes),
    avgComments,
    avgCommentsFormatted: avgComments == null ? "" : formatCompact(avgComments),
    avgReelsPlays,
    avgReelsPlaysFormatted: avgReelsPlays == null ? "" : formatCompact(avgReelsPlays),
  };
}

export function generateInfluencerData(count = 80): Influencer[] {
  const rand = createRng(2026);
  const between = (min: number, max: number) => min + rand() * (max - min);
  const intBetween = (min: number, max: number) => Math.round(between(min, max));
  const pick = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];

  return Array.from({ length: count }, (_, i) => {
    const baseName = NAMES[i % NAMES.length];
    const cycle = Math.floor(i / NAMES.length);
    const name = cycle === 0 ? baseName : `${baseName} ${cycle + 1}`;
    const region = pick(REGIONS);
    const genderRoll = rand();
    const gender = genderRoll < 0.48 ? "Female" : genderRoll < 0.92 ? "Male" : "";
    const ageRange = pick(["18-24", "25-34", "35-44", "45-64", "65+"]);
    const f = intBetween(7, 90);
    const track = rand() > 0.15 ? pick(TRACKS) : null;
    const artist = rand() > 0.15 ? pick(ARTISTS) : null;
    const locationPct = intBetween(22, 95);
    const languagePct = intBetween(30, 95);
    const platforms: Array<TopVideo["platform"]> = ["tiktok", "instagram", "youtube", "tiktok", "instagram"];

    const topVideos: TopVideo[] = [0, 1, 2, 3, 4].map((idx) => {
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

    const tiktokFollowers = intBetween(50_000, 4_500_000);
    const youtubeFollowers = intBetween(10_000, 2_800_000);
    const instagramFollowers = intBetween(20_000, 3_200_000);
    const score = intBetween(35, 99);

    return {
      id: `inf-${i + 1}`,
      rank: i + 1,
      name,
      avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
      category: pick(CATEGORIES),
      niche: pick(NICHES),
      country: region.country,
      countryFlag: region.flag,
      role: pick(ROLES),
      gender,
      ageRange,
      score,
      scoreFormatted: String(score),
      tiktokFollowers,
      tiktokFollowersFormatted: formatCompact(tiktokFollowers),
      youtubeFollowers,
      youtubeFollowersFormatted: formatCompact(youtubeFollowers),
      instagramFollowers,
      instagramFollowersFormatted: formatCompact(instagramFollowers),
      topVideos,
      trackFeatured: track
        ? {
            name: track.name,
            subtitle: track.subtitle,
            color: AVATAR_COLORS[(i + 2) % AVATAR_COLORS.length],
          }
        : null,
      artistFeatured: artist
        ? { name: artist, color: AVATAR_COLORS[(i + 5) % AVATAR_COLORS.length] }
        : null,
      audienceLocation: {
        label: region.country,
        flag: region.flag,
        percent: locationPct,
      },
      audienceLanguage: {
        label: pick(LANGUAGES),
        percent: languagePct,
      },
      audienceGender: { f, m: 100 - f },
      audienceAge: buildAudienceAge(rand),
      tiktokStats: buildPlatformStats(rand, {
        postsMin: 200,
        postsMax: 4500,
        viewsMin: 8_000,
        viewsMax: 2_500_000,
        likesMin: 500,
        likesMax: 900_000,
        commentsMin: 2,
        commentsMax: 12_000,
        emptyChance: 0.1,
      }),
      instagramStats: buildPlatformStats(rand, {
        postsMin: 40,
        postsMax: 1800,
        viewsMin: 5_000,
        viewsMax: 1_200_000,
        likesMin: 200,
        likesMax: 400_000,
        commentsMin: 5,
        commentsMax: 4_000,
        withReels: true,
        emptyChance: 0.4,
      }),
      youtubeStats: buildPlatformStats(rand, {
        postsMin: 20,
        postsMax: 1500,
        viewsMin: 10_000,
        viewsMax: 4_000_000,
        likesMin: 300,
        likesMax: 200_000,
        commentsMin: 10,
        commentsMax: 5_000,
        emptyChance: 0.55,
      }),
    };
  });
}

export const influencerData = generateInfluencerData(80);
