import { createContext } from "react";
import CellValue from "../types/CellValue";

const TableContext = createContext<{
  rows: { [key: string]: CellValue }[];
  tableRows: { [key: string]: CellValue }[];
}>({ rows: [], tableRows: [] });

export default TableContext;
