export interface CreateFilterInputOptions {
    type?: "text" | "number" | "date";
    value: string;
    onChange: (value: string) => void;
    onEnter?: () => void;
    placeholder?: string;
    autoFocus?: boolean;
    min?: string;
    max?: string;
    step?: string;
}
export declare const createFilterInput: (options: CreateFilterInputOptions) => {
    element: HTMLInputElement;
    update: (newOptions: Partial<CreateFilterInputOptions>) => void;
    destroy: () => void;
};
