import {
  forwardRef,
  LegacyRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import EditableCell from "./EditableCell/EditableCell";
import HeaderObject from "../../types/HeaderObject";
import CellChangeProps from "../../types/CellChangeProps";
import CellValue from "../../types/CellValue";
import TableContext from "../../context/TableContext";
import { useThrottle } from "../../utils/performanceUtils";
import useTableHeaderCell from "../../hooks/useTableHeaderCell";

interface TableCellProps {
  borderClass: string;
  colIndex: number;
  content: CellValue;
  draggedHeaderRef: React.MutableRefObject<HeaderObject | null>;
  header: HeaderObject;
  headersRef: React.RefObject<HeaderObject[]>;
  hoveredHeaderRef: React.MutableRefObject<HeaderObject | null>;
  isSelected: boolean;
  isTopLeftCell: boolean;
  onCellChange?: (props: CellChangeProps) => void;
  onMouseDown: (rowIndex: number, colIndex: number) => void;
  onMouseOver: (rowIndex: number, colIndex: number) => void;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  row: { [key: string]: CellValue };
  rowIndex: number;
}

const TableCell = forwardRef(
  (
    {
      borderClass,
      colIndex,
      content,
      draggedHeaderRef,
      header,
      headersRef,
      hoveredHeaderRef,
      isSelected,
      isTopLeftCell,
      onCellChange,
      onMouseDown,
      onMouseOver,
      onTableHeaderDragEnd,
      row,
      rowIndex,
    }: TableCellProps,
    ref: LegacyRef<HTMLTableCellElement>
  ) => {
    // Context
    const { rows, tableRows } = useContext(TableContext);

    // Local state
    const [localContent, setLocalContent] = useState(content);
    const [isEditing, setIsEditing] = useState(false);

    // Hooks
    const { handleDragOver } = useTableHeaderCell({
      draggedHeaderRef,
      headersRef,
      hoveredHeaderRef,
      onTableHeaderDragEnd,
    });
    const throttledHandleDragOver = useThrottle({
      callback: handleDragOver,
      limit: 10,
    });

    // Derived state
    const clickable = Boolean(header?.isEditable);
    const isOddRow = rowIndex % 2 === 0;
    const cellClassName = `st-cell ${
      isSelected
        ? isTopLeftCell
          ? `st-cell-selected-first-cell ${borderClass}`
          : `st-cell-selected ${borderClass}`
        : ""
    } ${isOddRow ? "st-cell-odd-row" : "st-cell-even-row"} ${
      clickable ? "clickable" : ""
    }`;

    // Update local content when the content changes
    useEffect(() => {
      setLocalContent(content);
    }, [content]);

    // Update local content when the table rows change
    useEffect(() => {
      if (
        row.originalRowIndex === undefined ||
        typeof row.originalRowIndex !== "number"
      )
        return;

      const tableRowContent = rows[row.originalRowIndex];

      if (tableRowContent[header.accessor] !== localContent) {
        setLocalContent(tableRowContent[header.accessor]);
      } else {
        tableRows[row.originalRowIndex][header.accessor] = localContent;
      }
    }, [header.accessor, localContent, rows, row.originalRowIndex, tableRows]);

    const updateLocalContent = (newValue: CellValue) => {
      setLocalContent(newValue);
      onCellChange?.({
        accessor: header.accessor,
        newValue,
        newRowIndex: rowIndex,
        originalRowIndex: row.originalRowIndex as number,
        row,
      });
    };

    if (isEditing) {
      return (
        <div
          className={`st-cell-editing ${
            isOddRow ? "st-cell-odd-row" : "st-cell-even-row"
          }`}
        >
          <EditableCell
            onChange={updateLocalContent}
            setIsEditing={setIsEditing}
            value={localContent}
          />
        </div>
      );
    }

    return (
      <div
        className={cellClassName}
        onDoubleClick={() => header.isEditable && setIsEditing(true)}
        onMouseDown={() => onMouseDown(rowIndex, colIndex)}
        onMouseOver={() => onMouseOver(rowIndex, colIndex)}
        onDragOver={(event) =>
          throttledHandleDragOver({ event, hoveredHeader: header })
        }
        ref={ref}
      >
        {localContent}
      </div>
    );
  }
);

export default TableCell;
