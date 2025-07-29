type TableRow<T> = {
  depth: number;
  groupingKey?: keyof T;
  isLastGroupRow: boolean;
  position: number;
  row: T;
};

export default TableRow;
