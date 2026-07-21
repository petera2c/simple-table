export interface DropdownOptions {
    width?: number;
    maxHeight?: number;
    overflow?: "auto" | "hidden" | "visible";
    positioning?: "fixed" | "absolute";
    onClose: () => void;
}
export interface DropdownPosition {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
}
export declare const calculateDropdownPosition: (triggerElement: HTMLElement, dropdownElement: HTMLElement, options: DropdownOptions) => {
    position: DropdownPosition;
    placement: string;
};
export declare const createDropdown: (triggerElement: HTMLElement, content: HTMLElement | DocumentFragment, options: DropdownOptions) => HTMLElement;
