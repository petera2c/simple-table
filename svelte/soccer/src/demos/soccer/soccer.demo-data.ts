// Self-contained demo table setup for this example.
import type { SvelteColumnDef } from "@simple-table/svelte";

export type SoccerPosition = "GK" | "DEF" | "MID" | "FWD";

export interface SoccerPlayer {
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
  { name: "Manchester City", short: "MCI" }, { name: "Arsenal", short: "ARS" },
  { name: "Liverpool", short: "LIV" }, { name: "Real Madrid", short: "RMA" },
  { name: "Barcelona", short: "BAR" }, { name: "Bayern Munich", short: "BAY" },
  { name: "Paris Saint-Germain", short: "PSG" }, { name: "Inter Milan", short: "INT" },
  { name: "Manchester United", short: "MUN" }, { name: "Chelsea", short: "CHE" },
  { name: "Tottenham Hotspur", short: "TOT" }, { name: "Atletico Madrid", short: "ATM" },
  { name: "Borussia Dortmund", short: "DOR" }, { name: "Napoli", short: "NAP" },
  { name: "AC Milan", short: "MIL" }, { name: "Juventus", short: "JUV" },
  { name: "Newcastle United", short: "NEW" }, { name: "Aston Villa", short: "AVL" },
  { name: "RB Leipzig", short: "RBL" }, { name: "Bayer Leverkusen", short: "B04" },
];

const NATIONS: Array<{ name: string; flag: string }> = [
  { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" }, { name: "Spain", flag: "🇪🇸" },
  { name: "France", flag: "🇫🇷" }, { name: "Germany", flag: "🇩🇪" },
  { name: "Brazil", flag: "🇧🇷" }, { name: "Argentina", flag: "🇦🇷" },
  { name: "Portugal", flag: "🇵🇹" }, { name: "Italy", flag: "🇮🇹" },
  { name: "Netherlands", flag: "🇳🇱" }, { name: "Belgium", flag: "🇧🇪" },
  { name: "Croatia", flag: "🇭🇷" }, { name: "Uruguay", flag: "🇺🇾" },
  { name: "Norway", flag: "🇳🇴" }, { name: "Japan", flag: "🇯🇵" },
  { name: "Nigeria", flag: "🇳🇬" },
];

const FIRST_NAMES = [
  "Liam", "Noah", "Lucas", "Mateo", "Leon", "Hugo", "Marco", "Diego", "Ethan", "Kai",
  "Erling", "Kylian", "Bukayo", "Phil", "Rodri", "Jude", "Vinicius", "Martin", "Bruno", "Declan",
];
const LAST_NAMES = [
  "Silva", "Santos", "Muller", "Schmidt", "Rossi", "Romano", "Garcia", "Martinez", "Lopez", "Dubois",
  "Haaland", "Mbappe", "Saka", "Foden", "Bellingham", "Junior", "Odegaard", "Fernandes", "Rice", "Kane",
];
const POSITIONS: SoccerPosition[] = ["GK", "DEF", "MID", "FWD"];

function pick<T>(rand: () => number, arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)]!;
}
function round(value: number, digits = 1): number {
  const f = Math.pow(10, digits);
  return Math.round(value * f) / f;
}

export function generateSoccerData(count = 200): SoccerPlayer[] {
  const rand = mulberry32(0x50cce7);
  const players: SoccerPlayer[] = [];
  for (let i = 0; i < count; i++) {
    const club = pick(rand, CLUBS);
    const nation = pick(rand, NATIONS);
    const position = pick(rand, POSITIONS);
    const name = `${pick(rand, FIRST_NAMES)} ${pick(rand, LAST_NAMES)}`;
    const appearances = 8 + Math.floor(rand() * 31);
    const minutes = appearances * (45 + Math.floor(rand() * 45));
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
      id: `player-${i}`, rank: i + 1, rankChange, name, club: club.name, clubShort: club.short,
      nation: nation.name, nationFlag: nation.flag, position, age: 17 + Math.floor(rand() * 20),
      appearances, minutes, goals, assists, xG, xA, shots, shotsOnTarget, passes, keyPasses,
      passAccuracy, tackles, interceptions, clearances, rating, formHistory,
    });
  }
  players.sort((a, b) => b.rating - a.rating);
  players.forEach((player, idx) => { player.rank = idx + 1; });
  return players;
}

export const soccerHeaders: SvelteColumnDef<SoccerPlayer>[] = [
  { accessor: "rank", label: "#", width: 56, align: "center", type: "number", pinned: "left", sortable: true, editable: false },
  {
    accessor: "name", label: "Player", width: 220, align: "left", type: "string", pinned: "left", sortable: true, editable: false,
    valueFormatter: ({ value, row }) => `${row.nationFlag} ${value}`,
  },
  { accessor: "clubShort", label: "Club", width: 80, type: "string", sortable: true, editable: false },
  {
    accessor: "position", label: "Pos", width: 80, align: "center", type: "enum", sortable: true, editable: false, filterable: true,
    enumOptions: [
      { label: "Goalkeeper", value: "GK" }, { label: "Defender", value: "DEF" },
      { label: "Midfielder", value: "MID" }, { label: "Forward", value: "FWD" },
    ],
  },
  {
    accessor: "rating", label: "Rating", width: 90, align: "center", type: "number", sortable: true, editable: false,
    valueFormatter: ({ value }) => typeof value === "number" ? value.toFixed(2) : "",
  },
  {
    accessor: "formHistory", label: "Form", width: 140, align: "center", type: "lineAreaChart",
    sortable: false, editable: false, filterable: false, tooltip: "Match ratings over the last 8 games",
    chartOptions: { height: 34, min: 4, max: 10, strokeWidth: 2, fillOpacity: 0.18 },
  },
  { accessor: "appearances", label: "Apps", width: 70, align: "center", type: "number", sortable: true, editable: false },
  {
    accessor: "attack", label: "Attack", width: 360, sortable: false, collapsible: true,
    children: [
      { accessor: "goals", label: "Goals", width: 80, align: "center", type: "number", sortable: true, editable: false, showWhen: "always" },
      { accessor: "assists", label: "Assists", width: 80, align: "center", type: "number", sortable: true, editable: false, showWhen: "parentExpanded" },
      { accessor: "xG", label: "xG", width: 70, align: "center", type: "number", sortable: true, editable: false, showWhen: "parentExpanded" },
      { accessor: "xA", label: "xA", width: 70, align: "center", type: "number", sortable: true, editable: false, showWhen: "parentExpanded" },
      { accessor: "shots", label: "Shots", width: 80, align: "center", type: "number", sortable: true, editable: false, showWhen: "parentExpanded" },
    ],
  },
  {
    accessor: "passing", label: "Passing", width: 300, sortable: false, collapsible: true,
    children: [
      {
        accessor: "passAccuracy", label: "Pass %", width: 90, align: "right", type: "number", sortable: true, editable: false, showWhen: "always",
        valueFormatter: ({ value }) => typeof value === "number" ? `${value.toFixed(1)}%` : "",
      },
      { accessor: "passes", label: "Passes", width: 90, align: "center", type: "number", sortable: true, editable: false, showWhen: "parentExpanded" },
      { accessor: "keyPasses", label: "Key Passes", width: 100, align: "center", type: "number", sortable: true, editable: false, showWhen: "parentExpanded" },
    ],
  },
  {
    accessor: "defense", label: "Defense", width: 320, sortable: false, collapsible: true, collapseDefault: true,
    children: [
      { accessor: "tackles", label: "Tackles", width: 90, align: "center", type: "number", sortable: true, editable: false, showWhen: "always" },
      { accessor: "interceptions", label: "Interceptions", width: 120, align: "center", type: "number", sortable: true, editable: false, showWhen: "parentExpanded" },
      { accessor: "clearances", label: "Clearances", width: 110, align: "center", type: "number", sortable: true, editable: false, showWhen: "parentExpanded" },
    ],
  },
];

export const soccerData = generateSoccerData(200);

export const soccerConfig = {
  headers: soccerHeaders,
  rows: soccerData,
};
