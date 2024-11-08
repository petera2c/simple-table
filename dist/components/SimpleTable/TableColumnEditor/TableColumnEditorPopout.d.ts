import { Dispatch, SetStateAction } from "react";
import HeaderObject from "../../../types/HeaderObject";
type TableColumnEditorPopoutProps = {
    headers: HeaderObject[];
    open: boolean;
    position: "left" | "right";
    setOpen: (open: boolean) => void;
    setHiddenColumns: Dispatch<SetStateAction<{
        [key: string]: boolean;
    }>>;
    hiddenColumns: {
        [key: string]: boolean;
    };
};
declare const TableColumnEditorPopout: ({ headers, open, position, setOpen, setHiddenColumns, hiddenColumns, }: TableColumnEditorPopoutProps) => import("react/jsx-runtime").JSX.Element;
export default TableColumnEditorPopout;
