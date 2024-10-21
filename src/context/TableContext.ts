import { createContext } from "react";
import CellValue from "../types/CellValue";

const TableContext = createContext<{ [key: string]: CellValue }[]>([]);

export default TableContext;
