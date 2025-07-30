import { MutableRefObject, useEffect } from "react";
import { Row, TableRefType, UpdateDataProps } from "..";
import { getRowId } from "../utils/rowUtils";
import { getCellKey } from "../utils/cellUtils";
import { CellRegistryEntry, HeaderRegistryEntry } from "../context/TableContext";
import { Accessor } from "../types/HeaderObject";
import { SetHeaderRenameProps } from "../types/TableRefType";

const useTableAPI = ({
  tableRef,
  rows,
  rowIdAccessor,
  cellRegistryRef,
  headerRegistryRef,
}: {
  tableRef?: MutableRefObject<TableRefType | null>;
  rows: Row[];
  rowIdAccessor: Accessor;
  cellRegistryRef: MutableRefObject<Map<string, CellRegistryEntry>>;
  headerRegistryRef: MutableRefObject<Map<string, HeaderRegistryEntry>>;
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
            if (row[accessor] !== undefined) {
              row[accessor] = newValue;
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
      };
    }
  }, [cellRegistryRef, headerRegistryRef, rows, rowIdAccessor, tableRef]);
};

export default useTableAPI;
