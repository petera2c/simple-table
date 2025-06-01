import Row from "./Row";

type TableRow = {
  row: Row;
  depth: number;
  groupingKey?: string;
  position: number;
  isLastGroupRow: boolean;
};

export default TableRow;
