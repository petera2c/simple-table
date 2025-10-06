import React, { useState, useMemo } from "react";
import { SimpleTable } from "../..";
import HeaderObject from "../../types/HeaderObject";
import Row from "../../types/Row";
import { FilterCondition, TableFilterState } from "../../types/FilterTypes";
import CellValue from "../../types/CellValue";
import { UniversalTableProps } from "./StoryWrapper";

// Sample data with more variety for filtering
const sampleData: Row[] = [
  {
    id: 1,
    name: "John Doe",
    age: 30,
    email: "john@example.com",
    salary: 75000,
    department: "Engineering",
    active: true,
    location: "New York",
  },
  {
    id: 2,
    name: "Jane Smith",
    age: 25,
    email: "jane@example.com",
    salary: 65000,
    department: "Marketing",
    active: true,
    location: "San Francisco",
  },
  {
    id: 3,
    name: "Bob Johnson",
    age: 35,
    email: "bob@example.com",
    salary: 85000,
    department: "Engineering",
    active: false,
    location: "New York",
  },
  {
    id: 4,
    name: "Alice Brown",
    age: 28,
    email: "alice@example.com",
    salary: 70000,
    department: "Sales",
    active: true,
    location: "Chicago",
  },
  {
    id: 5,
    name: "Charlie Wilson",
    age: 32,
    email: "charlie@example.com",
    salary: 80000,
    department: "Engineering",
    active: true,
    location: "San Francisco",
  },
  {
    id: 6,
    name: "Diana Prince",
    age: 29,
    email: "diana@example.com",
    salary: 72000,
    department: "Marketing",
    active: false,
    location: "Los Angeles",
  },
  {
    id: 7,
    name: "Ethan Hunt",
    age: 31,
    email: "ethan@example.com",
    salary: 78000,
    department: "Sales",
    active: true,
    location: "Chicago",
  },
  {
    id: 8,
    name: "Fiona Green",
    age: 26,
    email: "fiona@example.com",
    salary: 68000,
    department: "Marketing",
    active: true,
    location: "New York",
  },
  {
    id: 9,
    name: "George Lucas",
    age: 38,
    email: "george@example.com",
    salary: 90000,
    department: "Engineering",
    active: true,
    location: "San Francisco",
  },
  {
    id: 10,
    name: "Helen Troy",
    age: 27,
    email: "helen@example.com",
    salary: 69000,
    department: "Sales",
    active: false,
    location: "Los Angeles",
  },
];

const headers: HeaderObject[] = [
  {
    accessor: "name",
    label: "Name",
    width: 150,
    type: "string",
    filterable: true,
  },
  {
    accessor: "age",
    label: "Age",
    width: 80,
    type: "number",
    filterable: true,
  },
  {
    accessor: "department",
    label: "Department",
    width: 120,
    type: "enum",
    filterable: true,
    enumOptions: [
      { value: "Engineering", label: "Engineering" },
      { value: "Marketing", label: "Marketing" },
      { value: "Sales", label: "Sales" },
    ],
  },
  {
    accessor: "location",
    label: "Location",
    width: 120,
    type: "enum",
    filterable: true,
    enumOptions: [
      { value: "New York", label: "New York" },
      { value: "San Francisco", label: "San Francisco" },
      { value: "Chicago", label: "Chicago" },
      { value: "Los Angeles", label: "Los Angeles" },
      { value: "Miami", label: "Miami" },
      { value: "Seattle", label: "Seattle" },
      { value: "Boston", label: "Boston" },
      { value: "Washington", label: "Washington" },
      { value: "Austin", label: "Austin" },
      { value: "Dallas", label: "Dallas" },
      { value: "Atlanta", label: "Atlanta" },
      { value: "San Diego", label: "San Diego" },
      { value: "San Jose", label: "San Jose" },
      { value: "San Antonio", label: "San Antonio" },
      { value: "Phoenix", label: "Phoenix" },
      { value: "Charlotte", label: "Charlotte" },
      { value: "Nashville", label: "Nashville" },
      { value: "Milwaukee", label: "Milwaukee" },
      { value: "Cleveland", label: "Cleveland" },
      { value: "Indianapolis", label: "Indianapolis" },
      { value: "Columbus", label: "Columbus" },
      { value: "Omaha", label: "Omaha" },
      { value: "Albuquerque", label: "Albuquerque" },
      { value: "Tampa", label: "Tampa" },
      { value: "New Orleans", label: "New Orleans" },
      { value: "Charlotte", label: "Charlotte" },
      { value: "St. Louis", label: "St. Louis" },
      { value: "Raleigh", label: "Raleigh" },
      { value: "Salt Lake City", label: "Salt Lake City" },
      { value: "Orlando", label: "Orlando" },
    ],
  },
  {
    accessor: "active",
    label: "Active",
    width: 80,
    type: "boolean",
    filterable: true,
    cellRenderer: ({ row }) => (row.active ? "✓ Yes" : "✗ No"),
    align: "center",
  },
  {
    accessor: "email",
    label: "Email",
    width: 200,
    type: "string",
    filterable: true,
  },
  {
    accessor: "salary",
    label: "Salary",
    width: 120,
    type: "number",
    filterable: true,
    cellRenderer: ({ row }) => `$${(row.salary || 0).toLocaleString()}`,
    align: "right",
  },
];

// Default args specific to ExternalFilterExample - exported for reuse in stories and tests
export const externalFilterExampleDefaults = {
  externalFilterHandling: true,
  columnResizing: true,
  columnReordering: true,
  height: "500px",
};

const ExternalFilterExampleComponent: React.FC<UniversalTableProps> = (props) => {
  const [filters, setFilters] = useState<{ [key: string]: FilterCondition }>({});

  // Filter data externally based on filters
  const filteredData = useMemo(() => {
    if (Object.keys(filters).length === 0) return sampleData;

    return sampleData.filter((row) => {
      return Object.values(filters).every((filter) => {
        const cellValue = row[filter.accessor] as CellValue;

        // Apply filter based on operator
        switch (filter.operator) {
          case "equals":
            return cellValue === filter.value;
          case "notEquals":
            return cellValue !== filter.value;
          case "contains":
            return String(cellValue).toLowerCase().includes(String(filter.value).toLowerCase());
          case "notContains":
            return !String(cellValue).toLowerCase().includes(String(filter.value).toLowerCase());
          case "startsWith":
            return String(cellValue).toLowerCase().startsWith(String(filter.value).toLowerCase());
          case "endsWith":
            return String(cellValue).toLowerCase().endsWith(String(filter.value).toLowerCase());
          case "greaterThan":
            return Number(cellValue) > Number(filter.value);
          case "greaterThanOrEqual":
            return Number(cellValue) >= Number(filter.value);
          case "lessThan":
            return Number(cellValue) < Number(filter.value);
          case "lessThanOrEqual":
            return Number(cellValue) <= Number(filter.value);
          case "in":
            return Array.isArray(filter.values) && filter.values.includes(cellValue);
          case "notIn":
            return !Array.isArray(filter.values) || !filter.values.includes(cellValue);
          case "isEmpty":
            return !cellValue || cellValue === "";
          case "isNotEmpty":
            return cellValue && cellValue !== "";
          default:
            return true;
        }
      });
    });
  }, [filters]);

  const handleFilterChange = (filters: TableFilterState) => {
    setFilters(filters);
  };
  return (
    <SimpleTable
      {...props}
      defaultHeaders={headers}
      rows={filteredData} // We provide the pre-filtered data
      rowIdAccessor="id"
      onFilterChange={handleFilterChange} // Handle filter changes externally
      // Default settings for this example
      externalFilterHandling={props.externalFilterHandling ?? true}
      columnResizing={props.columnResizing ?? true}
      columnReordering={props.columnReordering ?? true}
      height={props.height ?? "500px"}
      theme={props.theme ?? "light"}
    />
  );
};

export default ExternalFilterExampleComponent;
