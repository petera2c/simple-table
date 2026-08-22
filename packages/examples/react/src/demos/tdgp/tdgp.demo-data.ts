import type { ReactColumnDef } from "@simple-table/react";

export type TdgpDeveloper = {
  id: number | string;
  firstName?: string;
  lastName?: string;
  country?: string;
  city?: string;
  stack?: string;
  preferredLanguage?: string;
  age?: number;
  salary?: number;
  reposCount?: number;
  __tdgpKeys?: string[];
  __tdgpChildren?: TdgpDeveloper[];
  [key: string]: unknown;
};

export const TDGP_DATASET = "developers-10k";
export const TDGP_SERVER_URL = "https://data.thedatagrid.com";
export const TDGP_PAGE_SIZE = 5;
export const TDGP_GROUP_BY = ["country", "stack"];

const currency = (value: number | string | null | undefined) =>
  value == null ? "" : `$${Number(value).toLocaleString()}`;

export const tdgpHeaders: ReactColumnDef<TdgpDeveloper>[] = [
  {
    accessor: "country",
    label: "Country",
    width: 180,
    type: "string",
    filterable: true,
    expandable: true,
  },
  { accessor: "stack", label: "Stack", width: 140, type: "string", filterable: true },
  { accessor: "firstName", label: "First name", width: 130, type: "string", filterable: true },
  { accessor: "lastName", label: "Last name", width: 130, type: "string", filterable: true },
  {
    accessor: "preferredLanguage",
    label: "Language",
    width: 130,
    type: "string",
    filterable: true,
  },
  { accessor: "age", label: "Age", width: 90, type: "number", filterable: true },
  {
    accessor: "salary",
    label: "Salary",
    width: 130,
    type: "number",
    filterable: true,
    align: "right",
    valueFormatter: ({ value }) => currency(value as number | string | null | undefined),
  },
  {
    accessor: "reposCount",
    label: "Repos",
    width: 100,
    type: "number",
    filterable: true,
  },
];

export const tdgpAggregations = [
  { id: "age", field: "age", fn: "avg" as const },
  { id: "salary", field: "salary", fn: "sum" as const },
  { id: "reposCount", field: "reposCount", fn: "sum" as const },
];
