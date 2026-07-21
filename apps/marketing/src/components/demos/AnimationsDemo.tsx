import { useState } from "react";
import { SimpleTable } from "@simple-table/react";
import type { ReactColumnDef, Theme } from "@simple-table/react";
import "@simple-table/react/styles.css";

const INITIAL_HEADERS: ReactColumnDef[] = [
  { accessor: "id", label: "ID", width: 60, sortable: true, type: "number" },
  { accessor: "name", label: "Name", minWidth: 140, width: "1fr", sortable: true, type: "string" },
  { accessor: "age", label: "Age", width: 80, align: "right", sortable: true, type: "number" },
  { accessor: "role", label: "Role", minWidth: 140, width: "1fr", sortable: true, type: "string" },
  {
    accessor: "department",
    disableReorder: true,
    sortable: true,
    label: "Department",
    minWidth: 140,
    width: "1fr",
    type: "string",
  },
];

const EMPLOYEES = [
  { id: 1, name: "Captain Stella Vega", age: 38, role: "Mission Commander", department: "Flight Operations" },
  { id: 2, name: "Dr. Cosmos Rivera", age: 34, role: "Astrophysicist", department: "Science" },
  { id: 3, name: "Commander Nebula Johnson", age: 42, role: "Operations Director", department: "Mission Control" },
  { id: 4, name: "Cadet Orbit Williams", age: 26, role: "Flight Engineer", department: "Engineering" },
  { id: 5, name: "Dr. Galaxy Chen", age: 31, role: "Life Support Specialist", department: "Engineering" },
  { id: 6, name: "Lt. Meteor Lee", age: 29, role: "Navigation Officer", department: "Flight Operations" },
  { id: 7, name: "Dr. Comet Hassan", age: 33, role: "Mission Planner", department: "Planning" },
  { id: 8, name: "Major Pulsar White", age: 36, role: "Communications Director", department: "Communications" },
  { id: 9, name: "Specialist Quasar Black", age: 28, role: "Systems Analyst", department: "Technology" },
  { id: 10, name: "Engineer Supernova Blue", age: 35, role: "Propulsion Engineer", department: "Engineering" },
  { id: 11, name: "Dr. Aurora Kumar", age: 30, role: "Planetary Geologist", department: "Science" },
  { id: 12, name: "Admiral Cosmos Silver", age: 45, role: "Program Director", department: "Leadership" },
];

const AnimationsDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const [headers, setHeaders] = useState<ReactColumnDef[]>(INITIAL_HEADERS);

  const handleColumnOrderChange = (newHeaders: ReactColumnDef[]) => {
    setHeaders(newHeaders);
  };

  return (
    <SimpleTable
      columnReordering
      columns={headers}
      enableColumnEditor
      enableColumnEditorInitOpen
      height={height}
      onColumnOrderChange={handleColumnOrderChange}
      rows={EMPLOYEES}
      theme={theme}
    />
  );
};

export default AnimationsDemo;
