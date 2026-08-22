import {
  tableFilterConditions,
  type FilterCondition,
  type FilterOperator,
  type TableFilterState,
} from "../types/FilterTypes";
import type Row from "../types/Row";
import type { RowData } from "../types/Row";
import type { TdgpFilterModel, TdgpFilterOperator, TdgpFilterPredicate } from "./types";

type OperatorMapEntry = {
  operator: TdgpFilterOperator;
  negate?: boolean;
};

const OPERATOR_MAP: Record<FilterOperator, OperatorMapEntry> = {
  equals: { operator: "EQ" },
  notEquals: { operator: "NEQ" },
  contains: { operator: "CONTAINS" },
  notContains: { operator: "CONTAINS", negate: true },
  startsWith: { operator: "STARTS_WITH" },
  endsWith: { operator: "ENDS_WITH" },
  isEmpty: { operator: "IS_BLANK" },
  isNotEmpty: { operator: "IS_NOT_BLANK" },
  greaterThan: { operator: "GT" },
  lessThan: { operator: "LT" },
  greaterThanOrEqual: { operator: "GTE" },
  lessThanOrEqual: { operator: "LTE" },
  between: { operator: "BETWEEN" },
  notBetween: { operator: "BETWEEN", negate: true },
  in: { operator: "IN" },
  notIn: { operator: "IN", negate: true },
  before: { operator: "LT" },
  after: { operator: "GT" },
};

function isBlanklessOperator(operator: FilterOperator): boolean {
  return operator === "isEmpty" || operator === "isNotEmpty";
}

function isListOperator(operator: FilterOperator): boolean {
  return (
    operator === "between" ||
    operator === "notBetween" ||
    operator === "in" ||
    operator === "notIn"
  );
}

function predicateArgs<TData extends RowData>(
  condition: FilterCondition<TData>,
): Array<string | number | boolean | null> | null {
  if (isBlanklessOperator(condition.operator)) return [];

  if (isListOperator(condition.operator)) {
    const values = (condition.values ?? []).filter(
      (value) => value != null && value !== "",
    ) as Array<string | number | boolean>;
    if (values.length === 0) return null;
    return values;
  }

  if (condition.value == null || condition.value === "") return null;
  if (Array.isArray(condition.value)) return null;
  return [condition.value as string | number | boolean];
}

function conditionToFilter<TData extends RowData>(
  condition: FilterCondition<TData>,
): TdgpFilterModel | null {
  const mapped = OPERATOR_MAP[condition.operator];
  if (!mapped) return null;

  const args = predicateArgs(condition);
  if (args == null) return null;

  const predicate: TdgpFilterPredicate = {
    kind: "predicate",
    field: String(condition.accessor),
    operator: mapped.operator,
    ...(args.length > 0 ? { args } : {}),
  };

  if (mapped.negate) {
    return { kind: "not", child: predicate };
  }
  return predicate;
}

/** Turn Simple Table column filters into a TDGP filter tree. */
export function tableFiltersToTdgpFilter<TData extends RowData = Row>(
  filters: TableFilterState<TData> | null | undefined,
): TdgpFilterModel | undefined {
  const children = tableFilterConditions(filters)
    .map((condition) => conditionToFilter(condition))
    .filter((model): model is TdgpFilterModel => model != null);

  if (children.length === 0) return undefined;
  if (children.length === 1) return children[0];
  return { kind: "group", combinator: "AND", children };
}
