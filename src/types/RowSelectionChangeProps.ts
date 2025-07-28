type RowSelectionChangeProps<T> = {
  row: T;
  isSelected: boolean;
  selectedRows: Set<string>;
};

export default RowSelectionChangeProps;
