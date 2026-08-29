import type ColumnDef from "../../types/ColumnDef";
import type { Accessor } from "../../types/ColumnDef";
import type { SimpleTableConfig } from "../../types/SimpleTableConfig";
import type { CustomTheme } from "../../types/CustomTheme";
import type Row from "../../types/Row";
import type RowState from "../../types/RowState";
import type { PivotConfig } from "../../types/PivotTypes";
import type { AnimationCoordinator } from "../../managers/AnimationCoordinator";
import type { DimensionManager } from "../../managers/DimensionManager";
import type { ScrollManager } from "../../managers/ScrollManager";
import type { HorizontalScrollEngine } from "../../managers/horizontalScroll";
import type { SortManager } from "../../managers/SortManager";
import type { FilterManager } from "../../managers/FilterManager";
import type { SelectionManager } from "../../managers/SelectionManager";
import type { RowSelectionManager } from "../../managers/RowSelectionManager";
import type { AccordionAxis } from "../../utils/accordionAnimation";
import type { NestedTableFactory } from "../../utils/nestedGridRowRenderer";
import type { ResolvedIcons } from "../initialization/TableInitializer";
import type { RenderContext } from "./RenderContext";

export interface RenderContextSource {
  accordionAxis: AccordionAxis;
  animationCoordinator: AnimationCoordinator;
  cellRegistry: Map<string, any>;
  collapsedHeaders: Set<Accessor>;
  collapsedRows: Map<string, number>;
  config: SimpleTableConfig;
  customTheme: CustomTheme;
  dimensionManager: DimensionManager | null;
  draggedHeaderRef: { current: ColumnDef | null };
  essentialAccessors: Set<string>;
  expandedDepths: Set<number>;
  expandedRows: Map<string, number>;
  filterManager: FilterManager | null;
  headerRegistry: Map<string, any>;
  headers: ColumnDef[];
  hoverScopeId: string;
  hoveredHeaderRef: { current: ColumnDef | null };
  internalIsLoading: boolean;
  isResizing: boolean;
  localRows: Row[];
  createNestedTable: NestedTableFactory;
  mainBodyRef: { current: HTMLDivElement | null };
  mainHeaderRef: { current: HTMLDivElement | null };
  pinnedLeftHeaderRef: { current: HTMLDivElement | null };
  pinnedLeftRef: { current: HTMLDivElement | null };
  pinnedRightHeaderRef: { current: HTMLDivElement | null };
  pinnedRightRef: { current: HTMLDivElement | null };
  positionOnlyBody?: boolean;
  columnDragging?: boolean;
  externalViewportHeight?: number;
  resolvedIcons: ResolvedIcons;
  rowSelectionManager: RowSelectionManager | null;
  rowStateMap: Map<string | number, RowState>;
  scrollManager: ScrollManager | null;
  horizontalScroll: HorizontalScrollEngine | null;
  selectionManager: SelectionManager | null;
  sortManager: SortManager | null;
  onRender: () => void;
  getShrinkFloors: () => Map<string, number>;
  onAutoExpandNaturalWidths: (widths: Map<string, number>) => void;
  setIsResizing: (value: boolean) => void;
  setHeaders: (headers: ColumnDef[]) => void;
  setCollapsedHeaders: (headers: Set<Accessor>) => void;
  setCollapsedRows: (
    rowsOrUpdater: Map<string, number> | ((prev: Map<string, number>) => Map<string, number>),
  ) => void;
  setExpandedRows: (
    rowsOrUpdater: Map<string, number> | ((prev: Map<string, number>) => Map<string, number>),
  ) => void;
  setRowStateMap: (
    mapOrUpdater:
      | Map<string | number, any>
      | ((prev: Map<string | number, any>) => Map<string | number, any>),
  ) => void;
  getCollapsedRows: () => Map<string, number>;
  getCollapsedHeaders: () => Set<Accessor>;
  getExpandedRows: () => Map<string, number>;
  getHeaders: () => ColumnDef[];
  getPristineDefaultHeaders: () => ColumnDef[];
  getPivot: () => PivotConfig | null;
  setPivot: (pivot: PivotConfig | null) => void;
  getRowStateMap: () => Map<string | number, RowState>;
  setColumnEditorOpen: (open: boolean) => void;
  setCurrentPage: (page: number) => void;
}

export const buildRenderContext = (source: RenderContextSource): RenderContext => ({
  accordionAxis: source.accordionAxis,
  animationCoordinator: source.animationCoordinator,
  cellRegistry: source.cellRegistry,
  collapsedHeaders: source.collapsedHeaders,
  collapsedRows: source.collapsedRows,
  config: source.config,
  customTheme: source.customTheme,
  dimensionManager: source.dimensionManager,
  draggedHeaderRef: source.draggedHeaderRef,
  effectiveHeaders: [],
  essentialAccessors: source.essentialAccessors,
  expandedDepths: source.expandedDepths,
  expandedRows: source.expandedRows,
  filterManager: source.filterManager,
  headerRegistry: source.headerRegistry,
  headers: source.headers,
  hoverScopeId: source.hoverScopeId,
  hoveredHeaderRef: source.hoveredHeaderRef,
  internalIsLoading: source.internalIsLoading,
  isResizing: source.isResizing,
  localRows: source.localRows,
  createNestedTable: source.createNestedTable,
  mainBodyRef: source.mainBodyRef,
  mainHeaderRef: source.mainHeaderRef,
  pinnedLeftHeaderRef: source.pinnedLeftHeaderRef,
  pinnedLeftRef: source.pinnedLeftRef,
  pinnedRightHeaderRef: source.pinnedRightHeaderRef,
  pinnedRightRef: source.pinnedRightRef,
  positionOnlyBody: source.positionOnlyBody,
  columnDragging: source.columnDragging,
  externalViewportHeight: source.externalViewportHeight,
  resolvedIcons: source.resolvedIcons,
  rowSelectionManager: source.rowSelectionManager,
  rowStateMap: source.rowStateMap,
  scrollManager: source.scrollManager,
  horizontalScroll: source.horizontalScroll,
  selectionManager: source.selectionManager,
  sortManager: source.sortManager,
  onRender: source.onRender,
  getShrinkFloors: source.getShrinkFloors,
  onAutoExpandNaturalWidths: source.onAutoExpandNaturalWidths,
  setIsResizing: source.setIsResizing,
  setHeaders: source.setHeaders,
  setCollapsedHeaders: source.setCollapsedHeaders,
  setCollapsedRows: source.setCollapsedRows,
  setExpandedRows: source.setExpandedRows,
  setRowStateMap: source.setRowStateMap,
  getCollapsedRows: source.getCollapsedRows,
  getCollapsedHeaders: source.getCollapsedHeaders,
  getExpandedRows: source.getExpandedRows,
  getHeaders: source.getHeaders,
  getPristineDefaultHeaders: source.getPristineDefaultHeaders,
  getPivot: source.getPivot,
  setPivot: source.setPivot,
  getRowStateMap: source.getRowStateMap,
  setColumnEditorOpen: source.setColumnEditorOpen,
  setCurrentPage: source.setCurrentPage,
});
