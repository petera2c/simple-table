import { useState } from "react";
import { SimpleTable } from "@simple-table/react";
import type { HeaderObject, ReactHeaderObject, Theme } from "@simple-table/react";
import "@simple-table/react/styles.css";

// Define headers
const headers: ReactHeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, isSortable: true, type: "number" },
  {
    accessor: "name",
    label: "Name",
    minWidth: 120,
    width: "1fr",
    isSortable: true,
    type: "string",
  },
  { accessor: "age", label: "Age", width: 100, isSortable: true, type: "number" },
  { accessor: "role", label: "Role", width: 150, isSortable: true, type: "string" },
  { accessor: "department", label: "Department", width: 150, isSortable: true, type: "string" },
  { accessor: "email", label: "Email", width: 200, isSortable: true, type: "string" },
];

// Sample data
const EMPLOYEE_DATA = [
  {
    id: 1,
    name: "Marcus Rodriguez",
    age: 29,
    role: "Frontend Developer",
    department: "Engineering",
    email: "marcus.rodriguez@company.com",
  },
  {
    id: 2,
    name: "Sophia Chen",
    age: 27,
    role: "UX/UI Designer",
    department: "Design",
    email: "sophia.chen@company.com",
  },
  {
    id: 3,
    name: "Raj Patel",
    age: 34,
    role: "Engineering Manager",
    department: "Management",
    email: "raj.patel@company.com",
  },
  {
    id: 4,
    name: "Luna Martinez",
    age: 23,
    role: "Junior Developer",
    department: "Engineering",
    email: "luna.martinez@company.com",
  },
  {
    id: 5,
    name: "Tyler Anderson",
    age: 31,
    role: "DevOps Engineer",
    department: "Operations",
    email: "tyler.anderson@company.com",
  },
  {
    id: 6,
    name: "Zara Kim",
    age: 28,
    role: "Product Designer",
    department: "Design",
    email: "zara.kim@company.com",
  },
  {
    id: 7,
    name: "Kai Thompson",
    age: 26,
    role: "Full Stack Developer",
    department: "Engineering",
    email: "kai.thompson@company.com",
  },
  {
    id: 8,
    name: "Ava Singh",
    age: 33,
    role: "Product Manager",
    department: "Product",
    email: "ava.singh@company.com",
  },
  {
    id: 9,
    name: "Jordan Walsh",
    age: 25,
    role: "Marketing Specialist",
    department: "Growth",
    email: "jordan.walsh@company.com",
  },
  {
    id: 10,
    name: "Phoenix Lee",
    age: 30,
    role: "Backend Developer",
    department: "Engineering",
    email: "phoenix.lee@company.com",
  },
  {
    id: 11,
    name: "River Jackson",
    age: 24,
    role: "Growth Designer",
    department: "Design",
    email: "river.jackson@company.com",
  },
  {
    id: 12,
    name: "Atlas Morgan",
    age: 32,
    role: "Tech Lead",
    department: "Engineering",
    email: "atlas.morgan@company.com",
  },
];

const ColumnSelectionDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const [selectedColumn, setSelectedColumn] = useState<ReactHeaderObject | null>(null);

  const handleColumnSelect = (header: HeaderObject) => {
    setSelectedColumn(header as ReactHeaderObject);
  };

  return (
    <SimpleTable
      defaultHeaders={headers}
      height={height}
      onColumnSelect={handleColumnSelect}
      rows={EMPLOYEE_DATA}
      selectableColumns={true}
      theme={theme}
    />
  );
};

export default ColumnSelectionDemo;
