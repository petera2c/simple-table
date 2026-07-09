export const ROW_COUNT = 3235;
export const ROW_HEIGHT = 65;
export const HEADER_HEIGHT = 36;

const GENRES = [
  "Hot AC",
  "Top 40/Pop",
  "Top 40/Urban",
  "Rhythmic",
  "Alternative Rock",
  "Country",
  "AAA",
];

const AREAS = ["Los Angeles", "New York", "Chicago", "Boston", "Dallas", "Houston", "Philadelphia"];

const STATION_NAMES = [
  "KBIG 104.3 MYfm",
  "WHTZ Z100",
  "102.7 KIIS FM KVVS",
  "Hot 97",
  "WKTU - 103.5 KTU",
  "WWPR-FM Power 105.1",
  "WTMX - The MIX 101.9 FM",
  "WNEW-FM Fresh 102.7 (US Only)",
  "KRRL-FM Real 92.3",
  "WXKS-FM kiss 108",
  "POWER106",
  "KHKS 106.1 KISS-FM",
  "WNYL ALT 92.3",
  "KYSR ALT 98.7 FM",
  "KKGO Go Country 105 (US Only)",
  "KROQ",
  "KTBZ-FM 94.5 The Buzz",
  "WNSH New York's Country 94.7 FM",
  "Hot 104 Radio",
  "WKLB Country 102.5 FM",
  "WUSN-FM",
  "WUSL POWER 99 FM",
  "93XRT",
];

/** Seeded PRNG so row metrics stay stable across remounts. */
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface RadioStationRow {
  id: number;
  __index__: number;
  name: string;
  genre: string;
  broadcast_area: string;
  country: string;
  wikipedia_views: number;
  aqh: number;
}

export function createRadioStationRows(count: number = ROW_COUNT): RadioStationRow[] {
  const rand = mulberry32(42);
  return Array.from({ length: count }, (_, i) => {
    const aqh = Math.round((70_000 - i * 18 - rand() * 40) / 100) * 100;
    return {
      id: i,
      __index__: i + 1,
      name: STATION_NAMES[i % STATION_NAMES.length],
      genre: GENRES[i % GENRES.length],
      broadcast_area: AREAS[i % AREAS.length],
      country: "US",
      wikipedia_views: Math.floor(10 + rand() * 160),
      aqh: Math.max(1_000, aqh),
    };
  });
}

export function formatNumber(value: unknown): string {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return String(value ?? "");
  return n.toLocaleString("en-US");
}

export const radioStationRows = createRadioStationRows();
