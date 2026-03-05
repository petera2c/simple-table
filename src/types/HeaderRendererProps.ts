import type { Accessor } from "./HeaderObject";
import type HeaderObject from "./HeaderObject";

export interface HeaderRendererComponents {
  sortIcon?: any;
  filterIcon?: any;
  collapseIcon?: any;
  labelContent?: any;
}

interface HeaderRendererProps {
  accessor: Accessor;
  colIndex: number;
  header: HeaderObject;
  components?: HeaderRendererComponents;
}

export type HeaderRenderer = (props: HeaderRendererProps) => any;

export default HeaderRendererProps;
