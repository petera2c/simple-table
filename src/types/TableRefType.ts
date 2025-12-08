import UpdateDataProps from "./UpdateCellProps";
import HeaderObject, { Accessor } from "./HeaderObject";
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
  /** Returns the currently visible rows (e.g., current page when paginated) */
  getVisibleRows: () => TableRow[];
  /** Returns all rows (flattened, including nested/grouped rows) */
  getAllRows: () => TableRow[];
  /** Returns the table's header/column definitions */
  getHeaders: () => HeaderObject[];
  exportToCSV: (props?: ExportToCSVProps) => void;
};

export default TableRefType;
export type { SetHeaderRenameProps, ExportToCSVProps };
