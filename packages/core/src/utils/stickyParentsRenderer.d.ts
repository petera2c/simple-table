import TableRow from "../types/TableRow";
import HeaderObject from "../types/HeaderObject";
import { CumulativeHeightMap, HeightOffsets } from "./infiniteScrollUtils";
import type { SectionScrollController } from "../managers/SectionScrollController";
import { CustomTheme } from "../types/CustomTheme";
import { CellRenderContext } from "./bodyCell/types";
export interface StickyParentsContainerProps {
    calculatedHeaderHeight: number;
    heightMap?: CumulativeHeightMap;
    partiallyVisibleRows: TableRow[];
    pinnedLeftColumns: HeaderObject[];
    pinnedLeftWidth: number;
    pinnedRightColumns: HeaderObject[];
    pinnedRightWidth: number;
    scrollTop: number;
    scrollbarWidth: number;
    stickyParents: TableRow[];
    /**
     * Global `colIndex` of the first leaf column in each sticky strip section,
     * matching {@link SectionRenderer} body sections (pinned left, main, right).
     */
    stickySectionColStart: {
        left: number;
        main: number;
        right: number;
    };
    /**
     * Row key (`stableRowKey` ?? `rowIdToString(rowId)`) → body slice `rowIndex`
     * for the current `rowsToRender` band, so selection matches virtualized body cells.
     */
    stickyBodyRowIndexByRowKey: Map<string, number>;
    /**
     * When true, the table is in external-scroll mode (scrollParent in use, no
     * fixed height). The overlay uses native CSS `position: sticky` (handled by
     * a stylesheet rule) so the browser composites it on the same paint as the
     * parent scroll. The renderer only needs this flag to neutralize the
     * overlay's flex column flow contribution via a negative bottom margin.
     */
    externalScrollActive?: boolean;
}
export interface StickyParentsRenderContext {
    collapsedHeaders: Set<string>;
    customTheme: CustomTheme;
    /** True when the column-editor toggle strip is visible and reserves horizontal space. */
    editColumns: boolean;
    headers: HeaderObject[];
    rowHeight: number;
    heightOffsets: HeightOffsets | undefined;
    cellRenderContext: CellRenderContext;
    sectionScrollController?: SectionScrollController | null;
}
export declare const createStickyParentsContainer: (props: StickyParentsContainerProps, context: StickyParentsRenderContext) => HTMLElement | null;
export declare const cleanupStickyParentsContainer: (container: HTMLElement, sectionScrollController?: SectionScrollController | null) => void;
