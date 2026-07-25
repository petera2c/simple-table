import { CellValue } from "..";
import { Accessor } from "./ColumnDef";
import type { RowId } from "./RowId";

type UpdateDataBase = {
  accessor: Accessor;
  newValue: CellValue;
};

/**
 * Update a cell by stable `rowId` (from `getRowId`) and/or source `rowIndex`.
 * When both are provided, `rowId` wins. `rowIndex` is the index into the
 * unsorted source `rows` array — not the sorted/visible position.
 */
type UpdateDataProps = UpdateDataBase &
  (
    | { rowId: RowId; rowIndex?: number }
    | { rowIndex: number; rowId?: undefined }
  );

export default UpdateDataProps;
