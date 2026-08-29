import { SimpleTableConfig } from "../../types/SimpleTableConfig";
import { CustomTheme } from "../../types/CustomTheme";
import ColumnDef, { Accessor } from "../../types/ColumnDef";
import type { PivotConfig } from "../../types/PivotTypes";
import Row from "../../types/Row";
import RowState from "../../types/RowState";
import { DimensionManager } from "../../managers/DimensionManager";
import { ScrollManager } from "../../managers/ScrollManager";
import type { HorizontalScrollEngine } from "../../managers/horizontalScroll";
import { SortManager } from "../../managers/SortManager";
import { FilterManager } from "../../managers/FilterManager";
import { SelectionManager } from "../../managers/SelectionManager";
import { RowSelectionManager } from "../../managers/RowSelectionManager";
import type { AnimationCoordinator } from "../../managers/AnimationCoordinator";
import type { AccordionAxis } from "../../utils/accordionAnimation";
import type { NestedTableFactory } from "../../utils/nestedGridRowRenderer";
import { ResolvedIcons } from "../initialization/TableInitializer";

export interface RenderContext {
  /**
   * Active accordion animation axis for this render. Set on row-grouping or
   * nested-column collapse/expand toggles. Cell renderers use it to initialize
   * incoming cells at zero size in the named axis so the CSS size transition
   * can grow them while sibling cells FLIP into place.
   */
  accordionAxis?: AccordionAxis;
  animationCoordinator?: AnimationCoordinator;
  cellRegistry: Map<string, any>;
  collapsedHeaders: Set<Accessor>;
  collapsedRows: Map<string, number>;
  config: SimpleTableConfig;
  customTheme: CustomTheme;
  dimensionManager: DimensionManager | null;
  draggedHeaderRef: { current: ColumnDef | null };
  effectiveHeaders: ColumnDef[];
  essentialAccessors: Set<string>;
  expandedDepths: Set<number>;
  expandedRows: Map<string, number>;
  filterManager: FilterManager | null;
  getCollapsedRows: () => Map<string, number>;
  getCollapsedHeaders?: () => Set<Accessor>;
  getExpandedRows: () => Map<string, number>;
  getHeaders: () => ColumnDef[];
  /** Last ingested column definitions — the reset target for the column editor's reset button. */
  getPristineDefaultHeaders: () => ColumnDef[];
  getPivot: () => PivotConfig | null;
  setPivot: (pivot: PivotConfig | null) => void;
  getRowStateMap: () => Map<string | number, RowState>;
  headerRegistry: Map<string, any>;
  headers: ColumnDef[];
  /**
   * Unique id for this table instance. Scopes row-hover cell tracking so
   * multiple tables on one page with overlapping rowIds don't cross-hover.
   */
  hoverScopeId: string;
  hoveredHeaderRef: { current: ColumnDef | null };
  internalIsLoading: boolean;
  isResizing: boolean;
  localRows: Row[];
  /** Injected factory for nested grid tables (breaks the SimpleTableVanilla import cycle). */
  createNestedTable?: NestedTableFactory;
  mainBodyRef: { current: HTMLDivElement | null };
  mainHeaderRef: { current: HTMLDivElement | null };
  onRender: () => void;
  /** Natural-width shrink floors (accessor -> px) for auto-expand column resize. */
  getShrinkFloors?: () => Map<string, number>;
  /** Persist user-set widths (drag / double-click auto-fit) as natural widths. */
  onAutoExpandNaturalWidths?: (widths: Map<string, number>) => void;
  pinnedLeftHeaderRef: { current: HTMLDivElement | null };
  pinnedLeftRef: { current: HTMLDivElement | null };
  pinnedRightHeaderRef: { current: HTMLDivElement | null };
  pinnedRightRef: { current: HTMLDivElement | null };
  resolvedIcons: ResolvedIcons;
  rowSelectionManager: RowSelectionManager | null;
  rowStateMap: Map<string | number, RowState>;
  scrollManager: ScrollManager | null;
  horizontalScroll: HorizontalScrollEngine | null;
  selectionManager: SelectionManager | null;
  setCollapsedHeaders: (headers: Set<Accessor>) => void;
  setCollapsedRows: (rows: Map<string, number>) => void;
  setColumnEditorOpen: (open: boolean) => void;
  setCurrentPage: (page: number) => void;
  setExpandedRows: (rows: Map<string, number>) => void;
  setHeaders: (headers: ColumnDef[]) => void;
  setIsResizing: (value: boolean) => void;
  setRowStateMap: (map: Map<string | number, any>) => void;
  sortManager: SortManager | null;
  /** When true, body cells that stay visible get only position updates (no content/selection recalc). Used during vertical scroll for performance. */
  positionOnlyBody?: boolean;
  /**
   * Mid column-header drag. Row model is unchanged — reuse last flatten/process
   * results and only repaint header/body lefts.
   */
  columnDragging?: boolean;
  /**
   * Visible portion of the table inside an external scroll parent (in pixels).
   * Set per render when `config.scrollParent` is active and no explicit
   * `height`/`maxHeight` is set. Drives virtualization the same way an
   * explicit `height` does, but the scroll source is external.
   */
  externalViewportHeight?: number;
}

export interface RenderState {
  currentPage: number;
  scrollTop: number;
  scrollDirection: "up" | "down" | "none";
  scrollbarWidth: number;
  isMainSectionScrollable: boolean;
  columnEditorOpen: boolean;
}
