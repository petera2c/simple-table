import UpdateDataProps from "./UpdateCellProps";
import { Accessor } from "./HeaderObject";
import TableRow from "./TableRow";
import Row from "./Row";

interface SetHeaderRenameProps {
  accessor: Accessor;
}

interface ExportToCSVProps {
  filename?: string;
}

interface AddRowProps {
  row: Row;
  index?: number; // If not provided, add to the end
  path?: (number | string)[]; // Path to nested children array (for adding to a specific group)
}

interface UpdateRowProps {
  rowId: string | number;
  updates: Partial<Row>;
  path?: (number | string)[]; // Path to the row in nested structure
}

interface DeleteRowProps {
  rowId: string | number;
  path?: (number | string)[]; // Path to the row in nested structure
}

type TableRefType = {
  updateData: (props: UpdateDataProps) => void;
  setHeaderRename: (props: SetHeaderRenameProps) => void;
  getVisibleRows: () => TableRow[];
  exportToCSV: (props?: ExportToCSVProps) => void;
  addRow: (props: AddRowProps) => void;
  updateRow: (props: UpdateRowProps) => void;
  deleteRow: (props: DeleteRowProps) => void;
};

export default TableRefType;
export type { SetHeaderRenameProps, ExportToCSVProps, AddRowProps, UpdateRowProps, DeleteRowProps };
