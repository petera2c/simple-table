interface TextInputProps {
    defaultValue: string | null | undefined;
    onBlur: () => void;
    onChange: (value: string) => void;
}
declare const StringEdit: ({ defaultValue, onBlur, onChange }: TextInputProps) => import("react/jsx-runtime").JSX.Element;
export default StringEdit;
