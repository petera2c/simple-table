import CellValue from "./CellValue";
import { Accessor } from "./HeaderObject";
import Row from "./Row";

type CellClickProps = {
  accessor: Accessor;
  colIndex: number;
  row: Row;
  rowIndex: number;
  value: CellValue;
};

export default CellClickProps;
