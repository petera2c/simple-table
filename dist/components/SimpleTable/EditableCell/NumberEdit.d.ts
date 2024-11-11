interface NumberInputProps {
    defaultValue: number;
    onBlur: () => void;
    onChange: (value: string) => void;
}
declare const NumberEdit: ({ defaultValue, onBlur, onChange }: NumberInputProps) => import("react/jsx-runtime").JSX.Element;
export default NumberEdit;
