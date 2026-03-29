import type { HeaderObject } from "simple-table-core";
import { QUICK_START_DATA } from "../data/quick-start-data";

export const quickStartHeaders: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, isSortable: true, type: "number" },
  {
    accessor: "name",
    label: "Name",
    minWidth: 80,
    width: "1fr",
    isSortable: true,
    type: "string",
  },
  { accessor: "age", label: "Age", width: 100, isSortable: true, type: "number" },
  { accessor: "role", label: "Role", width: 150, isSortable: true, type: "string" },
  { accessor: "department", label: "Department", width: 150, isSortable: true, type: "string" },
  { accessor: "startDate", label: "Start Date", width: 150, isSortable: true, type: "date" },
];

export const quickStartConfig = {
  headers: quickStartHeaders,
  rows: QUICK_START_DATA,
  tableProps: {
    editColumns: true,
    selectableCells: true,
    customTheme: { rowHeight: 32 },
  },
} as const;
