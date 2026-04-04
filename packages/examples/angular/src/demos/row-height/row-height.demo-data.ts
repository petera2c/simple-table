// Self-contained demo table setup for this example.
import type { HeaderObject } from "@simple-table/angular";


export const rowHeightHeaders: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", minWidth: 150, width: "1fr", type: "string" },
  { accessor: "age", label: "Age", width: 100, type: "string" },
  { accessor: "role", label: "Role", minWidth: 180, width: "1fr", type: "string" },
  { accessor: "department", label: "Department", minWidth: 180, width: "1fr", type: "string" },
];

export const rowHeightData = [
  { id: 1, name: "Valentina Romano", age: 34, role: "Principal Architect", department: "Design" },
  { id: 2, name: "Mateo Fernandez", age: 29, role: "Project Architect", department: "Design" },
  { id: 3, name: "Amira Okafor", age: 41, role: "Design Director", department: "Leadership" },
  { id: 4, name: "Ravi Nakamura", age: 26, role: "Junior Architect", department: "Design" },
  { id: 5, name: "Layla Hassan", age: 32, role: "Structural Engineer", department: "Engineering" },
  { id: 6, name: "Cosmo Chen", age: 30, role: "Interior Designer", department: "Interiors" },
  { id: 7, name: "Stella Petrov", age: 28, role: "Urban Planner", department: "Planning" },
  { id: 8, name: "Dante Kim", age: 35, role: "Project Manager", department: "Operations" },
  { id: 9, name: "Indigo Martinez", age: 27, role: "Environmental Designer", department: "Sustainability" },
  { id: 10, name: "Blaze Williams", age: 33, role: "Construction Manager", department: "Construction" },
  { id: 11, name: "Iris Silva", age: 31, role: "Landscape Architect", department: "Landscape" },
  { id: 12, name: "Neo Thompson", age: 36, role: "Technical Coordinator", department: "Technical" },
];

export const rowHeightConfig = {
  headers: rowHeightHeaders,
  rows: rowHeightData,
  tableProps: { customTheme: { rowHeight: 32 } },
} as const;
