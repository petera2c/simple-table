export interface CustomSelectOption {
    value: string;
    label: string;
}
export interface CreateCustomSelectOptions {
    value: string;
    onChange: (value: string) => void;
    options: CustomSelectOption[];
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    containerRef?: HTMLElement;
    mainBodyRef?: HTMLElement;
}
export declare const createCustomSelect: (options: CreateCustomSelectOptions) => {
    element: HTMLDivElement;
    update: (newOptions: Partial<CreateCustomSelectOptions>) => void;
    destroy: () => void;
    setOpen: (newOpen: boolean) => void;
};
