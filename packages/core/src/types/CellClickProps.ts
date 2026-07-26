import CellValue from "./CellValue";
import { Accessor } from "./ColumnDef";
import Row from "./Row";
import type { RowData } from "./Row";

type CellClickProps<TData extends RowData = Row, TValue = CellValue> = {
  accessor: Accessor<TData>;
  colIndex: number;
  row: TData;
  rowIndex: number;
  value: TValue;
};

export default CellClickProps;
