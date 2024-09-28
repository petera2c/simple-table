interface TableCellProps {
  rowIndex: number;
  colIndex: number;
  content: any;
  isSelected: boolean;
  isTopLeftCell: boolean;
  borderClass: string;
  onMouseDown: (rowIndex: number, colIndex: number) => void;
  onMouseOver: (rowIndex: number, colIndex: number) => void;
}

const TableCell = ({
  rowIndex,
  colIndex,
  content,
  isSelected,
  isTopLeftCell,
  borderClass,
  onMouseDown,
  onMouseOver,
}: TableCellProps) => {
  return (
    <td
      onMouseDown={() => onMouseDown(rowIndex, colIndex)}
      onMouseOver={() => onMouseOver(rowIndex, colIndex)}
    >
      <div
        className={`table-cell ${
          isSelected
            ? isTopLeftCell
              ? `selected-first-cell ${borderClass}`
              : `selected ${borderClass}`
            : ""
        }`}
      >
        {content}
      </div>
    </td>
  );
};

export default TableCell;
