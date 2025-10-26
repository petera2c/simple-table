import Row from "./Row";

type TableRow = {
  depth: number;
  displayPosition: number;
  groupingKey?: string;
  isLastGroupRow: boolean;
  position: number;
  row: Row;
};

export default TableRow;
