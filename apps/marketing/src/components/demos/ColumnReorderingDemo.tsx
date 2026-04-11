import { useState } from "react";
import { SimpleTable } from "@simple-table/react";
import type { HeaderObject, ReactHeaderObject, Theme } from "@simple-table/react";
import "@simple-table/react/styles.css";

// Define headers for the demo
const initialHeaders: ReactHeaderObject[] = [
  { accessor: "id", label: "ID", width: 60, type: "number" },
  { accessor: "name", label: "Name", width: "1fr", type: "string" },
  { accessor: "age", label: "Age", width: 80, align: "right", type: "number" },
  { accessor: "role", label: "Role", minWidth: 100, width: "1fr", type: "string" },
  {
    accessor: "department",
    disableReorder: true,
    label: "Department",
    width: "1fr",
    type: "string",
  },
];

// Sample data
const EMPLOYEE_DATA = [
  {
    id: 1,
    name: "Captain Stella Vega",
    age: 38,
    role: "Mission Commander",
    department: "Flight Operations",
    startDate: "2018-04-12",
  },
  {
    id: 2,
    name: "Dr. Cosmos Rivera",
    age: 34,
    role: "Astrophysicist",
    department: "Science",
    startDate: "2019-09-15",
  },
  {
    id: 3,
    name: "Commander Nebula Johnson",
    age: 42,
    role: "Operations Director",
    department: "Mission Control",
    startDate: "2016-12-03",
  },
  {
    id: 4,
    name: "Cadet Orbit Williams",
    age: 26,
    role: "Flight Engineer",
    department: "Engineering",
    startDate: "2022-03-20",
  },
  {
    id: 5,
    name: "Dr. Galaxy Chen",
    age: 31,
    role: "Life Support Specialist",
    department: "Engineering",
    startDate: "2020-07-08",
  },
  {
    id: 6,
    name: "Lt. Meteor Lee",
    age: 29,
    role: "Navigation Officer",
    department: "Flight Operations",
    startDate: "2021-01-14",
  },
  {
    id: 7,
    name: "Dr. Comet Hassan",
    age: 33,
    role: "Mission Planner",
    department: "Planning",
    startDate: "2019-11-22",
  },
  {
    id: 8,
    name: "Major Pulsar White",
    age: 36,
    role: "Communications Director",
    department: "Communications",
    startDate: "2018-08-17",
  },
  {
    id: 9,
    name: "Specialist Quasar Black",
    age: 28,
    role: "Systems Analyst",
    department: "Technology",
    startDate: "2021-06-05",
  },
  {
    id: 10,
    name: "Engineer Supernova Blue",
    age: 35,
    role: "Propulsion Engineer",
    department: "Engineering",
    startDate: "2019-02-28",
  },
  {
    id: 11,
    name: "Dr. Aurora Kumar",
    age: 30,
    role: "Planetary Geologist",
    department: "Science",
    startDate: "2020-10-12",
  },
  {
    id: 12,
    name: "Admiral Cosmos Silver",
    age: 45,
    role: "Program Director",
    department: "Leadership",
    startDate: "2015-05-18",
  },
];

const ColumnReorderingDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const [headers, setHeaders] = useState<ReactHeaderObject[]>(initialHeaders);
  const [, setCurrentColumnOrder] = useState<string>(
    initialHeaders.map((header) => header.accessor).join(", "),
  );

  const handleColumnOrderChange = (newHeaders: HeaderObject[]) => {
    setHeaders(newHeaders as ReactHeaderObject[]);
    setCurrentColumnOrder(newHeaders.map((header) => header.accessor).join(", "));
  };

  return (
    <SimpleTable
      columnReordering
      defaultHeaders={headers}
      height={height}
      rows={EMPLOYEE_DATA}
      onColumnOrderChange={handleColumnOrderChange}
      theme={theme}
    />
  );
};

export default ColumnReorderingDemo;
