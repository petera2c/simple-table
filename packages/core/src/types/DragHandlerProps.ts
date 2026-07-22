import ColumnDef, { Accessor } from "./ColumnDef";

type useDragHandlerProps = {
  draggedHeaderRef: { current: ColumnDef | null };
  essentialAccessors?: ReadonlySet<Accessor | string>;
  headers: ColumnDef[];
  hoveredHeaderRef: { current: ColumnDef | null };
  onColumnOrderChange?: (newHeaders: ColumnDef[]) => void;
  onTableHeaderDragEnd: (newHeaders: ColumnDef[]) => void;
};

export default useDragHandlerProps;
