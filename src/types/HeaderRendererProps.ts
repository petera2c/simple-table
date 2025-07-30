import { ReactNode } from "react";
import type { Accessor } from "./HeaderObject";
import type HeaderObject from "./HeaderObject";

interface HeaderRendererProps {
  accessor: Accessor;
  colIndex: number;
  header: HeaderObject;
}

export type HeaderRenderer = (props: HeaderRendererProps) => ReactNode | string;

export default HeaderRendererProps;
