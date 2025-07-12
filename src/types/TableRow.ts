import Row from "./Row";

type TableRow = {
  depth: number;
  groupingKey?: string;
  isLastGroupRow: boolean;
  position: number;
  previousPosition: number;
  row: Row;
};

export default TableRow;
