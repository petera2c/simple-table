// Self-contained demo table setup for this example.
import type { AngularHeaderObject, Row } from "@simple-table/angular";


export const customIconsData: Row[] = [
  { id: 1, name: "Alpha Release", version: "1.0.0", status: "released", downloads: 15420, date: "2024-01-15" },
  { id: 2, name: "Beta Release", version: "1.1.0", status: "released", downloads: 28300, date: "2024-03-22" },
  { id: 3, name: "Hotfix", version: "1.1.1", status: "released", downloads: 31050, date: "2024-04-05" },
  { id: 4, name: "Feature Update", version: "1.2.0", status: "released", downloads: 42100, date: "2024-06-10" },
  { id: 5, name: "Security Patch", version: "1.2.1", status: "released", downloads: 45800, date: "2024-07-18" },
  { id: 6, name: "Major Release", version: "2.0.0", status: "released", downloads: 67200, date: "2024-09-01" },
  { id: 7, name: "Minor Update", version: "2.1.0", status: "beta", downloads: 8900, date: "2024-11-12" },
  { id: 8, name: "Next Release", version: "2.2.0", status: "planned", downloads: 0, date: "2025-01-20" },
];

export const customIconsHeaders: AngularHeaderObject[] = [
  { accessor: "id", label: "ID", width: 60, type: "number", isSortable: true },
  { accessor: "name", label: "Release", width: 170, type: "string", isSortable: true },
  { accessor: "version", label: "Version", width: 100, type: "string", isSortable: true },
  { accessor: "status", label: "Status", width: 110, type: "string", isSortable: true },
  {
    accessor: "downloads",
    label: "Downloads",
    width: 130,
    type: "number",
    isSortable: true,
    valueFormatter: ({ value }) => (value as number).toLocaleString(),
  },
  {
    accessor: "date",
    label: "Date",
    width: 130,
    type: "date",
    isSortable: true,
    valueFormatter: ({ value }) => new Date(value as string).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  },
];

export const customIconsConfig = {
  headers: customIconsHeaders,
  rows: customIconsData,
} as const;
