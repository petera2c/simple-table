import type { SimpleTableConfig } from "../../types/SimpleTableConfig";
import type ColumnDef from "../../types/ColumnDef";
import type { Accessor } from "../../types/ColumnDef";
import type Row from "../../types/Row";
import type { CustomTheme } from "../../types/CustomTheme";
import type RowState from "../../types/RowState";
import type { PivotConfig } from "../../types/PivotTypes";
import type { AnimationCoordinator } from "../../managers/AnimationCoordinator";
import type { AccordionController } from "../../managers/AccordionController";
import type { AutoSizeManager } from "../../managers/AutoSizeManager";
import type { AutoScaleManager } from "../../managers/AutoScaleManager";
import type { DimensionManager } from "../../managers/DimensionManager";
import type { ExternalScrollController } from "../../managers/ExternalScrollController";
import type { FilterManager } from "../../managers/FilterManager";
import type { SortManager } from "../../managers/SortManager";
import type { PivotManager } from "../../managers/PivotManager";
import type { SelectionManager } from "../../managers/SelectionManager";
import type { RowSelectionManager } from "../../managers/RowSelectionManager";
import type { ScrollManager } from "../../managers/ScrollManager";
import type { SectionScrollController } from "../../managers/SectionScrollController";
import type { DOMManager } from "../dom/DOMManager";
import type { RenderOrchestrator } from "../rendering/RenderOrchestrator";
import type { ResolvedIcons } from "../initialization/TableInitializer";
import type ExpandedDepthsManager from "../../hooks/expandedDepths";
import type { AccordionAxis } from "../../utils/accordionAnimation";

/**
 * Live accessors for the table facade. Used by config updates, render-context
 * assembly, and TableAPI — getters always read current instance state.
 */
export interface VanillaLiveHost {
  getConfig(): SimpleTableConfig;
  setConfig(config: SimpleTableConfig): void;
  applyAnimationsConfig(animations: SimpleTableConfig["animations"]): void;
  getCustomTheme(): CustomTheme;
  setCustomTheme(theme: CustomTheme): void;
  getInternalIsLoading(): boolean;
  setInternalIsLoading(value: boolean): void;
  getCurrentPage(): number;
  setCurrentPage(page: number): void;
  getFirstRenderDone(): boolean;
  getIsResizing(): boolean;
  setIsResizing(value: boolean): void;

  getLocalRows(): Row[];
  setLocalRows(rows: Row[]): void;
  rebuildRowIndexMap(): void;
  getHeaders(): ColumnDef[];
  setHeaders(headers: ColumnDef[]): void;
  getPristineDefaultHeaders(): ColumnDef[];
  getEssentialAccessors(): Set<string>;
  setEssentialAccessors(accessors: Set<string>): void;
  ingestColumnSnapshot(columns: ColumnDef[]): void;
  applyHeaders(headers: ColumnDef[]): void;
  getCollapsedHeaders(): Set<Accessor>;
  setCollapsedHeaders(headers: Set<Accessor>): void;
  getCollapsedRows(): Map<string, number>;
  setCollapsedRows(rows: Map<string, number>): void;
  getExpandedRows(): Map<string, number>;
  setExpandedRows(rows: Map<string, number>): void;
  getExpandedDepths(): Set<number>;
  clearExpandedRows(): void;
  clearCollapsedRows(): void;
  getRowStateMap(): Map<string | number, RowState>;
  setRowStateMap(map: Map<string | number, RowState>): void;
  getColumnEditorOpen(): boolean;
  setColumnEditorOpen(open: boolean): void;

  getCellRegistry(): Map<string, any>;
  getHeaderRegistry(): Map<string, any>;
  getHoverScopeId(): string;
  getDraggedHeaderRef(): { current: ColumnDef | null };
  getHoveredHeaderRef(): { current: ColumnDef | null };
  getResolvedIcons(): ResolvedIcons;
  getPositionOnlyBody(): boolean;

  getAnimationCoordinator(): AnimationCoordinator;
  getAccordionController(): AccordionController;
  getAutoSizeManager(): AutoSizeManager;
  getAutoScaleManager(): AutoScaleManager | null;
  getDomManager(): DOMManager;
  getRenderOrchestrator(): RenderOrchestrator;
  getDimensionManager(): DimensionManager | null;
  getFilterManager(): FilterManager | null;
  getSortManager(): SortManager | null;
  getPivotManager(): PivotManager | null;
  getSelectionManager(): SelectionManager | null;
  getRowSelectionManager(): RowSelectionManager | null;
  getScrollManager(): ScrollManager | null;
  getSectionScrollController(): SectionScrollController | null;
  getExternalScrollController(): ExternalScrollController;
  getExpandedDepthsManager(): ExpandedDepthsManager | null;

  syncPivotPipeline(filteredSourceRows?: Row[]): void;
  syncRowSelectionManager(): void;
  captureSnapshot(): void;
  beginAccordion(axis: Exclude<AccordionAxis, null>): void;
  getEffectiveRowGrouping(): Accessor[] | undefined;
  applyPivot(pivot: PivotConfig | null): void;
  onRender(source: string): void;
  isCellAnimating(cellId: string): boolean;
  hasAnimatingCells(): boolean;
  runWithoutAnimationSnapshot(fn: () => void): void;
}
