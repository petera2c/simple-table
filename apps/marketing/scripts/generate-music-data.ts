import type { Row } from "@simple-table/react";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Artist names pool
const ARTIST_NAMES = [
  "Arijit Singh",
  "Taylor Swift",
  "Ed Sheeran",
  "Billie Eilish",
  "The Weeknd",
  "Ariana Grande",
  "Eminem",
  "Drake",
  "Bad Bunny",
  "Justin Bieber",
  "BTS",
  "Dua Lipa",
  "Post Malone",
  "Olivia Rodrigo",
  "Harry Styles",
  "SZA",
  "Kendrick Lamar",
  "Doja Cat",
  "Shakira",
  "Coldplay",
  "Imagine Dragons",
  "Twenty One Pilots",
  "Adele",
  "Bruno Mars",
  "Rihanna",
  "Kanye West",
  "J Balvin",
  "Rosalía",
  "Anitta",
  "Peso Pluma",
  "Burna Boy",
  "Wizkid",
  "AP Dhillon",
  "Sidhu Moose Wala",
  "Atif Aslam",
  "Neha Kakkar",
  "Yo Yo Honey Singh",
  "Badshah",
  "Blackpink",
  "NewJeans",
  "Stray Kids",
  "Twice",
  "Måneskin",
  "Arctic Monkeys",
  "The 1975",
  "Lana Del Rey",
  "Travis Scott",
  "Metro Boomin",
  "Tyler, The Creator",
  "Frank Ocean",
];

// Growth statuses
const GROWTH_STATUSES = ["Growth", "Trending", "Steady", "Declining"];

// Moods/Vibes
const MOODS = [
  "Romantic",
  "Heartbroken",
  "Empowering",
  "Aggressive",
  "Celebratory",
  "Affectionate",
  "Energetic",
  "Melancholic",
  "Uplifting",
  "Chill",
  "Dark",
  "Hopeful",
];

// Genres
const GENRES = [
  "pop",
  "hip-hop/rap",
  "r&b/soul",
  "indie pop",
  "rock",
  "electronic/dance",
  "k-pop",
  "reggaeton",
  "bollywood",
  "latin",
  "country",
  "alternative",
  "punjabi",
  "afrobeat",
];

// Artist types
const ARTIST_TYPES = [
  { type: "Solo Artist", pronounOptions: ["He/Him", "She/Her", "They/Them"] },
  { type: "Band", pronounOptions: ["They/Them"] },
  { type: "Group", pronounOptions: ["They/Them"] },
];

// Record labels
const RECORD_LABELS = [
  "UMG (Republic Records)",
  "UMG (Interscope)",
  "Sony Music Entertainment",
  "Warner Music Group (Atlantic Records)",
  "T-Series",
  "YG Entertainment",
  "HYBE (Big Hit Music)",
  "Def Jam Recordings",
  "Columbia Records",
  "RCA Records",
  "Capitol Records",
  "Geffen Records",
  "Epic Records",
  "Island Records",
  "Independent",
];

// Languages
const LANGUAGES = [
  "English",
  "Hindi",
  "Spanish",
  "Korean",
  "Punjabi",
  "French",
  "Portuguese",
  "Japanese",
  "Italian",
  "German",
];

// Helper function to format large numbers
const formatNumber = (num: number): string => {
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(2)}B`;
  } else if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(2)}K`;
  }
  return num.toString();
};

// Generate realistic music artist data
const generateMusicData = (): Row[] => {
  const rows: Row[] = [];
  const totalRows = 50;
  const usedNames = new Set<string>();

  for (let i = 0; i < totalRows; i++) {
    // Get unique artist name
    let artistName;
    do {
      artistName = ARTIST_NAMES[Math.floor(Math.random() * ARTIST_NAMES.length)];
    } while (usedNames.has(artistName) && usedNames.size < ARTIST_NAMES.length);
    usedNames.add(artistName);

    // Artist type and pronouns
    const artistTypeObj = ARTIST_TYPES[Math.floor(Math.random() * ARTIST_TYPES.length)];
    const pronouns =
      artistTypeObj.pronounOptions[Math.floor(Math.random() * artistTypeObj.pronounOptions.length)];

    // Record label
    const recordLabel = RECORD_LABELS[Math.floor(Math.random() * RECORD_LABELS.length)];

    // Language
    const language = LANGUAGES[Math.floor(Math.random() * LANGUAGES.length)];

    // Growth status
    const growthStatus = GROWTH_STATUSES[Math.floor(Math.random() * GROWTH_STATUSES.length)];

    // Mood
    const mood = MOODS[Math.floor(Math.random() * MOODS.length)];

    // Genre
    const genre = GENRES[Math.floor(Math.random() * GENRES.length)];

    // Followers (between 10M and 200M)
    const followers = Math.floor(10000000 + Math.random() * 190000000);
    const followersGrowth = Math.floor(100000 + Math.random() * 5000000);
    const followersGrowthPercent = ((followersGrowth / followers) * 100).toFixed(2);

    // 7-day, 28-day, 60-day growth for followers
    const followers7DayGrowth = Math.floor(50000 + Math.random() * 500000);
    const followers7DayGrowthPercent = ((followers7DayGrowth / followers) * 100).toFixed(2);
    const followers28DayGrowth = Math.floor(200000 + Math.random() * 2000000);
    const followers28DayGrowthPercent = ((followers28DayGrowth / followers) * 100).toFixed(2);
    const followers60DayGrowth = Math.floor(500000 + Math.random() * 5000000);
    const followers60DayGrowthPercent = ((followers60DayGrowth / followers) * 100).toFixed(2);

    // Popularity (0-100)
    const popularity = Math.floor(70 + Math.random() * 30); // Most artists are 70-100
    const popularityChange = Math.floor(-5 + Math.random() * 10); // Change between -5 and +5
    const popularityChangePercent =
      popularity > 0 ? ((popularityChange / popularity) * 100).toFixed(2) : "0.00";

    // Playlist Reach (between 100M and 1B)
    const playlistReach = Math.floor(100000000 + Math.random() * 900000000);
    const playlistReachChange = Math.floor(-10000000 + Math.random() * 100000000);
    const playlistReachChangePercent = ((playlistReachChange / playlistReach) * 100).toFixed(2);

    // 7-day, 28-day, 60-day growth for playlist reach
    const playlistReach7DayGrowth = Math.floor(-5000000 + Math.random() * 20000000);
    const playlistReach7DayGrowthPercent = (
      (playlistReach7DayGrowth / playlistReach) *
      100
    ).toFixed(2);
    const playlistReach28DayGrowth = Math.floor(-10000000 + Math.random() * 100000000);
    const playlistReach28DayGrowthPercent = (
      (playlistReach28DayGrowth / playlistReach) *
      100
    ).toFixed(2);
    const playlistReach60DayGrowth = Math.floor(-10000000 + Math.random() * 150000000);
    const playlistReach60DayGrowthPercent = (
      (playlistReach60DayGrowth / playlistReach) *
      100
    ).toFixed(2);

    // Playlist Count (between 500 and 5000)
    const playlistCount = Math.floor(500 + Math.random() * 4500);
    const playlistCountGrowth = Math.floor(5 + Math.random() * 50);
    const playlistCountGrowthPercent = ((playlistCountGrowth / playlistCount) * 100).toFixed(2);

    // 7-day, 28-day, 60-day growth for playlist count
    const playlistCount7DayGrowth = Math.floor(2 + Math.random() * 20);
    const playlistCount7DayGrowthPercent = (
      (playlistCount7DayGrowth / playlistCount) *
      100
    ).toFixed(2);
    const playlistCount28DayGrowth = Math.floor(5 + Math.random() * 50);
    const playlistCount28DayGrowthPercent = (
      (playlistCount28DayGrowth / playlistCount) *
      100
    ).toFixed(2);
    const playlistCount60DayGrowth = Math.floor(10 + Math.random() * 100);
    const playlistCount60DayGrowthPercent = (
      (playlistCount60DayGrowth / playlistCount) *
      100
    ).toFixed(2);

    // Monthly Listeners (between 20M and 150M)
    const monthlyListeners = Math.floor(20000000 + Math.random() * 130000000);
    const monthlyListenersChange = Math.floor(-5000000 + Math.random() * 20000000);
    const monthlyListenersChangePercent = (
      (monthlyListenersChange / monthlyListeners) *
      100
    ).toFixed(2);

    // 7-day, 28-day, 60-day growth for monthly listeners
    const monthlyListeners7DayGrowth = Math.floor(-2000000 + Math.random() * 10000000);
    const monthlyListeners7DayGrowthPercent = (
      (monthlyListeners7DayGrowth / monthlyListeners) *
      100
    ).toFixed(2);
    const monthlyListeners28DayGrowth = Math.floor(-5000000 + Math.random() * 20000000);
    const monthlyListeners28DayGrowthPercent = (
      (monthlyListeners28DayGrowth / monthlyListeners) *
      100
    ).toFixed(2);
    const monthlyListeners60DayGrowth = Math.floor(-5000000 + Math.random() * 30000000);
    const monthlyListeners60DayGrowthPercent = (
      (monthlyListeners60DayGrowth / monthlyListeners) *
      100
    ).toFixed(2);

    // Conversion Rate (0-10%)
    const conversionRate = Math.round(Math.random() * 10 * 100) / 100;

    // Reach/Followers Ratio (0.5x - 10x)
    const reachFollowersRatio = Math.round((playlistReach / followers) * 100) / 100;

    rows.push({
      id: `artist-${i + 1}`,
      rank: i + 1,
      artistName,
      artistType: artistTypeObj.type,
      pronouns,
      recordLabel,
      lyricsLanguage: language,
      growthStatus,
      mood,
      genre,
      followers,
      followersFormatted: formatNumber(followers),
      followersGrowth,
      followersGrowthFormatted: formatNumber(followersGrowth),
      followersGrowthPercent: parseFloat(followersGrowthPercent),
      followers7DayGrowth,
      followers7DayGrowthPercent: parseFloat(followers7DayGrowthPercent),
      followers28DayGrowth,
      followers28DayGrowthPercent: parseFloat(followers28DayGrowthPercent),
      followers60DayGrowth,
      followers60DayGrowthPercent: parseFloat(followers60DayGrowthPercent),
      popularity,
      popularityChange,
      popularityChangePercent: parseFloat(popularityChangePercent),
      playlistReach,
      playlistReachFormatted: formatNumber(playlistReach),
      playlistReachChange,
      playlistReachChangeFormatted: formatNumber(playlistReachChange),
      playlistReachChangePercent: parseFloat(playlistReachChangePercent),
      playlistReach7DayGrowth,
      playlistReach7DayGrowthPercent: parseFloat(playlistReach7DayGrowthPercent),
      playlistReach28DayGrowth,
      playlistReach28DayGrowthPercent: parseFloat(playlistReach28DayGrowthPercent),
      playlistReach60DayGrowth,
      playlistReach60DayGrowthPercent: parseFloat(playlistReach60DayGrowthPercent),
      playlistCount,
      playlistCountGrowth,
      playlistCountGrowthPercent: parseFloat(playlistCountGrowthPercent),
      playlistCount7DayGrowth,
      playlistCount7DayGrowthPercent: parseFloat(playlistCount7DayGrowthPercent),
      playlistCount28DayGrowth,
      playlistCount28DayGrowthPercent: parseFloat(playlistCount28DayGrowthPercent),
      playlistCount60DayGrowth,
      playlistCount60DayGrowthPercent: parseFloat(playlistCount60DayGrowthPercent),
      monthlyListeners,
      monthlyListenersFormatted: formatNumber(monthlyListeners),
      monthlyListenersChange,
      monthlyListenersChangeFormatted: formatNumber(monthlyListenersChange),
      monthlyListenersChangePercent: parseFloat(monthlyListenersChangePercent),
      monthlyListeners7DayGrowth,
      monthlyListeners7DayGrowthPercent: parseFloat(monthlyListeners7DayGrowthPercent),
      monthlyListeners28DayGrowth,
      monthlyListeners28DayGrowthPercent: parseFloat(monthlyListeners28DayGrowthPercent),
      monthlyListeners60DayGrowth,
      monthlyListeners60DayGrowthPercent: parseFloat(monthlyListeners60DayGrowthPercent),
      conversionRate,
      reachFollowersRatio,
    });
  }

  // Sort by followers descending (most popular first)
  return rows.sort((a, b) => (b.followers as number) - (a.followers as number));
};

// Run the generation and save to a file
function saveDataToFile() {
  console.log("Generating music artist analytics dataset...");
  const data = generateMusicData();
  console.log(`Generated ${data.length} artist records`);

  const filePath = path.join(__dirname, "../public/data/music-data.json");
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Data saved to ${filePath}`);
}

// Execute the function
saveDataToFile();
