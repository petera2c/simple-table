import UpdateCellProps from "./UpdateCellProps";

type TableRefType<T> = {
  updateData: (props: UpdateCellProps<T>) => void;
};

export default TableRefType;
