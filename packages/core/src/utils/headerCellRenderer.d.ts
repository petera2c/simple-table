import { AbsoluteCell, HeaderRenderContext } from "./headerCell/types";
export type { AbsoluteCell, HeaderRenderContext } from "./headerCell/types";
export { cleanupHeaderCellRendering } from "./headerCell/eventTracking";
export declare const renderHeaderCells: (container: HTMLElement, absoluteCells: AbsoluteCell[], context: HeaderRenderContext, scrollLeft?: number) => void;
