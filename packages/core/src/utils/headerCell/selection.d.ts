import { HeaderRenderContext } from "./types";
/**
 * Updates an existing header select-all checkbox to match the current checked state.
 * Use when selection changes but the header cell DOM is reused (e.g. from cache).
 */
export declare const updateHeaderSelectionCheckbox: (cellElement: HTMLElement, checked: boolean) => void;
/**
 * Creates the header select-all checkbox using the shared createCheckbox (same as column editor popout).
 */
export declare const createSelectionCheckbox: (context: HeaderRenderContext) => HTMLElement;
