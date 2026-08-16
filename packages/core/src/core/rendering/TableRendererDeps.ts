import ColumnDef, { Accessor } from "../../types/ColumnDef";
import type { PivotConfig } from "../../types/PivotTypes";
import { SimpleTableConfig } from "../../types/SimpleTableConfig";
import { CustomTheme } from "../../types/CustomTheme";
import { DimensionManager } from "../../managers/DimensionManager";
import type { SectionScrollController } from "../../managers/SectionScrollController";
import { SortManager } from "../../managers/SortManager";
import { FilterManager } from "../../managers/FilterManager";
import { SelectionManager } from "../../managers/SelectionManager";
import { RowSelectionManager } from "../../managers/RowSelectionManager";
import type { AnimationCoordinator } from "../../managers/AnimationCoordinator";
import type { AccordionAxis } from "../../utils/accordionAnimation";
import type { NestedTableFactory } from "../../utils/nestedGridRowRenderer";
import type { RenderContext } from "./RenderContext";

export interface TableRendererDeps {
  /** Accordion animation axis for the in-flight collapse/expand. See {@link RenderContext.accordionAxis}. */
  accordionAxis?: AccordionAxis;
  animationCoordinator?: AnimationCoordinator;
  /**
   * True when the table is using an external `scrollParent` (no `height`/`maxHeight`).
   * In this mode the main body container does not scroll — the parent does — so
   * the sticky-parents container reads its scrollTop from `stickyParentsScrollTop`
   * (sourced from the table's external-aware state) instead of `mainBodyRef.scrollTop`.
   */
  externalScrollActive?: boolean;
  /** Externally-tracked scrollTop (already translated into table coordinates). */
  stickyParentsScrollTop?: number;
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
  getCollapsedHeaders?: () => Set<Accessor>;
  getCollapsedRows: () => Map<string, number>;
  getExpandedRows: () => Map<string, number>;
  getHeaders: () => ColumnDef[];
  /** Last ingested column definitions — the reset target for the column editor's reset button. */
  getPristineDefaultHeaders: () => ColumnDef[];
  getPivot: () => PivotConfig | null;
  setPivot: (pivot: PivotConfig | null) => void;
  getRowStateMap: () => Map<string | number, any>;
  headerRegistry: Map<string, any>;
  headers: ColumnDef[];
  /** Unique id for this table instance — scopes row-hover cell tracking. */
  hoverScopeId: string;
  hoveredHeaderRef: { current: ColumnDef | null };
  internalIsLoading: boolean;
  isResizing: boolean;
  localRows: any[];
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
  positionOnlyBody?: boolean; /** When true, scroll path updates cell geometry only (no full content/selection refresh); row separators still sync. */
  resolvedIcons: any;
  rowSelectionManager: RowSelectionManager | null;
  rowStateMap: Map<string | number, any>;
  sectionScrollController: SectionScrollController | null;
  selectionManager: SelectionManager | null;
  setCollapsedHeaders: (headers: Set<Accessor>) => void;
  setCollapsedRows: (rows: Map<string, number>) => void;
  setExpandedRows: (rows: Map<string, number>) => void;
  setHeaders: (headers: ColumnDef[]) => void;
  setIsResizing: (value: boolean) => void;
  setRowStateMap: (map: Map<string | number, any>) => void;
  sortManager: SortManager | null;
  /** Injected factory for nested grid tables (breaks the SimpleTableVanilla import cycle). */
  createNestedTable?: NestedTableFactory;
}
