import { SetStateAction } from "react";
import { Dispatch } from "react";
import { ReactNode } from "react";
import SortConfig from "./SortConfig";
import Row from "./Row";
import SharedTableProps from "./SharedTableProps";
import OnSortProps from "./OnSortProps";
import HeaderObject from "./HeaderObject";

interface TableHeaderProps extends SharedTableProps {
  columnResizing: boolean;
  currentRows: Row[];
  columnReordering: boolean;
  forceUpdate: () => void;
  onColumnOrderChange?: (newHeaders: HeaderObject[]) => void;
  onSort: OnSortProps;
  selectableColumns: boolean;
  setIsWidthDragging: Dispatch<SetStateAction<boolean>>;
  setSelectedCells: Dispatch<React.SetStateAction<Set<string>>>;
  sort: SortConfig | null;
  sortDownIcon?: ReactNode;
  sortUpIcon?: ReactNode;
}

export default TableHeaderProps;
