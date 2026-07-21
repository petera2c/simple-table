import { TableAPI } from "../../types/TableAPI";
import { SimpleTableConfig } from "../../types/SimpleTableConfig";
import HeaderObject, { Accessor } from "../../types/HeaderObject";
import Row from "../../types/Row";
import { CustomTheme } from "../../types/CustomTheme";
import RowState from "../../types/RowState";
import { SelectionManager } from "../../managers/SelectionManager";
import { RowSelectionManager } from "../../managers/RowSelectionManager";
import { SortManager } from "../../managers/SortManager";
import { FilterManager } from "../../managers/FilterManager";
import { FlattenRowsResult } from "../../utils/rowFlattening";
import { ProcessRowsResult } from "../../utils/rowProcessing";
import type { PivotConfig } from "../../types/PivotTypes";
export interface TableAPIContext {
    config: SimpleTableConfig;
    localRows: Row[];
    effectiveHeaders: HeaderObject[];
    headers: HeaderObject[];
    /** Pristine snapshot of the configured column definitions (see SimpleTableVanilla.pristineDefaultHeaders). */
    getPristineDefaultHeaders: () => HeaderObject[];
    essentialAccessors: Set<string>;
    customTheme: CustomTheme;
    currentPage: number;
    /** Returns current page from live state (use this in API getCurrentPage so it stays correct after setPage). */
    getCurrentPage: () => number;
    expandedRows: Map<string, number>;
    collapsedRows: Map<string, number>;
    expandedDepths: Set<number>;
    clearExpandedRows: () => void;
    clearCollapsedRows: () => void;
    rowStateMap: Map<string | number, RowState>;
    headerRegistry: Map<string, any>;
    cellRegistry?: Map<string, {
        updateContent: (value: any) => void;
    }>;
    /**
     * Whether a cell (by its `getCellId` key) is currently mid-FLIP-animation.
     * Live `updateData` content writes are skipped for animating cells so a
     * data tick doesn't re-render / mutate a cell that is sliding to a new
     * position (which causes visible jank). The underlying row data is still
     * updated; only the in-place DOM refresh is deferred to the next tick or
     * re-render once the animation settles.
     */
    isCellAnimating?: (cellId: string) => boolean;
    /** True while any FLIP cell transition is in flight (blocks live re-sort/re-filter). */
    hasAnimatingCells?: () => boolean;
    columnEditorOpen: boolean;
    expandedDepthsManager: any;
    selectionManager: SelectionManager | null;
    rowSelectionManager: RowSelectionManager | null;
    sortManager: SortManager | null;
    filterManager: FilterManager | null;
    getCachedFlattenResult?: () => FlattenRowsResult | null;
    getCachedProcessedResult?: () => ProcessRowsResult | null;
    onRender: () => void;
    /**
     * Bust the flatten / body row caches so the next render re-runs quick filter
     * (and related processing) against in-place mutated row values.
     */
    invalidateRowsCache?: () => void;
    /**
     * Run `fn` without capturing a FLIP snapshot when sort/filter subscribers
     * fire. Used for live-update-driven reorder/visibility changes so high-
     * frequency ticks don't spam sort animations.
     */
    runWithoutAnimationSnapshot?: (fn: () => void) => void;
    setHeaders: (headers: HeaderObject[]) => void;
    setCurrentPage: (page: number) => void;
    setColumnEditorOpen: (open: boolean) => void;
    getEffectiveRowGrouping: () => Accessor[] | undefined;
    setPivot: (config: PivotConfig | null) => void;
    getPivot: () => PivotConfig | null;
    getPivotHeaders: () => HeaderObject[];
    getPivotedRows: () => Row[];
}
export declare class TableAPIImpl {
    static createAPI(context: TableAPIContext): TableAPI;
}
