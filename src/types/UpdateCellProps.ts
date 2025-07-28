import { Accessor } from "./HeaderObject";

type UpdateCellProps<T> = {
  accessor: Accessor<T>;
  rowIndex: number;
  newValue: any;
};

export default UpdateCellProps;
