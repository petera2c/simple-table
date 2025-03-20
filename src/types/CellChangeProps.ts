import CellValue from "./CellValue";
import Row from "./Row";

type CellChangeProps = {
  accessor: any;
  newRowIndex: number;
  newValue: CellValue;
  originalRowIndex: number;
  row: Row;
};

export default CellChangeProps;
