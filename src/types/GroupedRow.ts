import CellValue from "./CellValue";

interface GroupedRow {
  children?: GroupedRow[];
  isExpanded?: boolean;
  isGroup?: boolean;
  [key: string]: CellValue | GroupedRow[];
}

export default GroupedRow;
