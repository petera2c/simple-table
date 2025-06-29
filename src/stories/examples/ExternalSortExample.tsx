import React, { useState, useMemo } from "react";
import { SimpleTable } from "../..";
import HeaderObject from "../../types/HeaderObject";
import Row from "../../types/Row";
import SortConfig from "../../types/SortConfig";
import { UniversalTableProps } from "./StoryWrapper";

// Sample data
const sampleData: Row[] = [
  {
    id: 1,
    name: "John Doe",
    age: 30,
    email: "john@example.com",
    salary: 75000,
    department: "Engineering",
  },
  {
    id: 2,
    name: "Jane Smith",
    age: 25,
    email: "jane@example.com",
    salary: 65000,
    department: "Marketing",
  },
  {
    id: 3,
    name: "Bob Johnson",
    age: 35,
    email: "bob@example.com",
    salary: 85000,
    department: "Engineering",
  },
  {
    id: 4,
    name: "Alice Brown",
    age: 28,
    email: "alice@example.com",
    salary: 70000,
    department: "Sales",
  },
  {
    id: 5,
    name: "Charlie Wilson",
    age: 32,
    email: "charlie@example.com",
    salary: 80000,
    department: "Engineering",
  },
  {
    id: 6,
    name: "Diana Prince",
    age: 29,
    email: "diana@example.com",
    salary: 72000,
    department: "Marketing",
  },
  {
    id: 7,
    name: "Ethan Hunt",
    age: 31,
    email: "ethan@example.com",
    salary: 78000,
    department: "Sales",
  },
  {
    id: 8,
    name: "Fiona Green",
    age: 26,
    email: "fiona@example.com",
    salary: 68000,
    department: "Marketing",
  },
];

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
    cellRenderer: ({ row }) => `$${(row.salary || 0).toLocaleString()}`,
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
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // Sort data externally based on sortConfig
  const sortedData = useMemo(() => {
    if (!sortConfig) return sampleData;

    const sorted = [...sampleData].sort((a, b) => {
      const accessor = sortConfig.key.accessor;
      const aValue = a[accessor];
      const bValue = b[accessor];

      if (aValue === bValue) return 0;

      let comparison = 0;
      if (sortConfig.key.type === "number") {
        comparison = (aValue as number) - (bValue as number);
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortConfig.direction === "ascending" ? comparison : -comparison;
    });

    return sorted;
  }, [sortConfig]);

  return (
    <SimpleTable
      {...props}
      defaultHeaders={headers}
      rows={sortedData} // We provide the pre-sorted data
      rowIdAccessor="id"
      onSortChange={setSortConfig} // Handle sort changes externally
      // Default settings for this example
      externalSortHandling={props.externalSortHandling ?? true}
      columnResizing={props.columnResizing ?? true}
      columnReordering={props.columnReordering ?? true}
      height={props.height ?? "400px"}
      theme={props.theme ?? "light"}
    />
  );
};

export default ExternalSortExampleComponent;
