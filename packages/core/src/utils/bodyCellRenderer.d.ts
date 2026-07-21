import { AbsoluteBodyCell, CellRenderContext } from "./bodyCell/types";
import type TableRow from "../types/TableRow";
import type { AnimationCoordinator, CellPosition } from "../managers/AnimationCoordinator";
export type { AbsoluteBodyCell, CellData, CellEditParams, CellClickParams, CellRegistryEntry, CellRenderContext, } from "./bodyCell/types";
export { cleanupBodyCellRendering } from "./bodyCell/eventTracking";
export declare const renderBodyCells: (container: HTMLElement, cells: AbsoluteBodyCell[], context: CellRenderContext, scrollLeft?: number, allRows?: TableRow[], positionOnly?: boolean, animationCoordinator?: AnimationCoordinator, fullCellLayout?: Map<string, CellPosition>) => void;
