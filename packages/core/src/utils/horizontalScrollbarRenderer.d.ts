import type { SectionScrollController } from "../managers/SectionScrollController";
export interface HorizontalScrollbarProps {
    mainBodyRef: HTMLDivElement;
    mainBodyWidth: number;
    pinnedLeftWidth: number;
    pinnedRightWidth: number;
    pinnedLeftContentWidth: number;
    pinnedRightContentWidth: number;
    tableBodyContainerRef: HTMLDivElement;
    /** True when the column-editor toggle strip is visible and reserves horizontal space. */
    editColumns: boolean;
    sectionScrollController?: SectionScrollController | null;
    /**
     * When true, skip the DOM scrollWidth check and always build the scrollbar.
     * Used after the caller has already verified content overflow (e.g. empty
     * tables where the header scrollport is sized to content and reports no
     * DOM overflow even though columns exceed the viewport).
     */
    forceScrollable?: boolean;
}
export declare const createHorizontalScrollbar: (props: HorizontalScrollbarProps) => HTMLElement | null;
/**
 * Apply width props to an existing scrollbar from {@link createHorizontalScrollbar}.
 * Used when layout is recreated without tearing down the DOM node (e.g. pinned resize).
 */
export declare const syncHorizontalScrollbarLayout: (container: HTMLElement, props: HorizontalScrollbarProps) => void;
export declare const cleanupHorizontalScrollbar: (container: HTMLElement, sectionScrollController?: SectionScrollController | null) => void;
