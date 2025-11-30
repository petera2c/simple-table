import Row from "./Row";
import { Accessor } from "./HeaderObject";

type TableRow = {
  depth: number;
  displayPosition: number;
  groupingKey?: string;
  isLastGroupRow: boolean;
  position: number;
  row: Row;
  // Path to reach this row in the nested structure (e.g., [0, 'teams', 2] means rows[0].teams[2])
  rowPath?: (string | number)[];
};

export default TableRow;
