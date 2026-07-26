/**
 * Compile-time smoke test: SimpleTableAngularProps / AngularColumnDef / TableAPI
 * accept a domain row type end-to-end (no asRows, no row casts in callbacks).
 */
import { describe, it, expect } from "vitest";
import type {
  TableAPI,
  AngularColumnDef,
  NestedAngularColumnDef,
  CellChangeProps,
  SimpleTableAngularProps,
} from "../index";

interface HREmployee {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  performanceScore: number;
}

const columns: AngularColumnDef<HREmployee>[] = [
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

const props: SimpleTableAngularProps<HREmployee> = {
  columns,
  rows,
  getRowId: ({ row }) => row.id,
  onCellEdit: ({ row }: CellChangeProps<HREmployee>) => {
    const id: number = row.id;
    void id;
  },
};
void props;

const loose: SimpleTableAngularProps = {
  columns: [{ accessor: "x", label: "X", width: 40 }],
  rows: [{ x: 1 }],
};
void loose;

interface NestCompany {
  id: string;
  name: string;
  divisions?: NestDivision[];
}
interface NestDivision {
  id: string;
  divisionName: string;
}

const divisionColumns: AngularColumnDef<NestDivision>[] = [
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

const companyColumns: AngularColumnDef<NestCompany>[] = [
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

const notAColumn = { foo: 1 };
const badNestedColumns: NestedAngularColumnDef[] = [
  // @ts-expect-error nest columns require column metadata (accessor, label, …)
  notAColumn,
];
void badNestedColumns;

const apiProbe: TableAPI<HREmployee> | null = null;
void apiProbe;

describe("generic row data types", () => {
  it("compiles typed SimpleTable props", () => {
    expect(columns[0]?.accessor).toBe("fullName");
  });

  it("accepts differently typed nested columns without casts", () => {
    expect(companyColumns[0]?.nestedTable?.columns?.[0]?.accessor).toBe("divisionName");
  });
});
