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

// Sample data with nested structures
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
        <code>latest.rank</code>, and <code>latest.performance.rating</code> to access deeply nested
        data in your row objects.
      </p>
      <p>
        <strong>Features demonstrated:</strong>
      </p>
      <ul>
        <li>Nested property access using dot notation (e.g., "stats.points")</li>
        <li>Multi-level nesting (e.g., "latest.performance.rating")</li>
        <li>Sorting and filtering work with nested accessors</li>
        <li>Custom cell renderers can access nested data</li>
        <li>Editable cells support nested accessors (if enabled)</li>
        <li>
          <strong>
            Value formatting with <code>valueFormatter</code>:
          </strong>{" "}
          Salary displays as currency, stats show decimals, rank has "#" prefix, years have
          "year(s)" suffix
        </li>
      </ul>

      <SimpleTable
        {...props}
        defaultHeaders={headers}
        height="500px"
        onCellEdit={(props) => {
          console.log("Cell edited:", props);
        }}
        rows={rows}
        rowIdAccessor="id"
        selectableCells={true}
      />
    </div>
  );
};

export default NestedAccessorExample;
