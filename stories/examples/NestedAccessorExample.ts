/**
 * Nested Accessor Example – vanilla port of React NestedAccessorExample.
 */
import { renderVanillaTable } from "../utils";

export const nestedAccessorHeaders: Record<string, unknown>[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Player Name", width: 200, type: "string", isSortable: true },
  { accessor: "team", label: "Team", width: 150, type: "string", isSortable: true, filterable: true },
  {
    accessor: "stats.points",
    label: "Points",
    width: 100,
    type: "number",
    isSortable: true,
    filterable: true,
    align: "right",
    valueFormatter: ({ value }: { value?: unknown }) => Number(value).toFixed(1),
  },
  {
    accessor: "stats.assists",
    label: "Assists",
    width: 100,
    type: "number",
    isSortable: true,
    filterable: true,
    align: "right",
    valueFormatter: ({ value }: { value?: unknown }) => Number(value).toFixed(1),
  },
  {
    accessor: "stats.rebounds",
    label: "Rebounds",
    width: 100,
    type: "number",
    isSortable: true,
    align: "right",
    valueFormatter: ({ value }: { value?: unknown }) => Number(value).toFixed(1),
  },
  {
    accessor: "latest.rank",
    label: "Latest Rank",
    width: 120,
    type: "number",
    isSortable: true,
    filterable: true,
    align: "right",
    valueFormatter: ({ value }: { value?: unknown }) => `#${value}`,
  },
  {
    accessor: "latest.performance.rating",
    label: "Performance Rating",
    width: 160,
    type: "number",
    isSortable: true,
    align: "right",
    valueFormatter: ({ value }: { value?: unknown }) => `${Number(value).toFixed(1)}%`,
  },
  {
    accessor: "contract.salary",
    label: "Salary",
    width: 150,
    type: "number",
    isSortable: true,
    align: "right",
    valueFormatter: ({ value }: { value?: unknown }) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Number(value)),
  },
];

export const nestedAccessorRows: Record<string, unknown>[] = [
  {
    id: 1,
    name: "LeBron James",
    team: "Lakers",
    stats: { points: 28.5, assists: 8.2, rebounds: 7.9 },
    latest: { rank: 5, performance: { rating: 92.3, trend: "up" } },
    recentGames: [
      { score: 32, opponent: "Warriors" },
      { score: 28, opponent: "Celtics" },
    ],
    awards: ["4× NBA Champion", "4× NBA MVP", "19× NBA All-Star"],
    contract: { salary: 44500000, yearsRemaining: 2 },
  },
  {
    id: 2,
    name: "Stephen Curry",
    team: "Warriors",
    stats: { points: 32.1, assists: 6.4, rebounds: 5.2 },
    latest: { rank: 2, performance: { rating: 95.7, trend: "up" } },
    recentGames: [
      { score: 38, opponent: "Lakers" },
      { score: 41, opponent: "Nets" },
    ],
    awards: ["4× NBA Champion", "2× NBA MVP", "10× NBA All-Star"],
    contract: { salary: 51900000, yearsRemaining: 3 },
  },
  {
    id: 3,
    name: "Giannis Antetokounmpo",
    team: "Bucks",
    stats: { points: 31.2, assists: 5.9, rebounds: 11.6 },
    latest: { rank: 1, performance: { rating: 98.1, trend: "stable" } },
    recentGames: [
      { score: 45, opponent: "76ers" },
      { score: 35, opponent: "Heat" },
    ],
    awards: ["NBA Champion (2021)", "2× NBA MVP", "8× NBA All-Star"],
    contract: { salary: 45640000, yearsRemaining: 4 },
  },
  {
    id: 4,
    name: "Kevin Durant",
    team: "Suns",
    stats: { points: 29.7, assists: 6.7, rebounds: 6.8 },
    latest: { rank: 3, performance: { rating: 94.2, trend: "up" } },
    recentGames: [
      { score: 33, opponent: "Mavericks" },
      { score: 29, opponent: "Clippers" },
    ],
    awards: ["2× NBA Champion", "NBA MVP (2014)", "14× NBA All-Star"],
    contract: { salary: 47649433, yearsRemaining: 2 },
  },
  {
    id: 5,
    name: "Luka Dončić",
    team: "Mavericks",
    stats: { points: 33.5, assists: 9.1, rebounds: 8.8 },
    latest: { rank: 4, performance: { rating: 96.5, trend: "up" } },
    recentGames: [
      { score: 42, opponent: "Suns" },
      { score: 36, opponent: "Rockets" },
    ],
    awards: ["NBA Rookie of the Year", "5× NBA All-Star", "5× All-NBA First Team"],
    contract: { salary: 40064220, yearsRemaining: 5 },
  },
];

export function renderNestedAccessorExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(nestedAccessorHeaders, nestedAccessorRows, {
    height: "500px",
    initialSortColumn: "latest.rank",
    initialSortDirection: "asc",
    selectableCells: true,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Nested Accessor Example";
  const p = document.createElement("p");
  p.style.marginBottom = "1rem";
  p.style.color = "#666";
  p.innerHTML =
    'Uses dot notation (e.g. <code>stats.points</code>, <code>latest.performance.rating</code>) and valueFormatter for currency and decimals.';
  wrapper.insertBefore(p, wrapper.querySelector("div:last-child")!);
  return wrapper;
}
