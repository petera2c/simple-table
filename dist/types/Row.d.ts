import CellValue from "./CellValue";
type Row = {
    rowMeta: {
        children?: Row[];
        isExpanded?: boolean;
        rowId: number;
    };
    rowData: {
        [key: string]: CellValue;
    };
};
export default Row;
