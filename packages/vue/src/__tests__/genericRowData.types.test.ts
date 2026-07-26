/**
 * Compile-time smoke test: SimpleTable / VueColumnDef / TableAPI accept a
 * domain row type end-to-end (no asRows, no row casts in callbacks).
 */
import { h } from "vue";
import { describe, it, expect } from "vitest";
import { SimpleTable } from "../index";
import type {
  TableAPI,
  VueColumnDef,
  NestedVueColumnDef,
  CellChangeProps,
  SimpleTableVueProps,
} from "../index";

interface HREmployee {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  performanceScore: number;
}

const columns: VueColumnDef<HREmployee>[] = [
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

const props: SimpleTableVueProps<HREmployee> = {
  columns,
  rows,
  getRowId: ({ row }) => row.id,
  onCellEdit: ({ row }: CellChangeProps<HREmployee>) => {
    const id: number = row.id;
    void id;
  },
};
void props;

// Explicit type arg still works when you want it:
void (SimpleTable as <T>(props: SimpleTableVueProps<T>) => unknown)<HREmployee>;

// Untyped / default path still accepts open records (prior object[] escape).
const loose: SimpleTableVueProps = {
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

const divisionColumns: VueColumnDef<NestDivision>[] = [
  {
    accessor: "divisionName",
    label: "Division",
    width: 120,
    cellRenderer: ({ row }) => {
      const name: string = row.divisionName;
      // @ts-expect-error NestDivision has no company-only fields
      const missing: string = row.companyName;
      void missing;
      return name;
    },
  },
];

const companyColumns: VueColumnDef<NestCompany>[] = [
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
const badNestedColumns: NestedVueColumnDef[] = [
  // @ts-expect-error nest columns require column metadata (accessor, label, …)
  notAColumn,
];
void badNestedColumns;

// Typed imperative handle shape consumers use with template refs.
const apiProbe: TableAPI<HREmployee> | null = null;
void apiProbe;

const probeVisibleRows = (api: TableAPI<HREmployee>) => {
  const id: number | undefined = api.getVisibleRows()[0]?.row.id;
  // @ts-expect-error HREmployee has no `missing`
  const missing: string | undefined = api.getVisibleRows()[0]?.row.missing;
  void id;
  void missing;
  void api.getAllRows();
};
void probeVisibleRows;

// h() accepts typed props bag
void h(SimpleTable, props);

describe("generic row data types", () => {
  it("compiles typed SimpleTable props", () => {
    expect(columns[0]?.accessor).toBe("fullName");
  });

  it("accepts differently typed nested columns without casts", () => {
    expect(companyColumns[0]?.nestedTable?.columns?.[0]?.accessor).toBe("divisionName");
  });
});
