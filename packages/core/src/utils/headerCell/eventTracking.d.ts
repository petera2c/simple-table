import HeaderObject from "../../types/HeaderObject";
export declare let prevUpdateTime: number;
export declare let prevDraggingPosition: {
    screenX: number;
    screenY: number;
};
export declare let prevHeaders: HeaderObject[] | null;
export declare const setPrevUpdateTime: (time: number) => void;
export declare const setPrevDraggingPosition: (position: {
    screenX: number;
    screenY: number;
}) => void;
export declare const setPrevHeaders: (headers: HeaderObject[] | null) => void;
export declare const getRenderedCells: (container: HTMLElement) => Map<string, HTMLElement>;
export interface CachedHeaderPosition {
    left: number;
    top: number;
    width: number;
    height: number;
}
export declare const getHeaderPositionCache: (container: HTMLElement) => Map<string, CachedHeaderPosition>;
export declare const REVERT_TO_PREVIOUS_HEADERS_DELAY = 150;
export declare const throttle: (callback: () => void, limit: number) => void;
export declare const addTrackedEventListener: (element: HTMLElement, event: string, handler: EventListener, options?: AddEventListenerOptions) => void;
/** Header tooltips are portaled under .simple-table-root; remove them when header DOM is torn down
 *  without pointer leave (e.g. sort/filter invalidates context cache and removes header cells). */
export declare const removeFloatingHeaderTooltips: (fromElement: HTMLElement) => void;
export declare const cleanupHeaderCellRendering: (container?: HTMLElement, onHostDiscard?: (host: HTMLElement) => void) => void;
