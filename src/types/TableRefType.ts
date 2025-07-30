import UpdateDataProps from "./UpdateCellProps";
import { Accessor } from "./HeaderObject";

interface SetHeaderRenameProps {
  accessor: Accessor;
}

type TableRefType = {
  updateData: (props: UpdateDataProps) => void;
  setHeaderRename: (props: SetHeaderRenameProps) => void;
};

export default TableRefType;
export type { SetHeaderRenameProps };
