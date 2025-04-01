import CellValue from "./CellValue";
import { RowId } from "./RowId";

type Row = {
  // Row metadata
  rowMeta: {
    children?: Row[];
    isExpanded?: boolean;
    rowId: RowId;
  };

  // Actual cell values
  rowData: { [key: string]: CellValue };
};

export default Row;
