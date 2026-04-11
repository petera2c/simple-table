import { SimpleTable } from "@simple-table/react";
import type { ReactHeaderObject, Theme } from "@simple-table/react";
import "@simple-table/react/styles.css";

// Define headers
const headers: ReactHeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", minWidth: 150, width: "1fr", type: "string" },
  { accessor: "age", label: "Age", width: 100, type: "string" },
  { accessor: "role", label: "Role", minWidth: 180, width: "1fr", type: "string" },
  { accessor: "department", label: "Department", minWidth: 180, width: "1fr", type: "string" },
];

// Sample data
const EMPLOYEE_DATA = [
  {
    id: 1,
    name: "Valentina Romano",
    age: 34,
    role: "Principal Architect",
    department: "Design",
    startDate: "2018-03-12",
  },
  {
    id: 2,
    name: "Mateo Fernandez",
    age: 29,
    role: "Project Architect",
    department: "Design",
    startDate: "2020-07-08",
  },
  {
    id: 3,
    name: "Amira Okafor",
    age: 41,
    role: "Design Director",
    department: "Leadership",
    startDate: "2016-01-15",
  },
  {
    id: 4,
    name: "Ravi Nakamura",
    age: 26,
    role: "Junior Architect",
    department: "Design",
    startDate: "2022-09-20",
  },
  {
    id: 5,
    name: "Layla Hassan",
    age: 32,
    role: "Structural Engineer",
    department: "Engineering",
    startDate: "2019-11-03",
  },
  {
    id: 6,
    name: "Cosmo Chen",
    age: 30,
    role: "Interior Designer",
    department: "Interiors",
    startDate: "2021-04-18",
  },
  {
    id: 7,
    name: "Stella Petrov",
    age: 28,
    role: "Urban Planner",
    department: "Planning",
    startDate: "2021-08-12",
  },
  {
    id: 8,
    name: "Dante Kim",
    age: 35,
    role: "Project Manager",
    department: "Operations",
    startDate: "2019-02-25",
  },
  {
    id: 9,
    name: "Indigo Martinez",
    age: 27,
    role: "Environmental Designer",
    department: "Sustainability",
    startDate: "2022-01-10",
  },
  {
    id: 10,
    name: "Blaze Williams",
    age: 33,
    role: "Construction Manager",
    department: "Construction",
    startDate: "2020-05-07",
  },
  {
    id: 11,
    name: "Iris Silva",
    age: 31,
    role: "Landscape Architect",
    department: "Landscape",
    startDate: "2020-10-14",
  },
  {
    id: 12,
    name: "Neo Thompson",
    age: 36,
    role: "Technical Coordinator",
    department: "Technical",
    startDate: "2018-12-03",
  },
];

const RowHeightDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable
      defaultHeaders={headers}
      height={height}
      rows={EMPLOYEE_DATA}
      customTheme={{
        rowHeight: 32,
      }}
      theme={theme}
    />
  );
};

export default RowHeightDemo;
