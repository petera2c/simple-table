import { ReactNode } from "react";
import type { Accessor } from "./HeaderObject";
import type HeaderObject from "./HeaderObject";

interface HeaderRendererComponents {
  sortIcon?: ReactNode;
  filterIcon?: ReactNode;
  collapseIcon?: ReactNode;
  labelContent?: ReactNode;
}

interface HeaderRendererProps {
  accessor: Accessor;
  colIndex: number;
  header: HeaderObject;
  components?: HeaderRendererComponents;
}

export type HeaderRenderer = (props: HeaderRendererProps) => ReactNode | string;

export default HeaderRendererProps;
