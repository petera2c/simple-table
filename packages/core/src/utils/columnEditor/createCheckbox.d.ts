/**
 * Creates a vanilla JS checkbox element
 */
export interface CreateCheckboxOptions {
    checked: boolean;
    onChange: (checked: boolean) => void;
    ariaLabel?: string;
}
/** Shared checkmark SVG for checkbox custom visual (used by createCheckbox and update helpers). */
export declare const createCheckmarkSVG: () => SVGSVGElement;
/**
 * Updates an existing checkbox DOM (created by createCheckbox) to match the given checked state.
 * Use when the checkbox element is reused (e.g. from cache) and selection state changed.
 * @param container - Element that contains .st-checkbox-input and .st-checkbox-custom (the label or a parent)
 */
export declare const updateCheckboxElement: (container: HTMLElement, checked: boolean) => void;
export declare const createCheckbox: ({ checked, onChange, ariaLabel }: CreateCheckboxOptions) => {
    element: HTMLLabelElement;
    update: (newChecked: boolean) => void;
    destroy: () => void;
};
