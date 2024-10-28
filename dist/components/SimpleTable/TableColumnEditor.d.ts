/// <reference types="react" />
import HeaderObject from "../../types/HeaderObject";
type TableColumnEditorProps = {
    editColumns: boolean;
    headersRef: React.MutableRefObject<HeaderObject[]>;
    onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
};
declare const TableColumnEditor: ({ editColumns, headersRef, onTableHeaderDragEnd, }: TableColumnEditorProps) => null;
export default TableColumnEditor;
