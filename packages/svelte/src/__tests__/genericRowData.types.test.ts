/**
 * Compile-time smoke test: SimpleTableSvelteProps / SvelteColumnDef / TableAPI
 * accept a domain row type end-to-end (no asRows, no row casts in callbacks).
 */
import { describe, it, expect } from "vitest";
import type {
  TableAPI,
  CellRenderer,
  SvelteColumnDef,
  NestedSvelteColumnDef,
  CellChangeProps,
  SimpleTableSvelteProps,
} from "../index";

interface HREmployee {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  performanceScore: number;
}

const columns: SvelteColumnDef<HREmployee>[] = [
  {
    accessor: "fullName",
    label: "Employee",
    width: 220,
    cellRenderer: ({ row }) => {
      const name: string = row.firstName;
      return name;
    },
  },
];

const rows: HREmployee[] = [
  {
    id: 1,
    firstName: "Ada",
    lastName: "Lovelace",
    fullName: "Ada Lovelace",
    performanceScore: 99,
  },
];

const props: SimpleTableSvelteProps<HREmployee> = {
  columns,
  rows,
  getRowId: ({ row }) => row.id,
  onCellEdit: ({ row }: CellChangeProps<HREmployee>) => {
    const id: number = row.id;
    void id;
  },
};
void props;

// Untyped / default path still accepts open records (prior object[] escape).
const loose: SimpleTableSvelteProps = {
  columns: [{ accessor: "x", label: "X", width: 40 }],
  rows: [{ x: 1 }],
};
void loose;

// Nested grid: child columns typed as Division assign under a Company column
// with no cast / helper (nestedTable.columns is open at the boundary).
interface NestCompany {
  id: string;
  name: string;
  divisions?: NestDivision[];
}
interface NestDivision {
  id: string;
  divisionName: string;
}

const divisionCellRenderer: CellRenderer<NestDivision> = ({ row }) => {
  const name: string = row.divisionName;
  // @ts-expect-error NestDivision has no company-only fields
  const missing: string = row.companyName;
  void missing;
  return name;
};

const divisionColumns: SvelteColumnDef<NestDivision>[] = [
  {
    accessor: "divisionName",
    label: "Division",
    width: 120,
    cellRenderer: divisionCellRenderer,
  },
];

const companyColumns: SvelteColumnDef<NestCompany>[] = [
  {
    accessor: "name",
    label: "Company",
    width: 160,
    expandable: true,
    nestedTable: {
      columns: divisionColumns,
      expandAll: false,
    },
  },
];
void companyColumns;

// Non-column objects are rejected at the nest boundary.
const notAColumn = { foo: 1 };
const badNestedColumns: NestedSvelteColumnDef[] = [
  // @ts-expect-error nest columns require column metadata (accessor, label, …)
  notAColumn,
];
void badNestedColumns;

// Typed imperative handle shape consumers use with bind:this.
type SvelteTableHandle<TData> = { getAPI: () => TableAPI<TData> | null };
const tableHandle: SvelteTableHandle<HREmployee> = {
  getAPI: () => null,
};
const apiFromHandle = tableHandle.getAPI();
void apiFromHandle;

const probeVisibleRows = (api: TableAPI<HREmployee>) => {
  const id: number | undefined = api.getVisibleRows()[0]?.row.id;
  // @ts-expect-error HREmployee has no `missing`
  const missing: string | undefined = api.getVisibleRows()[0]?.row.missing;
  void id;
  void missing;
  void api.getAllRows();
};
void probeVisibleRows;

const probeHandleGetAPI = (handle: SvelteTableHandle<HREmployee>) => {
  const api = handle.getAPI();
  const id: number | undefined = api?.getVisibleRows()[0]?.row.id;
  // @ts-expect-error HREmployee has no `missing`
  const missing: string | undefined = api?.getVisibleRows()[0]?.row.missing;
  void id;
  void missing;
};
void probeHandleGetAPI;

describe("generic row data types", () => {
  it("compiles typed SimpleTable props", () => {
    expect(columns[0]?.accessor).toBe("fullName");
  });

  it("accepts differently typed nested columns without casts", () => {
    expect(companyColumns[0]?.nestedTable?.columns?.[0]?.accessor).toBe("divisionName");
  });
});
