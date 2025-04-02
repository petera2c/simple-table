import HeaderObject from "../../types/HeaderObject";
import { displayCell, getCellId } from "../../utils/cellUtils";
import TableCell from "./TableCell";
import TableBodyProps from "../../types/TableBodyProps";
import TableRowSeparator from "./TableRowSeparator";
import Animate from "../Animate";
import { RowId } from "../../types/RowId";
import VisibleRow from "../../types/VisibleRow";

const RenderCells = ({
  getBorderClass,
  handleMouseDown,
  handleMouseOver,
  headers,
  hiddenColumns,
  isSelected,
  isTopLeftCell,
  onExpandRowClick,
  pinned,
  rowIndex,
  visibleRow,
  ...props
}: {
  headers: HeaderObject[];
  hiddenColumns: Record<string, boolean>;
  onExpandRowClick: (rowId: RowId) => void;
  pinned?: "left" | "right";
  rowIndex: number;
  visibleRow: VisibleRow;
} & Omit<TableBodyProps, "currentRows" | "headerContainerRef">) => {
  return (
    <Animate
      allowAnimations={props.allowAnimations}
      allowHorizontalAnimate={props.shouldPaginate}
      draggedHeaderRef={props.draggedHeaderRef}
      headersRef={props.headersRef}
      isBody
      mainBodyRef={props.mainBodyRef}
      pauseAnimation={props.isWidthDragging}
      rowIndex={rowIndex + 1}
    >
      {headers.map((header, colIndex) => {
        if (!displayCell({ hiddenColumns, header, pinned })) return null;

        return (
          <TableCell
            {...props}
            borderClass={getBorderClass(rowIndex, colIndex)}
            colIndex={colIndex}
            header={header}
            isSelected={isSelected(rowIndex, colIndex)}
            isTopLeftCell={isTopLeftCell(rowIndex, colIndex)}
            key={getCellId({ accessor: header.accessor, rowIndex: rowIndex + 1 })}
            onExpandRowClick={onExpandRowClick}
            onMouseDown={() => handleMouseDown({ rowIndex: rowIndex, colIndex })}
            onMouseOver={() => handleMouseOver(rowIndex, colIndex)}
            rowIndex={rowIndex}
            visibleRow={visibleRow}
          />
        );
      })}
    </Animate>
  );
};

export default RenderCells;
