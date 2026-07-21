export interface CreateDatePickerOptions {
    onChange: (date: Date) => void;
    onClose?: () => void;
    value: Date;
}
export declare const createDatePicker: (options: CreateDatePickerOptions) => {
    element: HTMLDivElement;
    update: (newOptions: Partial<CreateDatePickerOptions>) => void;
    destroy: () => void;
};
