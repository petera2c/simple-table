import CellValue from "./CellValue";
import { Accessor } from "./HeaderObject";
import Row from "./Row";
import { RowId } from "./RowId";

type CellClickProps = {
  accessor: Accessor;
  colIndex: number;
  row: Row;
  rowId: RowId;
  rowIndex: number;
  value: CellValue;
};

export default CellClickProps;
