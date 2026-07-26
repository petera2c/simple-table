import type { Accessor } from "./ColumnDef";
import type ColumnDef from "./ColumnDef";
import type Row from "./Row";
import type { RowData } from "./Row";
import type { IconElement } from "./IconsConfig";

export interface HeaderRendererComponents {
  sortIcon?: IconElement;
  filterIcon?: IconElement;
  collapseIcon?: IconElement;
  labelContent?: string | HTMLElement;
}

interface HeaderRendererProps<TData extends RowData = Row> {
  accessor: Accessor<TData>;
  colIndex: number;
  header: ColumnDef<TData, any>;
  components?: HeaderRendererComponents;
}

export type HeaderRenderer<TData extends RowData = Row> = (
  props: HeaderRendererProps<TData>
) => HTMLElement | string | null;

export default HeaderRendererProps;
