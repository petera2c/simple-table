import HeaderObject from "../../types/HeaderObject";
import { HeaderRenderContext } from "./types";
export declare const handleColumnHeaderClick: (event: MouseEvent, header: HeaderObject, colIndex: number, context: HeaderRenderContext) => void;
export declare const handleColumnHeaderDoubleClick: (event: MouseEvent, header: HeaderObject, context: HeaderRenderContext) => void;
export declare const attachDragHandlers: (labelElement: HTMLElement, cellElement: HTMLElement, header: HeaderObject, context: HeaderRenderContext) => void;
