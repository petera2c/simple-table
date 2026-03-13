import HeaderObject, { Accessor } from "../../types/HeaderObject";
import SortColumn from "../../types/SortColumn";
import { TableFilterState, FilterCondition } from "../../types/FilterTypes";
import { IconsConfig } from "../../types/IconsConfig";
import Row from "../../types/Row";

type SetStateAction<T> = T | ((prevState: T) => T);
type Dispatch<A> = (value: A) => void;
type MutableRefObject<T> = { current: T };
type RefObject<T> = { readonly current: T | null };

export interface AbsoluteCell {
  header: HeaderObject;
  left: number;
  top: number;
  width: number;
  height: number;
  colIndex: number;
  parentHeader?: HeaderObject;
}

export interface HeaderRenderContext {
  collapsedHeaders: Set<Accessor>;
  columnBorders: boolean;
  columnReordering: boolean;
  columnResizing: boolean;
  containerWidth: number;
  /** Main section viewport width (avoids clientWidth read when set); use for getVisibleCells when !pinned */
  mainSectionContainerWidth?: number;
  enableHeaderEditing?: boolean;
  enableRowSelection?: boolean;
  /** Used for context cache invalidation when row selection changes */
  selectedRowCount?: number;
  filters: TableFilterState;
  icons: IconsConfig;
  selectedColumns: Set<number>;
  columnsWithSelectedCells: Set<number>;
  sort: SortColumn | null;
  autoExpandColumns?: boolean;
  selectableColumns?: boolean;
  headers: HeaderObject[];
  rows: Row[];
  headerHeight: number;
  lastHeaderIndex: number;
  onSort: (accessor: Accessor) => void;
  handleApplyFilter: (filter: FilterCondition) => void;
  handleClearFilter: (accessor: Accessor) => void;
  handleSelectAll?: (checked: boolean) => void;
  setCollapsedHeaders: Dispatch<SetStateAction<Set<Accessor>>>;
  setHeaders: Dispatch<SetStateAction<HeaderObject[]>>;
  setIsResizing: Dispatch<SetStateAction<boolean>>;
  onColumnWidthChange?: (headers: HeaderObject[]) => void;
  onColumnOrderChange?: (headers: HeaderObject[]) => void;
  onTableHeaderDragEnd: (headers: HeaderObject[]) => void;
  onHeaderEdit?: (header: HeaderObject, newLabel: string) => void;
  onColumnSelect?: (header: HeaderObject) => void;
  selectColumns?: (columnIndices: number[]) => void;
  setSelectedColumns: Dispatch<SetStateAction<Set<number>>>;
  setSelectedCells: Dispatch<SetStateAction<Set<string>>>;
  setInitialFocusedCell: (cell: any) => void;
  areAllRowsSelected?: () => boolean;
  draggedHeaderRef: MutableRefObject<HeaderObject | null>;
  hoveredHeaderRef: MutableRefObject<HeaderObject | null>;
  headerRegistry?: Map<string, { setEditing: (editing: boolean) => void }>;
  reverse?: boolean;
  pinned?: "left" | "right";
  forceUpdate: () => void;
  mainBodyRef: RefObject<HTMLDivElement>;
  pinnedLeftRef: RefObject<HTMLDivElement>;
  pinnedRightRef: RefObject<HTMLDivElement>;
}
