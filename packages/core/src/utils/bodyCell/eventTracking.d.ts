export declare const addTrackedEventListener: (element: HTMLElement, event: string, handler: EventListener, options?: AddEventListenerOptions) => void;
export declare const getRenderedCells: (container: HTMLElement) => Map<string, HTMLElement>;
export declare const cleanupBodyCellRendering: (container?: HTMLElement, onHostDiscard?: (host: HTMLElement) => void) => void;
