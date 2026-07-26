// Self-contained demo table setup for this example.
import type { ReactColumnDef } from "@simple-table/react";

export interface EmptyEmployee {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
}

export const emptyStateData: EmptyEmployee[] = [];

export const emptyStateHeaders: ReactColumnDef<EmptyEmployee>[] = [
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
