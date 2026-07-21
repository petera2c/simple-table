/**
 * Filter / filter-UI dropdown positioning (React-era parity):
 * - Fixed: portaled under `.simple-table-root`, anchored to `anchorElement` (e.g. filter icon) so
 *   `overflow: hidden` on `.st-header-cell` does not clip the panel. Same top/left +4px and
 *   container-based flip as legacy React Dropdown.tsx.
 * - Absolute: stays under caller’s parent (e.g. `.st-custom-select`); use `anchorElement` for the
 *   trigger rect vs `position: relative` parent (React CustomSelect pattern).
 */
export interface CreateDropdownOptions {
    children: HTMLElement;
    containerRef?: HTMLElement;
    mainBodyRef?: HTMLElement;
    /** Rect used for placement. Required for fixed portaling (e.g. filter icon); for absolute, pass the real trigger (button/input) when it differs from the dropdown parent. */
    anchorElement?: HTMLElement;
    onClose: () => void;
    open: boolean;
    overflow?: "auto" | "visible" | "hidden";
    width?: number;
    maxWidth?: number;
    positioning?: "fixed" | "absolute";
    /**
     * When true, this panel does not clip overflowing descendants (e.g. nested operator menus inside
     * the filter popover). Uses overflow: visible and drops max-height on the shell — see
     * `.st-dropdown-content--allow-descendant-overflow` in base.css.
     */
    allowDescendantOverflow?: boolean;
}
export declare const createDropdown: (options: CreateDropdownOptions) => {
    element: HTMLDivElement;
    update: (newOptions: Partial<CreateDropdownOptions>) => void;
    destroy: () => void;
    setOpen: (newOpen: boolean) => void;
};
