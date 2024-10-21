import React from "react";
interface BooleanSelectProps {
    value: boolean;
    onBlur: () => void;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}
declare const BooleanSelect: ({ value, onBlur, onChange }: BooleanSelectProps) => import("react/jsx-runtime").JSX.Element;
export default BooleanSelect;
