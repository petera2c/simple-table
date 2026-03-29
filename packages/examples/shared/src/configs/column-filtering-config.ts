import type { HeaderObject } from "simple-table-core";
import { COLUMN_FILTERING_DATA } from "../data/column-filtering-data";

export const DEPARTMENT_OPTIONS = [
  { label: "Editorial", value: "Editorial" },
  { label: "Production", value: "Production" },
  { label: "Marketing", value: "Marketing" },
  { label: "Sales", value: "Sales" },
  { label: "Operations", value: "Operations" },
  { label: "Human Resources", value: "Human Resources" },
  { label: "Finance", value: "Finance" },
  { label: "Legal", value: "Legal" },
  { label: "IT Support", value: "IT Support" },
  { label: "Customer Service", value: "Customer Service" },
  { label: "Research & Development", value: "Research & Development" },
  { label: "Quality Assurance", value: "Quality Assurance" },
];

export const columnFilteringHeaders: HeaderObject[] = [
  {
    accessor: "id",
    label: "ID",
    width: 80,
    type: "number",
    isSortable: true,
    filterable: true,
  },
  {
    accessor: "name",
    label: "Employee Name",
    width: "1fr",
    minWidth: 150,
    type: "string",
    isSortable: true,
    filterable: true,
  },
  {
    accessor: "department",
    label: "Department",
    width: "1fr",
    minWidth: 120,
    type: "enum",
    isSortable: true,
    filterable: true,
    enumOptions: DEPARTMENT_OPTIONS,
  },
  {
    accessor: "role",
    label: "Role",
    width: 140,
    type: "string",
    isSortable: true,
    filterable: true,
  },
  {
    accessor: "salary",
    label: "Salary",
    width: 120,
    align: "right",
    type: "number",
    isSortable: true,
    filterable: true,
    cellRenderer: ({ row }) => {
      const salary = row.salary as number;
      return `$${salary.toLocaleString()}`;
    },
  },
  {
    accessor: "startDate",
    label: "Start Date",
    width: 130,
    type: "date",
    isSortable: true,
    filterable: true,
  },
  {
    accessor: "isActive",
    label: "Active",
    width: 100,
    align: "center",
    type: "boolean",
    isSortable: true,
    filterable: true,
  },
];

export const columnFilteringConfig = {
  headers: columnFilteringHeaders,
  rows: COLUMN_FILTERING_DATA,
} as const;
