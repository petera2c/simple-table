import type { Accessor } from "./HeaderObject";
import type HeaderObject from "./HeaderObject";
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
  header: HeaderObject;
  components?: HeaderRendererComponents;
}

export type HeaderRenderer = (props: HeaderRendererProps) => HTMLElement | string | null;

export default HeaderRendererProps;
