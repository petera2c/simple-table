// Self-contained demo table setup for this example.
import type { HeaderObject, TableFilterState } from "simple-table-core";


type CellValue = string | number | boolean | null | undefined;

export function matchesFilter(
  value: CellValue,
  filter: TableFilterState[string]
): boolean {
  const { operator } = filter;

  switch (operator) {
    case "equals":
      return value === filter.value;
    case "notEquals":
      return value !== filter.value;
    case "contains":
      return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
    case "notContains":
      return !String(value).toLowerCase().includes(String(filter.value).toLowerCase());
    case "startsWith":
      return String(value).toLowerCase().startsWith(String(filter.value).toLowerCase());
    case "endsWith":
      return String(value).toLowerCase().endsWith(String(filter.value).toLowerCase());
    case "greaterThan":
      return Number(value) > Number(filter.value);
    case "lessThan":
      return Number(value) < Number(filter.value);
    case "greaterThanOrEqual":
      return Number(value) >= Number(filter.value);
    case "lessThanOrEqual":
      return Number(value) <= Number(filter.value);
    case "between":
      return (
        filter.values != null &&
        Number(value) >= Number(filter.values[0]) &&
        Number(value) <= Number(filter.values[1])
      );
    case "in":
      return filter.values != null && filter.values.includes(value);
    case "notIn":
      return filter.values != null && !filter.values.includes(value);
    case "isEmpty":
      return value == null || value === "";
    case "isNotEmpty":
      return value != null && value !== "";
    default:
      return true;
  }
}

const DEPARTMENT_OPTIONS = [
  { label: "AI Research", value: "AI Research" },
  { label: "UX Design", value: "UX Design" },
  { label: "DevOps", value: "DevOps" },
  { label: "Marketing", value: "Marketing" },
  { label: "Engineering", value: "Engineering" },
  { label: "Product", value: "Product" },
  { label: "Sales", value: "Sales" },
];

const LOCATION_OPTIONS = [
  { label: "San Francisco", value: "San Francisco" },
  { label: "Tokyo", value: "Tokyo" },
  { label: "Lagos", value: "Lagos" },
  { label: "Mexico City", value: "Mexico City" },
  { label: "Kolkata", value: "Kolkata" },
  { label: "Stockholm", value: "Stockholm" },
  { label: "Dubai", value: "Dubai" },
  { label: "Milan", value: "Milan" },
  { label: "Seoul", value: "Seoul" },
  { label: "Austin", value: "Austin" },
  { label: "London", value: "London" },
  { label: "Moscow", value: "Moscow" },
];

export const externalFilterData = [
  { id: 1, name: "Dr. Elena Vasquez", age: 42, email: "elena.vasquez@techcorp.com", salary: 145000, department: "AI Research", active: true, location: "San Francisco" },
  { id: 2, name: "Kai Tanaka", age: 29, email: "k.tanaka@techcorp.com", salary: 95000, department: "UX Design", active: true, location: "Tokyo" },
  { id: 3, name: "Amara Okafor", age: 35, email: "amara.okafor@techcorp.com", salary: 125000, department: "DevOps", active: false, location: "Lagos" },
  { id: 4, name: "Santiago Rodriguez", age: 27, email: "s.rodriguez@techcorp.com", salary: 82000, department: "Marketing", active: true, location: "Mexico City" },
  { id: 5, name: "Priya Chakraborty", age: 33, email: "priya.c@techcorp.com", salary: 118000, department: "Engineering", active: true, location: "Kolkata" },
  { id: 6, name: "Magnus Eriksson", age: 38, email: "magnus.erik@techcorp.com", salary: 110000, department: "Product", active: false, location: "Stockholm" },
  { id: 7, name: "Zara Al-Rashid", age: 31, email: "zara.alrashid@techcorp.com", salary: 98000, department: "Sales", active: true, location: "Dubai" },
  { id: 8, name: "Luca Rossi", age: 26, email: "luca.rossi@techcorp.com", salary: 75000, department: "Marketing", active: true, location: "Milan" },
  { id: 9, name: "Dr. Sarah Kim", age: 45, email: "sarah.kim@techcorp.com", salary: 165000, department: "AI Research", active: true, location: "Seoul" },
  { id: 10, name: "Olumide Adebayo", age: 30, email: "olumide.a@techcorp.com", salary: 105000, department: "Engineering", active: false, location: "Austin" },
  { id: 11, name: "Isabella Chen", age: 24, email: "isabella.chen@techcorp.com", salary: 68000, department: "UX Design", active: true, location: "London" },
  { id: 12, name: "Dmitri Volkov", age: 39, email: "dmitri.volkov@techcorp.com", salary: 135000, department: "DevOps", active: true, location: "Moscow" },
];

export const externalFilterHeaders: HeaderObject[] = [
  { accessor: "name", label: "Name", width: "1fr", minWidth: 120, filterable: true, type: "string" },
  { accessor: "age", label: "Age", width: 120, filterable: true, type: "number" },
  {
    accessor: "department",
    label: "Department",
    width: 150,
    filterable: true,
    type: "enum",
    enumOptions: DEPARTMENT_OPTIONS,
  },
  {
    accessor: "location",
    label: "Location",
    width: 150,
    filterable: true,
    type: "enum",
    enumOptions: LOCATION_OPTIONS,
  },
  { accessor: "active", label: "Active", width: 120, filterable: true, type: "boolean" },
  {
    accessor: "salary",
    label: "Salary",
    width: 120,
    filterable: true,
    type: "number",
    align: "right",
    valueFormatter: ({ value }) => `$${(value as number).toLocaleString()}`,
  },
];

export const externalFilterConfig = {
  headers: externalFilterHeaders,
  rows: externalFilterData,
  tableProps: { externalFilterHandling: true, columnResizing: true },
} as const;
