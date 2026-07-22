import type { Accessor } from "./ColumnDef";
import type ColumnDef from "./ColumnDef";
import type { IconElement } from "./IconsConfig";

export interface HeaderRendererComponents {
  sortIcon?: IconElement;
  filterIcon?: IconElement;
  collapseIcon?: IconElement;
  labelContent?: string | HTMLElement;
}

interface HeaderRendererProps {
  accessor: Accessor;
  colIndex: number;
  header: ColumnDef;
  components?: HeaderRendererComponents;
}

export type HeaderRenderer = (props: HeaderRendererProps) => HTMLElement | string | null;

export default HeaderRendererProps;
