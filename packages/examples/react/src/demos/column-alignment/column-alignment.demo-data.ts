// Self-contained demo table setup for this example.
import type { ReactHeaderObject } from "@simple-table/react";


export const columnAlignmentHeaders: ReactHeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, align: "left", type: "number" },
  { accessor: "name", label: "Name", minWidth: 100, width: "1fr", align: "center", type: "string" },
  { accessor: "score", label: "Score", width: 120, align: "right", type: "number" },
  { accessor: "rating", label: "Rating", width: 120, align: "right", type: "number" },
  { accessor: "status", label: "Status", width: 120, align: "left", type: "string" },
];

export const columnAlignmentData = [
  { id: 1, name: "Camila Rodriguez", score: 94, rating: 4.9, status: "Active" },
  { id: 2, name: "Enzo Silva", score: 89, rating: 4.6, status: "Active" },
  { id: 3, name: "Yuki Kim", score: 96, rating: 4.8, status: "Active" },
  { id: 4, name: "Leandro Nakamura", score: 81, rating: 4.2, status: "Injured" },
  { id: 5, name: "Nadia Petrov", score: 87, rating: 4.4, status: "Active" },
  { id: 6, name: "Taj Chen", score: 92, rating: 4.7, status: "Active" },
  { id: 7, name: "Mira Thompson", score: 90, rating: 4.5, status: "Active" },
  { id: 8, name: "Juno Garcia", score: 84, rating: 4.3, status: "Inactive" },
  { id: 9, name: "Caspian Williams", score: 95, rating: 4.9, status: "Active" },
  { id: 10, name: "Vera Martinez", score: 88, rating: 4.4, status: "Active" },
  { id: 11, name: "Zion Hassan", score: 93, rating: 4.8, status: "Active" },
  { id: 12, name: "Kira Kumar", score: 91, rating: 4.6, status: "Resting" },
];

export const columnAlignmentConfig = {
  headers: columnAlignmentHeaders,
  rows: columnAlignmentData,
} as const;
