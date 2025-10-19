import UpdateDataProps from "./UpdateCellProps";
import { Accessor } from "./HeaderObject";
import TableRow from "./TableRow";

interface SetHeaderRenameProps {
  accessor: Accessor;
}

type TableRefType = {
  updateData: (props: UpdateDataProps) => void;
  setHeaderRename: (props: SetHeaderRenameProps) => void;
  getVisibleRows: () => TableRow[];
};

export default TableRefType;
export type { SetHeaderRenameProps };
