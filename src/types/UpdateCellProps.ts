import { CellValue } from "..";
import { Accessor } from "./HeaderObject";

type UpdateDataProps = {
  accessor: Accessor;
  rowIndex: number;
  newValue: CellValue;
};

export default UpdateDataProps;
