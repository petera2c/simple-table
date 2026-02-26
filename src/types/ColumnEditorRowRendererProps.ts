import { ReactNode } from "react";
import type { Accessor } from "./HeaderObject";
import type HeaderObject from "./HeaderObject";

export interface ColumnEditorRowRendererComponents {
  expandIcon?: ReactNode;
  checkbox?: ReactNode;
  dragIcon?: ReactNode;
  labelContent?: ReactNode;
}

interface ColumnEditorRowRendererProps {
  accessor: Accessor;
  header: HeaderObject;
  components: ColumnEditorRowRendererComponents;
}

export type ColumnEditorRowRenderer = (props: ColumnEditorRowRendererProps) => ReactNode | string;

export default ColumnEditorRowRendererProps;
