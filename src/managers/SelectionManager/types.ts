import type HeaderObject from "../../types/HeaderObject";
import type { Accessor } from "../../types/HeaderObject";
import type TableRowType from "../../types/TableRow";
import type Cell from "../../types/Cell";
import type { CustomTheme } from "../../types/CustomTheme";

export const createSetString = ({ rowIndex, colIndex, rowId }: Cell) =>
  `${rowIndex}-${colIndex}-${rowId}`;

export interface SelectionManagerConfig {
  selectableCells: boolean;
  headers: HeaderObject[];
  tableRows: TableRowType[];
  onCellEdit?: (props: any) => void;
  cellRegistry?: Map<string, any>;
  collapsedHeaders?: Set<Accessor>;
  rowHeight: number;
  enableRowSelection?: boolean;
  copyHeadersToClipboard?: boolean;
  customTheme: CustomTheme;
}
