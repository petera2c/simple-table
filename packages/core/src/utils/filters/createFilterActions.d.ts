export interface CreateFilterActionsOptions {
    onApply: () => void;
    onClear?: () => void;
    canApply: boolean;
    showClear: boolean;
}
/** Matches React FilterActions: `st-filter-button-apply`, `st-filter-button-clear`, `st-filter-button-disabled`. */
export declare const createFilterActions: (options: CreateFilterActionsOptions) => {
    element: HTMLDivElement;
    update: (newOptions: Partial<CreateFilterActionsOptions>) => void;
    destroy: () => void;
};
