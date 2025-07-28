import { Accessor } from "./HeaderObject";

type CellChangeProps<T> = {
  accessor: Accessor<T>;
  newValue: any;
  row: T;
};

export default CellChangeProps;
