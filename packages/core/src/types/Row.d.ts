import CellValue from "./CellValue";
type Row = Record<string, CellValue | Row[] | Record<string, any>>;
export default Row;
