import Row from "./Row";

type RowSelectionChangeProps = {
  row: Row;
  isSelected: boolean;
  selectedRows: Set<string>;
};

export default RowSelectionChangeProps;
