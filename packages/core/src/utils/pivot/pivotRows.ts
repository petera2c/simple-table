import type CellValue from "../../types/CellValue";
import type ColumnDef from "../../types/ColumnDef";
import type { Accessor } from "../../types/ColumnDef";
import type Row from "../../types/Row";
import type {
  PivotConfig,
  PivotResult,
  PivotValueConfig,
} from "../../types/PivotTypes";
import {
  PIVOT_ACCESSOR_PREFIX,
  PIVOT_BLANK_LABEL,
  PIVOT_CHILDREN_KEY,
  PIVOT_IS_TOTAL_KEY,
} from "../../types/PivotTypes";
import { aggregateValues } from "../aggregationUtils";
import { flattenAllHeaders } from "../headerUtils";
import { getNestedValue } from "../rowUtils";

const KEY_SEP = "\u0001";
const TOTAL_COL_KEY = "__total__";

type DimValue = string | number | boolean;

export type PivotRowsProps = {
  rows: Row[];
  pivot: PivotConfig;
  /** Field catalog (`columns`) for labels, types, widths, formatters. */
  fieldHeaders: ColumnDef[];
};

const normalizeDimValue = (value: CellValue): DimValue => {
  if (value === null || value === undefined) return PIVOT_BLANK_LABEL;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  return String(value);
};

const dimLabel = (value: DimValue): string => String(value);

const encodeKey = (parts: DimValue[]): string => parts.map(dimLabel).join(KEY_SEP);

const decodeKey = (key: string): string[] => (key === "" ? [] : key.split(KEY_SEP));

const compareDimLabels = (a: string, b: string): number => {
  if (a === PIVOT_BLANK_LABEL && b !== PIVOT_BLANK_LABEL) return 1;
  if (b === PIVOT_BLANK_LABEL && a !== PIVOT_BLANK_LABEL) return -1;
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
};

const findFieldHeader = (
  catalog: Map<string, ColumnDef>,
  accessor: Accessor
): ColumnDef | undefined => catalog.get(String(accessor));

export const buildPivotAccessor = (colKey: string, valueAccessor: Accessor): string => {
  return `${PIVOT_ACCESSOR_PREFIX}${colKey}${KEY_SEP}${String(valueAccessor)}`;
};

export const buildPivotRowTotalAccessor = (valueAccessor: Accessor): string => {
  return buildPivotAccessor(TOTAL_COL_KEY, valueAccessor);
};

const bucketKey = (rowKey: string, colKey: string, valueIndex: number): string =>
  `${rowKey}${KEY_SEP}${colKey}${KEY_SEP}${valueIndex}`;

const createLeafHeader = ({
  accessor,
  label,
  field,
  alignRight,
}: {
  accessor: string;
  label: string;
  field?: ColumnDef;
  alignRight?: boolean;
}): ColumnDef => ({
  accessor,
  label,
  width: field?.width ?? 100,
  type: field?.type ?? "number",
  align: alignRight ? "right" : field?.align ?? "right",
  sortable: field?.sortable ?? true,
  filterable: false,
  editable: false,
  valueFormatter: field?.valueFormatter,
  valueGetter: field?.valueGetter,
  minWidth: field?.minWidth,
  maxWidth: field?.maxWidth,
});

const buildColumnHeaders = ({
  colKeys,
  values,
  catalog,
  showRowTotals,
}: {
  colKeys: string[];
  values: PivotValueConfig[];
  catalog: Map<string, ColumnDef>;
  showRowTotals: boolean;
}): ColumnDef[] => {
  const multiValue = values.length > 1;
  const roots: ColumnDef[] = [];

  // Trie: path segment → node
  type TrieNode = {
    label: string;
    children: Map<string, TrieNode>;
    colKey?: string;
  };

  const root: TrieNode = { label: "", children: new Map() };

  for (const colKey of colKeys) {
    const parts = decodeKey(colKey);
    if (parts.length === 0) continue;
    let node = root;
    for (const part of parts) {
      let child = node.children.get(part);
      if (!child) {
        child = { label: part, children: new Map() };
        node.children.set(part, child);
      }
      node = child;
    }
    node.colKey = colKey;
  }

  const trieToHeaders = (node: TrieNode, pathPrefix: string): ColumnDef[] => {
    const entries = Array.from(node.children.entries()).sort(([a], [b]) =>
      compareDimLabels(a, b)
    );
    return entries.map(([segment, child]) => {
      const path = pathPrefix ? `${pathPrefix}${KEY_SEP}${segment}` : segment;
      if (child.colKey !== undefined && child.children.size === 0) {
        // Leaf column path
        if (!multiValue) {
          const valueCfg = values[0];
          const field = findFieldHeader(catalog, valueCfg.accessor);
          return createLeafHeader({
            accessor: buildPivotAccessor(child.colKey, valueCfg.accessor),
            label: segment,
            field,
            alignRight: true,
          });
        }
        return {
          accessor: `__pivotGroup:${child.colKey}`,
          label: segment,
          width: 100,
          children: values.map((valueCfg) => {
            const field = findFieldHeader(catalog, valueCfg.accessor);
            return createLeafHeader({
              accessor: buildPivotAccessor(child.colKey!, valueCfg.accessor),
              label: valueCfg.label ?? field?.label ?? String(valueCfg.accessor),
              field,
              alignRight: true,
            });
          }),
        };
      }

      const nested = trieToHeaders(child, path);
      return {
        accessor: `__pivotGroup:${path}`,
        label: segment,
        width: 100,
        children: nested,
      };
    });
  };

  if (colKeys.length === 0 || (colKeys.length === 1 && colKeys[0] === "")) {
    // No column dimensions — one leaf per measure
    for (const valueCfg of values) {
      const field = findFieldHeader(catalog, valueCfg.accessor);
      roots.push(
        createLeafHeader({
          accessor: buildPivotAccessor("", valueCfg.accessor),
          label: valueCfg.label ?? field?.label ?? String(valueCfg.accessor),
          field,
          alignRight: true,
        })
      );
    }
  } else {
    roots.push(...trieToHeaders(root, ""));
  }

  if (showRowTotals) {
    if (!multiValue) {
      const valueCfg = values[0];
      const field = findFieldHeader(catalog, valueCfg.accessor);
      roots.push(
        createLeafHeader({
          accessor: buildPivotRowTotalAccessor(valueCfg.accessor),
          label: "Total",
          field,
          alignRight: true,
        })
      );
    } else {
      roots.push({
        accessor: `__pivotGroup:${TOTAL_COL_KEY}`,
        label: "Total",
        width: 100,
        children: values.map((valueCfg) => {
          const field = findFieldHeader(catalog, valueCfg.accessor);
          return createLeafHeader({
            accessor: buildPivotRowTotalAccessor(valueCfg.accessor),
            label: valueCfg.label ?? field?.label ?? String(valueCfg.accessor),
            field,
            alignRight: true,
          });
        }),
      });
    }
  }

  return roots;
};

const buildRowDimensionHeaders = (
  rowDims: Accessor[],
  catalog: Map<string, ColumnDef>,
  expandable: boolean
): ColumnDef[] => {
  return rowDims.map((accessor, index) => {
    const field = findFieldHeader(catalog, accessor);
    return {
      accessor,
      label: field?.label ?? String(accessor),
      width: field?.width ?? 140,
      type: field?.type ?? "string",
      align: field?.align ?? "left",
      pinned: "left" as const,
      sortable: field?.sortable ?? true,
      filterable: field?.filterable,
      expandable: expandable && index === 0 ? true : field?.expandable,
      valueFormatter: field?.valueFormatter,
      valueGetter: field?.valueGetter,
      minWidth: field?.minWidth,
      maxWidth: field?.maxWidth,
    };
  });
};

const collectValuesForPrefix = (
  buckets: Map<string, CellValue[]>,
  rowKeyPrefix: string,
  colKey: string,
  valueIndex: number,
  exactRowKey: boolean
): CellValue[] => {
  const suffix = `${KEY_SEP}${colKey}${KEY_SEP}${valueIndex}`;
  const out: CellValue[] = [];

  if (exactRowKey) {
    const exact = buckets.get(`${rowKeyPrefix}${suffix}`);
    if (exact) out.push(...exact);
    return out;
  }

  for (const [key, values] of buckets) {
    if (!key.endsWith(suffix)) continue;
    const rowPart = key.slice(0, key.length - suffix.length);
    if (
      rowKeyPrefix === "" ||
      rowPart === rowKeyPrefix ||
      rowPart.startsWith(rowKeyPrefix + KEY_SEP)
    ) {
      out.push(...values);
    }
  }
  return out;
};

const fillMeasureCells = ({
  row,
  buckets,
  rowKeyPrefix,
  colKeys,
  values,
  showRowTotals,
  exactRowKey,
}: {
  row: Row;
  buckets: Map<string, CellValue[]>;
  rowKeyPrefix: string;
  colKeys: string[];
  values: PivotValueConfig[];
  showRowTotals: boolean;
  exactRowKey: boolean;
}): void => {
  for (const colKey of colKeys) {
    values.forEach((valueCfg, valueIndex) => {
      const collected = collectValuesForPrefix(
        buckets,
        rowKeyPrefix,
        colKey,
        valueIndex,
        exactRowKey
      );
      const aggregated = aggregateValues(collected, valueCfg.aggregation);
      if (aggregated !== undefined) {
        row[buildPivotAccessor(colKey, valueCfg.accessor)] = aggregated;
      }
    });
  }

  if (showRowTotals) {
    values.forEach((valueCfg, valueIndex) => {
      const allForRow: CellValue[] = [];
      for (const colKey of colKeys) {
        allForRow.push(
          ...collectValuesForPrefix(buckets, rowKeyPrefix, colKey, valueIndex, exactRowKey)
        );
      }
      // When there are no column dims, totals use the empty col key bucket
      if (colKeys.length === 0) {
        allForRow.push(
          ...collectValuesForPrefix(buckets, rowKeyPrefix, "", valueIndex, exactRowKey)
        );
      }
      const aggregated = aggregateValues(allForRow, valueCfg.aggregation);
      if (aggregated !== undefined) {
        row[buildPivotRowTotalAccessor(valueCfg.accessor)] = aggregated;
      }
    });
  }
};

const buildRowTree = ({
  rowDims,
  prefixParts,
  distinctRowKeys,
  buckets,
  colKeys,
  values,
  showRowTotals,
}: {
  rowDims: Accessor[];
  prefixParts: DimValue[];
  distinctRowKeys: string[];
  buckets: Map<string, CellValue[]>;
  colKeys: string[];
  values: PivotValueConfig[];
  showRowTotals: boolean;
}): Row[] => {
  const depth = prefixParts.length;

  if (depth >= rowDims.length) {
    return [];
  }

  const prefixKey = encodeKey(prefixParts);
  const nextDimIndex = depth;
  const childPartsByLabel = new Map<string, DimValue>();

  for (const rowKey of distinctRowKeys) {
    const parts = decodeKey(rowKey);
    if (prefixKey !== "") {
      if (rowKey !== prefixKey && !rowKey.startsWith(prefixKey + KEY_SEP)) continue;
    }
    if (parts.length <= nextDimIndex) continue;
    const part = parts[nextDimIndex];
    childPartsByLabel.set(dimLabel(part), part);
  }

  const sortedLabels = Array.from(childPartsByLabel.keys()).sort(compareDimLabels);
  const isLeafLevel = depth === rowDims.length - 1;

  return sortedLabels.map((label) => {
    const part = childPartsByLabel.get(label)!;
    const nextPrefix = [...prefixParts, part];
    const nextPrefixKey = encodeKey(nextPrefix);
    const row: Row = {};

    rowDims.forEach((accessor, i) => {
      if (i <= depth) {
        row[accessor] = nextPrefix[i];
      }
    });

    if (isLeafLevel) {
      fillMeasureCells({
        row,
        buckets,
        rowKeyPrefix: nextPrefixKey,
        colKeys,
        values,
        showRowTotals,
        exactRowKey: true,
      });
      return row;
    }

    const children = buildRowTree({
      rowDims,
      prefixParts: nextPrefix,
      distinctRowKeys,
      buckets,
      colKeys,
      values,
      showRowTotals,
    });
    row[PIVOT_CHILDREN_KEY] = children;

    fillMeasureCells({
      row,
      buckets,
      rowKeyPrefix: nextPrefixKey,
      colKeys,
      values,
      showRowTotals,
      exactRowKey: false,
    });

    return row;
  });
};

/**
 * Pure transform: flat source rows + pivot config → pivoted rows and generated headers.
 */
export const pivotRows = ({ rows, pivot, fieldHeaders }: PivotRowsProps): PivotResult => {
  if (!pivot.values || pivot.values.length === 0) {
    throw new Error("pivot.values must contain at least one measure");
  }

  const rowDims = pivot.rows ?? [];
  const colDims = pivot.columns ?? [];
  const values = pivot.values;
  const showRowTotals = pivot.showRowTotals !== false;
  const showColumnTotals = pivot.showColumnTotals !== false;
  const showGrandTotal = pivot.showGrandTotal !== false;

  const catalog = new Map<string, ColumnDef>();
  for (const header of flattenAllHeaders(fieldHeaders)) {
    catalog.set(String(header.accessor), header);
  }

  const buckets = new Map<string, CellValue[]>();
  const rowKeySet = new Set<string>();
  const colKeySet = new Set<string>();

  for (const sourceRow of rows) {
    const rowParts = rowDims.map((accessor) => normalizeDimValue(getNestedValue(sourceRow, accessor)));
    const colParts = colDims.map((accessor) => normalizeDimValue(getNestedValue(sourceRow, accessor)));
    const rowKey = encodeKey(rowParts);
    const colKey = encodeKey(colParts);

    rowKeySet.add(rowKey);
    colKeySet.add(colKey);

    values.forEach((valueCfg, valueIndex) => {
      const raw = getNestedValue(sourceRow, valueCfg.accessor);
      if (raw === undefined || raw === null) return;
      const key = bucketKey(rowKey, colKey, valueIndex);
      let list = buckets.get(key);
      if (!list) {
        list = [];
        buckets.set(key, list);
      }
      list.push(raw);
    });
  }

  const distinctRowKeys = Array.from(rowKeySet).sort((a, b) => {
    const aParts = decodeKey(a);
    const bParts = decodeKey(b);
    const len = Math.max(aParts.length, bParts.length);
    for (let i = 0; i < len; i++) {
      const cmp = compareDimLabels(aParts[i] ?? "", bParts[i] ?? "");
      if (cmp !== 0) return cmp;
    }
    return 0;
  });

  const distinctColKeys = Array.from(colKeySet).sort((a, b) => {
    const aParts = decodeKey(a);
    const bParts = decodeKey(b);
    const len = Math.max(aParts.length, bParts.length);
    for (let i = 0; i < len; i++) {
      const cmp = compareDimLabels(aParts[i] ?? "", bParts[i] ?? "");
      if (cmp !== 0) return cmp;
    }
    return 0;
  });

  // Normalize: no column dims → single empty col key
  const colKeys = colDims.length === 0 ? [""] : distinctColKeys;

  // Row-total columns are only meaningful when there are column dimensions to sum across.
  const effectiveShowRowTotals = showRowTotals && colDims.length > 0;

  const columnHeaders = buildColumnHeaders({
    colKeys: colDims.length === 0 ? [] : distinctColKeys,
    values,
    catalog,
    showRowTotals: effectiveShowRowTotals,
  });

  const expandable = rowDims.length > 1;
  const rowHeaders = buildRowDimensionHeaders(rowDims, catalog, expandable);
  const headers: ColumnDef[] = [...rowHeaders, ...columnHeaders];

  let pivotedRows: Row[];

  if (rowDims.length === 0) {
    const row: Row = {};
    fillMeasureCells({
      row,
      buckets,
      rowKeyPrefix: "",
      colKeys,
      values,
      showRowTotals: effectiveShowRowTotals && showGrandTotal,
      exactRowKey: false,
    });
    pivotedRows = [row];
  } else {
    pivotedRows = buildRowTree({
      rowDims,
      prefixParts: [],
      distinctRowKeys,
      buckets,
      colKeys,
      values,
      showRowTotals: effectiveShowRowTotals,
    });
  }

  if (showColumnTotals && rowDims.length > 0) {
    const totalRow: Row = { [PIVOT_IS_TOTAL_KEY]: true };
    totalRow[rowDims[0]] = "Total";
    fillMeasureCells({
      row: totalRow,
      buckets,
      rowKeyPrefix: "",
      colKeys,
      values,
      showRowTotals: effectiveShowRowTotals && showGrandTotal,
      exactRowKey: false,
    });
    pivotedRows = [...pivotedRows, totalRow];
  }

  const rowGrouping: Accessor[] | undefined =
    rowDims.length > 1
      ? Array.from({ length: rowDims.length - 1 }, () => PIVOT_CHILDREN_KEY)
      : undefined;

  return { rows: pivotedRows, headers, rowGrouping };
};
