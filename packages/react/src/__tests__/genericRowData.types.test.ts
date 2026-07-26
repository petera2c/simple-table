/**
 * Compile-time smoke test: SimpleTable / ReactColumnDef / TableAPI accept a
 * domain row type end-to-end (no asRows, no row casts in callbacks).
 */
import { createElement, createRef } from "react";
import { describe, it, expect } from "vitest";
import { SimpleTable } from "../index";
import type {
  TableAPI,
  ReactColumnDef,
  CellChangeProps,
  SimpleTableReactProps,
} from "../index";

interface HREmployee {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  performanceScore: number;
}

const columns: ReactColumnDef<HREmployee>[] = [
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

const props: SimpleTableReactProps<HREmployee> = {
  columns,
  rows,
  getRowId: ({ row }) => row.id,
  onCellEdit: ({ row }: CellChangeProps<HREmployee>) => {
    const id: number = row.id;
    void id;
  },
};

const ref = createRef<TableAPI<HREmployee>>();
void createElement(SimpleTable<HREmployee>, { ...props, ref });

// Untyped / default path still accepts open records (prior object[] escape).
const loose: SimpleTableReactProps = {
  columns: [{ accessor: "x", label: "X", width: 40 }],
  rows: [{ x: 1 }],
};
void loose;

describe("generic row data types", () => {
  it("compiles typed SimpleTable props and ref", () => {
    expect(columns[0]?.accessor).toBe("fullName");
    expect(ref.current).toBeNull();
  });
});
