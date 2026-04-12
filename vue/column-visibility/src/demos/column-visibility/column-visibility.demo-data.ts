// Self-contained demo table setup for this example (aligned with simple-table-marketing column visibility demo).
import type { ColumnVisibilityState, HeaderObject, Row } from "@simple-table/vue";

export const COLUMN_VISIBILITY_DEMO_STORAGE_KEY = "columnVisibilityDemo";

export function loadColumnVisibilityDemoSaved(): ColumnVisibilityState {
  if (typeof window === "undefined") return {};
  try {
    const saved = localStorage.getItem(COLUMN_VISIBILITY_DEMO_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export function saveColumnVisibilityDemoState(state: ColumnVisibilityState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(COLUMN_VISIBILITY_DEMO_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export const columnVisibilityData: Row[] = [
  { id: 1, firstName: "Alice", lastName: "Johnson", email: "alice@example.com", phone: "555-0101", role: "Engineer", department: "Engineering", location: "NYC", startDate: "2021-03-15" },
  { id: 2, firstName: "Bob", lastName: "Martinez", email: "bob@example.com", phone: "555-0102", role: "Designer", department: "Design", location: "LA", startDate: "2022-07-22" },
  { id: 3, firstName: "Clara", lastName: "Chen", email: "clara@example.com", phone: "555-0103", role: "PM", department: "Product", location: "SF", startDate: "2020-01-10" },
  { id: 4, firstName: "David", lastName: "Kim", email: "david@example.com", phone: "555-0104", role: "Engineer", department: "Engineering", location: "CHI", startDate: "2019-11-05" },
  { id: 5, firstName: "Elena", lastName: "Rossi", email: "elena@example.com", phone: "555-0105", role: "Analyst", department: "Analytics", location: "BOS", startDate: "2023-02-14" },
  { id: 6, firstName: "Frank", lastName: "Müller", email: "frank@example.com", phone: "555-0106", role: "Engineer", department: "Engineering", location: "SEA", startDate: "2021-09-30" },
  { id: 7, firstName: "Grace", lastName: "Park", email: "grace@example.com", phone: "555-0107", role: "Designer", department: "Design", location: "AUS", startDate: "2022-04-18" },
  { id: 8, firstName: "Henry", lastName: "Patel", email: "henry@example.com", phone: "555-0108", role: "Lead", department: "Engineering", location: "DEN", startDate: "2018-05-20" },
];

export const columnVisibilityHeaders: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 60, type: "number" },
  { accessor: "firstName", label: "First Name", width: 120, type: "string" },
  { accessor: "lastName", label: "Last Name", width: 120, type: "string" },
  { accessor: "email", label: "Email", width: 200, type: "string" },
  { accessor: "phone", label: "Phone", width: 120, type: "string", hide: true },
  { accessor: "role", label: "Role", width: 130, type: "string" },
  { accessor: "department", label: "Department", width: 140, type: "string" },
  { accessor: "location", label: "Location", width: 100, type: "string", hide: true },
  {
    accessor: "startDate",
    label: "Start Date",
    width: 130,
    type: "date",
    valueFormatter: ({ value }) => new Date(value as string).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  },
];

export function getColumnVisibilityDemoHeaders(
  savedVisibility: ColumnVisibilityState = loadColumnVisibilityDemoSaved(),
): HeaderObject[] {
  return columnVisibilityHeaders.map((header) => ({
    ...header,
    hide:
      savedVisibility[header.accessor] === false ||
      (savedVisibility[header.accessor] === undefined && header.accessor === "email") ||
      (savedVisibility[header.accessor] === undefined && header.hide === true),
  }));
}

export const columnVisibilityConfig = {
  headers: columnVisibilityHeaders,
  rows: columnVisibilityData,
  tableProps: {
    editColumns: true as const,
    editColumnsInitOpen: true as const,
    columnEditorConfig: {
      text: "Manage Columns",
      searchEnabled: true,
      searchPlaceholder: "Search columns…",
    },
  },
} as const;
