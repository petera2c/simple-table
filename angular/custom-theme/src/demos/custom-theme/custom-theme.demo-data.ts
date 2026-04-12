// Self-contained demo table setup for this example.
import type { HeaderObject, Row } from "@simple-table/angular";


export const customThemeData: Row[] = [
  { id: 1, name: "Alice Johnson", phone: "2125551234", email: "alice@corp.com", city: "New York", status: "active" },
  { id: 2, name: "Bob Martinez", phone: "3105559876", email: "bob@corp.com", city: "Los Angeles", status: "active" },
  { id: 3, name: "Clara Chen", phone: "4155553210", email: "clara@corp.com", city: "San Francisco", status: "inactive" },
  { id: 4, name: "David Kim", phone: "3125557654", email: "david@corp.com", city: "Chicago", status: "active" },
  { id: 5, name: "Elena Rossi", phone: "6175554321", email: "elena@corp.com", city: "Boston", status: "active" },
  { id: 6, name: "Frank Müller", phone: "2065558765", email: "frank@corp.com", city: "Seattle", status: "inactive" },
  { id: 7, name: "Grace Park", phone: "5125552468", email: "grace@corp.com", city: "Austin", status: "active" },
  { id: 8, name: "Henry Patel", phone: "3035551357", email: "henry@corp.com", city: "Denver", status: "active" },
];

function formatPhone(raw: string): string {
  if (raw.length === 10) {
    return `(${raw.slice(0, 3)}) ${raw.slice(3, 6)}-${raw.slice(6)}`;
  }
  return raw;
}

export const customThemeHeaders: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 60, type: "number" },
  { accessor: "name", label: "Name", width: 170, type: "string", isSortable: true },
  {
    accessor: "phone",
    label: "Phone",
    width: 150,
    type: "string",
    valueFormatter: ({ value }) => formatPhone(value as string),
  },
  { accessor: "email", label: "Email", width: 180, type: "string" },
  { accessor: "city", label: "City", width: 140, type: "string", isSortable: true },
  { accessor: "status", label: "Status", width: 100, type: "string" },
];

export const customThemeConfig = {
  headers: customThemeHeaders,
  rows: customThemeData,
  tableProps: {
    theme: "custom" as const,
    customTheme: {
      rowHeight: 40,
      headerHeight: 44,
    },
  },
} as const;
