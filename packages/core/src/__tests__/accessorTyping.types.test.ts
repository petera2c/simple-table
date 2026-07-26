/**
 * Compile-time probe: rowGrouping / updateData / filters / pivot use
 * Accessor<TData>. Included in `npm run typecheck` (no runner).
 *
 * Note: Accessor keeps a `string & {}` arm for dotted/dynamic paths, so arbitrary
 * string literals still assign — keyof autocomplete is the consumer win, not
 * typo rejection for plain strings.
 */
import type {
  Accessor,
  FilterCondition,
  PivotConfig,
  SimpleTableProps,
  TableAPI,
  TableFilterState,
  UpdateDataProps,
} from "../index";

interface HREmployee {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  performanceScore: number;
  reports?: HREmployee[];
}

const validGrouping: SimpleTableProps<HREmployee> = {
  rows: [],
  columns: [],
  rowGrouping: ["reports"],
};
void validGrouping;

// Dynamic / synthetic keys still assign via Accessor's string & {} arm.
const dynamicGrouping: SimpleTableProps<HREmployee> = {
  rows: [],
  columns: [],
  rowGrouping: ["__syntheticChildren"],
};
void dynamicGrouping;

const badGroupingType: SimpleTableProps<HREmployee> = {
  rows: [],
  columns: [],
  // @ts-expect-error — number is not an Accessor
  rowGrouping: [1],
};
void badGroupingType;

declare const api: TableAPI<HREmployee>;

const updateOk: UpdateDataProps<HREmployee> = {
  accessor: "performanceScore",
  rowId: 1,
  newValue: 99,
};
api.updateData(updateOk);

// keyof TData flows into UpdateDataProps / TableAPI.updateData
const scoreKey: Accessor<HREmployee> = "performanceScore";
api.updateData({ accessor: scoreKey, rowId: 1, newValue: 100 });

const filterOk: FilterCondition<HREmployee> = {
  accessor: "fullName",
  operator: "contains",
  value: "Ada",
};
void api.applyFilter(filterOk);

const filterState: TableFilterState<HREmployee> = {
  fullName: filterOk,
};
void api.applyFilter(filterState.fullName);

const pivotOk: PivotConfig<HREmployee> = {
  rows: ["firstName"],
  columns: ["lastName"],
  values: [{ accessor: "performanceScore", aggregation: { type: "sum" } }],
};
api.setPivot(pivotOk);

export {};
