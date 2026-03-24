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
  areAllRowsSelected?: () => boolean;
  autoExpandColumns: boolean;
  collapsedHeaders: Set<Accessor>;
  essentialAccessors?: ReadonlySet<string>;
  columnBorders: boolean;
  columnReordering: boolean;
  columnResizing: boolean;
  columnsWithSelectedCells: Set<number>;
  containerWidth: number;
  draggedHeaderRef: MutableRefObject<HeaderObject | null>;
  enableHeaderEditing?: boolean;
  enableRowSelection?: boolean;
  filters: TableFilterState;
  forceUpdate: () => void;
  getCollapsedHeaders?: () => Set<Accessor>; /** Get current collapsed headers (avoids stale closure in toggle handler). */
  handleApplyFilter: (filter: FilterCondition) => void;
  handleClearFilter: (accessor: Accessor) => void;
  handleSelectAll?: (checked: boolean) => void;
  headerHeight: number;
  headerRegistry?: Map<string, { setEditing: (editing: boolean) => void }>;
  headers: HeaderObject[];
  hoveredHeaderRef: MutableRefObject<HeaderObject | null>;
  icons: IconsConfig;
  lastHeaderIndex: number;
  mainBodyRef: RefObject<HTMLDivElement>;
  mainSectionContainerWidth?: number; /** Main section viewport width (avoids clientWidth read when set); use for getVisibleCells when !pinned */
  onColumnOrderChange?: (headers: HeaderObject[]) => void;
  onColumnSelect?: (header: HeaderObject) => void;
  onColumnWidthChange?: (headers: HeaderObject[]) => void;
  onHeaderEdit?: (header: HeaderObject, newLabel: string) => void;
  onSort: (accessor: Accessor) => void;
  onTableHeaderDragEnd: (headers: HeaderObject[]) => void;
  pinned?: "left" | "right";
  pinnedLeftRef: RefObject<HTMLDivElement>;
  pinnedRightRef: RefObject<HTMLDivElement>;
  reverse: boolean;
  rows: Row[];
  selectColumns?: (columnIndices: number[]) => void;
  selectableColumns?: boolean;
  selectedColumns: Set<number>;
  selectedRowCount?: number; /** Used for context cache invalidation when row selection changes */
  setCollapsedHeaders: Dispatch<SetStateAction<Set<Accessor>>>;
  setHeaders: Dispatch<SetStateAction<HeaderObject[]>>;
  setInitialFocusedCell: (cell: any) => void;
  setIsResizing: Dispatch<SetStateAction<boolean>>;
  setSelectedCells: Dispatch<SetStateAction<Set<string>>>;
  setSelectedColumns: Dispatch<SetStateAction<Set<number>>>;
  sort: SortColumn | null;
}
