import { useMemo } from "react";
import type { Row } from "@simple-table/react";

export type SoccerPosition = "GK" | "DEF" | "MID" | "FWD";

export interface SoccerPlayer extends Row {
  id: string;
  rank: number;
  rankChange: number;
  name: string;
  club: string;
  clubShort: string;
  nation: string;
  nationFlag: string;
  position: SoccerPosition;
  age: number;
  appearances: number;
  minutes: number;
  goals: number;
  assists: number;
  xG: number;
  xA: number;
  shots: number;
  shotsOnTarget: number;
  passes: number;
  keyPasses: number;
  passAccuracy: number;
  tackles: number;
  interceptions: number;
  clearances: number;
  rating: number;
  formHistory: number[];
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CLUBS: Array<{ name: string; short: string }> = [
  { name: "Manchester City", short: "MCI" },
  { name: "Arsenal", short: "ARS" },
  { name: "Liverpool", short: "LIV" },
  { name: "Real Madrid", short: "RMA" },
  { name: "Barcelona", short: "BAR" },
  { name: "Bayern Munich", short: "BAY" },
  { name: "Paris Saint-Germain", short: "PSG" },
  { name: "Inter Milan", short: "INT" },
  { name: "Manchester United", short: "MUN" },
  { name: "Chelsea", short: "CHE" },
  { name: "Tottenham Hotspur", short: "TOT" },
  { name: "Atletico Madrid", short: "ATM" },
  { name: "Borussia Dortmund", short: "DOR" },
  { name: "Napoli", short: "NAP" },
  { name: "AC Milan", short: "MIL" },
  { name: "Juventus", short: "JUV" },
  { name: "Newcastle United", short: "NEW" },
  { name: "Aston Villa", short: "AVL" },
  { name: "RB Leipzig", short: "RBL" },
  { name: "Bayer Leverkusen", short: "B04" },
];

const NATIONS: Array<{ name: string; flag: string }> = [
  { name: "England", flag: "\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}" },
  { name: "Spain", flag: "\u{1F1EA}\u{1F1F8}" },
  { name: "France", flag: "\u{1F1EB}\u{1F1F7}" },
  { name: "Germany", flag: "\u{1F1E9}\u{1F1EA}" },
  { name: "Brazil", flag: "\u{1F1E7}\u{1F1F7}" },
  { name: "Argentina", flag: "\u{1F1E6}\u{1F1F7}" },
  { name: "Portugal", flag: "\u{1F1F5}\u{1F1F9}" },
  { name: "Italy", flag: "\u{1F1EE}\u{1F1F9}" },
  { name: "Netherlands", flag: "\u{1F1F3}\u{1F1F1}" },
  { name: "Belgium", flag: "\u{1F1E7}\u{1F1EA}" },
  { name: "Croatia", flag: "\u{1F1ED}\u{1F1F7}" },
  { name: "Uruguay", flag: "\u{1F1FA}\u{1F1FE}" },
  { name: "Norway", flag: "\u{1F1F3}\u{1F1F4}" },
  { name: "Japan", flag: "\u{1F1EF}\u{1F1F5}" },
  { name: "Nigeria", flag: "\u{1F1F3}\u{1F1EC}" },
];

const FIRST_NAMES = [
  "Liam", "Noah", "Lucas", "Mateo", "Leon", "Hugo", "Marco", "Diego", "Ethan", "Kai",
  "Erling", "Kylian", "Bukayo", "Phil", "Rodri", "Jude", "Vinicius", "Martin", "Bruno", "Declan",
  "Gabriel", "Florian", "Cole", "Alex", "Joao", "Pedro", "Rafael", "Federico", "Niccolo", "Sven",
];
const LAST_NAMES = [
  "Silva", "Santos", "Muller", "Schmidt", "Rossi", "Romano", "Garcia", "Martinez", "Lopez", "Dubois",
  "Haaland", "Mbappe", "Saka", "Foden", "Bellingham", "Junior", "Odegaard", "Fernandes", "Rice", "Kane",
  "Wirtz", "Palmer", "Felix", "Neves", "Goncalo", "Lautaro", "Leao", "Chiesa", "Barella", "Botman",
];

const POSITIONS: SoccerPosition[] = ["GK", "DEF", "MID", "FWD"];

function pick<T>(rand: () => number, arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)]!;
}

function round(value: number, digits = 1): number {
  const f = Math.pow(10, digits);
  return Math.round(value * f) / f;
}

export function generateSoccerData(count = 600): SoccerPlayer[] {
  const rand = mulberry32(0x50cce7);
  const players: SoccerPlayer[] = [];

  for (let i = 0; i < count; i++) {
    const club = pick(rand, CLUBS);
    const nation = pick(rand, NATIONS);
    const position = pick(rand, POSITIONS);
    const name = `${pick(rand, FIRST_NAMES)} ${pick(rand, LAST_NAMES)}`;

    const appearances = 8 + Math.floor(rand() * 31);
    const minutes = appearances * (45 + Math.floor(rand() * 45));

    // Position-weighted output so the stat lines read realistically.
    const attackWeight = position === "FWD" ? 1 : position === "MID" ? 0.55 : 0.12;
    const defenseWeight = position === "DEF" ? 1 : position === "MID" ? 0.6 : position === "GK" ? 0.2 : 0.2;

    const goals = Math.floor(rand() * 24 * attackWeight);
    const assists = Math.floor(rand() * 16 * (position === "MID" ? 1 : attackWeight + 0.2));
    const shots = goals * 3 + Math.floor(rand() * 30 * attackWeight);
    const shotsOnTarget = Math.floor(shots * (0.35 + rand() * 0.2));
    const xG = round(goals * (0.7 + rand() * 0.6), 1);
    const xA = round(assists * (0.7 + rand() * 0.6), 1);

    const passes = 200 + Math.floor(rand() * 1800 * (position === "GK" ? 0.4 : 1));
    const keyPasses = Math.floor(rand() * 70 * (position === "MID" ? 1 : attackWeight + 0.2));
    const passAccuracy = round(70 + rand() * 26, 1);

    const tackles = Math.floor(rand() * 90 * defenseWeight);
    const interceptions = Math.floor(rand() * 70 * defenseWeight);
    const clearances = Math.floor(rand() * 140 * (position === "DEF" || position === "GK" ? 1 : 0.25));

    const rating = round(6.2 + rand() * 2.6, 2);
    const formHistory = Array.from({ length: 8 }, () => round(5.5 + rand() * 3.5, 1));
    const rankChange = Math.floor((rand() - 0.5) * 14);

    players.push({
      id: `player-${i}`,
      rank: i + 1,
      rankChange,
      name,
      club: club.name,
      clubShort: club.short,
      nation: nation.name,
      nationFlag: nation.flag,
      position,
      age: 17 + Math.floor(rand() * 20),
      appearances,
      minutes,
      goals,
      assists,
      xG,
      xA,
      shots,
      shotsOnTarget,
      passes,
      keyPasses,
      passAccuracy,
      tackles,
      interceptions,
      clearances,
      rating,
      formHistory,
    });
  }

  // Rank by season rating so the leaderboard reads top-down.
  players.sort((a, b) => b.rating - a.rating);
  players.forEach((player, idx) => {
    player.rank = idx + 1;
  });

  return players;
}

export function useSoccerData(count = 600) {
  const data = useMemo(() => generateSoccerData(count), [count]);
  return { data, isLoading: false };
}
