import { RefObject } from "react";
import TableHeaderProps from "./TableHeaderProps";
import TableBodyProps from "./TableBodyProps";
import Cell from "./Cell";

// Common properties to omit from both TableHeaderProps and TableBodyProps
type OmittedTableProps =
  | "centerHeaderRef"
  | "headerContainerRef"
  | "mainTemplateColumns"
  | "pinnedLeftColumns"
  | "pinnedLeftHeaderRef"
  | "pinnedLeftTemplateColumns"
  | "pinnedRightColumns"
  | "pinnedRightHeaderRef"
  | "pinnedRightTemplateColumns"
  | "headers";

interface TableContentProps extends Omit<TableHeaderProps, OmittedTableProps>, Omit<TableBodyProps, OmittedTableProps> {
  editColumns: boolean;
  pinnedLeftRef: RefObject<HTMLDivElement | null>;
  pinnedRightRef: RefObject<HTMLDivElement | null>;
}

export default TableContentProps;
