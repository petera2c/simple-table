/// <reference types="react" />
import CellValue from "../types/CellValue";
declare const TableContext: import("react").Context<
  {
    [key: string]: CellValue;
  }[]
>;
export default TableContext;
