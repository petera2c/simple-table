import CellValue from "./CellValue";

// Row is now just a record of data - users can put whatever they want in it
// The table will use rowGrouping prop to understand how to group/expand rows
type Row = Record<string, CellValue | Row[]>;

export default Row;
