import HeaderObject, { Accessor } from "../../types/HeaderObject";
import { HeaderRenderContext } from "../../utils/headerCellRenderer";
import { CellRenderContext } from "../../utils/bodyCellRenderer";
import TableRow from "../../types/TableRow";
import type { AnimationCoordinator, CellPosition } from "../../managers/AnimationCoordinator";
export interface HeaderSectionParams {
    headers: HeaderObject[];
    collapsedHeaders: Set<Accessor>;
    pinned?: "left" | "right";
    maxHeaderDepth: number;
    headerHeight: number;
    context: HeaderRenderContext;
    sectionWidth?: number;
    startColIndex?: number;
}
export interface BodySectionParams {
    headers: HeaderObject[];
    rows: TableRow[];
    collapsedHeaders: Set<Accessor>;
    pinned?: "left" | "right";
    context: CellRenderContext;
    sectionWidth?: number;
    rowHeight: number;
    heightOffsets?: Array<[number, number]>;
    totalRowCount?: number;
    startColIndex?: number;
    /** When true, only update cell positions for existing cells (scroll performance). */
    positionOnly?: boolean;
    /** Full table rows ref + range for range-based body cell cache (avoids cache miss on every scroll). */
    fullTableRows?: TableRow[];
    renderedStartIndex?: number;
    renderedEndIndex?: number;
    /** Full pre-pagination flattened rows (used by animation snapshot to include
     * off-page rows so cross-page sort can FLIP cells in/out from off-screen). */
    allFlattenedRows?: TableRow[];
    /** Global flattened-list index where the current page starts. Used to offset
     * absolute positions in {@link allFlattenedRows} so on-page rows align with
     * the page-relative DOM positions while off-page rows fall above/below. */
    pageStartIndex?: number;
    /** When provided, body cell renderer hands outgoing cells to the coordinator
     * for FLIP-style out-animation instead of removing them immediately. */
    animationCoordinator?: AnimationCoordinator;
}
export declare class SectionRenderer {
    private headerSections;
    private bodySections;
    /**
     * Callback fired before a body cell host element is permanently removed in
     * the {@link invalidateCache} "all" path (which wipes every rendered cell).
     * Threaded down from the table config so framework adapters can tear down
     * renderer subtrees (React portals, etc.) before the nodes are discarded.
     */
    private onRendererHostDiscard?;
    private bodyCellsCache;
    private headerCellsCache;
    private contextCache;
    private bodySectionSnapshots;
    private nextColIndexMap;
    private stateRowsMap;
    private nestedGridRowsMap;
    renderHeaderSection(params: HeaderSectionParams): HTMLElement;
    renderBodySection(params: BodySectionParams): HTMLElement;
    private renderNestedGridRows;
    private renderStateRows;
    private calculateAbsoluteHeaderCells;
    private calculateAbsoluteBodyCells;
    private getLeafHeaders;
    private createHeadersHash;
    private createHeightOffsetsHash;
    private createContextHash;
    private getCachedBodyCells;
    private getCachedHeaderCells;
    private getCachedContext;
    setOnRendererHostDiscard(cb: ((host: HTMLElement) => void) | undefined): void;
    invalidateCache(type?: "body" | "header" | "context" | "all"): void;
    /**
     * Get the next colIndex after rendering a section
     */
    getNextColIndex(sectionKey: string): number;
    /**
     * Build a per-section layout map covering every cell in the dataset (every
     * row × every leaf header), not just the cells in the current virtualization
     * band. Used by the animation coordinator: it needs positions for off-screen
     * rows so that:
     *
     *   - Cells that newly enter the visible band (e.g. row sorted from bottom
     *     to top) can FLIP in from their actual pre-change off-screen `top`.
     *   - Cells that leave the visible band (e.g. row sorted from top to
     *     bottom) can be retained and slid to their actual post-change
     *     off-screen `top` before being removed.
     *
     * The body container clips overflow so cells whose interpolated position
     * falls outside the viewport simply aren't painted — the animation looks
     * like a slide in from / out to the viewport edge.
     */
    getCurrentBodyLayouts(): Map<HTMLElement, Map<string, CellPosition>>;
    /**
     * Compute every cell position the section currently knows about (every row
     * × every leaf header), including positions for off-screen rows, by using
     * the most recent snapshot config for `sectionKey`. Returns null if no
     * snapshot has been captured for this section yet.
     */
    getFullSectionLayout(sectionKey: string): Map<string, CellPosition> | null;
    /**
     * Refresh the per-section snapshot config so getCurrentBodyLayouts can
     * recompute positions for any row × column combination the section
     * currently knows about.
     */
    private captureSnapshotConfig;
    /**
     * Tear down all body sections and forget them so a subsequent
     * `renderBodySection` creates fresh nodes. Used when the empty-state path
     * takes over the body container: clearing `innerHTML` alone leaves
     * `renderedCells` pointing at detached nodes, so rows never remount when
     * data returns (e.g. typing `-E` mid-filter briefly matches every row).
     */
    releaseBodySections(): void;
    cleanup(): void;
}
