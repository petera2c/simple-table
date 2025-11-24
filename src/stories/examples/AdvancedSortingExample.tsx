import React from "react";
import { SimpleTable } from "../..";
import HeaderObject from "../../types/HeaderObject";
import Row from "../../types/Row";
import { UniversalTableProps } from "./StoryWrapper";

// Sample data with metadata for advanced sorting
const sampleData: Row[] = [
  {
    id: 1,
    name: "Alice Johnson",
    department: "Engineering",
    salary: 95000,
    experience: 8,
    rating: 4.8,
    hireDate: "2016-03-15",
    status: "active",
    priority: 1,
    metadata: { seniorityLevel: 3, performanceScore: 92 },
  },
  {
    id: 2,
    name: "Bob Smith",
    department: "Marketing",
    salary: 75000,
    experience: 5,
    rating: 4.2,
    hireDate: "2019-07-22",
    status: "active",
    priority: 2,
    metadata: { seniorityLevel: 2, performanceScore: 78 },
  },
  {
    id: 3,
    name: "Carol Williams",
    department: "Engineering",
    salary: 120000,
    experience: 12,
    rating: 4.9,
    hireDate: "2012-01-10",
    status: "active",
    priority: 1,
    metadata: { seniorityLevel: 4, performanceScore: 98 },
  },
  {
    id: 4,
    name: "David Brown",
    department: "Sales",
    salary: 68000,
    experience: 3,
    rating: 3.8,
    hireDate: "2021-05-18",
    status: "probation",
    priority: 3,
    metadata: { seniorityLevel: 1, performanceScore: 65 },
  },
  {
    id: 5,
    name: "Eve Davis",
    department: "Engineering",
    salary: 110000,
    experience: 10,
    rating: 4.7,
    hireDate: "2014-09-30",
    status: "active",
    priority: 1,
    metadata: { seniorityLevel: 4, performanceScore: 88 },
  },
  {
    id: 6,
    name: "Frank Miller",
    department: "Marketing",
    salary: 82000,
    experience: 6,
    rating: 4.3,
    hireDate: "2018-11-05",
    status: "active",
    priority: 2,
    metadata: { seniorityLevel: 2, performanceScore: 81 },
  },
  {
    id: 7,
    name: "Grace Lee",
    department: "Sales",
    salary: 72000,
    experience: 4,
    rating: 4.1,
    hireDate: "2020-02-14",
    status: "active",
    priority: 2,
    metadata: { seniorityLevel: 2, performanceScore: 73 },
  },
  {
    id: 8,
    name: "Henry Wilson",
    department: "Engineering",
    salary: 88000,
    experience: 7,
    rating: 4.5,
    hireDate: "2017-06-20",
    status: "active",
    priority: 2,
    metadata: { seniorityLevel: 3, performanceScore: 85 },
  },
];

const headers: HeaderObject[] = [
  {
    accessor: "name",
    label: "Name",
    width: 180,
    isSortable: true,
    type: "string",
  },
  {
    accessor: "department",
    label: "Department",
    width: 150,
    isSortable: true,
    type: "string",
  },
  {
    accessor: "salary",
    label: "Salary",
    width: 120,
    isSortable: true,
    type: "number",
    valueFormatter: ({ value }) => {
      if (typeof value === "number") {
        return `$${value.toLocaleString()}`;
      }
      return String(value);
    },
  },
  {
    accessor: "experience",
    label: "Years Experience",
    width: 140,
    isSortable: true,
    type: "number",
  },
  {
    accessor: "rating",
    label: "Rating",
    width: 100,
    isSortable: true,
    type: "number",
    valueFormatter: ({ value }) => {
      if (typeof value === "number") {
        return `⭐ ${value.toFixed(1)}`;
      }
      return String(value);
    },
  },
  {
    accessor: "hireDate",
    label: "Hire Date",
    width: 130,
    isSortable: true,
    type: "date",
    valueFormatter: ({ value }) => {
      if (typeof value === "string") {
        return new Date(value).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }
      return String(value);
    },
  },
  {
    accessor: "status",
    label: "Status",
    width: 120,
    isSortable: true,
    type: "string",
    valueFormatter: ({ value }) => {
      const status = String(value);
      return status.charAt(0).toUpperCase() + status.slice(1);
    },
  },
  {
    accessor: "priority",
    label: "Priority (Custom Sort)",
    width: 180,
    isSortable: true,
    type: "number",
    // Custom comparator: Sort by priority, then by metadata.performanceScore
    comparator: ({ rowA, rowB, direction }) => {
      const priorityA = rowA.priority as number;
      const priorityB = rowB.priority as number;

      // First compare by priority
      if (priorityA !== priorityB) {
        const result = priorityA - priorityB;
        return direction === "ascending" ? result : -result;
      }

      // If priority is the same, compare by performance score from metadata
      const metadataA = rowA.metadata as Record<string, any>;
      const metadataB = rowB.metadata as Record<string, any>;
      const scoreA = metadataA?.performanceScore || 0;
      const scoreB = metadataB?.performanceScore || 0;

      const result = scoreB - scoreA; // Higher score comes first
      return direction === "ascending" ? result : -result;
    },
    valueFormatter: ({ value, row }) => {
      const metadata = row.metadata as Record<string, any>;
      const score = metadata?.performanceScore || 0;
      return `P${value} (Score: ${score})`;
    },
  },
  {
    accessor: "metadata",
    label: "Seniority Level (ValueGetter)",
    width: 220,
    isSortable: true,
    type: "number",
    // Use valueGetter to extract nested data for sorting
    valueGetter: ({ row }) => {
      const metadata = row.metadata as Record<string, any>;
      return metadata?.seniorityLevel || 0;
    },
    valueFormatter: ({ row }) => {
      const metadata = row.metadata as Record<string, any>;
      const level = metadata?.seniorityLevel || 0;
      const labels = ["Intern", "Junior", "Mid", "Senior", "Lead"];
      return labels[level] || "Unknown";
    },
  },
];

export const advancedSortingExampleDefaults: Partial<UniversalTableProps> = {
  theme: "light",
  selectableCells: false,
  height: "600px",
};

const AdvancedSortingExample: React.FC<UniversalTableProps> = (props) => {
  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2>Advanced Sorting Features</h2>
        <div style={{ marginTop: "10px", fontSize: "14px", lineHeight: "1.6" }}>
          <p>
            <strong>This example demonstrates:</strong>
          </p>
          <ul>
            <li>
              <strong>Custom Comparator:</strong> The "Priority" column uses a custom sorting
              function that sorts first by priority, then by performance score from row metadata.
            </li>
            <li>
              <strong>ValueGetter:</strong> The "Seniority Level" column uses valueGetter to extract
              nested metadata for sorting, while displaying formatted text.
            </li>
            <li>
              <strong>ValueFormatter:</strong> Multiple columns show formatted values (salary with
              $, rating with stars, etc.) while sorting on raw data.
            </li>
          </ul>
          <p style={{ marginTop: "10px" }}>
            <em>Click column headers to sort and observe how custom sorting logic works!</em>
          </p>
        </div>
      </div>
      <SimpleTable rows={sampleData} defaultHeaders={headers} rowIdAccessor="id" {...props} />
    </div>
  );
};

export default AdvancedSortingExample;
