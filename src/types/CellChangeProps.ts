import CellValue from "./CellValue";

type CellChangeProps = {
  accessor: any;
  newRowIndex: number;
  newValue: CellValue;
  originalRowIndex: number;
  row: { [key: string]: CellValue };
};

export default CellChangeProps;
