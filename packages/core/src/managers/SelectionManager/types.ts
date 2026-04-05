import type HeaderObject from "../../types/HeaderObject";
import type { Accessor } from "../../types/HeaderObject";
import type TableRowType from "../../types/TableRow";
import type Cell from "../../types/Cell";
import type { CustomTheme } from "../../types/CustomTheme";

export const createSetString = ({ rowIndex, colIndex, rowId }: Cell) =>
  `${rowIndex}-${colIndex}-${rowId}`;

export interface SelectionManagerConfig {
  selectableCells: boolean;
  /** When true, header cells use column / cell-selection highlight classes (must match table `selectableColumns`). */
  selectableColumns?: boolean;
  headers: HeaderObject[];
  tableRows: TableRowType[];
  onCellEdit?: (props: any) => void;
  cellRegistry?: Map<string, any>;
  collapsedHeaders?: Set<Accessor>;
  rowHeight: number;
  enableRowSelection?: boolean;
  copyHeadersToClipboard?: boolean;
  customTheme: CustomTheme;
  /** Called when a selection drag ends so the table can re-render and apply selection classes. */
  onSelectionDragEnd?: () => void;
  /** Root element of the table; sync scopes cell queries to this so only this table's cells are updated. */
  tableRoot?: HTMLElement;
}
