import { SimpleTable } from "@simple-table/react";
import type { ReactHeaderObject, QuickFilterMode, Theme } from "@simple-table/react";
import "@simple-table/react/styles.css";

// Sample data with variety for testing quick filter
const sampleData = [
  {
    id: 1,
    name: "Alice Johnson",
    age: 28,
    department: "Engineering",
    salary: 95000,
    status: "Active",
    location: "New York",
  },
  {
    id: 2,
    name: "Bob Smith",
    age: 35,
    department: "Sales",
    salary: 75000,
    status: "Active",
    location: "Los Angeles",
  },
  {
    id: 3,
    name: "Charlie Davis",
    age: 42,
    department: "Engineering",
    salary: 110000,
    status: "Active",
    location: "San Francisco",
  },
  {
    id: 4,
    name: "Diana Prince",
    age: 31,
    department: "Marketing",
    salary: 82000,
    status: "Inactive",
    location: "Chicago",
  },
  {
    id: 5,
    name: "Ethan Hunt",
    age: 29,
    department: "Sales",
    salary: 78000,
    status: "Active",
    location: "Boston",
  },
  {
    id: 6,
    name: "Fiona Green",
    age: 38,
    department: "Engineering",
    salary: 105000,
    status: "Active",
    location: "Seattle",
  },
  {
    id: 7,
    name: "George Wilson",
    age: 26,
    department: "Marketing",
    salary: 68000,
    status: "Active",
    location: "Austin",
  },
  {
    id: 8,
    name: "Hannah Lee",
    age: 33,
    department: "Sales",
    salary: 88000,
    status: "Inactive",
    location: "Denver",
  },
  {
    id: 9,
    name: "Isaac Chen",
    age: 27,
    department: "Engineering",
    salary: 92000,
    status: "Active",
    location: "San Diego",
  },
  {
    id: 10,
    name: "Julia Brown",
    age: 30,
    department: "Marketing",
    salary: 72000,
    status: "Inactive",
    location: "Miami",
  },
  {
    id: 11,
    name: "Kevin Davis",
    age: 28,
    department: "Sales",
    salary: 85000,
    status: "Active",
    location: "Phoenix",
  },
  {
    id: 12,
    name: "Laura Garcia",
    age: 32,
    department: "Engineering",
    salary: 102000,
    status: "Active",
    location: "San Antonio",
  },
];

const headers: ReactHeaderObject[] = [
  {
    accessor: "name",
    label: "Employee Name",
    width: 180,
    type: "string",
  },
  {
    accessor: "age",
    label: "Age",
    width: 80,
    type: "number",
  },
  {
    accessor: "department",
    label: "Department",
    width: 140,
    type: "string",
  },
  {
    accessor: "salary",
    label: "Salary",
    width: 120,
    type: "number",
    valueFormatter: ({ value }) => `$${(value || 0).toLocaleString()}`,
    align: "right",
  },
  {
    accessor: "status",
    label: "Status",
    width: 100,
    type: "string",
  },
  {
    accessor: "location",
    label: "Location",
    width: 140,
    type: "string",
  },
];

const QuickFilterDemo = ({
  height = "400px",
  theme,
  searchText = "",
  filterMode = "simple",
  caseSensitive = false,
}: {
  height?: string | number;
  theme?: Theme;
  searchText?: string;
  filterMode?: QuickFilterMode;
  caseSensitive?: boolean;
}) => {
  return (
    <SimpleTable
      defaultHeaders={headers}
      rows={sampleData}
      quickFilter={{
        text: searchText,
        mode: filterMode,
        caseSensitive: caseSensitive,
      }}
      height={height}
      theme={theme}
    />
  );
};

export default QuickFilterDemo;
