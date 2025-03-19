import { Dispatch, SetStateAction } from "react";
import HeaderObject from "../../../types/HeaderObject";
type TableColumnEditorProps = {
    headers: HeaderObject[];
    columnEditorText: string;
    editColumns: boolean;
    editColumnsInitOpen: boolean;
    position: "left" | "right";
    setHiddenColumns: Dispatch<SetStateAction<{
        [key: string]: boolean;
    }>>;
    hiddenColumns: {
        [key: string]: boolean;
    };
};
declare const TableColumnEditor: ({ columnEditorText, editColumns, editColumnsInitOpen, headers, position, setHiddenColumns, hiddenColumns, }: TableColumnEditorProps) => import("react/jsx-runtime").JSX.Element | null;
export default TableColumnEditor;
