import HeaderObject, { Accessor } from "../../types/HeaderObject";
import { SimpleTableConfig } from "../../types/SimpleTableConfig";
import { CustomTheme } from "../../types/CustomTheme";
import { DimensionManager } from "../../managers/DimensionManager";
import type { SectionScrollController } from "../../managers/SectionScrollController";
import { SortManager } from "../../managers/SortManager";
import { FilterManager } from "../../managers/FilterManager";
import { SelectionManager } from "../../managers/SelectionManager";
import { RowSelectionManager } from "../../managers/RowSelectionManager";
import type { AnimationCoordinator, CellPosition } from "../../managers/AnimationCoordinator";
import type { AccordionAxis } from "../../utils/accordionAnimation";
import type { NestedTableFactory } from "../../utils/nestedGridRowRenderer";
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
    draggedHeaderRef: {
        current: HeaderObject | null;
    };
    effectiveHeaders: HeaderObject[];
    essentialAccessors: Set<string>;
    expandedDepths: Set<number>;
    expandedRows: Map<string, number>;
    filterManager: FilterManager | null;
    getCollapsedHeaders?: () => Set<Accessor>;
    getCollapsedRows: () => Map<string, number>;
    getExpandedRows: () => Map<string, number>;
    getHeaders: () => HeaderObject[];
    /** Pristine snapshot of the configured column definitions — the reset target for the column editor's reset button. */
    getPristineDefaultHeaders: () => HeaderObject[];
    getRowStateMap: () => Map<string | number, any>;
    headerRegistry: Map<string, any>;
    headers: HeaderObject[];
    /** Unique id for this table instance — scopes row-hover cell tracking. */
    hoverScopeId: string;
    hoveredHeaderRef: {
        current: HeaderObject | null;
    };
    internalIsLoading: boolean;
    isResizing: boolean;
    localRows: any[];
    mainBodyRef: {
        current: HTMLDivElement | null;
    };
    mainHeaderRef: {
        current: HTMLDivElement | null;
    };
    onRender: () => void;
    /** Natural-width shrink floors (accessor -> px) for auto-expand column resize. */
    getShrinkFloors?: () => Map<string, number>;
    /** Persist user-set widths (drag / double-click auto-fit) as natural widths. */
    onAutoExpandNaturalWidths?: (widths: Map<string, number>) => void;
    pinnedLeftHeaderRef: {
        current: HTMLDivElement | null;
    };
    pinnedLeftRef: {
        current: HTMLDivElement | null;
    };
    pinnedRightHeaderRef: {
        current: HTMLDivElement | null;
    };
    pinnedRightRef: {
        current: HTMLDivElement | null;
    };
    positionOnlyBody?: boolean; /** When true, scroll path updates cell geometry only (no full content/selection refresh); row separators still sync. */
    resolvedIcons: any;
    rowSelectionManager: RowSelectionManager | null;
    rowStateMap: Map<string | number, any>;
    sectionScrollController: SectionScrollController | null;
    selectionManager: SelectionManager | null;
    setCollapsedHeaders: (headers: Set<Accessor>) => void;
    setCollapsedRows: (rows: Map<string, number>) => void;
    setExpandedRows: (rows: Map<string, number>) => void;
    setHeaders: (headers: HeaderObject[]) => void;
    setIsResizing: (value: boolean) => void;
    setRowStateMap: (map: Map<string | number, any>) => void;
    sortManager: SortManager | null;
    /** Injected factory for nested grid tables (breaks the SimpleTableVanilla import cycle). */
    createNestedTable?: NestedTableFactory;
}
export declare class TableRenderer {
    private sectionRenderer;
    private footerInstance;
    private lastCustomFooterRenderer;
    private lastCustomFooterKey;
    private columnEditorInstance;
    private horizontalScrollbarRef;
    private scrollbarTimeoutId;
    private stickyParentsContainer;
    private sectionScrollController;
    private renderScheduled;
    private pendingRenderCallback;
    constructor();
    private scheduleRender;
    setOnRendererHostDiscard(cb: ((host: HTMLElement) => void) | undefined): void;
    invalidateCache(type?: "body" | "header" | "context" | "all"): void;
    /** See {@link SectionRenderer.getCurrentBodyLayouts}. */
    getCurrentBodyLayouts(): Map<HTMLElement, Map<string, CellPosition>>;
    renderHeader(container: HTMLElement, calculatedHeaderHeight: number, maxHeaderDepth: number, deps: TableRendererDeps): void;
    renderBody(container: HTMLElement, processedResult: any, deps: TableRendererDeps): void;
    renderFooter(container: HTMLElement, totalRows: number, currentPage: number, onPageChange: (page: number) => void, deps: TableRendererDeps): void;
    renderColumnEditor(contentWrapper: HTMLElement, columnEditorOpen: boolean, setColumnEditorOpen: (open: boolean) => void, mergedColumnEditorConfig: any, deps: TableRendererDeps): void;
    renderHorizontalScrollbar(wrapperContainer: HTMLElement, mainBodyWidth: number, pinnedLeftWidth: number, pinnedRightWidth: number, pinnedLeftContentWidth: number, pinnedRightContentWidth: number, tableBodyContainerRef: HTMLDivElement, deps: TableRendererDeps): void;
    cleanup(): void;
}
