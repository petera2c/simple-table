import CellValue from "./CellValue";

type CellChangeProps = {
  accessor: any;
  newRowIndex: number;
  newValue: CellValue;
  originalRowIndex: number;
  row: any;
};

export default CellChangeProps;
