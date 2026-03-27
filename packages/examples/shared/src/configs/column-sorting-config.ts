import type { HeaderObject } from "simple-table-core";
import { COLUMN_SORTING_DATA } from "../data/column-sorting-data";

export const columnSortingHeaders: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, isSortable: true, type: "number" },
  { accessor: "name", label: "Name", width: 180, isSortable: true, type: "string" },
  { accessor: "age", label: "Age", width: 80, isSortable: true, type: "number" },
  { accessor: "role", label: "Role", width: 200, isSortable: true, type: "string" },
  {
    accessor: "department",
    label: "Department",
    width: 180,
    isSortable: true,
    type: "string",
    valueFormatter: ({ value }) => {
      return (value as string).charAt(0).toUpperCase() + (value as string).slice(1);
    },
  },
  {
    accessor: "startDate",
    label: "Start Date",
    width: 140,
    isSortable: true,
    type: "date",
    valueFormatter: ({ value }) => {
      if (typeof value === "string") {
        return new Date(value).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }
      return String(value);
    },
  },
];

export const columnSortingConfig = {
  headers: columnSortingHeaders,
  rows: COLUMN_SORTING_DATA,
  tableProps: {
    initialSortColumn: "age",
    initialSortDirection: "desc" as const,
  },
} as const;
