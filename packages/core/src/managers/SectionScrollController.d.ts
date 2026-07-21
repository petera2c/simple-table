export type SectionId = "pinned-left" | "main" | "pinned-right";
export type SectionPaneRole = "sticky" | "scrollbar" | "header" | "body";
export interface SectionScrollControllerConfig {
    /** Heavy body virtualization. Throttled to every {@link VIRTUALIZATION_THRESHOLD_PX}px. */
    onMainSectionScrollLeft?: (scrollLeft: number) => void;
}
/**
 * Single controller for horizontal scroll sync across all four panes per section:
 * sticky parent, horizontal scrollbar segment, header, and body.
 * Scrolling any one pane updates the other three in that section.
 * All four panes must have the same scroll width (enforced by renderers).
 */
export declare class SectionScrollController {
    private scrollLeftBySection;
    private panesBySection;
    private scrollHandlers;
    /** Non-passive touchmove handlers on header panes that cancel iOS touch scrolling. */
    private headerTouchMoveHandlers;
    private config;
    /** Guard to avoid re-entrancy when we programmatically set scrollLeft on other panes */
    private isSyncing;
    /** Last scrollLeft at which we ran main-section virtualization; used to run heavy ops only every N px. */
    private lastMainVirtualizationScrollLeft;
    /**
     * True while a touch-driven scroll (including post-release momentum) is in progress on a body
     * pane. While true, we must not write scrollLeft to scroll-container followers (the horizontal
     * scrollbar), because on iOS that cancels the body's inertial momentum. Such followers are
     * reconciled once scrolling settles.
     */
    private isTouchScrolling;
    /** Scroll-idle timer used to detect the end of a touch-driven scroll (incl. momentum). */
    private touchSettleTimeoutId;
    constructor(config?: SectionScrollControllerConfig);
    updateConfig(config: Partial<SectionScrollControllerConfig>): void;
    /**
     * Register a pane (sticky, scrollbar, header, or body) for a section.
     * When any registered pane scrolls, the others in the same section are updated.
     * If a pane with the same role was already registered (e.g. after re-render), it is replaced.
     */
    registerPane(sectionId: SectionId, element: HTMLElement, role: SectionPaneRole): void;
    /**
     * Unregister a pane (e.g. when section is removed or re-created).
     */
    unregisterPane(sectionId: SectionId, element: HTMLElement): void;
    /**
     * Unregister all panes for a section (e.g. on cleanup).
     */
    unregisterSection(sectionId: SectionId): void;
    /**
     * Set scroll position for a section. Updates state and all registered panes.
     * Used when a pane fires scroll and when restoring after render.
     */
    setSectionScrollLeft(sectionId: SectionId, value: number): void;
    getSectionScrollLeft(sectionId: SectionId): number;
    /**
     * Restore scroll position to all registered panes from stored state (e.g. after render).
     */
    restoreAll(): void;
    private addScrollListener;
    /**
     * Track touch-driven scrolling on a body pane. While a touch (and its post-release momentum) is
     * active, scroll-container followers (the horizontal scrollbar) are not written, to preserve iOS
     * momentum; they are reconciled when scrolling settles.
     */
    private addTouchTracking;
    /**
     * (Re)arm the scroll-idle timer that marks the end of a touch-driven scroll. When it fires (no
     * scroll for the idle window, i.e. momentum has stopped), reconcile scroll-container followers
     * (the scrollbar) to the final position, which we deliberately skipped during the touch scroll.
     */
    private scheduleTouchSettle;
    private removeScrollListener;
    destroy(): void;
}
