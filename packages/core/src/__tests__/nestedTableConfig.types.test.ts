/**
 * Compile-time probe: NestedTableConfig accepts ColumnDef<Child>[] under a
 * parent ColumnDef without casts. Included in `npm run typecheck` (no runner).
 */
import type { ColumnDef, NestedColumnDef } from "../types/ColumnDef";

interface NestCompany {
  id: string;
  name: string;
  divisions?: NestDivision[];
}

interface NestDivision {
  id: string;
  divisionName: string;
}

const divisionColumns: ColumnDef<NestDivision>[] = [
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

const companyColumns: ColumnDef<NestCompany>[] = [
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
const badNestedColumns: NestedColumnDef[] = [
  // @ts-expect-error nest columns require column metadata (accessor, label, …)
  notAColumn,
];
void badNestedColumns;

export {};
