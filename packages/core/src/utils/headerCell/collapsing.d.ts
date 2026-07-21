import HeaderObject from "../../types/HeaderObject";
import { HeaderRenderContext } from "./types";
/** Use same icon and animation as body row expand/collapse (icons.expand + st-expand-icon-container). */
export declare const createCollapseIcon: (header: HeaderObject, context: HeaderRenderContext) => HTMLElement | null;
/** Update header collapse icon direction on an existing cell (delegates to body updateExpandIconState). */
export declare const updateHeaderCollapseIconState: (cellElement: HTMLElement, isCollapsed: boolean, label?: string) => void;
