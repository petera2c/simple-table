import CellValue from "./CellValue";
import { Accessor } from "./HeaderObject";
import Row from "./Row";

type CellChangeProps = {
  accessor: Accessor;
  newValue: CellValue;
  row: Row;
};

export default CellChangeProps;
