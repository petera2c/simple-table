import HeaderObject, { Accessor } from "./HeaderObject";
import Row from "./Row";
import {
  VanillaEmptyStateRenderer,
  VanillaErrorStateRenderer,
  VanillaLoadingStateRenderer,
} from "./RowStateRendererProps";
import FooterRendererProps from "./FooterRendererProps";
import { VanillaHeaderDropdown } from "./HeaderDropdownProps";
import SortColumn, { SortDirection } from "./SortColumn";
import CellClickProps from "./CellClickProps";
import CellChangeProps from "./CellChangeProps";
import { ColumnVisibilityState } from "./ColumnVisibilityTypes";
import { TableFilterState } from "./FilterTypes";
import OnNextPage from "./OnNextPage";
import OnRowGroupExpandProps from "./OnRowGroupExpandProps";
import RowSelectionChangeProps from "./RowSelectionChangeProps";
import type { RowSelectionMode } from "./RowSelectionMode";
import { RowButton } from "./RowButton";
import Theme from "./Theme";
import { CustomThemeProps } from "./CustomTheme";
import { GetRowId } from "./GetRowId";
import { ColumnEditorConfig } from "./ColumnEditorConfig";
import { VanillaIconsConfig } from "./IconsConfig";
import { QuickFilterConfig } from "./QuickFilterTypes";
import { AnimationsConfig } from "./AnimationsConfig";
import type { FooterPosition } from "./FooterPosition";
import type { PivotConfig } from "./PivotTypes";

/**
 * Canonical runtime config after {@link normalizeConfig}. Consumer-facing
 * aliases (`columns`, `enableColumnEditor`, …) are accepted on
 * {@link SimpleTableConfigInput} / {@link SimpleTableProps} and collapsed here.
 */
export interface SimpleTableConfig {
  animations?: AnimationsConfig;
  /**
   * Expand-only fill: when the columns' natural widths (declared px, or
   * content-measured for `width: "auto"`) leave surplus container space,
   * columns stretch proportionally to fill it (respecting `maxWidth`).
   * Columns are never squeezed below their natural width — when they don't
   * fit, the table scrolls horizontally instead.
   */
  autoExpandColumns?: boolean;
  canExpandRowGroup?: (row: Row) => boolean;
  cellUpdateFlash?: boolean;
  className?: string;
  columnBorders?: boolean;
  columnEditorConfig?: ColumnEditorConfig;
  columnReordering?: boolean;
  columnResizing?: boolean;
  copyHeadersToClipboard?: boolean;
  customTheme?: CustomThemeProps;
  defaultHeaders: HeaderObject[];
  editColumns?: boolean;
  editColumnsInitOpen?: boolean;
  emptyStateRenderer?: VanillaEmptyStateRenderer;
  enableHeaderEditing?: boolean;
  enableRowSelection?: boolean;
  /** @see SimpleTableProps.rowSelectionMode */
  rowSelectionMode?: RowSelectionMode;
  /** @see SimpleTableProps.selectRowOnClick */
  selectRowOnClick?: boolean;
  /** @see SimpleTableProps.showRowSelectionColumn */
  showRowSelectionColumn?: boolean;
  enableStickyParents?: boolean;
  /** @see SimpleTableProps.enableVirtualization */
  enableVirtualization?: boolean;
  errorStateRenderer?: VanillaErrorStateRenderer;
  expandAll?: boolean;
  externalFilterHandling?: boolean;
  externalSortHandling?: boolean;
  footerRenderer?: (props: FooterRendererProps) => HTMLElement | string | null;
  /** Placement of the pagination footer. Default `"bottom"`. */
  footerPosition?: FooterPosition;
  headerDropdown?: VanillaHeaderDropdown;
  height?: string | number;
  hideFooter?: boolean;
  hideHeader?: boolean;
  icons?: VanillaIconsConfig;
  includeHeadersInCSVExport?: boolean;
  initialSortColumn?: string;
  initialSortDirection?: SortDirection;
  isLoading?: boolean;
  loadingStateRenderer?: VanillaLoadingStateRenderer;
  maxHeight?: string | number;
  onCellClick?: (props: CellClickProps) => void;
  onCellEdit?: (props: CellChangeProps) => void;
  onColumnOrderChange?: (newHeaders: HeaderObject[]) => void;
  onColumnSelect?: (header: HeaderObject) => void;
  onColumnVisibilityChange?: (visibilityState: ColumnVisibilityState) => void;
  onColumnWidthChange?: (headers: HeaderObject[]) => void;
  onFilterChange?: (filters: TableFilterState) => void;
  onGridReady?: () => void;
  onHeaderEdit?: (header: HeaderObject, newLabel: string) => void;
  infiniteScrollThreshold?: number;
  onLoadMore?: () => void;
  onNextPage?: OnNextPage;
  onPageChange?: (page: number) => void | Promise<void>;
  onRowGroupExpand?: (props: OnRowGroupExpandProps) => void | Promise<void>;
  onRowSelectionChange?: (props: RowSelectionChangeProps) => void;
  /**
   * Called by the renderer immediately BEFORE it permanently discards a host
   * element that may contain async-framework renderer output (e.g. React
   * portals): innerHTML clears on cell rebuild/edit, plain cell removal, and
   * the animation coordinator's ghost/FLIP/shrink teardown paths. Framework
   * adapters use this to tear down the renderer subtree mounted into `host`
   * (or any descendant) so it isn't orphaned. Reuse/reparent paths never fire
   * it, so a reused node keeps its renderer content.
   */
  onRendererHostDiscard?: (host: HTMLElement) => void;
  onSortChange?: (sort: SortColumn | null) => void;
  /** @see SimpleTableProps.pivot */
  pivot?: PivotConfig | null;
  /** @see SimpleTableProps.onPivotChange */
  onPivotChange?: (pivot: PivotConfig | null) => void;
  quickFilter?: QuickFilterConfig;
  rowButtons?: RowButton[];
  rowGrouping?: Accessor[];
  getRowId?: GetRowId;
  rows: Row[];
  rowsPerPage?: number;
  scrollParent?: HTMLElement | "window" | (() => HTMLElement | null);
  selectableCells?: boolean;
  selectableColumns?: boolean;
  serverSidePagination?: boolean;
  shouldPaginate?: boolean;
  tableEmptyStateRenderer?: HTMLElement | string | null;
  theme?: Theme;
  totalRowCount?: number;
  useHoverRowBackground?: boolean;
  useOddColumnBackground?: boolean;
  useOddEvenRowBackground?: boolean;
}
