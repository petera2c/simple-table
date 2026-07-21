// Self-contained demo table setup for this example.
import type { AngularColumnDef, Row } from "@simple-table/angular";


export const emptyStateData: Row[] = [];

export const emptyStateHeaders: AngularColumnDef[] = [
  { accessor: "id", label: "ID", width: 60, type: "number" },
  { accessor: "name", label: "Name", width: 180, type: "string" },
  { accessor: "email", label: "Email", width: 220, type: "string" },
  { accessor: "role", label: "Role", width: 140, type: "string" },
  { accessor: "department", label: "Department", width: 150, type: "string" },
];

export const emptyStateConfig = {
  headers: emptyStateHeaders,
  rows: emptyStateData,
} as const;
