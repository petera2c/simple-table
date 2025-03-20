import CellValue from "./CellValue";
import GroupedRow from "./GroupedRow";

type Row = {
  // Row metadata
  rowMeta: {
    children?: Row[];
    isExpanded?: boolean;
    rowId: number;
  };

  // Actual cell values
  rowData: { [key: string]: CellValue };
};

export default Row;
