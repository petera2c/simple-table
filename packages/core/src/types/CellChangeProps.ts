import CellValue from "./CellValue";
import { Accessor } from "./ColumnDef";
import Row from "./Row";

type CellChangeProps = {
  accessor: Accessor;
  newValue: CellValue;
  row: Row;
};

export default CellChangeProps;
