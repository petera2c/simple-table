import { SimpleTableConfig } from "../../types/SimpleTableConfig";
import { CustomTheme } from "../../types/CustomTheme";
import HeaderObject, { Accessor } from "../../types/HeaderObject";
import Row from "../../types/Row";
import RowState from "../../types/RowState";
import { DimensionManager } from "../../managers/DimensionManager";
import { ScrollManager } from "../../managers/ScrollManager";
import type { SectionScrollController } from "../../managers/SectionScrollController";
import { SortManager } from "../../managers/SortManager";
import { FilterManager } from "../../managers/FilterManager";
import { SelectionManager } from "../../managers/SelectionManager";
import { RowSelectionManager } from "../../managers/RowSelectionManager";
import type { AnimationCoordinator, CellPosition } from "../../managers/AnimationCoordinator";
import type { AccordionAxis } from "../../utils/accordionAnimation";
import type { NestedTableFactory } from "../../utils/nestedGridRowRenderer";
import { FlattenRowsResult } from "../../utils/rowFlattening";
import { ProcessRowsResult } from "../../utils/rowProcessing";
import { MergedColumnEditorConfig, ResolvedIcons } from "../initialization/TableInitializer";
export interface RenderContext {
    /**
     * Active accordion animation axis for this render. Set on row-grouping or
     * nested-column collapse/expand toggles (see
     * {@link SimpleTableVanilla.beginAccordionAnimation}). Cell renderers use it
     * to initialize incoming cells at zero size in the named axis so the CSS
     * size transition can grow them while sibling cells FLIP into place.
     */
    accordionAxis?: AccordionAxis;
    animationCoordinator?: AnimationCoordinator;
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
    getCollapsedRows: () => Map<string, number>;
    getCollapsedHeaders?: () => Set<Accessor>;
    getExpandedRows: () => Map<string, number>;
    getHeaders: () => HeaderObject[];
    /** Pristine snapshot of the configured column definitions — the reset target for the column editor's reset button. */
    getPristineDefaultHeaders: () => HeaderObject[];
    getRowStateMap: () => Map<string | number, RowState>;
    headerRegistry: Map<string, any>;
    headers: HeaderObject[];
    /**
     * Unique id for this table instance. Scopes row-hover cell tracking so
     * multiple tables on one page with overlapping rowIds don't cross-hover.
     */
    hoverScopeId: string;
    hoveredHeaderRef: {
        current: HeaderObject | null;
    };
    internalIsLoading: boolean;
    isResizing: boolean;
    localRows: Row[];
    /** Injected factory for nested grid tables (breaks the SimpleTableVanilla import cycle). */
    createNestedTable?: NestedTableFactory;
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
    resolvedIcons: ResolvedIcons;
    rowSelectionManager: RowSelectionManager | null;
    rowStateMap: Map<string | number, RowState>;
    scrollManager: ScrollManager | null;
    sectionScrollController: SectionScrollController | null;
    selectionManager: SelectionManager | null;
    setCollapsedHeaders: (headers: Set<Accessor>) => void;
    setCollapsedRows: (rows: Map<string, number>) => void;
    setColumnEditorOpen: (open: boolean) => void;
    setCurrentPage: (page: number) => void;
    setExpandedRows: (rows: Map<string, number>) => void;
    setHeaders: (headers: HeaderObject[]) => void;
    setIsResizing: (value: boolean) => void;
    setRowStateMap: (map: Map<string | number, any>) => void;
    sortManager: SortManager | null;
    /** When true, body cells that stay visible get only position updates (no content/selection recalc). Used during vertical scroll for performance. */
    positionOnlyBody?: boolean;
    /**
     * Visible portion of the table inside an external scroll parent (in pixels).
     * Set by {@link SimpleTableVanilla} per render when `config.scrollParent` is
     * active and no explicit `height`/`maxHeight` is set. Drives virtualization
     * the same way an explicit `height` does, but the scroll source is external.
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
export declare class RenderOrchestrator {
    private tableRenderer;
    private lastHeadersRef;
    private lastRowsRef;
    private flattenedRowsCache;
    private lastProcessedResult;
    /** Fingerprint for skipping pagination + height-map work on vertical scroll frames. */
    private processRowsScrollReuseKey;
    private processRowsScrollReuseBase;
    /** Last painted virtual row range on scroll-raf; when unchanged, DOM work is redundant (native scroll moves content). */
    private lastScrollRafPaintedRange;
    /** Reuse normalized headers across scroll frames when layout inputs are unchanged. */
    private scrollRafHeadersMemo;
    constructor();
    getCachedFlattenResult(): FlattenRowsResult | null;
    getLastProcessedResult(): ProcessRowsResult | null;
    /** See {@link TableRenderer.getCurrentBodyLayouts}. */
    getCurrentBodyLayouts(): Map<HTMLElement, Map<string, CellPosition>>;
    setOnRendererHostDiscard(cb: ((host: HTMLElement) => void) | undefined): void;
    invalidateCache(type?: "body" | "header" | "context" | "all"): void;
    computeEffectiveHeaders(headers: HeaderObject[], config: SimpleTableConfig, customTheme: CustomTheme, containerWidth?: number): HeaderObject[];
    /**
     * Warms flattened/processed row caches so imperative APIs (e.g. getVisibleRows) are
     * correct before the first ResizeObserver-driven render, without mutating the DOM.
     */
    primeLastProcessedResult(context: RenderContext, state: RenderState): void;
    private buildRowModelSnapshot;
    render(elements: {
        bodyContainer: HTMLElement;
        content: HTMLElement;
        contentWrapper: HTMLElement;
        footerContainer: HTMLElement;
        headerContainer: HTMLElement;
        rootElement: HTMLElement;
        wrapperContainer: HTMLElement;
    }, refs: {
        mainBodyRef: {
            current: HTMLDivElement | null;
        };
        tableBodyContainerRef: {
            current: HTMLDivElement | null;
        };
    }, context: RenderContext, state: RenderState, mergedColumnEditorConfig: MergedColumnEditorConfig): void;
    private renderHeader;
    private renderBody;
    private renderFooter;
    private renderColumnEditor;
    private renderHorizontalScrollbar;
    private registerSectionPanes;
    private buildRendererDeps;
    cleanup(): void;
}
