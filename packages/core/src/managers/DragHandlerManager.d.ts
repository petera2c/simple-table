import HeaderObject, { Accessor } from "../types/HeaderObject";
export declare const getHeaderIndexPath: (headers: HeaderObject[], targetAccessor: Accessor, currentPath?: number[]) => number[] | null;
export declare const getSiblingArray: (headers: HeaderObject[], indexPath: number[]) => HeaderObject[];
export declare const setSiblingArray: (headers: HeaderObject[], indexPath: number[], newSiblings: HeaderObject[]) => HeaderObject[];
export declare const getHeaderSection: (header: HeaderObject, rootHeaders: HeaderObject[]) => "left" | "main" | "right";
export declare const updateHeaderPinnedProperty: (header: HeaderObject, targetSection: "left" | "main" | "right") => HeaderObject;
export declare function swapHeaders(headers: HeaderObject[], draggedPath: number[], hoveredPath: number[]): {
    newHeaders: HeaderObject[];
    emergencyBreak: boolean;
};
export declare function insertHeaderAcrossSections({ headers, draggedHeader, hoveredHeader, }: {
    headers: HeaderObject[];
    draggedHeader: HeaderObject;
    hoveredHeader: HeaderObject;
}): {
    newHeaders: HeaderObject[];
    emergencyBreak: boolean;
};
export interface DragHandlerManagerConfig {
    headers: HeaderObject[];
    essentialAccessors?: ReadonlySet<string>;
    onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
    onColumnOrderChange?: (newHeaders: HeaderObject[]) => void;
    onHeadersChange?: (newHeaders: HeaderObject[]) => void;
}
export declare class DragHandlerManager {
    private config;
    private draggedHeader;
    private hoveredHeader;
    private prevUpdateTime;
    private prevDraggingPosition;
    private prevHeadersTracker;
    constructor(config: DragHandlerManagerConfig);
    updateConfig(config: Partial<DragHandlerManagerConfig>): void;
    getDraggedHeader(): HeaderObject | null;
    getHoveredHeader(): HeaderObject | null;
    handleDragStart(header: HeaderObject): void;
    handleDragOver({ event, hoveredHeader, }: {
        event: DragEvent;
        hoveredHeader: HeaderObject;
    }): void;
    handleDragEnd(): void;
    destroy(): void;
}
