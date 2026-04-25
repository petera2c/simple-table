import HeaderObject, { Accessor } from "../../types/HeaderObject";
import CellValue from "../../types/CellValue";
import { IconsConfig } from "../../types/IconsConfig";
import OnRowGroupExpandProps from "../../types/OnRowGroupExpandProps";
import type Row from "../../types/Row";
import type TableRow from "../../types/TableRow";
import type RowState from "../../types/RowState";
import type { RowButton } from "../../types/RowButton";
import type { CustomTheme } from "../../types/CustomTheme";
import type { HeightOffsets } from "../infiniteScrollUtils";
import type {
  VanillaEmptyStateRenderer,
  VanillaErrorStateRenderer,
  VanillaLoadingStateRenderer,
} from "../../types/RowStateRendererProps";

type SetStateAction<T> = T | ((prevState: T) => T);
type Dispatch<A> = (value: A) => void;

// Types for cell data
export interface AbsoluteBodyCell {
  header: HeaderObject;
  row: Row;
  rowIndex: number;
  colIndex: number;
  rowId: string;
  /**
   * Position-independent stable key (mirror of `tableRow.stableRowKey`),
   * used to compute the cell DOM `id` and the animation snapshot key when
   * `getRowId` is provided. Falls back to `rowId` (positional) when absent.
   */
  stableRowKey?: string;
  displayRowNumber: number;
  depth: number;
  isOdd: boolean;
  tableRow: TableRow;
  left: number; // Horizontal position
  top: number; // Vertical position
  width: number; // Cell width
  height: number; // Cell height
}

// Cell selection/interaction data
export interface CellData {
  rowIndex: number;
  colIndex: number;
  rowId: string;
}

// Cell edit params
export interface CellEditParams {
  accessor: Accessor;
  newValue: CellValue;
  row: Row;
  rowIndex: number;
}

// Cell click params
export interface CellClickParams {
  accessor: Accessor;
  colIndex: number;
  row: Row;
  rowIndex: number;
  value: CellValue;
}

// Cell registry entry
export interface CellRegistryEntry {
  updateContent: (newValue: CellValue) => void;
}

// Main render context
export interface CellRenderContext {
  // State management
  collapsedHeaders: Set<Accessor>;
  collapsedRows: Map<string, number>;
  expandedRows: Map<string, number>;
  expandedDepths: number[];
  selectedColumns: Set<number>;
  rowsWithSelectedCells: Set<string>;

  // Configuration
  columnBorders: boolean;
  enableRowSelection?: boolean;
  /** Used for context cache invalidation when row selection changes */
  selectedRowCount?: number;
  cellUpdateFlash?: boolean;
  useOddColumnBackground?: boolean;
  useHoverRowBackground?: boolean;
  useOddEvenRowBackground?: boolean;
  rowGrouping?: string[];
  headers: HeaderObject[];
  rowHeight: number;
  /** Number of header rows (for aria-rowindex: position + maxHeaderDepth + 1) */
  maxHeaderDepth?: number;
  heightOffsets?: HeightOffsets;
  customTheme?: CustomTheme;
  containerWidth?: number;
  /** Main section viewport width (avoids clientWidth read when set); use for getVisibleBodyCells when !pinned */
  mainSectionContainerWidth?: number;

  // Callbacks
  onCellEdit?: (params: CellEditParams) => void;
  onCellClick?: (params: CellClickParams) => void;
  onRowGroupExpand?: (props: OnRowGroupExpandProps) => void | Promise<void>;
  handleRowSelect?: (rowId: string, checked: boolean) => void;
  handleMouseDown: (cell: CellData) => void;
  handleMouseOver: (cell: CellData, clientX: number, clientY: number) => void;

  // Refs and state setters
  cellRegistry?: Map<string, CellRegistryEntry>;
  setCollapsedRows: Dispatch<SetStateAction<Map<string, number>>>;
  setExpandedRows: Dispatch<SetStateAction<Map<string, number>>>;
  setRowStateMap: Dispatch<SetStateAction<Map<string | number, RowState>>>;
  getCollapsedRows?: () => Map<string, number>;
  getExpandedRows?: () => Map<string, number>;

  // UI state
  icons: IconsConfig;
  theme: string;
  rowButtons?: RowButton[];

  // Inherited by nested tables (state row renderers)
  loadingStateRenderer?: VanillaLoadingStateRenderer;
  errorStateRenderer?: VanillaErrorStateRenderer;
  emptyStateRenderer?: VanillaEmptyStateRenderer;

  // Helper functions from context
  getBorderClass: (cell: CellData) => string;
  isSelected: (cell: CellData) => boolean;
  isInitialFocusedCell: (cell: CellData) => boolean;
  isCopyFlashing: (cell: CellData) => boolean;
  isWarningFlashing: (cell: CellData) => boolean;
  isRowSelected?: (rowId: string) => boolean;
  canExpandRowGroup?: (row: Row) => boolean;
  isLoading?: boolean;

  // Pinned section
  pinned?: "left" | "right";
}
