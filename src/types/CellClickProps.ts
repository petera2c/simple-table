import { Accessor } from "./HeaderObject";
import { RowId } from "./RowId";

type CellClickProps<T> = {
  accessor: Accessor<T>;
  colIndex: number;
  row: T;
  rowId: RowId;
  rowIndex: number;
  value: any;
};

export default CellClickProps;
