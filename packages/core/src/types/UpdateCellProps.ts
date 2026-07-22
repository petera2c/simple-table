import { CellValue } from "..";
import { Accessor } from "./ColumnDef";

type UpdateDataProps = {
  accessor: Accessor;
  rowIndex: number;
  newValue: CellValue;
};

export default UpdateDataProps;
