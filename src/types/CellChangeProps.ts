import CellValue from "./CellValue";
import Row from "./Row";

type CellChangeProps = {
  accessor: string;
  newValue: CellValue;
  row: Row;
};

export default CellChangeProps;
