// Self-contained demo table setup for this example.
import type { AngularHeaderObject } from "@simple-table/angular";


export const COLUMN_RESIZING_STORAGE_KEY = "columnResizingDemo_widths";

export const columnResizingHeaders: AngularHeaderObject[] = [
  { accessor: "id", label: "ID", width: 60, type: "number" },
  { accessor: "name", label: "First Name", width: "1fr", minWidth: 100, type: "string" },
  { accessor: "age", label: "Age", width: "1fr", minWidth: 50, type: "string" },
  { accessor: "role", label: "Role", width: 150, align: "right", type: "number" },
  { accessor: "department", label: "Department", width: "1fr", minWidth: 100, type: "string" },
  { accessor: "startDate", label: "Start Date", width: 150, type: "date" },
];

export const columnResizingData = [
  { id: 1, name: "Dr. Marina Silva", age: 38, role: "Marine Biologist", department: "Research", startDate: "2019-03-15" },
  { id: 2, name: "Captain Alex Torres", age: 45, role: "Research Vessel Captain", department: "Operations", startDate: "2017-08-20" },
  { id: 3, name: "Dr. Coral Chen", age: 34, role: "Oceanographer", department: "Research", startDate: "2020-01-12" },
  { id: 4, name: "Finn O'Brien", age: 27, role: "Research Assistant", department: "Research", startDate: "2022-06-08" },
  { id: 5, name: "Reef Nakamura", age: 31, role: "Dive Safety Officer", department: "Safety", startDate: "2021-02-14" },
  { id: 6, name: "Tide Rodriguez", age: 29, role: "Equipment Specialist", department: "Technical", startDate: "2021-09-03" },
  { id: 7, name: "Dr. Ocean Williams", age: 42, role: "Research Director", department: "Leadership", startDate: "2016-05-10" },
  { id: 8, name: "Wave Petrov", age: 26, role: "Data Analyst", department: "Analysis", startDate: "2022-11-22" },
  { id: 9, name: "Pearl Kim", age: 33, role: "Laboratory Manager", department: "Laboratory", startDate: "2020-07-18" },
  { id: 10, name: "Current Hassan", age: 28, role: "Field Coordinator", department: "Operations", startDate: "2021-12-05" },
  { id: 11, name: "Abyss Thompson", age: 30, role: "ROV Operator", department: "Technical", startDate: "2021-04-20" },
  { id: 12, name: "Dr. Depth Martinez", age: 39, role: "Senior Researcher", department: "Research", startDate: "2018-10-14" },
];

export const columnResizingConfig = {
  headers: columnResizingHeaders,
  rows: columnResizingData,
} as const;
