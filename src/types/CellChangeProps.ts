import CellValue from "./CellValue";

type CellChangeProps = {
  colIndex: number;
  newValue: CellValue;
  row: any;
  rowIndex: number;
};

export default CellChangeProps;
