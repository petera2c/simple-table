import Row from "./Row";
import type { RowData } from "./Row";

type RowSelectionChangeProps<TData extends RowData = Row> = {
  row: TData;
  isSelected: boolean;
  selectedRows: Set<string>;
};

export default RowSelectionChangeProps;
