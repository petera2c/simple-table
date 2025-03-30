import { SetStateAction } from "react";
import { Dispatch } from "react";
import { ReactNode } from "react";
import SortConfig from "./SortConfig";
import Row from "./Row";
import SharedTableProps from "./SharedTableProps";
import OnSortProps from "./OnSortProps";

interface TableHeaderProps extends SharedTableProps {
  columnResizing: boolean;
  currentRows: Row[];
  enableColumnReordering: boolean;
  forceUpdate: () => void;
  onSort: OnSortProps;
  selectableColumns: boolean;
  setIsWidthDragging: Dispatch<SetStateAction<boolean>>;
  setSelectedCells: Dispatch<React.SetStateAction<Set<string>>>;
  sort: SortConfig | null;
  sortDownIcon?: ReactNode;
  sortUpIcon?: ReactNode;
}

export default TableHeaderProps;
