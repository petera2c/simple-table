import { ReactNode } from "react";
interface CheckboxProps {
    checked?: boolean;
    children?: ReactNode;
    onChange?: (checked: boolean) => void;
}
declare const Checkbox: ({ checked, children, onChange }: CheckboxProps) => import("react/jsx-runtime").JSX.Element;
export default Checkbox;
