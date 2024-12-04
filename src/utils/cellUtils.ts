export const getCellId = ({
  accessor,
  rowIndex,
}: {
  accessor: string;
  rowIndex: number;
}) => {
  return `cell-${accessor}-${rowIndex}`;
};
