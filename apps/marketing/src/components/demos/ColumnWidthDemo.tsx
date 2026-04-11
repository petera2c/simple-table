import { SimpleTable } from "@simple-table/react";
import type { ReactHeaderObject, Theme } from "@simple-table/react";
import "@simple-table/react/styles.css";
import { useState, useEffect } from "react";

// Define headers with different width strategies
const headers: ReactHeaderObject[] = [
  // Fixed width in pixels
  { accessor: "id", label: "ID", width: 60, type: "number" },

  // Auto-sizing with "1fr" - takes equal share of available space
  { accessor: "name", label: "Name", width: "1fr", minWidth: 120, type: "string" },

  // Another auto-sizing column with minWidth constraint
  { accessor: "email", label: "Email", width: "1fr", minWidth: 180, type: "string" },

  // Fixed width for predictable layout
  { accessor: "age", label: "Age", width: 80, type: "number" },

  // Auto-sizing column
  { accessor: "department", label: "Department", width: "1fr", minWidth: 100, type: "string" },

  // Fixed width
  { accessor: "salary", label: "Salary", width: 120, align: "right", type: "number" },
];

// Sample data - Tech startup employee directory
const EMPLOYEE_DATA = [
  {
    id: 1,
    name: "Alexandra Reeves",
    email: "alex.reeves@techstartup.io",
    age: 32,
    department: "AI Research",
    salary: "$145,000",
  },
  {
    id: 2,
    name: "Zephyr Kim",
    email: "zephyr.kim@techstartup.io",
    age: 28,
    department: "Product Design",
    salary: "$125,000",
  },
  {
    id: 3,
    name: "Phoenix Okafor",
    email: "phoenix.okafor@techstartup.io",
    age: 35,
    department: "Platform Engineering",
    salary: "$160,000",
  },
  {
    id: 4,
    name: "Luna Tanaka",
    email: "luna.tanaka@techstartup.io",
    age: 29,
    department: "DevOps & Infrastructure",
    salary: "$138,000",
  },
  {
    id: 5,
    name: "River Stone",
    email: "river.stone@techstartup.io",
    age: 31,
    department: "Growth Engineering",
    salary: "$142,000",
  },
  {
    id: 6,
    name: "Sage Morrison",
    email: "sage.morrison@techstartup.io",
    age: 27,
    department: "Customer Success",
    salary: "$95,000",
  },
  {
    id: 7,
    name: "Atlas Chen",
    email: "atlas.chen@techstartup.io",
    age: 33,
    department: "Security & Compliance",
    salary: "$155,000",
  },
  {
    id: 8,
    name: "Nova Patel",
    email: "nova.patel@techstartup.io",
    age: 30,
    department: "Data Science",
    salary: "$148,000",
  },
  {
    id: 9,
    name: "Isabella Patel",
    email: "isabella.patel@techstartup.io",
    age: 29,
    department: "Marketing",
    salary: "$130,000",
  },
  {
    id: 10,
    name: "Leo Patel",
    email: "leo.patel@techstartup.io",
    age: 30,
    department: "Sales",
    salary: "$125,000",
  },
  {
    id: 11,
    name: "Oliver Patel",
    email: "oliver.patel@techstartup.io",
    age: 31,
    department: "HR",
    salary: "$115,000",
  },
  {
    id: 12,
    name: "Sophia Patel",
    email: "sophia.patel@techstartup.io",
    age: 28,
    department: "Finance",
    salary: "$120,000",
  },
  {
    id: 13,
    name: "William Patel",
    email: "william.patel@techstartup.io",
    age: 32,
    department: "Marketing",
    salary: "$135,000",
  },
];

const ColumnWidthDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <SimpleTable
      autoExpandColumns={!isMobile}
      columnResizing
      defaultHeaders={headers}
      height={height}
      rows={EMPLOYEE_DATA}
      theme={theme}
    />
  );
};

export default ColumnWidthDemo;
