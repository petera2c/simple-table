import { useState } from "react";
import SimpleTable from "../../components/simple-table/SimpleTable";
import HeaderObject, { ValueFormatterProps } from "../../types/HeaderObject";
import { UniversalTableProps } from "./StoryWrapper";

const headers: HeaderObject[] = [
  {
    accessor: "id",
    label: "ID",
    width: 80,
    type: "number",
  },
  {
    accessor: "name",
    label: "Player Name",
    width: 200,
    type: "string",
    isSortable: true,
  },
  {
    accessor: "team",
    label: "Team",
    width: 150,
    type: "string",
    isSortable: true,
    filterable: true,
  },
  {
    accessor: "stats.points",
    label: "Points",
    width: 100,
    type: "number",
    isSortable: true,
    filterable: true,
    align: "right",
    valueFormatter: ({ value }) => Number(value).toFixed(1), // Format to 1 decimal place
  },
  {
    accessor: "stats.assists",
    label: "Assists",
    width: 100,
    type: "number",
    isSortable: true,
    filterable: true,
    align: "right",
    valueFormatter: ({ value }) => Number(value).toFixed(1), // Format to 1 decimal place
  },
  {
    accessor: "stats.rebounds",
    label: "Rebounds",
    width: 100,
    type: "number",
    isSortable: true,
    align: "right",
    valueFormatter: ({ value }) => Number(value).toFixed(1), // Format to 1 decimal place
  },
  {
    accessor: "latest.rank",
    label: "Latest Rank",
    width: 120,
    type: "number",
    isSortable: true,
    filterable: true,
    align: "right",
    valueFormatter: ({ value }) => `#${value}`, // Add # prefix for rank
  },
  {
    accessor: "latest.performance.rating",
    label: "Performance Rating",
    width: 160,
    type: "number",
    isSortable: true,
    align: "right",
    valueFormatter: ({ value }) => `${Number(value).toFixed(1)}%`, // Format as percentage
  },
  {
    accessor: "recentGames[0].score",
    label: "Last Game Score",
    width: 140,
    type: "number",
    isSortable: true,
    align: "right",
    valueFormatter: ({ value }) => `${value} pts`, // Add points suffix
  },
  {
    accessor: "awards[0]",
    label: "Top Award",
    width: 180,
    type: "string",
    isSortable: true,
    filterable: true,
  },
  {
    accessor: "contract.salary",
    label: "Salary",
    width: 150,
    type: "number",
    isSortable: true,
    align: "right",
    valueFormatter: ({ value }) => {
      // Format as currency with millions abbreviation
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Number(value));
    },
  },
  {
    accessor: "contract.yearsRemaining",
    label: "Years Left",
    width: 120,
    type: "number",
    isSortable: true,
    align: "center",
    valueFormatter: ({ value }: ValueFormatterProps) =>
      `${value} ${value === 1 ? "year" : "years"}`, // Add "year(s)" suffix
  },
];

// Sample data with nested structures and arrays
const initialRows = [
  {
    id: 1,
    name: "LeBron James",
    team: "Lakers",
    stats: {
      points: 28.5,
      assists: 8.2,
      rebounds: 7.9,
    },
    latest: {
      rank: 5,
      performance: {
        rating: 92.3,
        trend: "up",
      },
    },
    recentGames: [
      { score: 32, opponent: "Warriors" },
      { score: 28, opponent: "Celtics" },
    ],
    awards: ["4× NBA Champion", "4× NBA MVP", "19× NBA All-Star"],
    contract: {
      salary: 44500000,
      yearsRemaining: 2,
    },
  },
  {
    id: 2,
    name: "Stephen Curry",
    team: "Warriors",
    stats: {
      points: 32.1,
      assists: 6.4,
      rebounds: 5.2,
    },
    latest: {
      rank: 2,
      performance: {
        rating: 95.7,
        trend: "up",
      },
    },
    recentGames: [
      { score: 38, opponent: "Lakers" },
      { score: 41, opponent: "Nets" },
    ],
    awards: ["4× NBA Champion", "2× NBA MVP", "10× NBA All-Star"],
    contract: {
      salary: 51900000,
      yearsRemaining: 3,
    },
  },
  {
    id: 3,
    name: "Giannis Antetokounmpo",
    team: "Bucks",
    stats: {
      points: 31.2,
      assists: 5.9,
      rebounds: 11.6,
    },
    latest: {
      rank: 1,
      performance: {
        rating: 98.1,
        trend: "stable",
      },
    },
    recentGames: [
      { score: 45, opponent: "76ers" },
      { score: 35, opponent: "Heat" },
    ],
    awards: ["NBA Champion (2021)", "2× NBA MVP", "8× NBA All-Star"],
    contract: {
      salary: 45640000,
      yearsRemaining: 4,
    },
  },
  {
    id: 4,
    name: "Kevin Durant",
    team: "Suns",
    stats: {
      points: 29.7,
      assists: 6.7,
      rebounds: 6.8,
    },
    latest: {
      rank: 3,
      performance: {
        rating: 94.2,
        trend: "up",
      },
    },
    recentGames: [
      { score: 33, opponent: "Mavericks" },
      { score: 29, opponent: "Clippers" },
    ],
    awards: ["2× NBA Champion", "NBA MVP (2014)", "14× NBA All-Star"],
    contract: {
      salary: 47649433,
      yearsRemaining: 2,
    },
  },
  {
    id: 5,
    name: "Luka Dončić",
    team: "Mavericks",
    stats: {
      points: 33.5,
      assists: 9.1,
      rebounds: 8.8,
    },
    latest: {
      rank: 4,
      performance: {
        rating: 96.5,
        trend: "up",
      },
    },
    recentGames: [
      { score: 42, opponent: "Suns" },
      { score: 36, opponent: "Rockets" },
    ],
    awards: ["NBA Rookie of the Year", "5× NBA All-Star", "5× All-NBA First Team"],
    contract: {
      salary: 40064220,
      yearsRemaining: 5,
    },
  },
  {
    id: 6,
    name: "Joel Embiid",
    team: "76ers",
    stats: {
      points: 30.6,
      assists: 4.2,
      rebounds: 10.2,
    },
    latest: {
      rank: 6,
      performance: {
        rating: 93.8,
        trend: "stable",
      },
    },
    recentGames: [
      { score: 34, opponent: "Bucks" },
      { score: 31, opponent: "Knicks" },
    ],
    awards: ["NBA MVP (2023)", "7× NBA All-Star", "5× All-NBA"],
    contract: {
      salary: 47607350,
      yearsRemaining: 4,
    },
  },
  {
    id: 7,
    name: "Jayson Tatum",
    team: "Celtics",
    stats: {
      points: 27.0,
      assists: 4.4,
      rebounds: 8.4,
    },
    latest: {
      rank: 8,
      performance: {
        rating: 91.2,
        trend: "up",
      },
    },
    recentGames: [
      { score: 30, opponent: "Lakers" },
      { score: 28, opponent: "Heat" },
    ],
    awards: ["NBA Champion (2024)", "5× NBA All-Star", "4× All-NBA"],
    contract: {
      salary: 32600060,
      yearsRemaining: 3,
    },
  },
  {
    id: 8,
    name: "Damian Lillard",
    team: "Bucks",
    stats: {
      points: 26.3,
      assists: 7.0,
      rebounds: 4.1,
    },
    latest: {
      rank: 10,
      performance: {
        rating: 90.1,
        trend: "stable",
      },
    },
    recentGames: [
      { score: 27, opponent: "Celtics" },
      { score: 25, opponent: "Nets" },
    ],
    awards: ["NBA Rookie of the Year", "8× NBA All-Star", "7× All-NBA"],
    contract: {
      salary: 45640084,
      yearsRemaining: 3,
    },
  },
];

const NestedAccessorExample = (props: UniversalTableProps) => {
  const [rows] = useState(initialRows);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Nested Accessor Example</h2>
      <p>
        This example demonstrates how to use nested accessors like <code>stats.points</code>,{" "}
        <code>latest.rank</code>, <code>latest.performance.rating</code>, and array accessors like{" "}
        <code>recentGames[0].score</code> and <code>awards[0]</code> to access deeply nested data
        and array elements in your row objects.
      </p>
      <p>
        <strong>Features demonstrated:</strong>
      </p>
      <ul>
        <li>Nested property access using dot notation (e.g., "stats.points")</li>
        <li>Multi-level nesting (e.g., "latest.performance.rating")</li>
        <li>Array index access (e.g., "awards[0]")</li>
        <li>Combined nested and array access (e.g., "recentGames[0].score")</li>
        <li>Sorting and filtering work with nested and array accessors</li>
        <li>Initial sort by nested accessor (table starts sorted by "latest.rank")</li>
        <li>Custom cell renderers can access nested data</li>
        <li>Editable cells support nested accessors (if enabled)</li>
        <li>
          <strong>
            Value formatting with <code>valueFormatter</code>:
          </strong>{" "}
          Salary displays as currency, stats show decimals, rank has "#" prefix, years have
          "year(s)" suffix, scores have "pts" suffix
        </li>
      </ul>

      <SimpleTable
        {...props}
        defaultHeaders={headers}
        height="500px"
        initialSortColumn="awards[0]"
        initialSortDirection="asc"
        onCellEdit={(props) => {}}
        rows={rows}
        rowIdAccessor="id"
        selectableCells={true}
      />
    </div>
  );
};

export default NestedAccessorExample;
