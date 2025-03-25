import CellValue from "./CellValue";

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
