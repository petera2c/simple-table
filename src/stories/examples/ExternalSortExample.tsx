import React, { useState, useEffect } from "react";
import { SimpleTable } from "../..";
import HeaderObject from "../../types/HeaderObject";
import Row from "../../types/Row";
import SortColumn from "../../types/SortColumn";
import { UniversalTableProps } from "./StoryWrapper";

// Generate a large dataset for the "server"
const generateServerData = (count: number): Row[] => {
  const firstNames = [
    "John",
    "Jane",
    "Bob",
    "Alice",
    "Charlie",
    "Diana",
    "Ethan",
    "Fiona",
    "George",
    "Helen",
    "Ivan",
    "Julia",
    "Kevin",
    "Laura",
    "Mike",
    "Nancy",
    "Oscar",
    "Paula",
    "Quinn",
    "Rachel",
    "Steve",
    "Tina",
    "Uma",
    "Victor",
    "Wendy",
    "Xavier",
    "Yara",
    "Zack",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
    "Hernandez",
    "Lopez",
    "Gonzalez",
    "Wilson",
    "Anderson",
    "Thomas",
    "Taylor",
    "Moore",
    "Jackson",
    "Martin",
  ];
  const departments = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations"];

  const data: Row[] = [];
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    data.push({
      id: i + 1,
      name: `${firstName} ${lastName}`,
      age: Math.floor(Math.random() * 40) + 22, // 22-61
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
      salary: Math.floor(Math.random() * 80000) + 40000, // 40k-120k
      department: departments[Math.floor(Math.random() * departments.length)],
    });
  }
  return data;
};

// Simulated server data (500 rows)
const SERVER_DATA = generateServerData(500);

// Simulate API delay
const simulateDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Fake API function that sorts and returns a subset of data
const fetchSortedData = async (
  sortColumn: SortColumn | null,
  pageSize: number = 30,
): Promise<Row[]> => {
  // Simulate network delay
  await simulateDelay(800);

  let sortedData = [...SERVER_DATA];

  // Sort the data if sortColumn is provided
  if (sortColumn) {
    sortedData.sort((a, b) => {
      const accessor = sortColumn.key.accessor;
      const aValue = a[accessor];
      const bValue = b[accessor];

      if (aValue === bValue) return 0;

      let comparison = 0;
      if (sortColumn.key.type === "number") {
        comparison = (aValue as number) - (bValue as number);
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortColumn.direction === "asc" ? comparison : -comparison;
    });
  }

  // Return first pageSize items
  return sortedData.slice(0, pageSize);
};

const headers: HeaderObject[] = [
  {
    accessor: "name",
    label: "Name",
    width: 150,
    isSortable: true,
    type: "string",
  },
  {
    accessor: "age",
    label: "Age",
    width: 80,
    isSortable: true,
    type: "number",
  },
  {
    accessor: "department",
    label: "Department",
    width: 120,
    isSortable: true,
    type: "string",
  },
  {
    accessor: "email",
    label: "Email",
    width: 200,
    isSortable: true,
    type: "string",
  },
  {
    accessor: "salary",
    label: "Salary",
    width: 120,
    isSortable: true,
    type: "number",
    valueFormatter: ({ value }) => `$${(value || 0).toLocaleString()}`,
    align: "right",
  },
];

// Default args specific to ExternalSortExample - exported for reuse in stories and tests
export const externalSortExampleDefaults = {
  externalSortHandling: true,
  columnResizing: true,
  columnReordering: true,
  height: "400px",
};

const ExternalSortExampleComponent: React.FC<UniversalTableProps> = (props) => {
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch initial data on mount
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      const data = await fetchSortedData(null, 30);
      setRows(data);
      setIsLoading(false);
    };
    loadInitialData();
  }, []);

  // Fetch sorted data when sort changes
  useEffect(() => {
    if (sortColumn === null) return; // Skip initial render

    const loadSortedData = async () => {
      setIsLoading(true);
      const data = await fetchSortedData(sortColumn, 30);
      setRows(data);
      setIsLoading(false);
    };
    loadSortedData();
  }, [sortColumn]);

  return (
    <div>
      <div
        style={{
          padding: "20px",
          backgroundColor: "#dbeafe",
          border: "2px solid #3b82f6",
          borderRadius: "12px",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: "0 0 12px 0", color: "#1e40af", fontSize: "20px" }}>
          🔄 External Sort with API Demo
        </h2>
        <div style={{ fontSize: "14px", color: "#1e3a8a", lineHeight: "1.6" }}>
          <p style={{ margin: "0 0 8px 0" }}>
            <strong>This example demonstrates external sorting with simulated API calls:</strong>
          </p>
          <ul style={{ margin: "0", paddingLeft: "20px" }}>
            <li>
              <strong>Server has 500 rows</strong> of data
            </li>
            <li>
              <strong>API returns 30 sorted rows</strong> based on the sort column
            </li>
            <li>
              <strong>800ms simulated delay</strong> to mimic real network latency
            </li>
            <li>Click any column header to trigger a new API call with sorting</li>
            <li>
              Watch for any <strong>flicker</strong> when the data updates after sorting
            </li>
          </ul>
          <p style={{ margin: "12px 0 0 0", fontStyle: "italic" }}>
            💡 This simulates a real-world scenario where the server handles sorting and pagination.
          </p>
        </div>
      </div>

      <SimpleTable
        {...props}
        defaultHeaders={headers}
        rows={rows}
        isLoading={isLoading}
        onSortChange={setSortColumn}
        // Default settings for this example
        externalSortHandling={props.externalSortHandling ?? true}
        columnResizing={props.columnResizing ?? true}
        columnReordering={props.columnReordering ?? true}
        height={props.height ?? "500px"}
        theme={props.theme ?? "light"}
        loadingStateRenderer={
          <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
            <div>⏳ Loading sorted data from server...</div>
          </div>
        }
      />
    </div>
  );
};

export default ExternalSortExampleComponent;
