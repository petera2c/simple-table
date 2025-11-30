import { MutableRefObject, useEffect } from "react";
import { Row, TableRefType, UpdateDataProps } from "..";
import { getRowId, getNestedValue, setNestedValue } from "../utils/rowUtils";
import { getCellKey } from "../utils/cellUtils";
import { CellRegistryEntry, HeaderRegistryEntry } from "../context/TableContext";
import { Accessor } from "../types/HeaderObject";
import {
  SetHeaderRenameProps,
  ExportToCSVProps,
  AddRowProps,
  UpdateRowProps,
  DeleteRowProps,
} from "../types/TableRefType";
import TableRow from "../types/TableRow";
import { exportTableToCSV } from "../utils/csvExportUtils";
import HeaderObject from "../types/HeaderObject";
import CellValue from "../types/CellValue";

// Helper to navigate nested structure using a path
const navigatePath = (root: any, path: (string | number)[]): any => {
  return path.reduce((acc, key) => acc?.[key], root);
};

const useTableAPI = ({
  cellRegistryRef,
  currentTableRows,
  headerRegistryRef,
  headers,
  rowIdAccessor,
  rows,
  rowsRef,
  tableRef,
  visibleRows,
}: {
  cellRegistryRef: MutableRefObject<Map<string, CellRegistryEntry>>;
  currentTableRows: TableRow[];
  headerRegistryRef: MutableRefObject<Map<string, HeaderRegistryEntry>>;
  headers: HeaderObject[];
  rowIdAccessor: Accessor;
  rows: Row[];
  rowsRef: MutableRefObject<Row[]>;
  tableRef?: MutableRefObject<TableRefType | null>;
  visibleRows: TableRow[];
}) => {
  // Set up API methods on the ref if provided
  useEffect(() => {
    if (tableRef) {
      tableRef.current = {
        updateData: ({ accessor, rowIndex, newValue }: UpdateDataProps) => {
          // Get the row ID using the new utility
          const row = rows?.[rowIndex];
          if (row) {
            const rowId = getRowId({ row, rowIdAccessor });
            const key = getCellKey({ rowId, accessor });
            const cell = cellRegistryRef.current.get(key);

            if (cell) {
              // If the cell is registered (visible), update it directly
              cell.updateContent(newValue);
            }

            // Always update the data source - now directly on the row
            // Support nested accessors by using getNestedValue to check existence
            if (getNestedValue(row, accessor) !== undefined) {
              setNestedValue(row, accessor, newValue);
            }
          }
        },
        setHeaderRename: ({ accessor }: SetHeaderRenameProps) => {
          // Find the header cell in the registry and set it to editing mode
          const headerCell = headerRegistryRef.current.get(String(accessor));
          if (headerCell) {
            headerCell.setEditing(true);
          }
        },
        getVisibleRows: () => {
          return visibleRows;
        },
        exportToCSV: ({ filename }: ExportToCSVProps = {}) => {
          exportTableToCSV(currentTableRows, headers, filename);
        },
        addRow: ({ row, index, path }: AddRowProps) => {
          const target = path?.length ? navigatePath(rowsRef.current, path) : rowsRef.current;

          if (Array.isArray(target)) {
            index !== undefined ? target.splice(index, 0, row) : target.push(row);
          }
        },
        updateRow: ({ rowId, updates, path }: UpdateRowProps) => {
          const target = path?.length
            ? navigatePath(rowsRef.current, path)
            : rowsRef.current.find((r) => getRowId({ row: r, rowIdAccessor }) === rowId);

          if (target) {
            Object.assign(target, updates);

            // Update any visible cells that are affected
            Object.keys(updates).forEach((accessor) => {
              const key = getCellKey({ rowId, accessor });
              const cell = cellRegistryRef.current.get(key);
              if (cell) {
                cell.updateContent(updates[accessor] as CellValue);
              }
            });
          }
        },
        deleteRow: ({ rowId, path }: DeleteRowProps) => {
          if (path?.length) {
            const parent = navigatePath(rowsRef.current, path.slice(0, -1));
            const lastKey = path[path.length - 1];

            if (Array.isArray(parent) && typeof lastKey === "number") {
              parent.splice(lastKey, 1);
            }
          } else {
            const index = rowsRef.current.findIndex(
              (r) => getRowId({ row: r, rowIdAccessor }) === rowId
            );
            if (index !== -1) {
              rowsRef.current.splice(index, 1);
            }
          }
        },
      };
    }
  }, [
    cellRegistryRef,
    currentTableRows,
    headerRegistryRef,
    headers,
    rowIdAccessor,
    rows,
    rowsRef,
    tableRef,
    visibleRows,
  ]);
};

export default useTableAPI;
