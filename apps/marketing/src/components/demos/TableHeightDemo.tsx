import { useState } from "react";
import { SimpleTable } from "@simple-table/react";
import type { ReactHeaderObject, Theme } from "@simple-table/react";
import "@simple-table/react/styles.css";

// Define headers
const headers: ReactHeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", minWidth: 150, width: "1fr", type: "string" },
  { accessor: "email", label: "Email", minWidth: 200, width: "1fr", type: "string" },
  { accessor: "role", label: "Role", minWidth: 150, width: "1fr", type: "string" },
  { accessor: "department", label: "Department", minWidth: 150, width: "1fr", type: "string" },
  { accessor: "status", label: "Status", width: 120, type: "string" },
];

// Sample data - enough rows to demonstrate scrolling
const EMPLOYEE_DATA = [
  {
    id: 1,
    name: "Alice Chen",
    email: "alice@example.com",
    role: "Senior Engineer",
    department: "Engineering",
    status: "Active",
  },
  {
    id: 2,
    name: "Bob Martinez",
    email: "bob@example.com",
    role: "Product Manager",
    department: "Product",
    status: "Active",
  },
  {
    id: 3,
    name: "Carol Williams",
    email: "carol@example.com",
    role: "Designer",
    department: "Design",
    status: "Active",
  },
  {
    id: 4,
    name: "David Kim",
    email: "david@example.com",
    role: "Data Analyst",
    department: "Analytics",
    status: "Active",
  },
  {
    id: 5,
    name: "Eva Patel",
    email: "eva@example.com",
    role: "DevOps Engineer",
    department: "Engineering",
    status: "On Leave",
  },
  {
    id: 6,
    name: "Frank Johnson",
    email: "frank@example.com",
    role: "QA Lead",
    department: "Engineering",
    status: "Active",
  },
  {
    id: 7,
    name: "Grace Lee",
    email: "grace@example.com",
    role: "UX Researcher",
    department: "Design",
    status: "Active",
  },
  {
    id: 8,
    name: "Henry Brown",
    email: "henry@example.com",
    role: "Backend Developer",
    department: "Engineering",
    status: "Active",
  },
  {
    id: 9,
    name: "Iris Davis",
    email: "iris@example.com",
    role: "Frontend Developer",
    department: "Engineering",
    status: "Active",
  },
  {
    id: 10,
    name: "Jack Wilson",
    email: "jack@example.com",
    role: "Technical Writer",
    department: "Documentation",
    status: "Active",
  },
  {
    id: 11,
    name: "Kate Thompson",
    email: "kate@example.com",
    role: "Security Engineer",
    department: "Engineering",
    status: "Active",
  },
  {
    id: 12,
    name: "Leo Garcia",
    email: "leo@example.com",
    role: "ML Engineer",
    department: "AI",
    status: "Active",
  },
  {
    id: 13,
    name: "Mia Anderson",
    email: "mia@example.com",
    role: "Project Manager",
    department: "Operations",
    status: "Active",
  },
  {
    id: 14,
    name: "Noah Taylor",
    email: "noah@example.com",
    role: "Solutions Architect",
    department: "Engineering",
    status: "Active",
  },
  {
    id: 15,
    name: "Olivia Moore",
    email: "olivia@example.com",
    role: "HR Manager",
    department: "Human Resources",
    status: "Active",
  },
];

const TableHeightDemo = ({
  height = "300px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const [selectedHeight, setSelectedHeight] = useState<string>("400px");

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedHeight("200px")}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            selectedHeight === "200px"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          200px
        </button>
        <button
          onClick={() => setSelectedHeight("300px")}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            selectedHeight === "300px"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          300px
        </button>
        <button
          onClick={() => setSelectedHeight("400px")}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            selectedHeight === "400px"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          400px
        </button>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Current height:{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">{selectedHeight}</code>
      </div>
      <SimpleTable
        defaultHeaders={headers}
        height={selectedHeight}
        rows={EMPLOYEE_DATA}
        theme={theme}
      />
    </div>
  );
};

export default TableHeightDemo;
