import React from "react";
interface TextInputProps {
    defaultValue: string;
    onBlur: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
declare const TextEdit: ({ defaultValue, onBlur, onChange }: TextInputProps) => import("react/jsx-runtime").JSX.Element;
export default TextEdit;
