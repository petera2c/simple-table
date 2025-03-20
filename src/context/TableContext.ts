import { createContext } from "react";
import Row from "../types/Row";

const TableContext = createContext<{
  // All rows
  rows: Row[];
  // Rows that are currently visible
  tableRows: Row[];
}>({ rows: [], tableRows: [] });

export default TableContext;
