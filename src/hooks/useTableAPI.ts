import { MutableRefObject, useEffect } from "react";
import { Row, TableRefType, UpdateDataProps } from "..";
import { getRowId, getNestedValue, setNestedValue } from "../utils/rowUtils";
import { getCellKey } from "../utils/cellUtils";
import { CellRegistryEntry, HeaderRegistryEntry } from "../context/TableContext";
import { Accessor } from "../types/HeaderObject";
import { SetHeaderRenameProps, ExportToCSVProps } from "../types/TableRefType";
import TableRow from "../types/TableRow";
import { exportTableToCSV } from "../utils/csvExportUtils";
import HeaderObject from "../types/HeaderObject";

const useTableAPI = ({
  cellRegistryRef,
  currentTableRows,
  headerRegistryRef,
  headers,
  rowIdAccessor,
  rowIndexMap,
  rows,
  setRows,
  tableRef,
  visibleRows,
}: {
  cellRegistryRef: MutableRefObject<Map<string, CellRegistryEntry>>;
  currentTableRows: TableRow[];
  headerRegistryRef: MutableRefObject<Map<string, HeaderRegistryEntry>>;
  headers: HeaderObject[];
  rowIdAccessor: Accessor;
  rowIndexMap: MutableRefObject<Map<string | number, number>>;
  rows: Row[];
  setRows: (rows: Row[]) => void;
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
      };
    }
  }, [
    cellRegistryRef,
    currentTableRows,
    headerRegistryRef,
    headers,
    rowIdAccessor,
    rowIndexMap,
    rows,
    setRows,
    tableRef,
    visibleRows,
  ]);
};

export default useTableAPI;
