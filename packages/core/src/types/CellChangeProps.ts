import CellValue from "./CellValue";
import { Accessor } from "./ColumnDef";
import Row from "./Row";
import type { RowData } from "./Row";

type CellChangeProps<TData extends RowData = Row, TValue = CellValue> = {
  accessor: Accessor<TData>;
  newValue: TValue;
  row: TData;
};

export default CellChangeProps;
