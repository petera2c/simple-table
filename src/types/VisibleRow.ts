import Row from "./Row";

type VisibleRow = {
  depth: number;
  isLastGroupRow: boolean;
  position: number;
  row: Row;
};

export default VisibleRow;
