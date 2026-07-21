import HeaderObject, { Accessor } from "./HeaderObject";
import Row from "./Row";
import { EmptyStateRenderer, ErrorStateRenderer, LoadingStateRenderer } from "./RowStateRendererProps";
import FooterRendererProps from "./FooterRendererProps";
import { HeaderDropdown } from "./HeaderDropdownProps";
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
import { IconsConfig } from "./IconsConfig";
import { QuickFilterConfig } from "./QuickFilterTypes";
import { AnimationsConfig } from "./AnimationsConfig";
import type { FooterPosition } from "./FooterPosition";
import type { PivotConfig } from "./PivotTypes";
export interface SimpleTableProps {
    animations?: AnimationsConfig;
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
    emptyStateRenderer?: EmptyStateRenderer;
    enableHeaderEditing?: boolean;
    enableRowSelection?: boolean;
    /**
     * Row selection mode when `enableRowSelection` is true.
     * - `"multiple"` (default): select any number of rows
     * - `"single"`: selecting a row replaces the previous selection
     */
    rowSelectionMode?: RowSelectionMode;
    /**
     * When true, clicking a data cell selects the row (toggles in multiple mode,
     * replaces selection in single mode). Default false.
     */
    selectRowOnClick?: boolean;
    /**
     * When false, the checkbox selection column is not shown; selection still works
     * via click, keyboard, or TableAPI. Default true. The column is still shown when
     * `rowButtons` is set (buttons need a home).
     */
    showRowSelectionColumn?: boolean;
    enableStickyParents?: boolean;
    /**
     * When false, disables both row and column virtualization so every row and
     * column is rendered in the DOM. Useful for print, a11y tooling, or small
     * datasets that still need a fixed `height` / `maxHeight` for layout.
     * Default true.
     */
    enableVirtualization?: boolean;
    errorStateRenderer?: ErrorStateRenderer;
    expandAll?: boolean;
    externalFilterHandling?: boolean;
    externalSortHandling?: boolean;
    footerRenderer?: (props: FooterRendererProps) => HTMLElement | string | null;
    footerPosition?: FooterPosition;
    headerDropdown?: HeaderDropdown;
    height?: string | number;
    hideFooter?: boolean;
    hideHeader?: boolean;
    icons?: IconsConfig;
    includeHeadersInCSVExport?: boolean;
    initialSortColumn?: string;
    initialSortDirection?: SortDirection;
    isLoading?: boolean;
    loadingStateRenderer?: LoadingStateRenderer;
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
    onSortChange?: (sort: SortColumn | null) => void;
    /**
     * Declarative matrix pivot. When set, flat `rows` are reshaped into a
     * pivoted grid with dynamic columns. Ignores consumer `rowGrouping` while active.
     */
    pivot?: PivotConfig | null;
    /** Fired when pivot config changes via TableAPI.setPivot. */
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
