import UpdateDataProps from "./UpdateCellProps";
import { Accessor } from "./HeaderObject";
import TableRow from "./TableRow";

interface SetHeaderRenameProps {
  accessor: Accessor;
}

interface ExportToCSVProps {
  filename?: string;
}

type TableRefType = {
  updateData: (props: UpdateDataProps) => void;
  setHeaderRename: (props: SetHeaderRenameProps) => void;
  getVisibleRows: () => TableRow[];
  exportToCSV: (props?: ExportToCSVProps) => void;
};

export default TableRefType;
export type { SetHeaderRenameProps, ExportToCSVProps };
